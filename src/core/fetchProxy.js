import { each } from '../helper/tools'
import { computeStackTrace } from '../helper/tracekit'
import { toStackTraceString } from '../helper/errorTools'
import { normalizeUrl } from '../helper/urlPolyfill'
var fetchProxySingleton
var originalFetch
var beforeSendCallbacks = []
var onRequestCompleteCallbacks = []

export function startFetchProxy() {
  if (!fetchProxySingleton) {
    proxyFetch()
    fetchProxySingleton = {
      beforeSend: function (callback) {
        beforeSendCallbacks.push(callback)
      },
      onRequestComplete: function (callback) {
        onRequestCompleteCallbacks.push(callback)
      }
    }
  }
  return fetchProxySingleton
}

export function resetFetchProxy() {
  if (fetchProxySingleton) {
    fetchProxySingleton = undefined
    beforeSendCallbacks.splice(0, beforeSendCallbacks.length)
    onRequestCompleteCallbacks.splice(0, onRequestCompleteCallbacks.length)
    window.fetch = originalFetch
  }
}

function proxyFetch() {
  if (!window.fetch) {
    return
  }
  originalFetch = window.fetch

  // tslint:disable promise-function-async
  window.fetch = function (input, init) {
    var method =
      (init && init.method) ||
      (typeof input === 'object' && input.method) ||
      'GET'
    var url = normalizeUrl((typeof input === 'object' && input.url) || input)
    var startTime = performance.now()
    var _this = this
    var context = {
      init: init,
      method: method,
      startTime: startTime,
      url: url
    }
    var reportFetch = async function (response) {
      context.duration = performance.now() - context.startTime

      if ('stack' in response || response instanceof Error) {
        context.status = 0
        context.headers = response.headers
        context.response = toStackTraceString(computeStackTrace(response))
        each(onRequestCompleteCallbacks, function (callback) {
          callback(context)
        })
      } else if ('status' in response) {
        var text
        try {
          text = await response.clone().text()
        } catch (e) {
          text = 'Unable to retrieve response: ' + e
        }
        context.response = text
        context.responseType = response.type
        context.status = response.status
        context.headers = response.headers
        each(onRequestCompleteCallbacks, function (callback) {
          callback(context)
        })
      }
    }
    each(beforeSendCallbacks, function (callback) {
      callback(context)
    })
    var responsePromise = originalFetch.call(_this, input, context.init)
    responsePromise.then(reportFetch, reportFetch)
    return responsePromise
  }
}
