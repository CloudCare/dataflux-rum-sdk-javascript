"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tools = require("./tools");

var Observable = function Observable() {
  this.observers = [];
};

Observable.prototype = {
  subscribe: function subscribe(f) {
    this.observers.push(f);
  },
  notify: function notify(data) {
    (0, _tools.each)(this.observers, function (observer) {
      observer(data);
    });
  }
};
var _default = Observable;
exports["default"] = _default;