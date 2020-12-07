import { normalizeUrl } from '../helper/urlPolyfill'
import { each } from '../helper/tools'

var xhrProxySingleton
var beforeSendCallbacks = []
var onRequestCompleteCallbacks = []
var originalXhrOpen
var originalXhrSend

export function startXhrProxy() {
  if (!xhrProxySingleton) {
    proxyXhr()
    xhrProxySingleton = {
      beforeSend: function (callback) {
        beforeSendCallbacks.push(callback)
      },
      onRequestComplete: function (callback) {
        onRequestCompleteCallbacks.push(callback)
      }
    }
  }
  return xhrProxySingleton
}

export function resetXhrProxy() {
  if (xhrProxySingleton) {
    xhrProxySingleton = undefined
    beforeSendCallbacks.splice(0, beforeSendCallbacks.length)
    onRequestCompleteCallbacks.splice(0, onRequestCompleteCallbacks.length)
    XMLHttpRequest.prototype.open = originalXhrOpen
    XMLHttpRequest.prototype.send = originalXhrSend
  }
}

function proxyXhr() {
  originalXhrOpen = XMLHttpRequest.prototype.open
  originalXhrSend = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.open = function (method, url) {
    // WARN: since this data structure is tied to the instance, it is shared by both logs and rum
    // and can be used by different code versions depending on customer setup
    // so it should stay compatible with older versions
    this._dataflux_xhr = {
      method: method,
      startTime: -1, // computed in send call
      url: normalizeUrl(url)
    }
    return originalXhrOpen.apply(this, arguments)
  }

  XMLHttpRequest.prototype.send = function (body) {
    var _this = this
    if (_this._dataflux_xhr) {
      _this._dataflux_xhr.startTime = performance.now()

      var originalOnreadystatechange = _this.onreadystatechange

      _this.onreadystatechange = function () {
        if (_this.readyState === XMLHttpRequest.DONE) {
          reportXhr()
        }

        if (originalOnreadystatechange) {
          originalOnreadystatechange.apply(_this, arguments)
        }
      }

      var hasBeenReported = false
      var reportXhr = function () {
        if (hasBeenReported) {
          return
        }
        hasBeenReported = true

        _this._dataflux_xhr.duration =
          performance.now() - _this._dataflux_xhr.startTime
        _this._dataflux_xhr.response = _this.response
        _this._dataflux_xhr.status = _this.status
        each(onRequestCompleteCallbacks, function (callback) {
          callback(_this._dataflux_xhr)
        })
      }

      _this.addEventListener('loadend', reportXhr)
      each(beforeSendCallbacks, function (callback) {
        callback(_this._dataflux_xhr, _this)
      })
    }

    return originalXhrSend.apply(_this, arguments)
  }
}
