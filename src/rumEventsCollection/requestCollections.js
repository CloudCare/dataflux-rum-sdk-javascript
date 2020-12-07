import { startXhrProxy } from '../core/xhrProxy'
import { startFetchProxy } from '../core/fetchProxy'
import { LifeCycleEventType } from '../helper/lifeCycle'
import { isAllowedRequestUrl } from '../rumEventsCollection/resource/resourceUtils'
import { startTracer } from '../rumEventsCollection/tracing/tracer'
import { RequestType } from '../helper/enums'

var nextRequestIndex = 1

export function startRequestCollection(lifeCycle, configuration) {
  var tracer = startTracer(configuration)
  trackXhr(lifeCycle, configuration, tracer)
  trackFetch(lifeCycle, configuration, tracer)
}

export function trackXhr(lifeCycle, configuration, tracer) {
  var xhrProxy = startXhrProxy()
  xhrProxy.beforeSend(function (context, xhr) {
    if (isAllowedRequestUrl(configuration, context.url)) {
      tracer.traceXhr(context, xhr)
      context.requestIndex = getNextRequestIndex()

      lifeCycle.notify(LifeCycleEventType.REQUEST_STARTED, {
        requestIndex: context.requestIndex
      })
    }
  })
  xhrProxy.onRequestComplete(function (context) {
    if (isAllowedRequestUrl(configuration, context.url)) {
      tracer.clearTracingIfCancelled(context)
      lifeCycle.notify(LifeCycleEventType.REQUEST_COMPLETED, {
        duration: context.duration,
        method: context.method,
        requestIndex: context.requestIndex,
        response: context.response,
        spanId: context.spanId,
        startTime: context.startTime,
        status: context.status,
        traceId: context.traceId,
        type: RequestType.XHR,
        url: context.url
      })
    }
  })
  return xhrProxy
}

export function trackFetch(lifeCycle, configuration, tracer) {
  var fetchProxy = startFetchProxy()
  fetchProxy.beforeSend(function (context) {
    if (isAllowedRequestUrl(configuration, context.url)) {
      tracer.traceFetch(context)
      context.requestIndex = getNextRequestIndex()

      lifeCycle.notify(LifeCycleEventType.REQUEST_STARTED, {
        requestIndex: context.requestIndex
      })
    }
  })
  fetchProxy.onRequestComplete(function (context) {
    if (isAllowedRequestUrl(configuration, context.url)) {
      tracer.clearTracingIfCancelled(context)
      lifeCycle.notify(LifeCycleEventType.REQUEST_COMPLETED, {
        duration: context.duration,
        method: context.method,
        requestIndex: context.requestIndex,
        response: context.response,
        responseType: context.responseType,
        spanId: context.spanId,
        startTime: context.startTime,
        status: context.status,
        traceId: context.traceId,
        type: RequestType.FETCH,
        url: context.url
      })
    }
  })
  return fetchProxy
}

function getNextRequestIndex() {
  var result = nextRequestIndex
  nextRequestIndex += 1
  return result
}
