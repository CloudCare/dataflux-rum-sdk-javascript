import { each, filter } from './tools';
export var LifeCycleEventType = {
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
export function LifeCycle() {}
LifeCycle.prototype = {
  callbacks: [],
  notify: function notify(eventType, data) {
    var eventCallbacks = this.callbacks[eventType];

    if (eventCallbacks) {
      each(eventCallbacks, function (callback) {
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
        _this.callbacks[eventType] = filter(_this.callbacks[eventType], function (other) {
          return other !== callback;
        });
      }
    };
  }
};