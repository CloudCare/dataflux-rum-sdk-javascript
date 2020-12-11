"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestType = exports.RumEventType = exports.ResourceType = exports.DOM_EVENT = void 0;
var DOM_EVENT = {
  BEFORE_UNLOAD: 'beforeunload',
  CLICK: 'click',
  KEY_DOWN: 'keydown',
  LOAD: 'load',
  POP_STATE: 'popstate',
  SCROLL: 'scroll',
  TOUCH_START: 'touchstart',
  VISIBILITY_CHANGE: 'visibilitychange',
  DOM_CONTENT_LOADED: 'DOMContentLoaded',
  POINTER_DOWN: 'pointerdown',
  POINTER_UP: 'pointerup',
  POINTER_CANCEL: 'pointercancel',
  HASH_CHANGE: 'hashchange',
  PAGE_HIDE: 'pagehide',
  MOUSE_DOWN: 'mousedown'
};
exports.DOM_EVENT = DOM_EVENT;
var ResourceType = {
  DOCUMENT: 'document',
  XHR: 'xhr',
  BEACON: 'beacon',
  FETCH: 'fetch',
  CSS: 'css',
  JS: 'js',
  IMAGE: 'image',
  FONT: 'font',
  MEDIA: 'media',
  OTHER: 'other'
};
exports.ResourceType = ResourceType;
var RumEventType = {
  ACTION: 'action',
  ERROR: 'error',
  LONG_TASK: 'long_task',
  VIEW: 'view',
  RESOURCE: 'resource'
};
exports.RumEventType = RumEventType;
var RequestType = {
  FETCH: ResourceType.FETCH,
  XHR: ResourceType.XHR
};
exports.RequestType = RequestType;