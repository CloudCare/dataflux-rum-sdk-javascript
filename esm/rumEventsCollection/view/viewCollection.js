import { getTimestamp, msToNs, extend2Lev } from '../../helper/tools';
import { RumEventType } from '../../helper/enums';
import { LifeCycleEventType } from '../../helper/lifeCycle';
import { trackViews } from './trackViews';
import { toValidEntry } from '../resource/resourceUtils';
export function startViewCollection(lifeCycle, configuration, location) {
  lifeCycle.subscribe(LifeCycleEventType.VIEW_UPDATED, function (view) {
    lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_V2_COLLECTED, processViewUpdate(view));
  });
  return trackViews(location, lifeCycle);
}

function computePerformanceViewDetails(entry) {
  var validEntry = toValidEntry(entry);

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
    fmp: msToNs(validEntry.largestContentfulPaint)
  };

  if (responseEnd !== fetchStart) {
    details.fpt = msToNs(responseEnd - fetchStart);
    var apdexLevel = parseInt((responseEnd - fetchStart) / 1000); // 秒数取整

    details.apdexLevel = apdexLevel > 9 ? 9 : apdexLevel;
  }

  if (domInteractive !== fetchStart) {
    details.tti = msToNs(domInteractive - fetchStart);
  }

  if (domContentLoaded !== fetchStart) {
    details.domReady = msToNs(domContentLoaded - fetchStart);
  } // Make sure a connection occurred


  if (loadEventEnd !== fetchStart) {
    details.load = msToNs(loadEventEnd - fetchStart);
  }

  if (loadEventEnd !== domContentLoaded) {
    details.resourceLoadTime = msToNs(loadEventEnd - domContentLoaded);
  }

  if (domComplete !== domInteractive) {
    details.dom = msToNs(domComplete - domInteractive);
  }

  return details;
}

function processViewUpdate(view) {
  var viewEvent = {
    _dd: {
      documentVersion: view.documentVersion
    },
    date: getTimestamp(view.startTime),
    type: RumEventType.VIEW,
    page: {
      // action: {
      //   count: view.eventCounts.userActionCount
      // },
      cumulativeLayoutShift: view.cumulativeLayoutShift,
      domComplete: msToNs(view.timings.domComplete),
      domContentLoaded: msToNs(view.timings.domContentLoaded),
      domInteractive: msToNs(view.timings.domInteractive),
      error: {
        count: view.eventCounts.errorCount
      },
      firstContentfulPaint: msToNs(view.timings.firstContentfulPaint),
      // firstInputDelay: msToNs(view.timings.firstInputDelay),
      loadEventEnd: msToNs(view.timings.loadEventEnd),
      loadingTime: msToNs(view.loadingTime),
      loadingType: view.loadingType,
      // longTask: {
      //   count: view.eventCounts.longTaskCount
      // },
      // resource: {
      //   count: view.eventCounts.resourceCount
      // },
      timeSpent: msToNs(view.duration)
    }
  };
  viewEvent = extend2Lev(viewEvent, {
    page: computePerformanceViewDetails(view.timings)
  });
  return {
    rawRumEvent: viewEvent,
    startTime: view.startTime
  };
}