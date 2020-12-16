"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonStringify = jsonStringify;
exports.noop = noop;
exports.performDraw = performDraw;
exports.round = round;
exports.msToNs = msToNs;
exports.getRelativeTime = getRelativeTime;
exports.getTimestamp = getTimestamp;
exports.getNavigationStart = getNavigationStart;
exports.findCommaSeparatedValue = findCommaSeparatedValue;
exports.findByPath = findByPath;
exports.safeTruncate = safeTruncate;
exports.addEventListener = addEventListener;
exports.addEventListeners = addEventListeners;
exports.includes = includes;
exports.createContextManager = createContextManager;
exports.isPercentage = isPercentage;
exports.getLocationOrigin = getLocationOrigin;
exports.getLinkElementOrigin = getLinkElementOrigin;
exports.withSnakeCaseKeys = withSnakeCaseKeys;
exports.deepSnakeCase = deepSnakeCase;
exports.toSnakeCase = toSnakeCase;
exports.escapeRowData = escapeRowData;
exports.ONE_KILO_BYTE = exports.ONE_HOUR = exports.ONE_MINUTE = exports.ONE_SECOND = exports.typeDecide = exports.getReferrer = exports.stringSplice = exports.searchConfigData = exports.strip_sa_properties = exports.autoExeQueue = exports.strToUnicode = exports.getCookieTopLevelDomain = exports.getCurrentDomain = exports._URL = exports.getURLSearchParams = exports.getQueryParamsFromUrl = exports.getHostname = exports.loadScript = exports.ajax = exports.xhr = exports.isSupportCors = exports.sessionStorage = exports.localStorage = exports.cookie = exports.addSinglePageEvent = exports.addHashEvent = exports.addEvent = exports.urlParse = exports.getQueryParam = exports.UUID = exports.base64Encode = exports.utf8Encode = exports.strip_empty_properties = exports.unique = exports.searchObjString = exports.formatJsonString = exports.searchObjDate = exports.formatDate = exports.hashCode = exports.throttle = exports.now = exports.getScreenOrientation = exports.mediaQueriesSupported = exports.encodeDates = exports.decodeURIComponent = exports.safeJSONParse = exports.isJSONString = exports.isElement = exports.isNumber = exports.isBoolean = exports.isDate = exports.isString = exports.isUndefined = exports.objectEntries = exports.isEmptyObject = exports.isObject = exports.tirm = exports.inherit = exports.map = exports.filter = exports.hasAttribute = exports.indexOf = exports.values = exports.toArray = exports.isArguments = exports.isFunction = exports.isArray = exports.coverExtend = exports.extend2Lev = exports.extend = exports.each = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ArrayProto = Array.prototype;
var FuncProto = Function.prototype;
var ObjProto = Object.prototype;
var slice = ArrayProto.slice;
var toString = ObjProto.toString;
var hasOwnProperty = ObjProto.hasOwnProperty;
var nativeBind = FuncProto.bind;
var nativeForEach = ArrayProto.forEach;
var nativeIndexOf = ArrayProto.indexOf;
var nativeIsArray = Array.isArray;
var breaker = false;

var each = function each(obj, iterator, context) {
  if (obj === null) return false;

  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
        return false;
      }
    }
  } else {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === breaker) {
          return false;
        }
      }
    }
  }
};

exports.each = each;

