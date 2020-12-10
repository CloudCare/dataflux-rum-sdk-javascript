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
  xhrProxy.onRequestComplete(function (context, xhr) {
    if (isAllowedRequestUrl(configuration, context.url)) {
      tracer.clearTracingIfCancelled(context)
      var contentTypes =
        xhr.getResponseHeader('content-type') &&
        xhr.getResponseHeader('content-type').split(';').length > 1 &&
        xhr.getResponseHeader('content-type').split(';')
      var connection = '',
        server = ''
      try {
        connection = xhr.getResponseHeader('connection')
        server = xhr.getResponseHeader('server')
      } catch (err) {
        connection = ''
        console.log(1111111111111111)
      }

      lifeCycle.notify(LifeCycleEventType.REQUEST_COMPLETED, {
        duration: context.duration,
        method: context.method,
        requestIndex: context.requestIndex,
        response: context.response,
        responseConnection: connection,
        responseServer: server,
        responseHeader: xhr.getAllResponseHeaders().replace(/[\n\r]/g, ' '),
        responseContentType: (contentTypes && contentTypes[0]) || '',
        responseContentEncoding:
          (contentTypes && contentTypes[1].replace(/(^\s*)|(\s*$)/g, '')) || '',
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
function getAllFetchResponseHeaders(headers) {
  if (!headers || !(headers instanceof Headers)) return ''

  var headerArry = []
  var entries = headers.entries()
  var next = entries.next()
  while (next && !next.done) {
    headerArry.push(next.value.join(':'))
    next = entries.next()
  }
  return headerArry.join(' ')
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
      var connection = '',
        server = ''
      try {
        connection = context.headers && context.headers.get('connection')
        server = context.headers && context.headers.get('server')
      } catch (err) {}
      lifeCycle.notify(LifeCycleEventType.REQUEST_COMPLETED, {
        duration: context.duration,
        method: context.method,
        requestIndex: context.requestIndex,
        response: context.response,
        responseType: context.responseType,
        responseHeader: getAllFetchResponseHeaders(context.headers),
        responseConnection: connection,
        //   context.headers && context.headers.get('connection'),
        responseServer: server,
        responseContentType:
          (context.headers && context.headers.get('content-type')) || '',
        responseContentEncoding:
          (context.headers && context.headers.get('content-encode')) || '',
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
