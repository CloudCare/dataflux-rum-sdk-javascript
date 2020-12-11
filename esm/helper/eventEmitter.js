import { each } from './tools';

var eventEmitter = function eventEmitter() {
  this._events = [];
  this.pendingEvents = [];
};

eventEmitter.prototype = {
  emit: function emit(type) {
    var args = [].slice.call(arguments, 1);
    each(this._events, function (val) {
      if (val.type !== type) {
        return false;
      }

      val.callback.apply(val.context, args);
    });
  },
  on: function on(event, callback, context) {
    if (typeof callback !== 'function') {
      return;
    }

    this._events.push({
      type: event,
      callback: callback,
      context: context || this
    });
  }
};
export default new eventEmitter();