var extend = function extend(obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

exports.extend = extend;

var extend2Lev = function extend2Lev(obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        if (isObject(source[prop]) && isObject(obj[prop])) {
          extend(obj[prop], source[prop]);
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
};

exports.extend2Lev = extend2Lev;

var coverExtend = function coverExtend(obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0 && obj[prop] === void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

exports.coverExtend = coverExtend;

var isArray = nativeIsArray || function (obj) {
  return toString.call(obj) === '[object Array]';
};

exports.isArray = isArray;

var isFunction = function isFunction(f) {
  if (!f) {
    return false;
  }

  try {
    return /^\s*\bfunction\b/.test(f);
  } catch (err) {
    return false;
  }
};

exports.isFunction = isFunction;

var isArguments = function isArguments(obj) {
  return !!(obj && hasOwnProperty.call(obj, 'callee'));
};

exports.isArguments = isArguments;

var toArray = function toArray(iterable) {
  if (!iterable) return [];

  if (iterable.toArray) {
    return iterable.toArray();
  }

  if (isArray(iterable)) {
    return slice.call(iterable);
  }

  if (isArguments(iterable)) {
    return slice.call(iterable);
  }

  return values(iterable);
};

exports.toArray = toArray;

var values = function values(obj) {
  var results = [];

  if (obj === null) {
    return results;
  }

  each(obj, function (value) {
    results[results.length] = value;
  });
  return results;
};

exports.values = values;

var indexOf = function indexOf(arr, target) {
  var indexOf = arr.indexOf;

  if (indexOf) {
    return indexOf.call(arr, target);
  } else {
    for (var i = 0; i < arr.length; i++) {
      if (target === arr[i]) {
        return i;
      }
    }

    return -1;
  }
};

exports.indexOf = indexOf;

var hasAttribute = function hasAttribute(ele, attr) {
  if (ele.hasAttribute) {
    return ele.hasAttribute(attr);
  } else {
    return !!(ele.attributes[attr] && ele.attributes[attr].specified);
  }
};

exports.hasAttribute = hasAttribute;

var filter = function filter(arr, fn, self) {
  if (arr.filter) {
    return arr.filter(fn);
  }

  var ret = [];

  for (var i = 0; i < arr.length; i++) {
    if (!hasOwnProperty.call(arr, i)) {
      continue;
    }

    var val = arr[i];

    if (fn.call(self, val, i, arr)) {
      ret.push(val);
    }
  }

  return ret;
};

exports.filter = filter;

var map = function map(arr, fn, self) {
  if (arr.map) {
    return arr.map(fn);
  }

  var ret = [];

  for (var i = 0; i < arr.length; i++) {
    if (!hasOwnProperty.call(arr, i)) {
      continue;
    }

    var val = arr[i];
    ret.push(fn.call(self, val, i, arr));
  }

  return ret;
};

exports.map = map;

var inherit = function inherit(subclass, superclass) {
  var F = function F() {};

  F.prototype = superclass.prototype;
  subclass.prototype = new F();
  subclass.prototype.constructor = subclass;
  subclass.superclass = superclass.prototype;
  return subclass;
};

exports.inherit = inherit;

var tirm = function tirm(str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

exports.tirm = tirm;

var isObject = function isObject(obj) {
  if (obj === null) return false;
  return toString.call(obj) === '[object Object]';
};

exports.isObject = isObject;

var isEmptyObject = function isEmptyObject(obj) {
  if (isObject(obj)) {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
};

exports.isEmptyObject = isEmptyObject;

var objectEntries = function objectEntries(object) {
  var res = [];
  each(object, function (value, key) {
    res.push([key, value]);
  });
  return res;
};

exports.objectEntries = objectEntries;

var isUndefined = function isUndefined(obj) {
  return obj === void 0;
};

exports.isUndefined = isUndefined;

var isString = function isString(obj) {
  return toString.call(obj) === '[object String]';
};

exports.isString = isString;

var isDate = function isDate(obj) {
  return toString.call(obj) === '[object Date]';
};

exports.isDate = isDate;

var isBoolean = function isBoolean(obj) {
  return toString.call(obj) === '[object Boolean]';
};

exports.isBoolean = isBoolean;

var isNumber = function isNumber(obj) {
  return toString.call(obj) === '[object Number]' && /[\d\.]+/.test(String(obj));
};

exports.isNumber = isNumber;

var isElement = function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
};

exports.isElement = isElement;

var isJSONString = function isJSONString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

exports.isJSONString = isJSONString;

var safeJSONParse = function safeJSONParse(str) {
  var val = null;

  try {
    val = JSON.parse(str);
  } catch (e) {
    return false;
  }

  return val;
};

exports.safeJSONParse = safeJSONParse;

var decodeURIComponent = function decodeURIComponent(val) {
  var result = val;

  try {
    result = decodeURIComponent(val);
  } catch (error) {
    result = val;
  }

  return result;
};

exports.decodeURIComponent = decodeURIComponent;

var encodeDates = function encodeDates(obj) {
  each(obj, function (v, k) {
    if (isDate(v)) {
      obj[k] = formatDate(v);
    } else if (isObject(v)) {
      obj[k] = encodeDates(v);
    }
  });
  return obj;
};

exports.encodeDates = encodeDates;

var mediaQueriesSupported = function mediaQueriesSupported() {
  return typeof window.matchMedia !== 'undefined' || typeof window.msMatchMedia !== 'undefined';
};

exports.mediaQueriesSupported = mediaQueriesSupported;

var getScreenOrientation = function getScreenOrientation() {
  var screenOrientationAPI = screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type;
  var screenOrientation = '未取到值';

  if (screenOrientationAPI) {
    screenOrientation = screenOrientationAPI.indexOf('landscape') > -1 ? 'landscape' : 'portrait';
  } else if (mediaQueriesSupported()) {
    var matchMediaFunc = window.matchMedia || window.msMatchMedia;

    if (matchMediaFunc('(orientation: landscape)').matches) {
      screenOrientation = 'landscape';
    } else if (matchMediaFunc('(orientation: portrait)').matches) {
      screenOrientation = 'portrait';
    }
  }

  return screenOrientation;
};

exports.getScreenOrientation = getScreenOrientation;

var now = Date.now || function () {
  return new Date().getTime();
};

exports.now = now;

var throttle = function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function later() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function throttled() {
    args = arguments;
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now; //下次触发 func 剩余的时间

    var remaining = wait - (now - previous);
    context = this; // 如果没有剩余的时间了或者你改了系统时间

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };

  return throttled;
};

exports.throttle = throttle;

var hashCode = function hashCode(str) {
  if (typeof str !== 'string') {
    return 0;
  }

  var hash = 0;
  var _char = null;

  if (str.length == 0) {
    return hash;
  }

  for (var i = 0; i < str.length; i++) {
    _char = str.charCodeAt(i);
    hash = (hash << 5) - hash + _char;
    hash = hash & hash;
  }

  return hash;
};

exports.hashCode = hashCode;

var formatDate = function formatDate(d) {
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.' + pad(d.getMilliseconds());
};

exports.formatDate = formatDate;

var searchObjDate = function searchObjDate(o) {
  if (isObject(o)) {
    each(o, function (a, b) {
      if (isObject(a)) {
        searchObjDate(o[b]);
      } else {
        if (isDate(a)) {
          o[b] = formatDate(a);
        }
      }
    });
  }
};

exports.searchObjDate = searchObjDate;

var formatJsonString = function formatJsonString(obj) {
  try {
    return JSON.stringify(obj, null, '  ');
  } catch (e) {
    return JSON.stringify(obj);
  }
}; // export var formatString = function (str) {
//   if (str.length > MAX_STRING_LENGTH) {
//     sd.log('字符串长度超过限制，已经做截取--' + str)
//     return str.slice(0, MAX_STRING_LENGTH)
//   } else {
//     return str
//   }
// }


exports.formatJsonString = formatJsonString;

var searchObjString = function searchObjString(o) {
  if (isObject(o)) {
    each(o, function (a, b) {
      if (isObject(a)) {
        searchObjString(o[b]);
      } else {
        if (isString(a)) {
          o[b] = formatString(a);
        }
      }
    });
  }
};

exports.searchObjString = searchObjString;

var unique = function unique(ar) {
  var temp,
      n = [],
      o = {};

  for (var i = 0; i < ar.length; i++) {
    temp = ar[i];

    if (!(temp in o)) {
      o[temp] = true;
      n.push(temp);
    }
  }

  return n;
};

exports.unique = unique;

var strip_empty_properties = function strip_empty_properties(p) {
  var ret = {};
  each(p, function (v, k) {
    if (v != null) {
      ret[k] = v;
    }
  });
  return ret;
};

exports.strip_empty_properties = strip_empty_properties;

var utf8Encode = function utf8Encode(string) {
  string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  var utftext = '',
      start,
      end;
  var stringl = 0,
      n;
  start = end = 0;
  stringl = string.length;

  for (n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(c1 >> 6 | 192, c1 & 63 | 128);
    } else {
      enc = String.fromCharCode(c1 >> 12 | 224, c1 >> 6 & 63 | 128, c1 & 63 | 128);
    }

    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end);
      }

      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.substring(start, string.length);
  }

  return utftext;
};

