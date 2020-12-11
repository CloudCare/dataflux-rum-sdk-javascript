var VariableLibrary = {
  navigator: typeof window.navigator != 'undefined' ? window.navigator : {},
  // 信息map
  infoMap: {
    engine: ['WebKit', 'Trident', 'Gecko', 'Presto'],
    browser: ['Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Arora', 'Lunascape', 'QupZilla', 'Coc Coc', 'Kindle', 'Iceweasel', 'Konqueror', 'Iceape', 'SeaMonkey', 'Epiphany', '360', '360SE', '360EE', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat',, 'WechatWork', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi'],
    os: ['Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'],
    device: ['Mobile', 'Tablet', 'iPad']
  }
}; // 方法库

var MethodLibrary = {
  // 获取匹配库
  getMatchMap: function getMatchMap(u) {
    return {
      // 内核
      Trident: u.indexOf('Trident') > -1 || u.indexOf('NET CLR') > -1,
      Presto: u.indexOf('Presto') > -1,
      WebKit: u.indexOf('AppleWebKit') > -1,
      Gecko: u.indexOf('Gecko/') > -1,
      // 浏览器
      Safari: u.indexOf('Safari') > -1,
      Chrome: u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
      IE: u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
      Edge: u.indexOf('Edge') > -1,
      Firefox: u.indexOf('Firefox') > -1 || u.indexOf('FxiOS') > -1,
      'Firefox Focus': u.indexOf('Focus') > -1,
      Chromium: u.indexOf('Chromium') > -1,
      Opera: u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1,
      Vivaldi: u.indexOf('Vivaldi') > -1,
      Yandex: u.indexOf('YaBrowser') > -1,
      Arora: u.indexOf('Arora') > -1,
      Lunascape: u.indexOf('Lunascape') > -1,
      QupZilla: u.indexOf('QupZilla') > -1,
      'Coc Coc': u.indexOf('coc_coc_browser') > -1,
      Kindle: u.indexOf('Kindle') > -1 || u.indexOf('Silk/') > -1,
      Iceweasel: u.indexOf('Iceweasel') > -1,
      Konqueror: u.indexOf('Konqueror') > -1,
      Iceape: u.indexOf('Iceape') > -1,
      SeaMonkey: u.indexOf('SeaMonkey') > -1,
      Epiphany: u.indexOf('Epiphany') > -1,
      360: u.indexOf('QihooBrowser') > -1 || u.indexOf('QHBrowser') > -1,
      '360EE': u.indexOf('360EE') > -1,
      '360SE': u.indexOf('360SE') > -1,
      UC: u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
      QQBrowser: u.indexOf('QQBrowser') > -1,
      QQ: u.indexOf('QQ/') > -1,
      Baidu: u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1,
      Maxthon: u.indexOf('Maxthon') > -1,
      Sogou: u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
      LBBROWSER: u.indexOf('LBBROWSER') > -1 || u.indexOf('LieBaoFast') > -1,
      '2345Explorer': u.indexOf('2345Explorer') > -1,
      TheWorld: u.indexOf('TheWorld') > -1,
      XiaoMi: u.indexOf('MiuiBrowser') > -1,
      Quark: u.indexOf('Quark') > -1,
      Qiyu: u.indexOf('Qiyu') > -1,
      Wechat: u.indexOf('MicroMessenger') > -1,
      WechatWork: u.indexOf('wxwork/') > -1,
      Taobao: u.indexOf('AliApp(TB') > -1,
      Alipay: u.indexOf('AliApp(AP') > -1,
      Weibo: u.indexOf('Weibo') > -1,
      Douban: u.indexOf('com.douban.frodo') > -1,
      Suning: u.indexOf('SNEBUY-APP') > -1,
      iQiYi: u.indexOf('IqiyiApp') > -1,
      // 系统或平台
      Windows: u.indexOf('Windows') > -1,
      Linux: u.indexOf('Linux') > -1 || u.indexOf('X11') > -1,
      'Mac OS': u.indexOf('Macintosh') > -1,
      Android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
      Ubuntu: u.indexOf('Ubuntu') > -1,
      FreeBSD: u.indexOf('FreeBSD') > -1,
      Debian: u.indexOf('Debian') > -1,
      'Windows Phone': u.indexOf('IEMobile') > -1 || u.indexOf('Windows Phone') > -1,
      BlackBerry: u.indexOf('BlackBerry') > -1 || u.indexOf('RIM') > -1,
      MeeGo: u.indexOf('MeeGo') > -1,
      Symbian: u.indexOf('Symbian') > -1,
      iOS: u.indexOf('like Mac OS X') > -1,
      'Chrome OS': u.indexOf('CrOS') > -1,
      WebOS: u.indexOf('hpwOS') > -1,
      // 设备
      Mobile: u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1,
      Tablet: u.indexOf('Tablet') > -1 || u.indexOf('Nexus 7') > -1,
      iPad: u.indexOf('iPad') > -1
    };
  },
  // 在信息map和匹配库中进行匹配
  matchInfoMap: function matchInfoMap(_this) {
    var u = VariableLibrary.navigator.userAgent || {};
    var match = MethodLibrary.getMatchMap(u);

    for (var s in VariableLibrary.infoMap) {
      for (var i = 0; i < VariableLibrary.infoMap[s].length; i++) {
        var value = VariableLibrary.infoMap[s][i];

        if (match[value]) {
          _this[s] = value;
        }
      }
    }
  },
  // 获取当前操作系统
  getOS: function getOS() {
    var _this = this;

    MethodLibrary.matchInfoMap(_this);
    return _this.os;
  },
  // 获取操作系统版本
  getOSVersion: function getOSVersion() {
    var _this = this;

    var u = VariableLibrary.navigator.userAgent || {};
    _this.osVersion = ''; // 系统版本信息

    var osVersion = {
      Windows: function Windows() {
        var v = u.replace(/^.*Windows NT ([\d.]+);.*$/, '$1');
        var oldWindowsVersionMap = {
          6.4: '10',
          6.3: '8.1',
          6.2: '8',
          6.1: '7',
          '6.0': 'Vista',
          5.2: 'XP',
          5.1: 'XP',
          '5.0': '2000'
        };
        return oldWindowsVersionMap[v] || v;
      },
      Android: function Android() {
        return u.replace(/^.*Android ([\d.]+);.*$/, '$1');
      },
      iOS: function iOS() {
        return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
      },
      Debian: function Debian() {
        return u.replace(/^.*Debian\/([\d.]+).*$/, '$1');
      },
      'Windows Phone': function WindowsPhone() {
        return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2');
      },
      'Mac OS': function MacOS() {
        return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
      },
      WebOS: function WebOS() {
        return u.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1');
      }
    };

    if (osVersion[_this.os]) {
      _this.osVersion = osVersion[_this.os]();

      if (_this.osVersion == u) {
        _this.osVersion = '';
      }
    }

    return _this.osVersion;
  },
  // 获取横竖屏状态
  getOrientationStatu: function getOrientationStatu() {
    var orientationStatus = '';
    var orientation = window.matchMedia('(orientation: portrait)');

    if (orientation.matches) {
      orientationStatus = '竖屏';
    } else {
      orientationStatus = '横屏';
    }

    return orientationStatus;
  },
  // 获取设备类型
  getDeviceType: function getDeviceType() {
    var _this = this;

    _this.device = 'PC';
    MethodLibrary.matchInfoMap(_this);
    return _this.device;
  },
  // 获取网络状态
  getNetwork: function getNetwork() {
    var netWork = navigator && navigator.connection && navigator.connection.effectiveType;
    return netWork;
  },
  // 获取当前语言
  getLanguage: function getLanguage() {
    var _this = this;

    _this.language = function () {
      var language = VariableLibrary.navigator.browserLanguage || VariableLibrary.navigator.language;
      var arr = language.split('-');

      if (arr[1]) {
        arr[1] = arr[1].toUpperCase();
      }

      return arr.join('_');
    }();

    return _this.language;
  },
  // 浏览器信息
  getBrowserInfo: function getBrowserInfo() {
    var _this = this;

    MethodLibrary.matchInfoMap(_this);
    var u = VariableLibrary.navigator.userAgent || {};

    var _mime = function _mime(option, value) {
      var mimeTypes = VariableLibrary.navigator.mimeTypes;

      for (var key in mimeTypes) {
        if (mimeTypes[key][option] == value) {
          return true;
        }
      }

      return false;
    };

    var match = MethodLibrary.getMatchMap(u);
    var is360 = false;

    if (window.chrome) {
      var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');

      if (chrome_version > 36 && window.showModalDialog) {
        is360 = true;
      } else if (chrome_version > 45) {
        is360 = _mime('type', 'application/vnd.chromium.remoting-viewer');
      }
    }

    if (match['Baidu'] && match['Opera']) {
      match['Baidu'] = false;
    }

    if (match['Mobile']) {
      match['Mobile'] = !(u.indexOf('iPad') > -1);
    }

    if (is360) {
      if (_mime('type', 'application/gameplugin')) {
        match['360SE'] = true;
      } else if (VariableLibrary.navigator && typeof VariableLibrary.navigator['connection']['saveData'] == 'undefined') {
        match['360SE'] = true;
      } else {
        match['360EE'] = true;
      }
    }

    if (match['IE'] || match['Edge']) {
      var navigator_top = window.screenTop - window.screenY;

      switch (navigator_top) {
        case 71:
          // 无收藏栏,贴边
          break;

        case 74:
          // 无收藏栏,非贴边
          break;

        case 99:
          // 有收藏栏,贴边
          break;

        case 102:
          // 有收藏栏,非贴边
          match['360EE'] = true;
          break;

        case 75:
          // 无收藏栏,贴边
          break;

        case 74:
          // 无收藏栏,非贴边
          break;

        case 105:
          // 有收藏栏,贴边
          break;

        case 104:
          // 有收藏栏,非贴边
          match['360SE'] = true;
          break;

        default:
          break;
      }
    }

    var browerVersionMap = {
      Safari: function Safari() {
        return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
      },
      Chrome: function Chrome() {
        return u.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
      },
      IE: function IE() {
        return u.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1');
      },
      Edge: function Edge() {
        return u.replace(/^.*Edge\/([\d.]+).*$/, '$1');
      },
      Firefox: function Firefox() {
        return u.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1');
      },
      'Firefox Focus': function FirefoxFocus() {
        return u.replace(/^.*Focus\/([\d.]+).*$/, '$1');
      },
      Chromium: function Chromium() {
        return u.replace(/^.*Chromium\/([\d.]+).*$/, '$1');
      },
      Opera: function Opera() {
        return u.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1');
      },
      Vivaldi: function Vivaldi() {
        return u.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1');
      },
      Yandex: function Yandex() {
        return u.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1');
      },
      Arora: function Arora() {
        return u.replace(/^.*Arora\/([\d.]+).*$/, '$1');
      },
      Lunascape: function Lunascape() {
        return u.replace(/^.*Lunascape[\/\s]([\d.]+).*$/, '$1');
      },
      QupZilla: function QupZilla() {
        return u.replace(/^.*QupZilla[\/\s]([\d.]+).*$/, '$1');
      },
      'Coc Coc': function CocCoc() {
        return u.replace(/^.*coc_coc_browser\/([\d.]+).*$/, '$1');
      },
      Kindle: function Kindle() {
        return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
      },
      Iceweasel: function Iceweasel() {
        return u.replace(/^.*Iceweasel\/([\d.]+).*$/, '$1');
      },
      Konqueror: function Konqueror() {
        return u.replace(/^.*Konqueror\/([\d.]+).*$/, '$1');
      },
      Iceape: function Iceape() {
        return u.replace(/^.*Iceape\/([\d.]+).*$/, '$1');
      },
      SeaMonkey: function SeaMonkey() {
        return u.replace(/^.*SeaMonkey\/([\d.]+).*$/, '$1');
      },
      Epiphany: function Epiphany() {
        return u.replace(/^.*Epiphany\/([\d.]+).*$/, '$1');
      },
      360: function _() {
        return u.replace(/^.*QihooBrowser\/([\d.]+).*$/, '$1');
      },
      '360SE': function SE() {
        var hash = {
          63: '10.0',
          55: '9.1',
          45: '8.1',
          42: '8.0',
          31: '7.0',
          21: '6.3'
        };
        var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
        return hash[chrome_version] || '';
      },
      '360EE': function EE() {
        var hash = {
          69: '11.0',
          63: '9.5',
          55: '9.0',
          50: '8.7',
          30: '7.5'
        };
        var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
        return hash[chrome_version] || '';
      },
      Maxthon: function Maxthon() {
        return u.replace(/^.*Maxthon\/([\d.]+).*$/, '$1');
      },
      QQBrowser: function QQBrowser() {
        return u.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1');
      },
      QQ: function QQ() {
        return u.replace(/^.*QQ\/([\d.]+).*$/, '$1');
      },
      Baidu: function Baidu() {
        return u.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1');
      },
      UC: function UC() {
        return u.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1');
      },
      Sogou: function Sogou() {
        return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1');
      },
      LBBROWSER: function LBBROWSER() {
        var version = '';

        if (u.indexOf('LieBaoFast') > -1) {
          version = u.replace(/^.*LieBaoFast\/([\d.]+).*$/, '$1');
        }

        var hash = {
          57: '6.5',
          49: '6.0',
          46: '5.9',
          42: '5.3',
          39: '5.2',
          34: '5.0',
          29: '4.5',
          21: '4.0'
        };
        var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
        return version || hash[chrome_version] || '';
      },
      '2345Explorer': function Explorer() {
        return u.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1');
      },
      TheWorld: function TheWorld() {
        return u.replace(/^.*TheWorld ([\d.]+).*$/, '$1');
      },
      XiaoMi: function XiaoMi() {
        return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1');
      },
      Quark: function Quark() {
        return u.replace(/^.*Quark\/([\d.]+).*$/, '$1');
      },
      Qiyu: function Qiyu() {
        return u.replace(/^.*Qiyu\/([\d.]+).*$/, '$1');
      },
      Wechat: function Wechat() {
        return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1');
      },
      WechatWork: function WechatWork() {
        return u.replace(/^.*wxwork\/([\d.]+).*$/, '$1');
      },
      Taobao: function Taobao() {
        return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1');
      },
      Alipay: function Alipay() {
        return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1');
      },
      Weibo: function Weibo() {
        return u.replace(/^.*weibo__([\d.]+).*$/, '$1');
      },
      Douban: function Douban() {
        return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1');
      },
      Suning: function Suning() {
        return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1');
      },
      iQiYi: function iQiYi() {
        return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1');
      }
    };
    _this.browserVersion = '';

    if (browerVersionMap[_this.browser]) {
      _this.browserVersion = browerVersionMap[_this.browser]();

      if (_this.browserVersion == u) {
        _this.browserVersion = '';
      }
    }

    if (_this.browser == 'Chrome' && u.match(/\S+Browser/)) {
      _this.browser = u.match(/\S+Browser/)[0];
      _this.version = u.replace(/^.*Browser\/([\d.]+).*$/, '$1');
    }

    if (_this.browser == 'Edge') {
      if (_this.version > '75') {
        _this.engine = 'Blink';
      } else {
        _this.engine = 'EdgeHTML';
      }
    }

    if (_this.browser == 'Chrome' && parseInt(_this.browserVersion) > 27) {
      _this.engine = 'Blink';
    } else if (match['Chrome'] && _this.engine == 'WebKit' && parseInt(version['Chrome']()) > 27) {
      _this.engine = 'Blink';
    } else if (_this.browser == 'Opera' && parseInt(_this.version) > 12) {
      _this.engine = 'Blink';
    } else if (_this.browser == 'Yandex') {
      _this.engine = 'Blink';
    }

    return {
      browser: _this.browser,
      browserVersion: _this.browserVersion,
      engine: _this.engine
    };
  },
  // 获取地理位置
  getGeoPostion: function getGeoPostion(callback) {
    navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition( // 位置获取成功
    function (position) {
      callback(position);
    }, // 位置获取失败
    function (error) {
      console.log(error);
    });
  }
};
export default {
  os: MethodLibrary.getOS(),
  osVersion: MethodLibrary.getOSVersion(),
  browser: MethodLibrary.getBrowserInfo().browser,
  browserVersion: MethodLibrary.getBrowserInfo().browserVersion,
  screenSize: window.screen.width + '*' + window.screen.height,
  networkType: MethodLibrary.getNetwork()
};