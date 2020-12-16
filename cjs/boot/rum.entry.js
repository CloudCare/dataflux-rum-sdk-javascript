"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeRumGlobal = makeRumGlobal;
exports.datafluxRum = void 0;

var _init = require("../core/init");

var _tools = require("../helper/tools");

var _rum = require("./rum");

var _configuration = require("../core/configuration");

var datafluxRum = makeRumGlobal(_rum.startRum);
exports.datafluxRum = datafluxRum;
(0, _init.defineGlobal)((0, _init.getGlobalObject)(), 'DATAFLUX_RUM', datafluxRum);

function makeRumGlobal(startRumImpl) {
  var isAlreadyInitialized = false;
  var globalContextManager = (0, _tools.createContextManager)();
  var rumGlobal = (0, _init.makeGlobal)({
    init: function init(userConfiguration) {
      if (typeof userConfiguration === 'undefined') {
        userConfiguration = {};
      }

      if (!(0, _init.checkCookiesAuthorized)((0, _configuration.buildCookieOptions)(userConfiguration)) || !(0, _init.checkIsNotLocalFile)() || !canInitRum(userConfiguration)) {
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

    if (userConfiguration.sampleRate !== undefined && !(0, _tools.isPercentage)(userConfiguration.sampleRate)) {
      console.error('Sample Rate should be a number between 0 and 100');
      return false;
    }

    if (userConfiguration.resourceSampleRate !== undefined && !(0, _tools.isPercentage)(userConfiguration.resourceSampleRate)) {
      console.error('Resource Sample Rate should be a number between 0 and 100');
      return false;
    }

    return true;
  }
}