exports.utf8Encode = utf8Encode;

var base64Encode = function base64Encode(data) {
  if (typeof btoa === 'function') {
    return btoa(encodeURIComponent(data).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
  }

  data = String(data);
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1,
      o2,
      o3,
      h1,
      h2,
      h3,
      h4,
      bits,
      i = 0,
      ac = 0,
      enc = '',
      tmp_arr = [];

  if (!data) {
    return data;
  }

  data = utf8Encode(data);

  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);
    bits = o1 << 16 | o2 << 8 | o3;
    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  switch (data.length % 3) {
    case 1:
      enc = enc.slice(0, -2) + '==';
      break;

    case 2:
      enc = enc.slice(0, -1) + '=';
      break;
  }

  return enc;
};

exports.base64Encode = base64Encode;

var UUID = function () {
  var T = function T() {
    var d = 1 * new Date(),
        i = 0;

    while (d == 1 * new Date()) {
      i++;
    }

    return d.toString(16) + i.toString(16);
  };

  var R = function R() {
    return Math.random().toString(16).replace('.', '');
  };

  var UA = function UA(n) {
    var ua = navigator.userAgent,
        i,
        ch,
        buffer = [],
        ret = 0;

    function xor(result, byte_array) {
      var j,
          tmp = 0;

      for (j = 0; j < byte_array.length; j++) {
        tmp |= buffer[j] << j * 8;
      }

      return result ^ tmp;
    }

    for (i = 0; i < ua.length; i++) {
      ch = ua.charCodeAt(i);
      buffer.unshift(ch & 0xff);

      if (buffer.length >= 4) {
        ret = xor(ret, buffer);
        buffer = [];
      }
    }

    if (buffer.length > 0) {
      ret = xor(ret, buffer);
    }

    return ret.toString(16);
  };

  return function () {
    var se = String(screen.height * screen.width);

    if (se && /\d{5,}/.test(se)) {
      se = se.toString(16);
    } else {
      se = String(Math.random() * 31242).replace('.', '').slice(0, 8);
    }

    var val = T() + '-' + R() + '-' + UA() + '-' + se + '-' + T();

    if (val) {
      return val;
    } else {
      return (String(Math.random()) + String(Math.random()) + String(Math.random())).slice(2, 15);
    }
  };
}();

exports.UUID = UUID;

