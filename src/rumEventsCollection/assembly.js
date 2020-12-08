import { extend2Lev, withSnakeCaseKeys } from '../helper/tools'
import { LifeCycleEventType } from '../helper/lifeCycle'
import { RumEventType } from '../helper/enums'
import deviceInfo from '../helper/deviceInfo'
var SessionType = {
  SYNTHETICS: 'synthetics',
  USER: 'user'
}

export function startRumAssembly(
  applicationId,
  configuration,
  lifeCycle,
  session,
  parentContexts,
  getGlobalContext
) {
  lifeCycle.subscribe(
    LifeCycleEventType.RAW_RUM_EVENT_V2_COLLECTED,
    function (data) {
      var startTime = data.startTime
      var rawRumEvent = data.rawRumEvent
      var savedGlobalContext = data.savedGlobalContext
      var customerContext = data.customerContext
      var viewContext = parentContexts.findViewV2(startTime)

      var deviceContext = {
        device: deviceInfo
      }
      if (session.isTracked() && viewContext && viewContext.session.id) {
        var actionContext = parentContexts.findActionV2(startTime)
        var rumContext = {
          _dd: {
            sdkName: configuration.sdkName,
            sdkVersion: configuration.sdkVersion,
            service: configuration.service,
            env: configuration.env,
            version: configuration.version
          },
          tags: configuration.tags,
          application: {
            id: applicationId
          },
          device: {},
          date: new Date().getTime(),
          user: {
            originId: session.getId(),
            user_id: configuration.user_id || session.getAnonymousID(),
            is_signin: configuration.user_id ? 'T' : 'F'
          },
          session: {
            // must be computed on each event because synthetics instrumentation can be done after sdk execution
            // cf https://github.com/puppeteer/puppeteer/issues/3667
            type: getSessionType()
          }
        }

        var rumEvent = needToAssembleWithAction(rawRumEvent)
          ? extend2Lev(
              rumContext,
              deviceContext,
              viewContext,
              actionContext,
              rawRumEvent
            )
          : extend2Lev(rumContext, deviceContext, viewContext, rawRumEvent)
        var serverRumEvent = withSnakeCaseKeys(rumEvent)
        serverRumEvent.context = extend2Lev(
          savedGlobalContext || getGlobalContext(),
          customerContext
        )
        lifeCycle.notify(LifeCycleEventType.RUM_EVENT_V2_COLLECTED, {
          rumEvent: rumEvent,
          serverRumEvent: serverRumEvent
        })
      }
    }
  )
}

function needToAssembleWithAction(event) {
  return (
    [RumEventType.ERROR, RumEventType.RESOURCE, RumEventType.LONG_TASK].indexOf(
      event.type
    ) !== -1
  )
}

function getSessionType() {
  return window._DATAFLUX_SYNTHETICS_BROWSER === undefined
    ? SessionType.USER
    : SessionType.SYNTHETICS
}
