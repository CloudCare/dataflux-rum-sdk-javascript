"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tools = require("./tools");

var _params = _interopRequireDefault(require("./params"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var dataSend = {};

dataSend.getSendUrl = function (url, data) {
  var base64Data = (0, _tools.base64Encode)(data);
  var crc = 'crc=' + (0, _tools.hashCode)(base64Data);

  if (url.indexOf('?') !== -1) {
    return url + '&data=' + encodeURIComponent(base64Data) + '&ext=' + encodeURIComponent(crc);
  } else {
    return url + '?data=' + encodeURIComponent(base64Data) + '&ext=' + encodeURIComponent(crc);
  }
};

dataSend.getSendData = function (data) {
  var base64Data = (0, _tools.base64Encode)(data);
  var crc = 'crc=' + (0, _tools.hashCode)(base64Data);
  return 'data=' + encodeURIComponent(base64Data) + '&ext=' + encodeURIComponent(crc);
};

dataSend.getInstance = function (data) {
  var sendType = this.getSendType(data);
  var obj = new this[sendType](data);
  var start = obj.start;

  obj.start = function () {
    var me = this;
    start.apply(this, arguments);
    setTimeout(function () {
      me.isEnd(true);
    }, _params["default"].callbackTimeout);
  };

  obj.end = function () {
    this.callback && this.callback();
    var self = this;
    setTimeout(function () {
      self.lastClear && self.lastClear();
    }, _params["default"].datasendTimeout - _params["default"].callbackTimeout);
  };

  obj.isEnd = function (isDelay) {
    if (!this.received) {
      this.received = true;
      this.end();
      var self = this;

      if (isDelay) {
        if (_params["default"].queueTimeout - _params["default"].callbackTimeout <= 0) {
          self.close();
        } else {
          setTimeout(function () {
            self.close();
          }, _params["default"].queueTimeout - _params["default"].callbackTimeout);
        }
      } else {
        self.close();
      }
    }
  };

  return obj;
};

dataSend.getSendType = function (data) {
  var supportedSendTypes = ['image', 'ajax', 'beacon'];
  var sendType = supportedSendTypes[0];

  if (data.config && (0, _tools.indexOf)(supportedSendTypes, data.config.send_type) > -1) {
    sendType = data.config.send_type;
  } else {
    sendType = 'ajax';
  }

  if (sendType === 'beacon' && typeof navigator.sendBeacon !== 'function') {
    sendType = 'image';
  }

  if (sendType === 'ajax' && (0, _tools.isSupportCors)() === false) {
    sendType = 'image';
  }

  return sendType;
};

dataSend.image = function (para) {
  this.callback = para.callback;
  this.img = document.createElement('img');
  this.img.width = 1;
  this.img.height = 1;
  this.img.crossOrigin = 'anonymous';
  this.data = para.data;
  this.server_url = dataSend.getSendUrl(para.server_url, para.data);
};

dataSend.image.prototype.start = function () {
  var me = this;

  this.img.onload = function () {
    this.onload = null;
    this.onerror = null;
    this.onabort = null;
    me.isEnd();
  };

  this.img.onerror = function () {
    this.onload = null;
    this.onerror = null;
    this.onabort = null;
    me.isEnd();
  };

  this.img.onabort = function () {
    this.onload = null;
    this.onerror = null;
    this.onabort = null;
    me.isEnd();
  };

  this.img.src = this.server_url;
};

dataSend.image.prototype.lastClear = function () {
  this.img.src = '';
};

dataSend.ajax = function (para) {
  this.callback = para.callback;
  this.server_url = para.server_url;
  this.data = dataSend.getSendData(para.data);
};

dataSend.ajax.prototype.start = function () {
  var me = this;

  _.ajax({
    url: this.server_url,
    type: 'POST',
    data: this.data,
    credentials: false,
    timeout: _params["default"].datasendTimeout,
    cors: true,
    success: function success() {
      me.isEnd();
    },
    error: function error() {
      me.isEnd();
    }
  });
};

dataSend.beacon = function (para) {
  this.callback = para.callback;
  this.server_url = para.server_url;
  this.data = dataSend.getSendData(para.data);
};

dataSend.beacon.prototype.start = function () {
  var me = this;

  if ((typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === 'object' && typeof navigator.sendBeacon === 'function') {
    navigator.sendBeacon(this.server_url, this.data);
  }

  setTimeout(function () {
    me.isEnd();
  }, 40);
};

var _default = dataSend;
exports["default"] = _default;