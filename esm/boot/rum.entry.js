import { defineGlobal, makeGlobal, getGlobalObject, checkCookiesAuthorized, checkIsNotLocalFile } from '../core/init';
import { createContextManager, isPercentage } from '../helper/tools';
import { startRum } from './rum';
import { buildCookieOptions } from '../core/configuration';
export var datafluxRum = makeRumGlobal(startRum);
defineGlobal(getGlobalObject(), 'DATAFLUX_RUM', datafluxRum);
export function makeRumGlobal(startRumImpl) {
  var isAlreadyInitialized = false;
  var globalContextManager = createContextManager();
  var rumGlobal = makeGlobal({
    init: function init(userConfiguration) {
      if (typeof userConfiguration === 'undefined') {
        userConfiguration = {};
      }

      if (!checkCookiesAuthorized(buildCookieOptions(userConfiguration)) || !checkIsNotLocalFile() || !canInitRum(userConfiguration)) {
        return;
      }

      startRumImpl(userConfiguration, globalContextManager.get);
      isAlreadyInitialized = true;
    },
    addRumGlobalContext: globalContextManager.add,
    removeRumGlobalContext: globalContextManager.remove,
    getRumGlobalContext: globalContextManager.get,
    setRumGlobalContext: globalContextManager.set
  });
  return rumGlobal;

  function canInitRum(userConfiguration) {
    if (isAlreadyInitialized) {
      console.error('DATAFLUX_RUM is already initialized.');
      return false;
    }

    if (!userConfiguration.applicationId) {
      console.error('Application ID is not configured, no RUM data will be collected.');
      return false;
    }

    if (!userConfiguration.datakitUrl) {
      console.error('datakitUrl is not configured, no RUM data will be collected.');
      return false;
    }

    if (userConfiguration.sampleRate !== undefined && !isPercentage(userConfiguration.sampleRate)) {
      console.error('Sample Rate should be a number between 0 and 100');
      return false;
    }

    if (userConfiguration.resourceSampleRate !== undefined && !isPercentage(userConfiguration.resourceSampleRate)) {
      console.error('Resource Sample Rate should be a number between 0 and 100');
      return false;
    }

    return true;
  }
}