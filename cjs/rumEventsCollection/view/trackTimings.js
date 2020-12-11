"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trackTimings = trackTimings;
exports.trackNavigationTimings = trackNavigationTimings;
exports.trackFirstContentfulPaint = trackFirstContentfulPaint;
exports.trackLargestContentfulPaint = trackLargestContentfulPaint;
exports.trackFirstInputDelay = trackFirstInputDelay;

var _enums = require("../../helper/enums");

var _tools = require("../../helper/tools");

var _lifeCycle = require("../../helper/lifeCycle");

var _trackFirstHidden = require("./trackFirstHidden");

function trackTimings(lifeCycle, callback) {
  console.log('========trackTimings========');
  var timings = {};

  function setTimings(newTimings) {
    timings = (0, _tools.extend)({}, timings, newTimings);
    callback(timings);
  }

  var _trackNavigationTimings = trackNavigationTimings(lifeCycle, setTimings);

  var _trackFirstContentfulPaint = trackFirstContentfulPaint(lifeCycle, function (firstContentfulPaint) {
    setTimings({
      firstContentfulPaint: firstContentfulPaint
    });
  });

  var _trackLargestContentfulPaint = trackLargestContentfulPaint(lifeCycle, window, function (largestContentfulPaint) {
    setTimings({
      largestContentfulPaint: largestContentfulPaint
    });
  }); // var _trackFirstInputDelay = trackFirstInputDelay(
  //   lifeCycle,
  //   function (firstInputDelay) {
  //     setTimings({
  //       firstInputDelay: firstInputDelay
  //     })
  //   }
  // )


  var stopNavigationTracking = _trackNavigationTimings.stop;
  var stopFCPTracking = _trackFirstContentfulPaint.stop;
  var stopLCPTracking = _trackLargestContentfulPaint.stop; // var stopFIDTracking = _trackFirstInputDelay.stop

  return {
    stop: function stop() {
      stopNavigationTracking();
      stopFCPTracking();
      stopLCPTracking(); // stopFIDTracking()
    }
  };
}

function trackNavigationTimings(lifeCycle, callback) {
  console.log('====trackNavigationTimings=====');
  var subscribe = lifeCycle.subscribe(_lifeCycle.LifeCycleEventType.PERFORMANCE_ENTRY_COLLECTED, function (entry) {
    if (entry.entryType === 'navigation') {
      callback({
        fetchStart: entry.fetchStart,
        responseEnd: entry.responseEnd,
        domComplete: entry.domComplete,
        domContentLoaded: entry.domContentLoadedEventEnd,
        domInteractive: entry.domInteractive,
        loadEventEnd: entry.loadEventEnd
      });
    }
  });
  return {
    stop: subscribe.unsubscribe
  };
}

function trackFirstContentfulPaint(lifeCycle, callback) {
  var firstHidden = (0, _trackFirstHidden.trackFirstHidden)();
  var subscribe = lifeCycle.subscribe(_lifeCycle.LifeCycleEventType.PERFORMANCE_ENTRY_COLLECTED, function (entry) {
    if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint' && entry.startTime < firstHidden.timeStamp) {
      callback(entry.startTime);
    }
  });
  return {
    stop: subscribe.unsubscribe
  };
}
/**
 * Track the largest contentful paint (LCP) occuring during the initial View.  This can yield
 * multiple values, only the most recent one should be used.
 * Documentation: https://web.dev/lcp/
 * Reference implementation: https://github.com/GoogleChrome/web-vitals/blob/master/src/getLCP.ts
 */


function trackLargestContentfulPaint(lifeCycle, emitter, callback) {
  var firstHidden = (0, _trackFirstHidden.trackFirstHidden)(); // Ignore entries that come after the first user interaction.  According to the documentation, the
  // browser should not send largest-contentful-paint entries after a user interact with the page,
  // but the web-vitals reference implementation uses this as a safeguard.

  var firstInteractionTimestamp = Infinity;
  var listeners = (0, _tools.addEventListeners)(emitter, [_enums.DOM_EVENT.POINTER_DOWN, _enums.DOM_EVENT.KEY_DOWN], function (event) {
    firstInteractionTimestamp = event.timeStamp;
  }, {
    capture: true,
    once: true
  });
  var subscribe = lifeCycle.subscribe(_lifeCycle.LifeCycleEventType.PERFORMANCE_ENTRY_COLLECTED, function (entry) {
    if (entry.entryType === 'largest-contentful-paint' && entry.startTime < firstInteractionTimestamp && entry.startTime < firstHidden.timeStamp) {
      callback(entry.startTime);
    }
  });
  return {
    stop: function stop() {
      listeners.stop();
      listeners.stop();
      subscribe.unsubscribe();
    }
  };
}
/**
 * Track the first input delay (FID) occuring during the initial View.  This yields at most one
 * value.
 * Documentation: https://web.dev/fid/
 * Reference implementation: https://github.com/GoogleChrome/web-vitals/blob/master/src/getFID.ts
 */


function trackFirstInputDelay(lifeCycle, callback) {
  var firstHidden = (0, _trackFirstHidden.trackFirstHidden)();
  var lifeCycle = lifeCycle.subscribe(_lifeCycle.LifeCycleEventType.PERFORMANCE_ENTRY_COLLECTED, function (entry) {
    if (entry.entryType === 'first-input' && entry.startTime < firstHidden.timeStamp) {
      callback(entry.processingStart - entry.startTime);
    }
  });
  return {
    stop: lifeCycle.unsubscribe
  };
}