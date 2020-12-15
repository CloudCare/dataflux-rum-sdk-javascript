import { startXhrProxy } from '../core/xhrProxy';
import { startFetchProxy } from '../core/fetchProxy';
import { LifeCycleEventType } from '../helper/lifeCycle';
import { isAllowedRequestUrl } from '../rumEventsCollection/resource/resourceUtils';
import { startTracer } from '../rumEventsCollection/tracing/tracer';
import { RequestType } from '../helper/enums';
var nextRequestIndex = 1;
export function startRequestCollection(lifeCycle, configuration) {
  var tracer = startTracer(configuration);
  trackXhr(lifeCycle, configuration, tracer);
  trackFetch(lifeCycle, configuration, tracer);
}

function matchResponseHeaderByName(headers, name) {
  // getResponseHeader会有跨域问题，所以用该方法匹配
  var reg = new RegExp(name + ':(.*)[\n\r]*', 'i');
  var matchs = headers.match(reg);

  if (matchs && matchs.length > 1) {
    return matchs[1].replace(/\s*/g, '');
  }

  return '';
}

function matchContentEncoding(endcoding) {
  if (!endcoding) return '';
  var reg = /charset=(.*)/;
  var matchs = endcoding.match(reg);

  if (matchs && matchs.length > 1) {
    return matchs[1].replace(/\s*/g, '');
  }

  return '';
}

export function trackXhr(lifeCycle, configuration, tracer) {
  var xhrProxy = startXhrProxy();
  xhrProxy.beforeSend(function (context, xhr) {
    if (isAllowedRequestUrl(configuration, context.url)) {
      tracer.traceXhr(context, xhr);
      context.requestIndex = getNextRequestIndex();
      lifeCycle.notify(LifeCycleEventType.REQUEST_STARTED, {
        requestIndex: context.requestIndex
      });
    }
  });
  xhrProxy.onRequestComplete(function (context, xhr) {
    if (isAllowedRequestUrl(configuration, context.url)) {
      tracer.clearTracingIfCancelled(context);
      var headers = xhr.getAllResponseHeaders();
      var contentTypes = matchResponseHeaderByName(headers, 'content-type');
      contentTypes = contentTypes && contentTypes.split(';').length > 0 && contentTypes.split(';');
      var connection = matchResponseHeaderByName(headers, 'connection'),
          server = matchResponseHeaderByName(headers, 'server');
      lifeCycle.notify(LifeCycleEventType.REQUEST_COMPLETED, {
        duration: context.duration,
        method: context.method,
        requestIndex: context.requestIndex,
        response: context.response,
        responseConnection: connection,
        responseServer: server,
        responseHeader: headers.replace(/[\n\r]/g, ' '),
        responseContentType: contentTypes && contentTypes[0] || '',
        responseContentEncoding: matchContentEncoding(contentTypes && contentTypes[1]),
        spanId: context.spanId,
        startTime: context.startTime,
        status: context.status,
        traceId: context.traceId,
        type: RequestType.XHR,
        url: context.url
      });
    }
  });
  return xhrProxy;
}

function getAllFetchResponseHeaders(headers) {
  if (!headers || !(headers instanceof Headers)) return '';
  var headerArry = [];
  var entries = headers.entries();
  var next = entries.next();

  while (next && !next.done) {
    headerArry.push(next.value.join(':'));
    next = entries.next();
  }

  return headerArry.join(/\r\n/);
}

export function trackFetch(lifeCycle, configuration, tracer) {
  var fetchProxy = startFetchProxy();
  fetchProxy.beforeSend(function (context) {
    if (isAllowedRequestUrl(configuration, context.url)) {
      tracer.traceFetch(context);
      context.requestIndex = getNextRequestIndex();
      lifeCycle.notify(LifeCycleEventType.REQUEST_STARTED, {
        requestIndex: context.requestIndex
      });
    }
  });
  fetchProxy.onRequestComplete(function (context) {
    if (isAllowedRequestUrl(configuration, context.url)) {
      tracer.clearTracingIfCancelled(context);
      var headers = getAllFetchResponseHeaders(context.headers);
      var connection = matchResponseHeaderByName(headers, 'connection'),
          server = matchResponseHeaderByName(headers, 'server');
      lifeCycle.notify(LifeCycleEventType.REQUEST_COMPLETED, {
        duration: context.duration,
        method: context.method,
        requestIndex: context.requestIndex,
        response: context.response,
        responseType: context.responseType,
        responseHeader: headers.replace(/[\n\r]/g, ' '),
        responseConnection: connection,
        responseServer: server,
        responseContentType: matchResponseHeaderByName(headers, 'content-type'),
        responseContentEncoding: matchContentEncoding(matchResponseHeaderByName(headers, 'content-encode')),
        spanId: context.spanId,
        startTime: context.startTime,
        status: context.status,
        traceId: context.traceId,
        type: RequestType.FETCH,
        url: context.url
      });
    }
  });
  return fetchProxy;
}

function getNextRequestIndex() {
  var result = nextRequestIndex;
  nextRequestIndex += 1;
  return result;
}