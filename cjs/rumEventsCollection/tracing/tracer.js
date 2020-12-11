"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearTracingIfCancelled = clearTracingIfCancelled;
exports.startTracer = startTracer;
exports.isTracingSupported = isTracingSupported;
exports.TraceIdentifier = TraceIdentifier;

var _tools = require("../../helper/tools");

var _urlPolyfill = require("../../helper/urlPolyfill");

function clearTracingIfCancelled(context) {
  if (context.status === 0) {
    context.traceId = undefined;
    context.spanId = undefined;
  }
}

function startTracer(configuration) {
  return {
    clearTracingIfCancelled: clearTracingIfCancelled,
    traceFetch: function traceFetch(context) {
      return injectHeadersIfTracingAllowed(configuration, context, function (tracingHeaders) {
        context.init = (0, _tools.extend)({}, context.init);
        var headers = [];

        if (context.init.headers instanceof Headers) {
          (0, _tools.each)(context.init.headers, function (value, key) {
            headers.push([key, value]);
          });
        } else if ((0, _tools.isArray)(context.init.headers)) {
          (0, _tools.each)(context.init.headers, function (header) {
            headers.push(header);
          });
        } else if (context.init.headers) {
          (0, _tools.each)(context.init.headers, function (value, key) {
            headers.push([key, value]);
          });
        }

        context.init.headers = headers.concat((0, _tools.objectEntries)(tracingHeaders));
      });
    },
    traceXhr: function traceXhr(context, xhr) {
      return injectHeadersIfTracingAllowed(configuration, context, function (tracingHeaders) {
        (0, _tools.each)(tracingHeaders, function (name, value) {
          xhr.setRequestHeader(name, value);
        });
      });
    }
  };
}

function injectHeadersIfTracingAllowed(configuration, context, inject) {
  if (!isTracingSupported() || !isAllowedUrl(configuration, context.url)) {
    return;
  }

  context.traceId = new TraceIdentifier();
  context.spanId = new TraceIdentifier();
  inject(makeTracingHeaders(context.traceId, context.spanId));
}

function isAllowedUrl(configuration, requestUrl) {
  var requestOrigin = (0, _urlPolyfill.getOrigin)(requestUrl);
  var flag = false;
  (0, _tools.each)(configuration.allowedTracingOrigins, function (allowedOrigin) {
    if (requestOrigin === allowedOrigin || allowedOrigin instanceof RegExp && allowedOrigin.test(requestOrigin)) {
      flag = true;
      return false;
    }
  });
  return flag;
}

function isTracingSupported() {
  return getCrypto() !== undefined;
}

function getCrypto() {
  return window.crypto || window.msCrypto;
}

function makeTracingHeaders(traceId, spanId) {
  return {
    'x-dataflux-origin': 'rum',
    'x-dataflux-parent-id': spanId.toDecimalString(),
    'x-dataflux-sampled': '1',
    'x-dataflux-sampling-priority': '1',
    'x-dataflux-trace-id': traceId.toDecimalString()
  };
}
/* tslint:disable:no-bitwise */


function TraceIdentifier() {
  getCrypto().getRandomValues(this.buffer);
  this.buffer[0] = this.buffer[0] & 0x7f;
}

TraceIdentifier.prototype = {
  buffer: new Uint8Array(8),
  toString: function toString(radix) {
    var high = this.readInt32(0);
    var low = this.readInt32(4);
    var str = '';

    while (1) {
      var mod = high % radix * 4294967296 + low;
      high = Math.floor(high / radix);
      low = Math.floor(mod / radix);
      str = (mod % radix).toString(radix) + str;

      if (!high && !low) {
        break;
      }
    }

    return str;
  },
  toDecimalString: function toDecimalString() {
    return this.toString(10);
  },
  readInt32: function readInt32(offset) {
    return this.buffer[offset] * 16777216 + (this.buffer[offset + 1] << 16) + (this.buffer[offset + 2] << 8) + this.buffer[offset + 3];
  }
};
/* tslint:enable:no-bitwise */