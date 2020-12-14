import { DOM_EVENT } from '../../helper/enums'
import {
  addEventListener,
  extend,
  UUID,
  noop,
  ONE_MINUTE,
  throttle
} from '../../helper/tools'
import { supportPerformanceTimingEvent } from '../performanceCollection'
import { LifeCycleEventType } from '../../helper/lifeCycle'
import { trackEventCounts } from '../trackEventCounts'
import { waitIdlePageActivity } from '../trackPageActivities'
import { trackTimings } from './trackTimings'

export var ViewLoadingType = {
  INITIAL_LOAD: 'initial_load',
  ROUTE_CHANGE: 'route_change'
}

export var THROTTLE_VIEW_UPDATE_PERIOD = 3000
export var SESSION_KEEP_ALIVE_INTERVAL = 5 * ONE_MINUTE

export function trackViews(location, lifeCycle) {
  var startOrigin = 0
  var initialView = newView(
    lifeCycle,
    location,
    ViewLoadingType.INITIAL_LOAD,
    document.referrer,
    startOrigin
  )
  var currentView = initialView

  var _trackTimings = trackTimings(lifeCycle, function (timings) {
    initialView.updateTimings(timings)
    initialView.scheduleUpdate()
  })
  var stopTimingsTracking = _trackTimings.stop
  trackHistory(onLocationChange)
  trackHash(onLocationChange)

  function onLocationChange() {
    if (currentView.isDifferentView(location)) {
      // Renew view on location changes
      currentView.triggerUpdate()
      currentView.end()
      currentView = newView(
        lifeCycle,
        location,
        ViewLoadingType.ROUTE_CHANGE,
        currentView.url
      )
    } else {
      currentView.updateLocation(location)
      currentView.triggerUpdate()
    }
  }

  // Renew view on session renewal
  lifeCycle.subscribe(LifeCycleEventType.SESSION_RENEWED, function () {
    // do not trigger view update to avoid wrong data
    currentView.end()
    currentView = newView(
      lifeCycle,
      location,
      ViewLoadingType.ROUTE_CHANGE,
      currentView.url
    )
  })

  // End the current view on page unload
  lifeCycle.subscribe(LifeCycleEventType.BEFORE_UNLOAD, function () {
    currentView.triggerUpdate()
    currentView.end()
  })

  // Session keep alive
  var keepAliveInterval = window.setInterval(function () {
    currentView.triggerUpdate()
  }, SESSION_KEEP_ALIVE_INTERVAL)

  return {
    stop: function () {
      stopTimingsTracking()
      currentView.end()
      clearInterval(keepAliveInterval)
    }
  }
}

function newView(lifeCycle, initialLocation, loadingType, referrer, startTime) {
  if (typeof startTime === 'undefined') {
    startTime = performance.now()
  }
  // Setup initial values
  var id = UUID()
  var eventCounts = {
    errorCount: 0,
    longTaskCount: 0,
    resourceCount: 0,
    userActionCount: 0
  }
  var timings = {}
  var documentVersion = 0
  var cumulativeLayoutShift
  var loadingTime
  var endTime
  var location = extend({}, initialLocation)

  lifeCycle.notify(LifeCycleEventType.VIEW_CREATED, {
    id,
    startTime,
    location,
    referrer
  })

  // Update the view every time the measures are changing
  var scheduleViewUpdate = throttle(
    triggerViewUpdate,
    THROTTLE_VIEW_UPDATE_PERIOD,
    {
      leading: false
    }
  )
  var cancelScheduleViewUpdate = scheduleViewUpdate.cancel
  // 数量暂时不收集
  var _trackEventCounts = trackEventCounts(
    lifeCycle,
    function (newEventCounts) {
      eventCounts = newEventCounts
      scheduleViewUpdate()
    }
  )
  var stopEventCountsTracking = _trackEventCounts.stop
  var _trackLoadingTime = trackLoadingTime(
    loadingType,
    function (newLoadingTime) {
      loadingTime = newLoadingTime
      scheduleViewUpdate()
    }
  )
  var setActivityLoadingTime = _trackLoadingTime.setActivityLoadingTime
  var setLoadEventEnd = _trackLoadingTime.setLoadEventEnd
  var _trackActivityLoadingTime = trackActivityLoadingTime(
    lifeCycle,
    setActivityLoadingTime
  )
  var stopActivityLoadingTimeTracking = _trackActivityLoadingTime.stop
  var stopCLSTracking
  if (isLayoutShiftSupported()) {
    cumulativeLayoutShift = 0
    var _trackLayoutShift = trackLayoutShift(lifeCycle, function (layoutShift) {
      cumulativeLayoutShift += layoutShift
      scheduleViewUpdate()
    })
    stopCLSTracking = _trackLayoutShift.stop
  } else {
    stopCLSTracking = noop
  }

  // Initial view update
  triggerViewUpdate()

  function triggerViewUpdate() {
    documentVersion += 1
    lifeCycle.notify(LifeCycleEventType.VIEW_UPDATED, {
      cumulativeLayoutShift: cumulativeLayoutShift,
      documentVersion: documentVersion,
      eventCounts: eventCounts,
      id: id,
      loadingTime: loadingTime,
      loadingType: loadingType,
      location: location,
      referrer: referrer,
      startTime: startTime,
      timings: timings,
      duration:
        (endTime === undefined ? performance.now() : endTime) - startTime
    })
  }

  return {
    scheduleUpdate: scheduleViewUpdate,
    end: function () {
      endTime = performance.now()
      stopEventCountsTracking()
      stopActivityLoadingTimeTracking()
      stopCLSTracking()
    },
    isDifferentView: function (otherLocation) {
      return (
        location.pathname !== otherLocation.pathname ||
        (!isHashAnAnchor(otherLocation.hash) &&
          otherLocation.hash !== location.hash)
      )
    },
    triggerUpdate: function () {
      // cancel any pending view updates execution
      cancelScheduleViewUpdate()
      triggerViewUpdate()
    },
    updateTimings: function (newTimings) {
      timings = newTimings
      if (newTimings.loadEventEnd !== undefined) {
        setLoadEventEnd(newTimings.loadEventEnd)
      }
    },
    updateLocation: function (newLocation) {
      location = extend({}, newLocation)
    },
    url: location.href
  }
}

