"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cacheCookieAccess = cacheCookieAccess;
exports.setCookie = setCookie;
exports.getCookie = getCookie;
exports.areCookiesAuthorized = areCookiesAuthorized;
exports.getCurrentSite = getCurrentSite;
exports.COOKIE_ACCESS_DELAY = void 0;

var _tools = require("../helper/tools");

var COOKIE_ACCESS_DELAY = _tools.ONE_SECOND;
exports.COOKIE_ACCESS_DELAY = COOKIE_ACCESS_DELAY;

function cacheCookieAccess(name, options) {
  var timeout;
  var cache;
  var hasCache = false;

  var cacheAccess = function cacheAccess() {
    hasCache = true;
    window.clearTimeout(timeout);
    timeout = window.setTimeout(function () {
      hasCache = false;
    }, COOKIE_ACCESS_DELAY);
  };

  return {
    get: function get() {
      if (hasCache) {
        return cache;
      }

      cache = getCookie(name);
      cacheAccess();
      return cache;
    },
    set: function set(value, expireDelay) {
      setCookie(name, value, expireDelay, options);
      cache = value;
      cacheAccess();
    }
  };
}

function setCookie(name, value, expireDelay, options) {
  var date = new Date();
  date.setTime(date.getTime() + expireDelay);
  var expires = 'expires=' + date.toUTCString();
  var sameSite = options && options.crossSite ? 'none' : 'strict';
  var domain = options && options.domain ? ';domain=' + options.domain : '';
  var secure = options && options.secure ? ';secure' : '';
  document.cookie = name + '=' + value + ';' + expires + ';path=/;samesite=' + sameSite + domain + secure;
}

function getCookie(name) {
  return (0, _tools.findCommaSeparatedValue)(document.cookie, name);
}

function areCookiesAuthorized(options) {
  if (document.cookie === undefined || document.cookie === null) {
    return false;
  }

  try {
    // Use a unique cookie name to avoid issues when the SDK is initialized multiple times during
    // the test cookie lifetime
    var testCookieName = "dd_cookie_test_".concat((0, _tools.UUID)());
    var testCookieValue = 'test';
    setCookie(testCookieName, testCookieValue, _tools.ONE_SECOND, options);
    return getCookie(testCookieName) === testCookieValue;
  } catch (error) {
    console.error(error);
    return false;
  }
}
/**
 * No API to retrieve it, number of levels for subdomain and suffix are unknown
 * strategy: find the minimal domain on which cookies are allowed to be set
 * https://web.dev/same-site-same-origin/#site
 */


var getCurrentSiteCache;

function getCurrentSite() {
  if (getCurrentSiteCache === undefined) {
    // Use a unique cookie name to avoid issues when the SDK is initialized multiple times during
    // the test cookie lifetime
    var testCookieName = "dd_site_test_".concat((0, _tools.UUID)());
    var testCookieValue = 'test';
    var domainLevels = window.location.hostname.split('.');
    var candidateDomain = domainLevels.pop();

    while (domainLevels.length && !getCookie(testCookieName)) {
      candidateDomain = domainLevels.pop() + '.' + candidateDomain;
      setCookie(testCookieName, testCookieValue, _tools.ONE_SECOND, {
        domain: candidateDomain
      });
    }

    getCurrentSiteCache = candidateDomain;
  }

  return getCurrentSiteCache;
}