import { extend, each } from '../helper/tools';
import { areCookiesAuthorized } from './cookie';
export function makeGlobal(stub) {
  var global = extend({}, stub, {
    onReady: function onReady(callback) {
      callback();
    }
  });
  return global;
}
export function defineGlobal(global, name, api) {
  var existingGlobalVariable = global[name];
  global[name] = api;

  if (existingGlobalVariable && existingGlobalVariable.q) {
    each(existingGlobalVariable.q, function (fn) {
      fn();
    });
  }
}
export function getGlobalObject() {
  if (typeof globalThis === 'object') {
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

  if (typeof globalObject !== 'object') {
    // on safari _dd_temp_ is available on window but not globally
    // fallback on other browser globals check
    if (typeof self === 'object') {
      globalObject = self;
    } else if (typeof window === 'object') {
      globalObject = window;
    } else {
      globalObject = {};
    }
  }

  return globalObject;
}
export function checkCookiesAuthorized(options) {
  if (!areCookiesAuthorized(options)) {
    console.warn('Cookies are not authorized, we will not send any data.');
    return false;
  }

  return true;
}
export function checkIsNotLocalFile() {
  if (isLocalFile()) {
    console.error('Execution is not allowed in the current context.');
    return false;
  }

  return true;
}

function isLocalFile() {
  return window.location.protocol === 'file:';
}