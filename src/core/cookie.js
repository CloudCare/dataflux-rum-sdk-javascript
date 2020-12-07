import { findCommaSeparatedValue, UUID, ONE_SECOND } from '../helper/tools'
export var COOKIE_ACCESS_DELAY = ONE_SECOND
export function cacheCookieAccess(name, options) {
  var timeout
  var cache
  var hasCache = false

  var cacheAccess = function () {
    hasCache = true
    window.clearTimeout(timeout)
    timeout = window.setTimeout(function () {
      hasCache = false
    }, COOKIE_ACCESS_DELAY)
  }

  return {
    get: function () {
      if (hasCache) {
        return cache
      }
      cache = getCookie(name)
      cacheAccess()
      return cache
    },
    set: function (value, expireDelay) {
      setCookie(name, value, expireDelay, options)
      cache = value
      cacheAccess()
    }
  }
}

export function setCookie(name, value, expireDelay, options) {
  var date = new Date()
  date.setTime(date.getTime() + expireDelay)
  var expires = 'expires=' + date.toUTCString()
  var sameSite = options && options.crossSite ? 'none' : 'strict'
  var domain = options && options.domain ? ';domain=' + options.domain : ''
  var secure = options && options.secure ? ';secure' : ''
  document.cookie =
    name +
    '=' +
    value +
    ';' +
    expires +
    ';path=/;samesite=' +
    sameSite +
    domain +
    secure
}

export function getCookie(name) {
  return findCommaSeparatedValue(document.cookie, name)
}

export function areCookiesAuthorized(options) {
  if (document.cookie === undefined || document.cookie === null) {
    return false
  }
  try {
    // Use a unique cookie name to avoid issues when the SDK is initialized multiple times during
    // the test cookie lifetime
    var testCookieName = `dd_cookie_test_${UUID()}`
    var testCookieValue = 'test'
    setCookie(testCookieName, testCookieValue, ONE_SECOND, options)
    return getCookie(testCookieName) === testCookieValue
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * No API to retrieve it, number of levels for subdomain and suffix are unknown
 * strategy: find the minimal domain on which cookies are allowed to be set
 * https://web.dev/same-site-same-origin/#site
 */
var getCurrentSiteCache
export function getCurrentSite() {
  if (getCurrentSiteCache === undefined) {
    // Use a unique cookie name to avoid issues when the SDK is initialized multiple times during
    // the test cookie lifetime
    var testCookieName = `dd_site_test_${UUID()}`
    var testCookieValue = 'test'

    var domainLevels = window.location.hostname.split('.')
    var candidateDomain = domainLevels.pop()
    while (domainLevels.length && !getCookie(testCookieName)) {
      candidateDomain = domainLevels.pop() + '.' + candidateDomain
      setCookie(testCookieName, testCookieValue, ONE_SECOND, {
        domain: candidateDomain
      })
    }
    getCurrentSiteCache = candidateDomain
  }
  return getCurrentSiteCache
}
