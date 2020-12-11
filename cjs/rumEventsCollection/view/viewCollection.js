"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startViewCollection = startViewCollection;

var _tools = require("../../helper/tools");

var _enums = require("../../helper/enums");

var _lifeCycle = require("../../helper/lifeCycle");

var _trackViews = require("./trackViews");

var _resourceUtils = require("../resource/resourceUtils");

function startViewCollection(lifeCycle, configuration, location) {
  lifeCycle.subscribe(_lifeCycle.LifeCycleEventType.VIEW_UPDATED, function (view) {
    lifeCycle.notify(_lifeCycle.LifeCycleEventType.RAW_RUM_EVENT_V2_COLLECTED, processViewUpdate(view));
  });
  return (0, _trackViews.trackViews)(location, lifeCycle);
}

function computePerformanceViewDetails(entry) {
  var validEntry = (0, _resourceUtils.toValidEntry)(entry);

  if (!validEntry) {
    return undefined;
  }

  var fetchStart = validEntry.fetchStart,
      responseEnd = validEntry.responseEnd,
      domInteractive = validEntry.domInteractive,
      domContentLoaded = validEntry.domContentLoaded,
      domComplete = validEntry.domComplete,
      loadEventEnd = validEntry.loadEventEnd;
  var details = {
    fmp: (0, _tools.msToNs)(validEntry.largestContentfulPaint)
  };

  if (responseEnd !== fetchStart) {
    details.fpt = (0, _tools.msToNs)(responseEnd - fetchStart);
    var apdexLevel = parseInt((responseEnd - fetchStart) / 1000); // 秒数取整

    details.apdexLevel = apdexLevel > 9 ? 9 : apdexLevel;
  }

  if (domInteractive !== fetchStart) {
    details.tti = (0, _tools.msToNs)(domInteractive - fetchStart);
  }

  if (domContentLoaded !== fetchStart) {
    details.domReady = (0, _tools.msToNs)(domContentLoaded - fetchStart);
  } // Make sure a connection occurred


  if (loadEventEnd !== fetchStart) {
    details.load = (0, _tools.msToNs)(loadEventEnd - fetchStart);
  }

  if (loadEventEnd !== domContentLoaded) {
    details.resourceLoadTime = (0, _tools.msToNs)(loadEventEnd - domContentLoaded);
  }

  if (domComplete !== domInteractive) {
    details.dom = (0, _tools.msToNs)(domComplete - domInteractive);
  }

  return details;
}

function processViewUpdate(view) {
  var viewEvent = {
    _dd: {
      documentVersion: view.documentVersion
    },
    date: (0, _tools.getTimestamp)(view.startTime),
    type: _enums.RumEventType.VIEW,
    page: {
      // action: {
      //   count: view.eventCounts.userActionCount
      // },
      cumulativeLayoutShift: view.cumulativeLayoutShift,
      domComplete: (0, _tools.msToNs)(view.timings.domComplete),
      domContentLoaded: (0, _tools.msToNs)(view.timings.domContentLoaded),
      domInteractive: (0, _tools.msToNs)(view.timings.domInteractive),
      error: {
        count: view.eventCounts.errorCount
      },
      firstContentfulPaint: (0, _tools.msToNs)(view.timings.firstContentfulPaint),
      // firstInputDelay: msToNs(view.timings.firstInputDelay),
      loadEventEnd: (0, _tools.msToNs)(view.timings.loadEventEnd),
      loadingTime: (0, _tools.msToNs)(view.loadingTime),
      loadingType: view.loadingType,
      // longTask: {
      //   count: view.eventCounts.longTaskCount
      // },
      // resource: {
      //   count: view.eventCounts.resourceCount
      // },
      timeSpent: (0, _tools.msToNs)(view.duration)
    }
  };
  viewEvent = (0, _tools.extend2Lev)(viewEvent, {
    page: computePerformanceViewDetails(view.timings)
  });
  return {
    rawRumEvent: viewEvent,
    startTime: view.startTime
  };
}