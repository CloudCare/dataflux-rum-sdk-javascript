import { toArray, map, each, jsonStringify, ONE_MINUTE } from '../helper/tools'
import {
  ErrorSource,
  formatUnknownError,
  toStackTraceString
} from '../helper/errorTools'
import { computeStackTrace, report } from '../helper/tracekit'
import Observable from '../helper/observable'
import { isIntakeRequest } from './configuration'
import { RequestType } from '../helper/enums'
import { resetXhrProxy, startXhrProxy } from './xhrProxy'
import { resetFetchProxy, startFetchProxy } from './fetchProxy'

var originalConsoleError

export function startConsoleTracking(errorObservable) {
  originalConsoleError = console.error
  console.error = function () {
    originalConsoleError.apply(console, arguments)
    var args = toArray(arguments)

    var message = []
    each(['console error:'].concat(args), function (para) {
      message.push(formatConsoleParameters(para))
    })

    errorObservable.notify({
      message: message.join(' '),
      source: ErrorSource.CONSOLE,
      startTime: performance.now()
    })
  }
}

export function stopConsoleTracking() {
  console.error = originalConsoleError
}

function formatConsoleParameters(param) {
  if (typeof param === 'string') {
    return param
  }
  if (param instanceof Error) {
    return toStackTraceString(computeStackTrace(param))
  }
  return jsonStringify(param, undefined, 2)
}
export function filterErrors(configuration, errorObservable) {
  var errorCount = 0
  var filteredErrorObservable = new Observable()
  errorObservable.subscribe(function (error) {
    if (errorCount < configuration.maxErrorsByMinute) {
      errorCount += 1
      filteredErrorObservable.notify(error)
    } else if (errorCount === configuration.maxErrorsByMinute) {
      errorCount += 1
      filteredErrorObservable.notify({
        message:
          'Reached max number of errors by minute: ' +
          configuration.maxErrorsByMinute,
        source: ErrorSource.AGENT,
        startTime: performance.now()
      })
    }
  })
  setInterval(function () {
    errorCount = 0
  }, ONE_MINUTE)
  return filteredErrorObservable
}
var traceKitReportHandler

export function startRuntimeErrorTracking(errorObservable) {
  traceKitReportHandler = function (stackTrace, _, errorObject) {
    var error = formatUnknownError(stackTrace, errorObject, 'Uncaught')
    errorObservable.notify({
      message: error.message,
      stack: error.stack,
      type: error.type,
      source: ErrorSource.SOURCE,
      startTime: performance.now()
    })
  }
  report.subscribe(traceKitReportHandler)
}

export function stopRuntimeErrorTracking() {
  report.unsubscribe(traceKitReportHandler)
}
var filteredErrorsObservable

export function startAutomaticErrorCollection(configuration) {
  if (!filteredErrorsObservable) {
    var errorObservable = new Observable()
    trackNetworkError(configuration, errorObservable)
    startConsoleTracking(errorObservable)
    startRuntimeErrorTracking(errorObservable)
    filteredErrorsObservable = filterErrors(configuration, errorObservable)
  }
  return filteredErrorsObservable
}

export function trackNetworkError(configuration, errorObservable) {
  startXhrProxy().onRequestComplete(function (context) {
    return handleCompleteRequest(RequestType.XHR, context)
  })
  startFetchProxy().onRequestComplete(function (context) {
    handleCompleteRequest(RequestType.FETCH, context)
  })

  function handleCompleteRequest(type, request) {
    if (
      !isIntakeRequest(request.url, configuration) &&
      (isRejected(request) || isServerError(request))
    ) {
      errorObservable.notify({
        message: format(type) + 'error' + request.method + ' ' + request.url,
        resource: {
          method: request.method,
          statusCode: request.status,
          url: request.url
        },
        source: ErrorSource.NETWORK,
        stack:
          truncateResponse(request.response, configuration) || 'Failed to load',
        startTime: request.startTime
      })
    }
  }

  return {
    stop: function () {
      resetXhrProxy()
      resetFetchProxy()
    }
  }
}
function isRejected(request) {
  return request.status === 0 && request.responseType !== 'opaque'
}

function isServerError(request) {
  return request.status >= 500
}

function truncateResponse(response, configuration) {
  if (
    response &&
    response.length > configuration.requestErrorResponseLengthLimit
  ) {
    return (
      response.substring(0, configuration.requestErrorResponseLengthLimit) +
      '...'
    )
  }
  return response
}

function format(type) {
  if (RequestType.XHR === type) {
    return 'XHR'
  }
  return 'Fetch'
}
