"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trackFirstHidden = trackFirstHidden;
exports.resetFirstHidden = resetFirstHidden;

var _enums = require("../../helper/enums");

var _tools = require("../../helper/tools");

var trackFirstHiddenSingleton;
var stopListeners;

function trackFirstHidden(emitter) {
  if (typeof emitter === 'undefined') {
    emitter = window;
  }

  if (!trackFirstHiddenSingleton) {
    if (document.visibilityState === 'hidden') {
      trackFirstHiddenSingleton = {
        timeStamp: 0
      };
    } else {
      trackFirstHiddenSingleton = {
        timeStamp: Infinity
      };
      var listeners = (0, _tools.addEventListener)(emitter, _enums.DOM_EVENT.PAGE_HIDE, function (evt) {
        trackFirstHiddenSingleton.timeStamp = evt.timeStamp;
      }, {
        capture: true,
        once: true
      });
      stopListeners = listeners.stop;
    }
  }

  return trackFirstHiddenSingleton;
}

function resetFirstHidden() {
  if (stopListeners) {
    stopListeners();
  }

  trackFirstHiddenSingleton = undefined;
}