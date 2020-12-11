"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tools = require("./tools");

var eventEmitter = function eventEmitter() {
  this._events = [];
  this.pendingEvents = [];
};

eventEmitter.prototype = {
  emit: function emit(type) {
    var args = [].slice.call(arguments, 1);
    (0, _tools.each)(this._events, function (val) {
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

var _default = new eventEmitter();

exports["default"] = _default;