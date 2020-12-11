import { each } from './tools';

var Observable = function Observable() {
  this.observers = [];
};

Observable.prototype = {
  subscribe: function subscribe(f) {
    this.observers.push(f);
  },
  notify: function notify(data) {
    each(this.observers, function (observer) {
      observer(data);
    });
  }
};
export default Observable;