function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import { each } from '../helper/tools';
import { computeStackTrace } from '../helper/tracekit';
import { toStackTraceString } from '../helper/errorTools';
import { normalizeUrl } from '../helper/urlPolyfill';
var fetchProxySingleton;
var originalFetch;
var beforeSendCallbacks = [];
var onRequestCompleteCallbacks = [];
export function startFetchProxy() {
  if (!fetchProxySingleton) {
    proxyFetch();
    fetchProxySingleton = {
      beforeSend: function beforeSend(callback) {
        beforeSendCallbacks.push(callback);
      },
      onRequestComplete: function onRequestComplete(callback) {
        onRequestCompleteCallbacks.push(callback);
      }
    };
  }

  return fetchProxySingleton;
}
export function resetFetchProxy() {
  if (fetchProxySingleton) {
    fetchProxySingleton = undefined;
    beforeSendCallbacks.splice(0, beforeSendCallbacks.length);
    onRequestCompleteCallbacks.splice(0, onRequestCompleteCallbacks.length);
    window.fetch = originalFetch;
  }
}

function proxyFetch() {
  if (!window.fetch) {
    return;
  }

  originalFetch = window.fetch; // tslint:disable promise-function-async

  window.fetch = function (input, init) {
    var method = init && init.method || typeof input === 'object' && input.method || 'GET';
    var url = normalizeUrl(typeof input === 'object' && input.url || input);
    var startTime = performance.now();

    var _this = this;

    var context = {
      init: init,
      method: method,
      startTime: startTime,
      url: url
    };

    var reportFetch = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (response) {
        context.duration = performance.now() - context.startTime;

        if ('stack' in response || response instanceof Error) {
          context.status = 0;
          context.headers = response.headers;
          context.response = toStackTraceString(computeStackTrace(response));
          each(onRequestCompleteCallbacks, function (callback) {
            callback(context);
          });
        } else if ('status' in response) {
          var text;

          try {
            text = yield response.clone().text();
          } catch (e) {
            text = 'Unable to retrieve response: ' + e;
          }

          context.response = text;
          context.responseType = response.type;
          context.status = response.status;
          context.headers = response.headers;
          each(onRequestCompleteCallbacks, function (callback) {
            callback(context);
          });
        }
      });

      return function reportFetch(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    each(beforeSendCallbacks, function (callback) {
      callback(context);
    });
    var responsePromise = originalFetch.call(_this, input, context.init);
    responsePromise.then(reportFetch, reportFetch);
    return responsePromise;
  };
}