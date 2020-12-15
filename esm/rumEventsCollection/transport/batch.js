import { LifeCycleEventType } from '../../helper/lifeCycle';
import { Batch, HttpRequest } from '../../core/transport';
import { RumEventType } from '../../helper/enums';
export function startRumBatch(configuration, lifeCycle) {
  var batch = makeRumBatch(configuration, lifeCycle);
  lifeCycle.subscribe(LifeCycleEventType.RUM_EVENT_V2_COLLECTED, function (data) {
    var rumEvent = data.rumEvent;
    var serverRumEvent = data.serverRumEvent;

    if (rumEvent.type === RumEventType.VIEW) {
      batch.upsert(serverRumEvent, rumEvent.page.id);
    } else {
      batch.add(serverRumEvent);
    }
  });
  return {
    stop: function stop() {
      batch.stop();
    }
  };
}

function makeRumBatch(configuration, lifeCycle) {
  var primaryBatch = createRumBatch(configuration.datakitUrl, function () {
    lifeCycle.notify(LifeCycleEventType.BEFORE_UNLOAD);
  });

  function createRumBatch(endpointUrl, unloadCallback) {
    return new Batch(new HttpRequest(endpointUrl, configuration.batchBytesLimit), configuration.maxBatchSize, configuration.batchBytesLimit, configuration.maxMessageSize, configuration.flushTimeout, unloadCallback);
  }

  var stopped = false;
  return {
    add: function add(message) {
      if (stopped) {
        return;
      }

      primaryBatch.add(message);
    },
    stop: function stop() {
      stopped = true;
    },
    upsert: function upsert(message, key) {
      if (stopped) {
        return;
      }

      primaryBatch.upsert(message, key);
    }
  };
}