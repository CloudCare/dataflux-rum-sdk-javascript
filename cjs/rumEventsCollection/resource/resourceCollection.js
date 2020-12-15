"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startResourceCollection = startResourceCollection;

var _tools = require("../../helper/tools");

var _enums = require("../../helper/enums");

var _lifeCycle = require("../../helper/lifeCycle");

var _matchRequestTiming = require("./matchRequestTiming");

var _resourceUtils = require("./resourceUtils");

function startResourceCollection(lifeCycle, configuration, session) {
  lifeCycle.subscribe(_lifeCycle.LifeCycleEventType.REQUEST_COMPLETED, function (request) {
    if (session.isTrackedWithResource()) {
      lifeCycle.notify(_lifeCycle.LifeCycleEventType.RAW_RUM_EVENT_V2_COLLECTED, processRequest(request));
    }
  });
  lifeCycle.subscribe(_lifeCycle.LifeCycleEventType.PERFORMANCE_ENTRY_COLLECTED, function (entry) {
    if (session.isTrackedWithResource() && entry.entryType === 'resource' && !(0, _resourceUtils.isRequestKind)(entry)) {
      lifeCycle.notify(_lifeCycle.LifeCycleEventType.RAW_RUM_EVENT_V2_COLLECTED, processResourceEntry(entry));
    }
  });
}

function getStatusGroup(status) {
  if (!status) return status;
  return String(status).substr(0, 1) + String(status).substr(1).replace(/\d*/g, 'x');
}

function processRequest(request) {
  var type = request.type === _enums.RequestType.XHR ? _enums.ResourceType.XHR : _enums.ResourceType.FETCH;
  var matchingTiming = (0, _matchRequestTiming.matchRequestTiming)(request);
  var startTime = matchingTiming ? matchingTiming.startTime : request.startTime;
  var correspondingTimingOverrides = matchingTiming ? computePerformanceEntryMetricsV2(matchingTiming) : undefined;
  var tracingInfo = computeRequestTracingInfo(request);
  var urlObj = (0, _tools.urlParse)(request.url).getParse();
  var resourceEvent = (0, _tools.extend2Lev)({
    date: (0, _tools.getTimestamp)(startTime),
    resource: {
      type: type,
      load: (0, _tools.msToNs)(request.duration),
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
    type: _enums.RumEventType.RESOURCE
  }, tracingInfo, correspondingTimingOverrides);
  return {
    startTime: startTime,
    rawRumEvent: resourceEvent
  };
}

function processResourceEntry(entry) {
  var type = (0, _resourceUtils.computeResourceKind)(entry);
  var entryMetrics = computePerformanceEntryMetricsV2(entry);
  var tracingInfo = computeEntryTracingInfo(entry);
  var urlObj = (0, _tools.urlParse)(entry.name).getParse();
  var statusCode = '';

  if ((0, _resourceUtils.is304)(entry)) {
    statusCode = 304;
  }

  var resourceEvent = (0, _tools.extend2Lev)({
    date: (0, _tools.getTimestamp)(entry.startTime),
    resource: {
      type: type,
      url: entry.name,
      urlHost: urlObj.Host,
      urlPath: urlObj.Path,
      method: 'GET',
      status: statusCode,
      statusGroup: getStatusGroup(statusCode)
    },
    type: _enums.RumEventType.RESOURCE
  }, tracingInfo, entryMetrics);
  return {
    startTime: entry.startTime,
    rawRumEvent: resourceEvent
  };
}

function computePerformanceEntryMetricsV2(timing) {
  return {
    resource: (0, _tools.extend2Lev)({}, {
      load: (0, _resourceUtils.computePerformanceResourceDuration)(timing),
      size: (0, _resourceUtils.computeSize)(timing)
    }, (0, _resourceUtils.computePerformanceResourceDetails)(timing))
  };
}

function computeRequestTracingInfo(request) {
  var hasBeenTraced = request.traceId && request.spanId;

  if (!hasBeenTraced) {
    return undefined;
  }

  return {
    _dd: {
      spanId: request.spanId.toDecimalString(),
      traceId: request.traceId.toDecimalString()
    },
    resource: {
      id: (0, _tools.UUID)()
    }
  };
}

function computeEntryTracingInfo(entry) {
  return entry.traceId ? {
    _dd: {
      traceId: entry.traceId
    }
  } : undefined;
}