function isHashAnAnchor(hash) {
  var correspondingId = hash.substr(1)
  return !!document.getElementById(correspondingId)
}

function trackHistory(onHistoryChange) {
  var originalPushState = history.pushState
  history.pushState = function () {
    originalPushState.apply(this, arguments)
    onHistoryChange()
  }
  var originalReplaceState = history.replaceState
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments)
    onHistoryChange()
  }
  addEventListener(window, DOM_EVENT.POP_STATE, onHistoryChange)
}

function trackHash(onHashChange) {
  addEventListener(window, DOM_EVENT.HASH_CHANGE, onHashChange)
}

function trackLoadingTime(loadType, callback) {
  var isWaitingForLoadEventEnd = loadType === ViewLoadingType.INITIAL_LOAD
  var isWaitingForActivityLoadingTime = true
  var loadingTimeCandidates = []

  function invokeCallbackIfAllCandidatesAreReceived() {
    if (
      !isWaitingForActivityLoadingTime &&
      !isWaitingForLoadEventEnd &&
      loadingTimeCandidates.length > 0
    ) {
      callback(Math.max.apply(undefined, loadingTimeCandidates))
    }
  }

  return {
    setLoadEventEnd: function (loadEventEnd) {
      if (isWaitingForLoadEventEnd) {
        isWaitingForLoadEventEnd = false
        loadingTimeCandidates.push(loadEventEnd)
        invokeCallbackIfAllCandidatesAreReceived()
      }
    },
    setActivityLoadingTime: function (activityLoadingTime) {
      if (isWaitingForActivityLoadingTime) {
        isWaitingForActivityLoadingTime = false
        if (activityLoadingTime !== undefined) {
          loadingTimeCandidates.push(activityLoadingTime)
        }
        invokeCallbackIfAllCandidatesAreReceived()
      }
    }
  }
}

function trackActivityLoadingTime(lifeCycle, callback) {
  var startTime = performance.now()

  var _waitIdlePageActivity = waitIdlePageActivity(
    lifeCycle,
    function (hadActivity, endTime) {
      if (hadActivity) {
        callback(endTime - startTime)
      } else {
        callback(undefined)
      }
    }
  )
  var stopWaitIdlePageActivity = _waitIdlePageActivity.stop
  return { stop: stopWaitIdlePageActivity }
}

/**
 * Track layout shifts (LS) occuring during the Views.  This yields multiple values that can be
 * added up to compute the cumulated layout shift (CLS).
 *
 * See isLayoutShiftSupported to check for browser support.
 *
 * Documentation: https://web.dev/cls/
 * Reference implementation: https://github.com/GoogleChrome/web-vitals/blob/master/src/getCLS.ts
 */
function trackLayoutShift(lifeCycle, callback) {
  var _lifeCycle = lifeCycle.subscribe(
    LifeCycleEventType.PERFORMANCE_ENTRY_COLLECTED,
    function (entry) {
      if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
        callback(entry.value)
      }
    }
  )

  return {
    stop: _lifeCycle.unsubscribe
  }
}

/**
 * Check whether `layout-shift` is supported by the browser.
 */
function isLayoutShiftSupported() {
  return supportPerformanceTimingEvent('layout-shift')
}
