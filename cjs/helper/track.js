"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tools = require("./tools");

var _store = _interopRequireDefault(require("./store"));

var _sendState = _interopRequireDefault(require("./sendState"));

var _params = _interopRequireDefault(require("./params"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var track = {};
track.checkOption = {
  regChecks: {
    regName: /^((?!^distinct_id$|^app_id$|^time$|^version$|^tags$|^first_id$|^env$)[a-zA-Z_$][a-zA-Z\d_$]{0,99})$/i
  },
  checkPropertiesKey: function checkPropertiesKey(obj) {
    var me = this,
        flag = true;
    (0, _tools.each)(obj, function (content, key) {
      if (!me.regChecks.regName.test(key)) {
        flag = false;
        return false;
      }
    });
    return flag;
  },
  check: function check(a, b) {
    if (typeof this[a] === 'string') {
      return this[this[a]](b);
    } else {
      return this[a](b);
    }
  },
  str: function str(s) {
    if (!(0, _tools.isString)(s)) {
      console.log('请检查参数格式,必须是字符串');
      return true;
    } else {
      return true;
    }
  },
  properties: function properties(p) {
    (0, _tools.strip_sa_properties)(p);

    if (p) {
      if ((0, _tools.isObject)(p)) {
        if (this.checkPropertiesKey(p)) {
          return true;
        } else {
          console.log('properties 里的自定义属性名需要是合法的变量名，不能以数字开头，且只包含：大小写字母、数字、下划线，自定义属性不能以 $ 开头');
          return true;
        }
      } else {
        console.log('properties可以没有，但有的话必须是对象');
        return true;
      }
    } else {
      return true;
    }
  },
  propertiesMust: function propertiesMust(p) {
    (0, _tools.strip_sa_properties)(p);

    if (p === undefined || !(0, _tools.isObject)(p) || (0, _tools.isEmptyObject)(p)) {
      console.log('properties必须是对象且有值');
      return true;
    } else {
      if (this.checkPropertiesKey(p)) {
        return true;
      } else {
        console.log('properties 里的自定义属性名需要是合法的变量名，不能以数字开头，且只包含：大小写字母、数字、下划线，自定义属性不能以 $ 开头');
        return true;
      }
    }
  },
  event: function event(s) {
    if (!(0, _tools.isString)(s) || !this['regChecks']['regName'].test(s)) {
      console.log('请检查参数格式，eventName 必须是字符串，且需是合法的变量名，即不能以数字开头，且只包含：大小写字母、数字、下划线和 $,其中以 $ 开头的表明是系统的保留字段，自定义事件名请不要以 $ 开头');
      return true;
    } else {
      return true;
    }
  },
  distinct_id: function distinct_id(id) {
    if ((0, _tools.isString)(id) && /^.{1,255}$/.test(id)) {
      return true;
    } else {
      console.log('distinct_id必须是不能为空，且小于255位的字符串');
      return false;
    }
  }
};

track.check = function (p) {
  var flag = true;

  for (var i in p) {
    if (!this.checkOption.check(i, p[i])) {
      return false;
    }
  }

  return flag;
};

track.send = function (p, callback) {
  var data = {
    app_id: _params["default"].appId,
    version: _params["default"].version,
    tags: _params["default"].tags,
    env: _params["default"].env
  }; // extend(data, store.getUnionId(), p)
  // if (isObject(p.properties) && !isEmptyObject(p.properties)) {
  //   extend(data.properties, p.properties)
  // }

  data.time = new Date() * 1;
  var data_config = (0, _tools.searchConfigData)(data.properties);

  _sendState["default"].getSendCall(data, data_config, callback);
};

var _default = track;
exports["default"] = _default;