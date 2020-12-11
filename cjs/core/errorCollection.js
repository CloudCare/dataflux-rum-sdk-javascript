"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startConsoleTracking = startConsoleTracking;
exports.stopConsoleTracking = stopConsoleTracking;
exports.filterErrors = filterErrors;
exports.startRuntimeErrorTracking = startRuntimeErrorTracking;
exports.stopRuntimeErrorTracking = stopRuntimeErrorTracking;
exports.startAutomaticErrorCollection = startAutomaticErrorCollection;
exports.trackNetworkError = trackNetworkError;

var _tools = require("../helper/tools");

var _errorTools = require("../helper/errorTools");

var _tracekit = require("../helper/tracekit");

var _observable = _interopRequireDefault(require("../helper/observable"));

var _configuration = require("./configuration");

var _enums = require("../helper/enums");

var _xhrProxy = require("./xhrProxy");

var _fetchProxy = require("./fetchProxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var originalConsoleError;

function startConsoleTracking(errorObservable) {
  originalConsoleError = console.error;

  console.error = function () {
    originalConsoleError.apply(console, arguments);
    var args = (0, _tools.toArray)(arguments);
    var message = [];
    (0, _tools.each)(['console error:'].concat(args), function (para) {
      message.push(formatConsoleParameters(para));
    });
    errorObservable.notify({
      message: message.join(' '),
      source: _errorTools.ErrorSource.CONSOLE,
      startTime: performance.now()
    });
  };
}

function stopConsoleTracking() {
  console.error = originalConsoleError;
}

function formatConsoleParameters(param) {
  if (typeof param === 'string') {
    return param;
  }

  if (param instanceof Error) {
    return (0, _errorTools.toStackTraceString)((0, _tracekit.computeStackTrace)(param));
  }

  return (0, _tools.jsonStringify)(param, undefined, 2);
}

function filterErrors(configuration, errorObservable) {
  var errorCount = 0;
  var filteredErrorObservable = new _observable["default"]();
  errorObservable.subscribe(function (error) {
    if (errorCount < configuration.maxErrorsByMinute) {
      errorCount += 1;
      filteredErrorObservable.notify(error);
    } else if (errorCount === configuration.maxErrorsByMinute) {
      errorCount += 1;
      filteredErrorObservable.notify({
        message: 'Reached max number of errors by minute: ' + configuration.maxErrorsByMinute,
        source: _errorTools.ErrorSource.AGENT,
        startTime: performance.now()
      });
    }
  });
  setInterval(function () {
    errorCount = 0;
  }, _tools.ONE_MINUTE);
  return filteredErrorObservable;
}

var traceKitReportHandler;

function startRuntimeErrorTracking(errorObservable) {
  traceKitReportHandler = function traceKitReportHandler(stackTrace, _, errorObject) {
    var error = (0, _errorTools.formatUnknownError)(stackTrace, errorObject, 'Uncaught');
    errorObservable.notify({
      message: error.message,
      stack: error.stack,
      type: error.type,
      source: _errorTools.ErrorSource.SOURCE,
      startTime: performance.now()
    });
  };

  _tracekit.report.subscribe(traceKitReportHandler);
}

function stopRuntimeErrorTracking() {
  _tracekit.report.unsubscribe(traceKitReportHandler);
}

var filteredErrorsObservable;

function startAutomaticErrorCollection(configuration) {
  if (!filteredErrorsObservable) {
    var errorObservable = new _observable["default"]();
    trackNetworkError(configuration, errorObservable);
    startConsoleTracking(errorObservable);
    startRuntimeErrorTracking(errorObservable);
    filteredErrorsObservable = filterErrors(configuration, errorObservable);
  }

  return filteredErrorsObservable;
}

function trackNetworkError(configuration, errorObservable) {
  (0, _xhrProxy.startXhrProxy)().onRequestComplete(function (context) {
    return handleCompleteRequest(_enums.RequestType.XHR, context);
  });
  (0, _fetchProxy.startFetchProxy)().onRequestComplete(function (context) {
    handleCompleteRequest(_enums.RequestType.FETCH, context);
  });

  function handleCompleteRequest(type, request) {
    if (!(0, _configuration.isIntakeRequest)(request.url, configuration) && (isRejected(request) || isServerError(request))) {
      errorObservable.notify({
        message: format(type) + 'error' + request.method + ' ' + request.url,
        resource: {
          method: request.method,
          statusCode: request.status,
          url: request.url
        },
        source: _errorTools.ErrorSource.NETWORK,
        stack: truncateResponse(request.response, configuration) || 'Failed to load',
        startTime: request.startTime
      });
    }
  }

  return {
    stop: function stop() {
      (0, _xhrProxy.resetXhrProxy)();
      (0, _fetchProxy.resetFetchProxy)();
    }
  };
}

function isRejected(request) {
  return request.status === 0 && request.responseType !== 'opaque';
}

function isServerError(request) {
  return request.status >= 500;
}

function truncateResponse(response, configuration) {
  if (response && response.length > configuration.requestErrorResponseLengthLimit) {
    return response.substring(0, configuration.requestErrorResponseLengthLimit) + '...';
  }

  return response;
}

function format(type) {
  if (_enums.RequestType.XHR === type) {
    return 'XHR';
  }

  return 'Fetch';
}