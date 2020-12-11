import { startAutomaticErrorCollection } from '../../core/errorCollection';
import { extend2Lev, getTimestamp } from '../../helper/tools';
import { RumEventType } from '../../helper/enums';
import { LifeCycleEventType } from '../../helper/lifeCycle';
import { formatUnknownError } from '../../helper/errorTools';
import { computeStackTrace } from '../../helper/tracekit';
export function startErrorCollection(lifeCycle, configuration) {
  return doStartErrorCollection(lifeCycle, configuration, startAutomaticErrorCollection(configuration));
}
export function doStartErrorCollection(lifeCycle, configuration, observable) {
  observable.subscribe(function (error) {
    lifeCycle.notify(LifeCycleEventType.RAW_RUM_EVENT_V2_COLLECTED, processError(error));
  });
}

function processError(error) {
  var rawRumEvent = {
    date: getTimestamp(error.startTime),
    error: {
      message: error.message,
      resource: error.resource,
      source: error.source,
      stack: error.stack,
      type: error.type,
      starttime: getTimestamp(error.startTime)
    },
    type: RumEventType.ERROR
  };
  return {
    rawRumEvent: rawRumEvent,
    startTime: error.startTime
  };
}