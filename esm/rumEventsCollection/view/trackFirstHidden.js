import { DOM_EVENT } from '../../helper/enums';
import { addEventListener } from '../../helper/tools';
var trackFirstHiddenSingleton;
var stopListeners;
export function trackFirstHidden(emitter) {
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
      var listeners = addEventListener(emitter, DOM_EVENT.PAGE_HIDE, function (evt) {
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
export function resetFirstHidden() {
  if (stopListeners) {
    stopListeners();
  }

  trackFirstHiddenSingleton = undefined;
}