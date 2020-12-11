"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LifeCycle = LifeCycle;
exports.LifeCycleEventType = void 0;

var _tools = require("./tools");

var LifeCycleEventType = {
  PERFORMANCE_ENTRY_COLLECTED: 'PERFORMANCE_ENTRY_COLLECTED',
  VIEW_CREATED: 'VIEW_CREATED',
  VIEW_UPDATED: 'VIEW_UPDATED',
  SESSION_RENEWED: 'SESSION_RENEWED',
  DOM_MUTATED: 'DOM_MUTATED',
  BEFORE_UNLOAD: 'BEFORE_UNLOAD',
  REQUEST_STARTED: 'REQUEST_STARTED',
  REQUEST_COMPLETED: 'REQUEST_COMPLETED',
  RAW_RUM_EVENT_V2_COLLECTED: 'RAW_RUM_EVENT_V2_COLLECTED',
  RUM_EVENT_V2_COLLECTED: 'RUM_EVENT_V2_COLLECTED'
};
exports.LifeCycleEventType = LifeCycleEventType;

function LifeCycle() {}

LifeCycle.prototype = {
  callbacks: [],
  notify: function notify(eventType, data) {
    var eventCallbacks = this.callbacks[eventType];

    if (eventCallbacks) {
      (0, _tools.each)(eventCallbacks, function (callback) {
        callback(data);
      });
    }
  },
  subscribe: function subscribe(eventType, callback) {
    if (!this.callbacks[eventType]) {
      this.callbacks[eventType] = [];
    }

    this.callbacks[eventType].push(callback);

    var _this = this;

    return {
      unsubscribe: function unsubscribe() {
        _this.callbacks[eventType] = (0, _tools.filter)(_this.callbacks[eventType], function (other) {
          return other !== callback;
        });
      }
    };
  }
};