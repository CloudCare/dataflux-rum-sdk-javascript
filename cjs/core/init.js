"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeGlobal = makeGlobal;
exports.defineGlobal = defineGlobal;
exports.getGlobalObject = getGlobalObject;
exports.checkCookiesAuthorized = checkCookiesAuthorized;
exports.checkIsNotLocalFile = checkIsNotLocalFile;

var _tools = require("../helper/tools");

var _cookie = require("./cookie");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function makeGlobal(stub) {
  var global = (0, _tools.extend)({}, stub, {
    onReady: function onReady(callback) {
      callback();
    }
  });
  return global;
}

function defineGlobal(global, name, api) {
  var existingGlobalVariable = global[name];
  global[name] = api;

  if (existingGlobalVariable && existingGlobalVariable.q) {
    (0, _tools.each)(existingGlobalVariable.q, function (fn) {
      fn();
    });
  }
}

function getGlobalObject() {
  if ((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === 'object') {
    return globalThis;
  }

  Object.defineProperty(Object.prototype, '_dd_temp_', {
    get: function get() {
      return this;
    },
    configurable: true
  }); // @ts-ignore

  var globalObject = _dd_temp_; // @ts-ignore

  delete Object.prototype._dd_temp_;

  if (_typeof(globalObject) !== 'object') {
    // on safari _dd_temp_ is available on window but not globally
    // fallback on other browser globals check
    if ((typeof self === "undefined" ? "undefined" : _typeof(self)) === 'object') {
      globalObject = self;
    } else if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
      globalObject = window;
    } else {
      globalObject = {};
    }
  }

  return globalObject;
}

function checkCookiesAuthorized(options) {
  if (!(0, _cookie.areCookiesAuthorized)(options)) {
    console.warn('Cookies are not authorized, we will not send any data.');
    return false;
  }

  return true;
}

function checkIsNotLocalFile() {
  if (isLocalFile()) {
    console.error('Execution is not allowed in the current context.');
    return false;
  }

  return true;
}

function isLocalFile() {
  return window.location.protocol === 'file:';
}