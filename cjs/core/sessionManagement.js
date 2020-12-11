"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startSessionManagement = startSessionManagement;
exports.isValidSessionString = isValidSessionString;
exports.persistSession = persistSession;
exports.stopSessionManagement = stopSessionManagement;
exports.trackActivity = trackActivity;
exports.ANONYMOUS_ID_EXPIRATION = exports.ANONYMOUS_ID_COOKIE_NAME = exports.VISIBILITY_CHECK_DELAY = exports.SESSION_TIME_OUT_DELAY = exports.SESSION_EXPIRATION_DELAY = exports.SESSION_COOKIE_NAME = void 0;

var _cookie = require("./cookie");

var _observable = _interopRequireDefault(require("../helper/observable"));

var _tools = require("../helper/tools");

var _enums = require("../helper/enums");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SESSION_COOKIE_NAME = '_dataflux_s';
exports.SESSION_COOKIE_NAME = SESSION_COOKIE_NAME;
var SESSION_EXPIRATION_DELAY = 15 * _tools.ONE_MINUTE;
exports.SESSION_EXPIRATION_DELAY = SESSION_EXPIRATION_DELAY;
var SESSION_TIME_OUT_DELAY = 4 * _tools.ONE_HOUR;
exports.SESSION_TIME_OUT_DELAY = SESSION_TIME_OUT_DELAY;
var VISIBILITY_CHECK_DELAY = _tools.ONE_MINUTE;
exports.VISIBILITY_CHECK_DELAY = VISIBILITY_CHECK_DELAY;
var ANONYMOUS_ID_COOKIE_NAME = '_dataflulx_an_id';
exports.ANONYMOUS_ID_COOKIE_NAME = ANONYMOUS_ID_COOKIE_NAME;
var ANONYMOUS_ID_EXPIRATION = 60 * 24 * _tools.ONE_HOUR;
exports.ANONYMOUS_ID_EXPIRATION = ANONYMOUS_ID_EXPIRATION;

function cacheAnonymousID(options) {
  var anonymousCookie = (0, _cookie.cacheCookieAccess)(ANONYMOUS_ID_COOKIE_NAME, options);
  var anonymouseId = anonymousCookie.get();

  if (!anonymouseId) {
    anonymousCookie.set((0, _tools.UUID)(), ANONYMOUS_ID_EXPIRATION);
  }

  return anonymousCookie;
}
/**
 * Limit access to cookie to avoid performance issues
 */


function startSessionManagement(options, productKey, computeSessionState) {
  var anonymousCookie = cacheAnonymousID(options);
  var sessionCookie = (0, _cookie.cacheCookieAccess)(SESSION_COOKIE_NAME, options);
  var renewObservable = new _observable["default"]();
  var currentSessionId = retrieveActiveSession(sessionCookie).id;
  var expandOrRenewSession = (0, _tools.throttle)(function () {
    var session = retrieveActiveSession(sessionCookie);
    var state = computeSessionState(session[productKey]);
    session[productKey] = state.trackingType;

    if (state.isTracked && !session.id) {
      session.id = (0, _tools.UUID)();
      session.created = String(Date.now());
    } // save changes and expand session duration


    persistSession(session, sessionCookie); // If the session id has changed, notify that the session has been renewed

    if (state.isTracked && currentSessionId !== session.id) {
      currentSessionId = session.id;
      renewObservable.notify();
    }
  }, _cookie.COOKIE_ACCESS_DELAY);

  var expandSession = function expandSession() {
    var session = retrieveActiveSession(sessionCookie);
    persistSession(session, sessionCookie);
  };

  expandOrRenewSession();
  trackActivity(expandOrRenewSession);
  trackVisibility(expandSession);
  return {
    getAnonymousID: function getAnonymousID() {
      return anonymousCookie.get();
    },
    getId: function getId() {
      return retrieveActiveSession(sessionCookie).id;
    },
    getTrackingType: function getTrackingType() {
      return retrieveActiveSession(sessionCookie)[productKey];
    },
    renewObservable: renewObservable
  };
}

var SESSION_ENTRY_REGEXP = /^([a-z]+)=([a-z0-9-]+)$/;
var SESSION_ENTRY_SEPARATOR = '&';

function isValidSessionString(sessionString) {
  return sessionString !== undefined && (sessionString.indexOf(SESSION_ENTRY_SEPARATOR) !== -1 || SESSION_ENTRY_REGEXP.test(sessionString));
}

function retrieveActiveSession(sessionCookie) {
  var session = retrieveSession(sessionCookie);

  if (isActiveSession(session)) {
    return session;
  }

  clearSession(sessionCookie);
  return {};
}

function isActiveSession(session) {
  return (session.created === undefined || Date.now() - Number(session.created) < SESSION_TIME_OUT_DELAY) && (session.expire === undefined || Date.now() < Number(session.expire));
}

function retrieveSession(sessionCookie) {
  var sessionString = sessionCookie.get();
  var session = {};

  if (isValidSessionString(sessionString)) {
    (0, _tools.each)(sessionString.split(SESSION_ENTRY_SEPARATOR), function (entry) {
      var matches = SESSION_ENTRY_REGEXP.exec(entry);

      if (matches !== null) {
        var key = matches[1];
        var value = matches[2];
        session[key] = value;
      }
    });
  }

  return session;
}

function persistSession(session, cookie) {
  if ((0, _tools.isEmptyObject)(session)) {
    clearSession(cookie);
    return;
  }

  session.expire = String(Date.now() + SESSION_EXPIRATION_DELAY);
  var cookieArray = [];
  var ars = (0, _tools.objectEntries)(session);
  (0, _tools.each)((0, _tools.objectEntries)(session), function (item) {
    cookieArray.push(item[0] + '=' + item[1]);
  });
  var cookieString = cookieArray.join(SESSION_ENTRY_SEPARATOR);
  cookie.set(cookieString, SESSION_EXPIRATION_DELAY);
}

function clearSession(cookie) {
  cookie.set('', 0);
}

function stopSessionManagement() {
  (0, _tools.each)(stopCallbacks, function (e) {
    e();
  });
  stopCallbacks = [];
}

var stopCallbacks = [];

function trackActivity(expandOrRenewSession) {
  var listeners = (0, _tools.addEventListeners)(window, [_enums.DOM_EVENT.CLICK, _enums.DOM_EVENT.TOUCH_START, _enums.DOM_EVENT.KEY_DOWN, _enums.DOM_EVENT.SCROLL], expandOrRenewSession, {
    capture: true,
    passive: true
  });
  stopCallbacks.push(listeners.stop);
}

function trackVisibility(expandSession) {
  var expandSessionWhenVisible = function expandSessionWhenVisible() {
    if (document.visibilityState === 'visible') {
      expandSession();
    }
  };

  var listener = (0, _tools.addEventListener)(document, _enums.DOM_EVENT.VISIBILITY_CHANGE, expandSessionWhenVisible);
  stopCallbacks.push(listener.stop);
  var visibilityCheckInterval = window.setInterval(expandSessionWhenVisible, VISIBILITY_CHECK_DELAY);
  stopCallbacks.push(function () {
    clearInterval(visibilityCheckInterval);
  });
}