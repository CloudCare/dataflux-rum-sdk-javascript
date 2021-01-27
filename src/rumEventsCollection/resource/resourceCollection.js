import {
  msToNs,
  getTimestamp,
  UUID,
  extend2Lev,
  urlParse
} from '../../helper/tools'
import { RequestType, ResourceType, RumEventType } from '../../helper/enums'
import { LifeCycleEventType } from '../../helper/lifeCycle'
import { matchRequestTiming } from './matchRequestTiming'
import {
  computePerformanceResourceDetails,
  computePerformanceResourceDuration,
  computeResourceKind,
  computeSize,
  isRequestKind,
  is304,
  isCacheHit
} from './resourceUtils'

export function startResourceCollection(lifeCycle, configuration, session) {
  lifeCycle.subscribe(LifeCycleEventType.REQUEST_COMPLETED, function (request) {
    if (session.isTrackedWithResource()) {
      lifeCycle.notify(
        LifeCycleEventType.RAW_RUM_EVENT_V2_COLLECTED,
        processRequest(request)
      )
    }
  })

  lifeCycle.subscribe(
    LifeCycleEventType.PERFORMANCE_ENTRY_COLLECTED,
    function (entry) {
      if (
        session.isTrackedWithResource() &&
        entry.entryType === 'resource' &&
        !isRequestKind(entry)
      ) {
        lifeCycle.notify(
          LifeCycleEventType.RAW_RUM_EVENT_V2_COLLECTED,
          processResourceEntry(entry)
        )
      }
    }
  )
}
function getStatusGroup(status) {
  if (!status) return status
  return (
    String(status).substr(0, 1) + String(status).substr(1).replace(/\d*/g, 'x')
  )
}
function processRequest(request) {
  var type =
    request.type === RequestType.XHR ? ResourceType.XHR : ResourceType.FETCH

  var matchingTiming = matchRequestTiming(request)
  var startTime = matchingTiming ? matchingTiming.startTime : request.startTime
  var correspondingTimingOverrides = matchingTiming
    ? computePerformanceEntryMetricsV2(matchingTiming)
    : undefined
  var tracingInfo = computeRequestTracingInfo(request)
  var urlObj = urlParse(request.url).getParse()
  var resourceEvent = extend2Lev(
    {
      date: getTimestamp(startTime),
      resource: {
        type: type,
        load: msToNs(request.duration),
        method: request.method,
        status: request.status,
        statusGroup: getStatusGroup(request.status),
        url: request.url,
        urlHost: urlObj.Host,
        urlPath: urlObj.Path,
        responseHeader: request.responseHeader,
        responseConnection: request.responseConnection,
        responseServer: request.responseServer,
        responseContentType: request.responseContentType,
        responseContentEncoding: request.responseContentEncoding
      },
      type: RumEventType.RESOURCE
    },
    tracingInfo,
    correspondingTimingOverrides
  )
  return { startTime: startTime, rawRumEvent: resourceEvent }
}

function processResourceEntry(entry) {
  var type = computeResourceKind(entry)
  var entryMetrics = computePerformanceEntryMetricsV2(entry)
  var tracingInfo = computeEntryTracingInfo(entry)
  var urlObj = urlParse(entry.name).getParse()
  var statusCode = ''
  if (is304(entry)) {
    statusCode = 304
  } else if (isCacheHit(entry)) {
    statusCode = 200
  }
  var resourceEvent = extend2Lev(
    {
      date: getTimestamp(entry.startTime),
      resource: {
        type: type,
        url: entry.name,
        urlHost: urlObj.Host,
        urlPath: urlObj.Path,
        method: 'GET',
        status: statusCode,
        statusGroup: getStatusGroup(statusCode)
      },
      type: RumEventType.RESOURCE
    },
    tracingInfo,
    entryMetrics
  )
  return { startTime: entry.startTime, rawRumEvent: resourceEvent }
}

function computePerformanceEntryMetricsV2(timing) {
  return {
    resource: extend2Lev(
      {},
      {
        load: computePerformanceResourceDuration(timing),
        size: computeSize(timing)
      },
      computePerformanceResourceDetails(timing)
    )
  }
}

function computeRequestTracingInfo(request) {
  var hasBeenTraced = request.traceId && request.spanId
  if (!hasBeenTraced) {
    return undefined
  }
  return {
    _dd: {
      spanId: request.spanId.toDecimalString(),
      traceId: request.traceId.toDecimalString()
    },
    resource: { id: UUID() }
  }
}

function computeEntryTracingInfo(entry) {
  return entry.traceId ? { _dd: { traceId: entry.traceId } } : undefined
}
