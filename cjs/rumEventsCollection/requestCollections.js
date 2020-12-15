"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startRequestCollection = startRequestCollection;
exports.trackXhr = trackXhr;
exports.trackFetch = trackFetch;

var _xhrProxy = require("../core/xhrProxy");

var _fetchProxy = require("../core/fetchProxy");

var _lifeCycle = require("../helper/lifeCycle");

var _resourceUtils = require("../rumEventsCollection/resource/resourceUtils");

var _tracer = require("../rumEventsCollection/tracing/tracer");

var _enums = require("../helper/enums");

var nextRequestIndex = 1;

function startRequestCollection(lifeCycle, configuration) {
  var tracer = (0, _tracer.startTracer)(configuration);
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

function trackXhr(lifeCycle, configuration, tracer) {
  var xhrProxy = (0, _xhrProxy.startXhrProxy)();
  xhrProxy.beforeSend(function (context, xhr) {
    if ((0, _resourceUtils.isAllowedRequestUrl)(configuration, context.url)) {
      tracer.traceXhr(context, xhr);
      context.requestIndex = getNextRequestIndex();
      lifeCycle.notify(_lifeCycle.LifeCycleEventType.REQUEST_STARTED, {
        requestIndex: context.requestIndex
      });
    }
  });
  xhrProxy.onRequestComplete(function (context, xhr) {
    if ((0, _resourceUtils.isAllowedRequestUrl)(configuration, context.url)) {
      tracer.clearTracingIfCancelled(context);
      var headers = xhr.getAllResponseHeaders();
      var contentTypes = matchResponseHeaderByName(headers, 'content-type');
      contentTypes = contentTypes && contentTypes.split(';').length > 0 && contentTypes.split(';');
      var connection = matchResponseHeaderByName(headers, 'connection'),
          server = matchResponseHeaderByName(headers, 'server');
      lifeCycle.notify(_lifeCycle.LifeCycleEventType.REQUEST_COMPLETED, {
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
        type: _enums.RequestType.XHR,
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

function trackFetch(lifeCycle, configuration, tracer) {
  var fetchProxy = (0, _fetchProxy.startFetchProxy)();
  fetchProxy.beforeSend(function (context) {
    if ((0, _resourceUtils.isAllowedRequestUrl)(configuration, context.url)) {
      tracer.traceFetch(context);
      context.requestIndex = getNextRequestIndex();
      lifeCycle.notify(_lifeCycle.LifeCycleEventType.REQUEST_STARTED, {
        requestIndex: context.requestIndex
      });
    }
  });
  fetchProxy.onRequestComplete(function (context) {
    if ((0, _resourceUtils.isAllowedRequestUrl)(configuration, context.url)) {
      tracer.clearTracingIfCancelled(context);
      var headers = getAllFetchResponseHeaders(context.headers);
      var connection = matchResponseHeaderByName(headers, 'connection'),
          server = matchResponseHeaderByName(headers, 'server');
      lifeCycle.notify(_lifeCycle.LifeCycleEventType.REQUEST_COMPLETED, {
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
        type: _enums.RequestType.FETCH,
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