var getQueryParam = function getQueryParam(url, param) {
  param = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  url = decodeURIComponent(url);
  var regexS = '[\\?&]' + param + '=([^&#]*)',
      regex = new RegExp(regexS),
      results = regex.exec(url);

  if (results === null || results && typeof results[1] !== 'string' && results[1].length) {
    return '';
  } else {
    return decodeURIComponent(results[1]);
  }
};

exports.getQueryParam = getQueryParam;

var urlParse = function urlParse(para) {
  var URLParser = function URLParser(a) {
    this._fields = {
      Username: 4,
      Password: 5,
      Port: 7,
      Protocol: 2,
      Host: 6,
      Path: 8,
      URL: 0,
      QueryString: 9,
      Fragment: 10
    };
    this._values = {};
    this._regex = null;
    this._regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;

    if (typeof a != 'undefined') {
      this._parse(a);
    }
  };

  URLParser.prototype.setUrl = function (a) {
    this._parse(a);
  };

  URLParser.prototype._initValues = function () {
    for (var a in this._fields) {
      this._values[a] = '';
    }
  };

  URLParser.prototype.addQueryString = function (queryObj) {
    if (_typeof(queryObj) !== 'object') {
      return false;
    }

    var query = this._values.QueryString || '';

    for (var i in queryObj) {
      if (new RegExp(i + '[^&]+').test(query)) {
        query = query.replace(new RegExp(i + '[^&]+'), i + '=' + queryObj[i]);
      } else {
        if (query.slice(-1) === '&') {
          query = query + i + '=' + queryObj[i];
        } else {
          if (query === '') {
            query = i + '=' + queryObj[i];
          } else {
            query = query + '&' + i + '=' + queryObj[i];
          }
        }
      }
    }

    this._values.QueryString = query;
  };

  URLParser.prototype.getParse = function () {
    return this._values;
  };

  URLParser.prototype.getUrl = function () {
    var url = '';
    url += this._values.Origin;
    url += this._values.Port ? ':' + this._values.Port : '';
    url += this._values.Path;
    url += this._values.QueryString ? '?' + this._values.QueryString : '';
    return url;
  };

  URLParser.prototype._parse = function (a) {
    this._initValues();

    var b = this._regex.exec(a);

    if (!b) {
      throw 'DPURLParser::_parse -> Invalid URL';
    }

    for (var c in this._fields) {
      if (typeof b[this._fields[c]] != 'undefined') {
        this._values[c] = b[this._fields[c]];
      }
    }

    this._values['Hostname'] = this._values['Host'].replace(/:\d+$/, '');
    this._values['Origin'] = this._values['Protocol'] + '://' + this._values['Hostname'];
  };

  return new URLParser(para);
};

exports.urlParse = urlParse;

var addEvent = function addEvent() {
  function fixEvent(event) {
    if (event) {
      event.preventDefault = fixEvent.preventDefault;
      event.stopPropagation = fixEvent.stopPropagation;
      event._getPath = fixEvent._getPath;
    }

    return event;
  }

  fixEvent._getPath = function () {
    var ev = this;

    var polyfill = function polyfill() {
      try {
        var element = ev.target;
        var pathArr = [element];

        if (element === null || element.parentElement === null) {
          return [];
        }

        while (element.parentElement !== null) {
          element = element.parentElement;
          pathArr.unshift(element);
        }

        return pathArr;
      } catch (error) {
        return [];
      }
    };

    return this.path || this.composedPath() && this.composedPath() || polyfill();
  };

  fixEvent.preventDefault = function () {
    this.returnValue = false;
  };

  fixEvent.stopPropagation = function () {
    this.cancelBubble = true;
  };

  var register_event = function register_event(element, type, handle) {
    if (element && element.addEventListener) {
      element.addEventListener(type, function (e) {
        e._getPath = fixEvent._getPath;
        handler.call(this, e);
      }, false);
    } else {
      var ontype = 'on' + type;
      var old_handler = element[ontype];
      element[ontype] = makeHandler(element, handler, old_handler);
    }
  };

  function makeHandler(element, new_handler, old_handlers) {
    var handler = function handler(event) {
      event = event || fixEvent(window.event);

      if (!event) {
        return undefined;
      }

      event.target = event.srcElement;
      var ret = true;
      var old_result, new_result;

      if (typeof old_handlers === 'function') {
        old_result = old_handlers(event);
      }

      new_result = new_handler.call(element, event);

      if (false === old_result || false === new_result) {
        ret = false;
      }

      return ret;
    };

    return handler;
  }

  register_event.apply(null, arguments);
};

exports.addEvent = addEvent;

var addHashEvent = function addHashEvent(callback) {
  var hashEvent = 'pushState' in window.history ? 'popstate' : 'hashchange';
  addEvent(window, hashEvent, callback);
};

exports.addHashEvent = addHashEvent;

