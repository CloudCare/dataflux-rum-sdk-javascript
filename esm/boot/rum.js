import { startRumSession } from '../rumEventsCollection/rumSession';
import { commonInit } from '../core/configuration';
import { buildEnv } from './buildEnv';
import { LifeCycle } from '../helper/lifeCycle';
import { startPerformanceCollection } from '../rumEventsCollection/performanceCollection';
import { startParentContexts } from '../rumEventsCollection/parentContexts';
import { startRumBatch } from '../rumEventsCollection/transport/batch';
import { startRumAssembly } from '../rumEventsCollection/assembly';
import { startErrorCollection } from '../rumEventsCollection/error/errorCollection';
import { startViewCollection } from '../rumEventsCollection/view/viewCollection';
import { startRequestCollection } from '../rumEventsCollection/requestCollections';
import { startResourceCollection } from '../rumEventsCollection/resource/resourceCollection';
export function startRum(userConfiguration, getGlobalContext) {
  var lifeCycle = new LifeCycle();
  var configuration = commonInit(userConfiguration, buildEnv);
  var session = startRumSession(configuration, lifeCycle);
  startRumEventCollection(userConfiguration.applicationId, location, lifeCycle, configuration, session, getGlobalContext);
  startPerformanceCollection(lifeCycle, configuration);
  startRequestCollection(lifeCycle, configuration);
}
export function startRumEventCollection(applicationId, location, lifeCycle, configuration, session, getGlobalContext) {
  var parentContexts = startParentContexts(lifeCycle, session);
  var batch = startRumBatch(configuration, lifeCycle);
  startRumAssembly(applicationId, configuration, lifeCycle, session, parentContexts, getGlobalContext);
  startResourceCollection(lifeCycle, configuration, session);
  startViewCollection(lifeCycle, configuration, location);
  startErrorCollection(lifeCycle, configuration);
  return {
    stop: function stop() {
      batch.stop();
    }
  }; // return {
  //   addAction,
  //   addError,
  //   parentContexts,
  //   stop() {
  //     // prevent batch from previous tests to keep running and send unwanted requests
  //     // could be replaced by stopping all the component when they will all have a stop method
  //     batch.stop()
  //   }
  // }
}