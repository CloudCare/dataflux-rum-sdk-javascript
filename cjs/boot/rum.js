"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startRum = startRum;
exports.startRumEventCollection = startRumEventCollection;

var _rumSession = require("../rumEventsCollection/rumSession");

var _configuration = require("../core/configuration");

var _buildEnv = require("./buildEnv");

var _lifeCycle = require("../helper/lifeCycle");

var _performanceCollection = require("../rumEventsCollection/performanceCollection");

var _parentContexts = require("../rumEventsCollection/parentContexts");

var _batch = require("../rumEventsCollection/transport/batch");

var _assembly = require("../rumEventsCollection/assembly");

var _errorCollection = require("../rumEventsCollection/error/errorCollection");

var _viewCollection = require("../rumEventsCollection/view/viewCollection");

var _requestCollections = require("../rumEventsCollection/requestCollections");

var _resourceCollection = require("../rumEventsCollection/resource/resourceCollection");

function startRum(userConfiguration, getGlobalContext) {
  var lifeCycle = new _lifeCycle.LifeCycle();
  var configuration = (0, _configuration.commonInit)(userConfiguration, _buildEnv.buildEnv);
  var session = (0, _rumSession.startRumSession)(configuration, lifeCycle);
  startRumEventCollection(userConfiguration.applicationId, location, lifeCycle, configuration, session, getGlobalContext);
  (0, _performanceCollection.startPerformanceCollection)(lifeCycle, configuration);
  (0, _requestCollections.startRequestCollection)(lifeCycle, configuration);
}

function startRumEventCollection(applicationId, location, lifeCycle, configuration, session, getGlobalContext) {
  var parentContexts = (0, _parentContexts.startParentContexts)(lifeCycle, session);
  var batch = (0, _batch.startRumBatch)(configuration, lifeCycle);
  (0, _assembly.startRumAssembly)(applicationId, configuration, lifeCycle, session, parentContexts, getGlobalContext);
  (0, _resourceCollection.startResourceCollection)(lifeCycle, configuration, session);
  (0, _viewCollection.startViewCollection)(lifeCycle, configuration, location);
  (0, _errorCollection.startErrorCollection)(lifeCycle, configuration);
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