var addSinglePageEvent = function addSinglePageEvent(callback) {
  var current_url = location.href;
  var historyPushState = window.history.pushState;
  var historyReplaceState = window.history.replaceState;

  window.history.pushState = function () {
    historyPushState.apply(window.history, arguments);
    callback(current_url);
    current_url = location.href;
  };

  window.history.replaceState = function () {
    historyReplaceState.apply(window.history, arguments);
    callback(current_url);
    current_url = location.href;
  };

  var singlePageEvent = historyPushState ? 'popstate' : 'hashchange';
  addEvent(window, singlePageEvent, function () {
    callback(current_url);
    current_url = location.href;
  });
};

exports.addSinglePageEvent = addSinglePageEvent;
var cookie = {
  get: function get(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];

      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }

      if (c.indexOf(nameEQ) == 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }

    return null;
  },
  set: function set(name, value, days, is_secure) {
    var cdomain = '',
        expires = '',
        secure = '';
    days = days == null ? 73000 : days;

    if (days !== 0) {
      var date = new Date();

      if (String(days).slice(-1) === 's') {
        date.setTime(date.getTime() + Number(String(days).slice(0, -1)) * 1000);
      } else {
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      }

      expires = '; expires=' + date.toGMTString();
    }

    if (is_secure) {
      secure = '; secure';
    }

    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
  },
  remove: function remove(name) {
    cookie.set(name, '', -1);
  }
};
exports.cookie = cookie;
var localStorage = {
  get: function get(name) {
    return window.localStorage.getItem(name);
  },
  parse: function parse(name) {
    var storedValue;

    try {
      storedValue = JSON.parse(localStorage.get(name)) || null;
    } catch (err) {
      sd.log(err);
    }

    return storedValue;
  },
  set: function set(name, value) {
    window.localStorage.setItem(name, value);
  },
  remove: function remove(name) {
    window.localStorage.removeItem(name);
  },
  isSupport: function isSupport() {
    var supported = true;

    try {
      var key = '__sensorsdatasupport__';
      var val = 'testIsSupportStorage';
      localStorage.set(key, val);

      if (localStorage.get(key) !== val) {
        supported = false;
      }

      localStorage.remove(key);
    } catch (err) {
      supported = false;
    }

    return supported;
  }
};
exports.localStorage = localStorage;
var sessionStorage = {
  isSupport: function isSupport() {
    var supported = true;
    var key = '__sensorsdatasupport__';
    var val = 'testIsSupportStorage';

    try {
      if (sessionStorage && sessionStorage.setItem) {
        sessionStorage.setItem(key, val);
        sessionStorage.removeItem(key, val);
        supported = true;
      } else {
        supported = false;
      }
    } catch (e) {
      supported = false;
    }

    return supported;
  }
};
exports.sessionStorage = sessionStorage;

var isSupportCors = function isSupportCors() {
  if (typeof window.XMLHttpRequest === 'undefined') {
    return false;
  }

  if ('withCredentials' in new XMLHttpRequest()) {
    return true;
  } else if (typeof XDomainRequest !== 'undefined') {
    return true;
  } else {
    return false;
  }
};

exports.isSupportCors = isSupportCors;

var xhr = function xhr(cors) {
  if (cors) {
    if (typeof window.XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest()) {
      return new XMLHttpRequest();
    } else if (typeof XDomainRequest !== 'undefined') {
      return new XDomainRequest();
    } else {
      return null;
    }
  } else {
    if (typeof window.XMLHttpRequest !== 'undefined') {
      return new XMLHttpRequest();
    }

    if (window.ActiveXObject) {
      try {
        return new ActiveXObject('Msxml2.XMLHTTP');
      } catch (d) {
        try {
          return new ActiveXObject('Microsoft.XMLHTTP');
        } catch (d) {
          console.log(d);
        }
      }
    }
  }
};

exports.xhr = xhr;

