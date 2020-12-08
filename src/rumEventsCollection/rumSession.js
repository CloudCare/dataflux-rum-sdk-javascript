import { startSessionManagement } from '../core/sessionManagement'
import { performDraw } from '../helper/tools'
import { LifeCycleEventType } from '../helper/lifeCycle'
export var RUM_SESSION_KEY = 'rum'
export var RumTrackingType = {
  NOT_TRACKED: '0',
  TRACKED_WITH_RESOURCES: '1',
  TRACKED_WITHOUT_RESOURCES: '2'
}
export function startRumSession(configuration, lifeCycle) {
  var session = startSessionManagement(
    configuration.cookieOptions,
    RUM_SESSION_KEY,
    function (rawTrackingType) {
      return computeSessionState(configuration, rawTrackingType)
    }
  )

  session.renewObservable.subscribe(function () {
    lifeCycle.notify(LifeCycleEventType.SESSION_RENEWED)
  })

  return {
    getId: session.getId,
    getAnonymousID: session.getAnonymousID,
    isTracked: function () {
      return (
        session.getId() !== undefined && isTracked(session.getTrackingType())
      )
    },
    isTrackedWithResource: function () {
      return (
        session.getId() !== undefined &&
        session.getTrackingType() === RumTrackingType.TRACKED_WITH_RESOURCES
      )
    }
  }
}

function computeSessionState(configuration, rawTrackingType) {
  var trackingType
  if (hasValidRumSession(rawTrackingType)) {
    trackingType = rawTrackingType
  } else if (!performDraw(configuration.sampleRate)) {
    trackingType = RumTrackingType.NOT_TRACKED
  } else if (!performDraw(configuration.resourceSampleRate)) {
    trackingType = RumTrackingType.TRACKED_WITHOUT_RESOURCES
  } else {
    trackingType = RumTrackingType.TRACKED_WITH_RESOURCES
  }
  return {
    trackingType: trackingType,
    isTracked: isTracked(trackingType)
  }
}

function hasValidRumSession(trackingType) {
  return (
    trackingType === RumTrackingType.NOT_TRACKED ||
    trackingType === RumTrackingType.TRACKED_WITH_RESOURCES ||
    trackingType === RumTrackingType.TRACKED_WITHOUT_RESOURCES
  )
}

function isTracked(rumSessionType) {
  return (
    rumSessionType === RumTrackingType.TRACKED_WITH_RESOURCES ||
    rumSessionType === RumTrackingType.TRACKED_WITHOUT_RESOURCES
  )
}
