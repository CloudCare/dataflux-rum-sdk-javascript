"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startRumSession = startRumSession;
exports.RumTrackingType = exports.RUM_SESSION_KEY = void 0;

var _sessionManagement = require("../core/sessionManagement");

var _tools = require("../helper/tools");

var _lifeCycle = require("../helper/lifeCycle");

var RUM_SESSION_KEY = 'rum';
exports.RUM_SESSION_KEY = RUM_SESSION_KEY;
var RumTrackingType = {
  NOT_TRACKED: '0',
  TRACKED_WITH_RESOURCES: '1',
  TRACKED_WITHOUT_RESOURCES: '2'
};
exports.RumTrackingType = RumTrackingType;

function startRumSession(configuration, lifeCycle) {
  var session = (0, _sessionManagement.startSessionManagement)(configuration.cookieOptions, RUM_SESSION_KEY, function (rawTrackingType) {
    return computeSessionState(configuration, rawTrackingType);
  });
  session.renewObservable.subscribe(function () {
    lifeCycle.notify(_lifeCycle.LifeCycleEventType.SESSION_RENEWED);
  });
  return {
    getId: session.getId,
    getAnonymousID: session.getAnonymousID,
    isTracked: function isTracked() {
      return session.getId() !== undefined && _isTracked(session.getTrackingType());
    },
    isTrackedWithResource: function isTrackedWithResource() {
      return session.getId() !== undefined && session.getTrackingType() === RumTrackingType.TRACKED_WITH_RESOURCES;
    }
  };
}

function computeSessionState(configuration, rawTrackingType) {
  var trackingType;

  if (hasValidRumSession(rawTrackingType)) {
    trackingType = rawTrackingType;
  } else if (!(0, _tools.performDraw)(configuration.sampleRate)) {
    trackingType = RumTrackingType.NOT_TRACKED;
  } else if (!(0, _tools.performDraw)(configuration.resourceSampleRate)) {
    trackingType = RumTrackingType.TRACKED_WITHOUT_RESOURCES;
  } else {
    trackingType = RumTrackingType.TRACKED_WITH_RESOURCES;
  }

  return {
    trackingType: trackingType,
    isTracked: _isTracked(trackingType)
  };
}

function hasValidRumSession(trackingType) {
  return trackingType === RumTrackingType.NOT_TRACKED || trackingType === RumTrackingType.TRACKED_WITH_RESOURCES || trackingType === RumTrackingType.TRACKED_WITHOUT_RESOURCES;
}

function _isTracked(rumSessionType) {
  return rumSessionType === RumTrackingType.TRACKED_WITH_RESOURCES || rumSessionType === RumTrackingType.TRACKED_WITHOUT_RESOURCES;
}