var ajax = function ajax(para) {
  para.timeout = para.timeout || 20000;
  para.credentials = typeof para.credentials === 'undefined' ? true : para.credentials;

  function getJSON(data) {
    if (!data) {
      return '';
    }

    try {
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }

  var g = xhr(para.cors);

  if (!g) {
    return false;
  }

  if (!para.type) {
    para.type = para.data ? 'POST' : 'GET';
  }

  para = extend({
    success: function success() {},
    error: function error() {}
  }, para);

  try {
    if (_typeof(g) === 'object' && 'timeout' in g) {
      g.timeout = para.timeout;
    } else {
      setTimeout(function () {
        g.abort();
      }, para.timeout + 500);
    }
  } catch (e) {
    try {
      setTimeout(function () {
        g.abort();
      }, para.timeout + 500);
    } catch (e2) {}
  }

  g.onreadystatechange = function () {
    try {
      if (g.readyState == 4) {
        if (g.status >= 200 && g.status < 300 || g.status == 304) {
          para.success(getJSON(g.responseText));
        } else {
          para.error(getJSON(g.responseText), g.status);
        }

        g.onreadystatechange = null;
        g.onload = null;
      }
    } catch (e) {
      g.onreadystatechange = null;
      g.onload = null;
    }
  };

  g.open(para.type, para.url, true);

  try {
    if (para.credentials) {
      g.withCredentials = true;
    }

    if (isObject(para.header)) {
      for (var i in para.header) {
        g.setRequestHeader(i, para.header[i]);
      }
    }

    if (para.data) {
      if (!para.cors) {
        g.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }

      if (para.contentType === 'application/json') {
        g.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
      } else {
        g.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }
    }
  } catch (e) {}

  g.send(para.data || null);
};

exports.ajax = ajax;

var loadScript = function loadScript(para) {
  para = extend({
    success: function success() {},
    error: function error() {},
    appendCall: function appendCall(g) {
      document.getElementsByTagName('head')[0].appendChild(g);
    }
  }, para);
  var g = null;

  if (para.type === 'css') {
    g = document.createElement('link');
    g.rel = 'stylesheet';
    g.href = para.url;
  }

  if (para.type === 'js') {
    g = document.createElement('script');
    g.async = 'async';
    g.setAttribute('charset', 'UTF-8');
    g.src = para.url;
    g.type = 'text/javascript';
  }

  g.onload = g.onreadystatechange = function () {
    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
      para.success();
      g.onload = g.onreadystatechange = null;
    }
  };

  g.onerror = function () {
    para.error();
    g.onerror = null;
  };

  para.appendCall(g);
};

exports.loadScript = loadScript;

var getHostname = function getHostname(url, defaultValue) {
  if (!defaultValue || typeof defaultValue !== 'string') {
    defaultValue = 'hostname解析异常';
  }

  var hostname = null;

  try {
    hostname = URL(url).hostname;
  } catch (e) {}

  return hostname || defaultValue;
};

exports.getHostname = getHostname;

var getQueryParamsFromUrl = function getQueryParamsFromUrl(url) {
  var result = {};
  var arr = url.split('?');
  var queryString = arr[1] || '';

  if (queryString) {
    result = getURLSearchParams('?' + queryString);
  }

  return result;
};

exports.getQueryParamsFromUrl = getQueryParamsFromUrl;

var getURLSearchParams = function getURLSearchParams(queryString) {
  queryString = queryString || '';

  var decodeParam = function decodeParam(str) {
    return decodeURIComponent(str);
  };

  var args = {};
  var query = queryString.substring(1);
  var pairs = query.split('&');

  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');
    if (pos === -1) continue;
    var name = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    name = decodeParam(name);
    value = decodeParam(value);
    args[name] = value;
  }

  return args;
};

exports.getURLSearchParams = getURLSearchParams;

var _URL = function _URL(url) {
  var result = {};
  var basicProps = ['hash', 'host', 'hostname', 'href', 'origin', 'password', 'pathname', 'port', 'protocol', 'search', 'username'];

  var isURLAPIWorking = function isURLAPIWorking() {
    var url;

    try {
      url = new URL('http://modernizr.com/');
      return url.href === 'http://modernizr.com/';
    } catch (e) {
      return false;
    }
  };

  if (typeof window.URL === 'function' && isURLAPIWorking()) {
    result = new URL(url);

    if (!result.searchParams) {
      result.searchParams = function () {
        var params = getURLSearchParams(result.search);
        return {
          get: function get(searchParam) {
            return params[searchParam];
          }
        };
      }();
    }
  } else {
    var _regex = /^https?:\/\/.+/;

    if (_regex.test(url) === false) {
      throw 'Invalid URL';
    }

    var link = document.createElement('a');
    link.href = url;

    for (var i = basicProps.length - 1; i >= 0; i--) {
      var prop = basicProps[i];
      result[prop] = link[prop];
    }

    if (result.hostname && typeof result.pathname === 'string' && result.pathname.indexOf('/') !== 0) {
      result.pathname = '/' + result.pathname;
    }

    result.searchParams = function () {
      var params = getURLSearchParams(result.search);
      return {
        get: function get(searchParam) {
          return params[searchParam];
        }
      };
    }();
  }

  return result;
};

exports._URL = _URL;

var getCurrentDomain = function getCurrentDomain(url) {
  var cookieTopLevelDomain = getCookieTopLevelDomain();

  if (url === '') {
    return 'url解析失败';
  } else if (cookieTopLevelDomain === '') {
    return 'url解析失败';
  } else {
    return cookieTopLevelDomain;
  }
};

exports.getCurrentDomain = getCurrentDomain;

var getCookieTopLevelDomain = function getCookieTopLevelDomain(hostname) {
  hostname = hostname || window.location.hostname;
  var splitResult = hostname.split('.');

  if (isArray(splitResult) && splitResult.length >= 2 && !/^(\d+\.)+\d+$/.test(hostname)) {
    var domainStr = '.' + splitResult.splice(splitResult.length - 1, 1);

    while (splitResult.length > 0) {
      domainStr = '.' + splitResult.splice(splitResult.length - 1, 1) + domainStr;
      document.cookie = 'domain_test=true; path=/; domain=' + domainStr;

      if (document.cookie.indexOf('domain_test=true') !== -1) {
        var now = new Date();
        now.setTime(now.getTime() - 1000);
        document.cookie = 'domain_test=true; expires=' + now.toGMTString() + '; path=/; domain=' + domainStr;
        return domainStr;
      }
    }
  }

  return '';
};

