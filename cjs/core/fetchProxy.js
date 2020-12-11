"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startFetchProxy = startFetchProxy;
exports.resetFetchProxy = resetFetchProxy;

var _tools = require("../helper/tools");

var _tracekit = require("../helper/tracekit");

var _errorTools = require("../helper/errorTools");

var _urlPolyfill = require("../helper/urlPolyfill");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var fetchProxySingleton;
var originalFetch;
var beforeSendCallbacks = [];
var onRequestCompleteCallbacks = [];

function startFetchProxy() {
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

function resetFetchProxy() {
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
    var method = init && init.method || _typeof(input) === 'object' && input.method || 'GET';
    var url = (0, _urlPolyfill.normalizeUrl)(_typeof(input) === 'object' && input.url || input);
    var startTime = performance.now();

    var _this = this;

    var context = {
      init: init,
      method: method,
      startTime: startTime,
      url: url
    };

    var reportFetch = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(response) {
        var text;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                context.duration = performance.now() - context.startTime;

                if (!('stack' in response || response instanceof Error)) {
                  _context.next = 8;
                  break;
                }

                context.status = 0;
                context.headers = response.headers;
                context.response = (0, _errorTools.toStackTraceString)((0, _tracekit.computeStackTrace)(response));
                (0, _tools.each)(onRequestCompleteCallbacks, function (callback) {
                  callback(context);
                });
                _context.next = 23;
                break;

              case 8:
                if (!('status' in response)) {
                  _context.next = 23;
                  break;
                }

                _context.prev = 9;
                _context.next = 12;
                return response.clone().text();

              case 12:
                text = _context.sent;
                _context.next = 18;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](9);
                text = 'Unable to retrieve response: ' + _context.t0;

              case 18:
                context.response = text;
                context.responseType = response.type;
                context.status = response.status;
                context.headers = response.headers;
                (0, _tools.each)(onRequestCompleteCallbacks, function (callback) {
                  callback(context);
                });

              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[9, 15]]);
      }));

      return function reportFetch(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    (0, _tools.each)(beforeSendCallbacks, function (callback) {
      callback(context);
    });
    var responsePromise = originalFetch.call(_this, input, context.init);
    responsePromise.then(reportFetch, reportFetch);
    return responsePromise;
  };
}