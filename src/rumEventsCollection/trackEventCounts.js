import { noop } from '../helper/tools'
import { RumEventType } from '../helper/enums'
import { LifeCycleEventType } from '../helper/lifeCycle'

export function trackEventCounts(lifeCycle, callback) {
  if (typeof callback === 'undefined') {
    callback = noop
  }
  var eventCounts = {
    errorCount: 0,
    longTaskCount: 0,
    resourceCount: 0,
    userActionCount: 0
  }

  var subscription = lifeCycle.subscribe(
    LifeCycleEventType.RAW_RUM_EVENT_V2_COLLECTED,
    function (data) {
      var rawRumEvent = data.rawRumEvent
      switch (rawRumEvent.type) {
        case RumEventType.ERROR:
          eventCounts.errorCount += 1
          callback(eventCounts)
          break
        case RumEventType.ACTION:
          eventCounts.userActionCount += 1
          callback(eventCounts)
          break
        case RumEventType.LONG_TASK:
          eventCounts.longTaskCount += 1
          callback(eventCounts)
          break
        case RumEventType.RESOURCE:
          eventCounts.resourceCount += 1
          callback(eventCounts)
          break
      }
    }
  )

  return {
    stop: function () {
      subscription.unsubscribe()
    },
    eventCounts: eventCounts
  }
}