exports.getCookieTopLevelDomain = getCookieTopLevelDomain;

var strToUnicode = function strToUnicode(str) {
  if (typeof str !== 'string') {
    return str;
  }

  var nstr = '';

  for (var i = 0; i < str.length; i++) {
    nstr += '\\' + str.charCodeAt(i).toString(16);
  }

  return nstr;
};

exports.strToUnicode = strToUnicode;

var autoExeQueue = function autoExeQueue() {
  var queue = {
    items: [],
    enqueue: function enqueue(val) {
      this.items.push(val);
      this.start();
    },
    dequeue: function dequeue() {
      return this.items.shift();
    },
    getCurrentItem: function getCurrentItem() {
      return this.items[0];
    },
    isRun: false,
    start: function start() {
      if (this.items.length > 0 && !this.isRun) {
        this.isRun = true;
        this.getCurrentItem().start();
      }
    },
    close: function close() {
      this.dequeue();
      this.isRun = false;
      this.start();
    }
  };
  return queue;
};

exports.autoExeQueue = autoExeQueue;

var strip_sa_properties = function strip_sa_properties(p) {
  if (!isObject(p)) {
    return p;
  }

  each(p, function (v, k) {
    if (isArray(v)) {
      var temp = [];
      each(v, function (arrv) {
        if (isString(arrv)) {
          temp.push(arrv);
        } else {
          console.log('您的数据-', k, v, '的数组里的值必须是字符串,已经将其删除');
        }
      });

      if (temp.length !== 0) {
        p[k] = temp;
      } else {
        delete p[k];
        console.log('已经删除空的数组');
      }
    }

    if (!(isString(v) || isNumber(v) || isDate(v) || isBoolean(v) || isArray(v) || isFunction(v) || k === '$option')) {
      console.log('您的数据-', k, v, '-格式不满足要求，我们已经将其删除');
      delete p[k];
    }
  });
  return p;
};

exports.strip_sa_properties = strip_sa_properties;

var searchConfigData = function searchConfigData(data) {
  if (_typeof(data) === 'object' && data.$option) {
    var data_config = data.$option;
    delete data.$option;
    return data_config;
  } else {
    return {};
  }
}; // 从字符串 src 中查找 k+sp 和  e 之间的字符串，如果 k==e 且 k 只有一个，或者 e 不存在，从 k+sp 截取到字符串结束
// abcd=1&b=1&c=3;
// abdc=1;b=1;a=3;


exports.searchConfigData = searchConfigData;

var stringSplice = function stringSplice(src, k, e, sp) {
  if (src === '') {
    return '';
  }

  sp = sp === '' ? '=' : sp;
  k += sp;
  var ps = src.indexOf(k);

  if (ps < 0) {
    return '';
  }

  ps += k.length;
  var pe = pe < ps ? src.length : src.indexOf(e, ps);
  return src.substring(ps, pe);
};

exports.stringSplice = stringSplice;

