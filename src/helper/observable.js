import { each } from './tools'
var Observable = function () {
  this.observers = []
}
Observable.prototype = {
  subscribe: function (f) {
    this.observers.push(f)
  },
  notify: function (data) {
    each(this.observers, function (observer) {
      observer(data)
    })
  }
}
export default Observable
