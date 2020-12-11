"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Batch = exports.HttpRequest = void 0;

var _tools = require("../helper/tools");

var _enums = require("../helper/enums");

var _dataMap = _interopRequireDefault(require("./dataMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// https://en.wikipedia.org/wiki/UTF-8
var HAS_MULTI_BYTES_CHARACTERS = /[^\u0000-\u007F]/;

function addBatchPrecision(url) {
  if (!url) return url;
  return url + (url.indexOf('?') === -1 ? '?' : '&') + 'precision=ms';
}

var httpRequest = function httpRequest(endpointUrl, bytesLimit) {
  this.endpointUrl = endpointUrl;
  this.bytesLimit = bytesLimit;
};

httpRequest.prototype = {
  send: function send(data, size) {
    var url = addBatchPrecision(this.endpointUrl);

    if (navigator.sendBeacon && size < this.bytesLimit) {
      var isQueued = navigator.sendBeacon(url, data);

      if (isQueued) {
        return;
      }
    }

    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.withCredentials = true;
    request.send(data);
  }
};
var HttpRequest = httpRequest;
exports.HttpRequest = HttpRequest;

function batch(request, maxSize, bytesLimit, maxMessageSize, flushTimeout, beforeUnloadCallback) {
  this.request = request;
  this.maxSize = maxSize;
  this.bytesLimit = bytesLimit;
  this.maxMessageSize = maxMessageSize;
  this.flushTimeout = flushTimeout;
  this.beforeUnloadCallback = beforeUnloadCallback;
  this.flushOnVisibilityHidden();
  this.flushPeriodically();
}

batch.prototype = {
  pushOnlyBuffer: [],
  upsertBuffer: {},
  bufferBytesSize: 0,
  bufferMessageCount: 0,
  add: function add(message) {
    this.addOrUpdate(message);
  },
  upsert: function upsert(message, key) {
    this.addOrUpdate(message, key);
  },
  flush: function flush() {
    if (this.bufferMessageCount !== 0) {
      var messages = this.pushOnlyBuffer.concat((0, _tools.values)(this.upsertBuffer));
      messages = this.batchProcessSendData(messages);
      this.request.send(messages.join('\n'), this.bufferBytesSize);
      this.pushOnlyBuffer = [];
      this.upsertBuffer = {};
      this.bufferBytesSize = 0;
      this.bufferMessageCount = 0;
    }
  },
  batchProcessSendData: function batchProcessSendData(messages) {
    var _this = this;

    var mes = [];
    (0, _tools.each)(messages, function (message) {
      var data = _this.processSendData(message);

      if (data) {
        mes.push(data);
      }
    });
    return mes;
  },
  processSendData: function processSendData(message) {
    var data = (0, _tools.safeJSONParse)(message);
    if (!data || !data.type) return [];
    var rowsStr = [];
    (0, _tools.each)(_dataMap["default"], function (value, key) {
      if (value.type === data.type) {
        var rowStr = '';
        rowStr += key + ',';
        var tagsStr = [];
        (0, _tools.each)(value.tags, function (value_path, _key) {
          var _value = (0, _tools.findByPath)(data, value_path);

          if (_value || (0, _tools.isNumber)(_value)) {
            tagsStr.push((0, _tools.escapeRowData)(_key) + '=' + (0, _tools.escapeRowData)(_value));
          }
        });

        if (data.tags.length) {
          // 自定义tag
          (0, _tools.each)(data.tags, function (_value, _key) {
            if (_value || (0, _tools.isNumber)(_value)) {
              tagsStr.push((0, _tools.escapeRowData)(_key) + '=' + (0, _tools.escapeRowData)(_value));
            }
          });
        }

        var fieldsStr = [];
        (0, _tools.each)(value.fields, function (_value, _key) {
          if ((0, _tools.isArray)(_value) && _value.length === 2) {
            var type = _value[0],
                value_path = _value[1];

            var _valueData = (0, _tools.findByPath)(data, value_path);

            if (_valueData || (0, _tools.isNumber)(_valueData)) {
              _valueData = (0, _tools.escapeRowData)(_valueData);
              _valueData = type === 'string' ? '"' + _valueData + '"' : _valueData;
              fieldsStr.push((0, _tools.escapeRowData)(_key) + '=' + _valueData);
            }
          } else if ((0, _tools.isString)(_value)) {
            var _valueData = (0, _tools.findByPath)(data, _value);

            if (_valueData || (0, _tools.isNumber)(_valueData)) {
              _valueData = (0, _tools.escapeRowData)(_valueData);
              fieldsStr.push((0, _tools.escapeRowData)(_key) + '=' + _valueData);
            }
          }
        });

        if (tagsStr.length) {
          rowStr += tagsStr.join(',');
        }

        if (fieldsStr.length) {
          rowStr += ' ';
          rowStr += fieldsStr.join(',');
        }

        rowStr = rowStr + ' ' + data.date;

        if (fieldsStr.length) {
          rowsStr.push(rowStr);
        }
      }
    });

    if (rowsStr.length) {
      return rowsStr.join('\n');
    } else {
      return '';
    }
  },
  sizeInBytes: function sizeInBytes(candidate) {
    // Accurate byte size computations can degrade performances when there is a lot of events to process
    if (!HAS_MULTI_BYTES_CHARACTERS.test(candidate)) {
      return candidate.length;
    }

    if (window.TextEncoder !== undefined) {
      return new TextEncoder().encode(candidate).length;
    }

    return new Blob([candidate]).size;
  },
  addOrUpdate: function addOrUpdate(message, key) {
    var process = this.process(message);

    if (process.messageBytesSize >= this.maxMessageSize) {
      console.warn('Discarded a message whose size was bigger than the maximum allowed size' + this.maxMessageSize + 'KB.');
      return;
    }

    if (this.hasMessageFor(key)) {
      this.remove(key);
    }

    if (this.willReachedBytesLimitWith(process.messageBytesSize)) {
      this.flush();
    }

    this.push(process.processedMessage, process.messageBytesSize, key);

    if (this.isFull()) {
      this.flush();
    }
  },
  process: function process(message) {
    var processedMessage = (0, _tools.jsonStringify)(message);
    var messageBytesSize = this.sizeInBytes(processedMessage);
    return {
      processedMessage: processedMessage,
      messageBytesSize: messageBytesSize
    };
  },
  push: function push(processedMessage, messageBytesSize, key) {
    if (this.bufferMessageCount > 0) {
      // \n separator at serialization
      this.bufferBytesSize += 1;
    }

    if (key !== undefined) {
      this.upsertBuffer[key] = processedMessage;
    } else {
      this.pushOnlyBuffer.push(processedMessage);
    }

    this.bufferBytesSize += messageBytesSize;
    this.bufferMessageCount += 1;
  },
  remove: function remove(key) {
    var removedMessage = this.upsertBuffer[key];
    delete this.upsertBuffer[key];
    var messageBytesSize = this.sizeInBytes(removedMessage);
    this.bufferBytesSize -= messageBytesSize;
    this.bufferMessageCount -= 1;

    if (this.bufferMessageCount > 0) {
      this.bufferBytesSize -= 1;
    }
  },
  hasMessageFor: function hasMessageFor(key) {
    return key !== undefined && this.upsertBuffer[key] !== undefined;
  },
  willReachedBytesLimitWith: function willReachedBytesLimitWith(messageBytesSize) {
    // byte of the separator at the end of the message
    return this.bufferBytesSize + messageBytesSize + 1 >= this.bytesLimit;
  },
  isFull: function isFull() {
    return this.bufferMessageCount === this.maxSize || this.bufferBytesSize >= this.bytesLimit;
  },
  flushPeriodically: function flushPeriodically() {
    var _this = this;

    setTimeout(function () {
      _this.flush();

      _this.flushPeriodically();
    }, _this.flushTimeout);
  },
  flushOnVisibilityHidden: function flushOnVisibilityHidden() {
    var _this = this;
    /**
     * With sendBeacon, requests are guaranteed to be successfully sent during document unload
     */
    // @ts-ignore this function is not always defined


    if (navigator.sendBeacon) {
      /**
       * beforeunload is called before visibilitychange
       * register first to be sure to be called before flush on beforeunload
       * caveat: unload can still be canceled by another listener
       */
      (0, _tools.addEventListener)(window, _enums.DOM_EVENT.BEFORE_UNLOAD, _this.beforeUnloadCallback);
      /**
       * Only event that guarantee to fire on mobile devices when the page transitions to background state
       * (e.g. when user switches to a different application, goes to homescreen, etc), or is being unloaded.
       */

      (0, _tools.addEventListener)(document, _enums.DOM_EVENT.VISIBILITY_CHANGE, function () {
        if (document.visibilityState === 'hidden') {
          _this.flush();
        }
      });
      /**
       * Safari does not support yet to send a request during:
       * - a visibility change during doc unload (cf: https://bugs.webkit.org/show_bug.cgi?id=194897)
       * - a page hide transition (cf: https://bugs.webkit.org/show_bug.cgi?id=188329)
       */

      (0, _tools.addEventListener)(window, _enums.DOM_EVENT.BEFORE_UNLOAD, function () {
        _this.flush();
      });
    }
  }
};
var Batch = batch;
exports.Batch = Batch;