var getReferrer = function getReferrer() {
  var ref = document.referrer.toLowerCase();
  var re = /^[^\?&#]*.swf([\?#])?/; // 如果页面 Referer 为空，从 URL 中获取

  if (ref === '' || ref.match(re)) {
    ref = stringSplice(window.location.href, 'ref', '&', '');

    if (ref !== '') {
      return encodeURIComponent(ref);
    }
  }

  return encodeURIComponent(ref);
};

exports.getReferrer = getReferrer;

var typeDecide = function typeDecide(o, type) {
  return toString.call(o) === '[object ' + type + ']';
};

exports.typeDecide = typeDecide;

function jsonStringify(value, replacer, space) {
  if (value === null || value === undefined) {
    return JSON.stringify(value);
  }

  var originalToJSON = [false, undefined];

  if (hasToJSON(value)) {
    // We need to add a flag and not rely on the truthiness of value.toJSON
    // because it can be set but undefined and that's actually significant.
    originalToJSON = [true, value.toJSON];
    delete value.toJSON;
  }

  var originalProtoToJSON = [false, undefined];
  var prototype;

  if (_typeof(value) === 'object') {
    prototype = Object.getPrototypeOf(value);

    if (hasToJSON(prototype)) {
      originalProtoToJSON = [true, prototype.toJSON];
      delete prototype.toJSON;
    }
  }

  var result;

  try {
    result = JSON.stringify(value, undefined, space);
  } catch (e) {
    result = '<error: unable to serialize object>';
  } finally {
    if (originalToJSON[0]) {
      value.toJSON = originalToJSON[1];
    }

    if (originalProtoToJSON[0]) {
      prototype.toJSON = originalProtoToJSON[1];
    }
  }

  return result;
}

function hasToJSON(value) {
  return _typeof(value) === 'object' && value !== null && value.hasOwnProperty('toJSON');
}

function noop() {}

var ONE_SECOND = 1000;
exports.ONE_SECOND = ONE_SECOND;
var ONE_MINUTE = 60 * ONE_SECOND;
exports.ONE_MINUTE = ONE_MINUTE;
var ONE_HOUR = 60 * ONE_MINUTE;
exports.ONE_HOUR = ONE_HOUR;
var ONE_KILO_BYTE = 1024;
/**
 * Return true if the draw is successful
 * @param threshold between 0 and 100
 */

exports.ONE_KILO_BYTE = ONE_KILO_BYTE;

function performDraw(threshold) {
  return threshold !== 0 && Math.random() * 100 <= threshold;
}

function round(num, decimals) {
  return +num.toFixed(decimals);
}

function msToNs(duration) {
  if (typeof duration !== 'number') {
    return duration;
  }

  return round(duration * 1e6, 0);
}

function getRelativeTime(timestamp) {
  return timestamp - getNavigationStart();
}

function getTimestamp(relativeTime) {
  return Math.floor(getNavigationStart() + relativeTime);
}
/**
 * Navigation start slightly change on some rare cases
 */


var navigationStart;

function getNavigationStart() {
  if (navigationStart === undefined) {
    navigationStart = performance.timing.navigationStart;
  }

  return navigationStart;
}

function findCommaSeparatedValue(rawString, name) {
  var matches = rawString.match('(?:^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return matches ? matches[1] : undefined;
}

function findByPath(source, path) {
  var pathArr = path.split('.');

  while (pathArr.length) {
    var key = pathArr.shift();

    if (key in source && hasOwnProperty.call(source, key)) {
      source = source[key];
    } else {
      return undefined;
    }
  }

  return source;
}

function safeTruncate(candidate, length) {
  var lastChar = candidate.charCodeAt(length - 1); // check if it is the high part of a surrogate pair

  if (lastChar >= 0xd800 && lastChar <= 0xdbff) {
    return candidate.slice(0, length + 1);
  }

  return candidate.slice(0, length);
}

function addEventListener(emitter, event, listener, options) {
  return addEventListeners(emitter, [event], listener, options);
}
/**
 * Add event listeners to an event emitter object (Window, Element, mock object...).  This provides
 * a few conveniences compared to using `element.addEventListener` directly:
 *
 * * supports IE11 by:
 *   * using an option object only if needed
 *   * emulating the `once` option
 *
 * * wraps the listener with a `monitor` function
 *
 * * returns a `stop` function to remove the listener
 *
 * * with `once: true`, the listener will be called at most once, even if different events are
 *   listened
 */


function addEventListeners(emitter, events, listener, options) {
  var wrapedListener = options && options.once ? function (event) {
    stop();
    listener(event);
  } : listener;
  options = options && options.passive ? {
    capture: options.capture,
    passive: options.passive
  } : options && options.capture;
  each(events, function (event) {
    emitter.addEventListener(event, wrapedListener, options);
  });

  var stop = function stop() {
    each(events, function (event) {
      emitter.removeEventListener(event, wrapedListener, options);
    });
  };

  return {
    stop: stop
  };
}

function includes(candidate, search) {
  // tslint:disable-next-line: no-unsafe-any
  return candidate.indexOf(search) !== -1;
}

function createContextManager() {
  var context = {};
  return {
    get: function get() {
      return context;
    },
    add: function add(key, value) {
      context[key] = value;
    },
    remove: function remove(key) {
      delete context[key];
    },
    set: function set(newContext) {
      context = newContext;
    }
  };
}

function isPercentage(value) {
  return isNumber(value) && value >= 0 && value <= 100;
}

function getLocationOrigin() {
  return getLinkElementOrigin(window.location);
}
/**
 * IE fallback
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/origin
 */


function getLinkElementOrigin(element) {
  if (element.origin) {
    return element.origin;
  }

  var sanitizedHost = element.host.replace(/(:80|:443)$/, '');
  return element.protocol + '//' + sanitizedHost;
}

function withSnakeCaseKeys(candidate) {
  var result = {};
  each(candidate, function (value, key) {
    result[toSnakeCase(key)] = deepSnakeCase(value);
  });
  return result;
}

function deepSnakeCase(candidate) {
  if (isArray(candidate)) {
    return map(candidate, function (value) {
      return deepSnakeCase(value);
    });
  }

  if (_typeof(candidate) === 'object' && candidate !== null) {
    return withSnakeCaseKeys(candidate);
  }

  return candidate;
}

function toSnakeCase(word) {
  return word.replace(/[A-Z]/g, function (uppercaseLetter, index) {
    return (index !== 0 ? '_' : '') + uppercaseLetter.toLowerCase();
  }).replace(/-/g, '_');
}

function escapeRowData(str) {
  if (!isString(str)) return str;
  var reg = /[\s=,"]/g;
  return String(str).replace(reg, function (word) {
    return '\\' + word;
  });
}