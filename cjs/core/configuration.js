"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCookieOptions = buildCookieOptions;
exports.commonInit = commonInit;
exports.isIntakeRequest = isIntakeRequest;
exports.DEFAULT_CONFIGURATION = void 0;

var _tools = require("../helper/tools");

var _cookie = require("./cookie");

var _urlPolyfill = require("../helper/urlPolyfill");

var DEFAULT_CONFIGURATION = {
  resourceSampleRate: 100,
  sampleRate: 100,
  flushTimeout: 30 * _tools.ONE_SECOND,
  maxErrorsByMinute: 3000,

  /**
   * Logs intake limit
   */
  maxBatchSize: 50,
  maxMessageSize: 256 * _tools.ONE_KILO_BYTE,

  /**
   * beacon payload max queue size implementation is 64kb
   * ensure that we leave room for logs, rum and potential other users
   */
  batchBytesLimit: 16 * _tools.ONE_KILO_BYTE,
  datakitUrl: '',
  allowedTracingOrigins: []
};
exports.DEFAULT_CONFIGURATION = DEFAULT_CONFIGURATION;

function buildCookieOptions(userConfiguration) {
  var cookieOptions = {};
  cookieOptions.secure = mustUseSecureCookie(userConfiguration);
  cookieOptions.crossSite = !!userConfiguration.useCrossSiteSessionCookie;

  if (!!userConfiguration.trackSessionAcrossSubdomains) {
    cookieOptions.domain = (0, _cookie.getCurrentSite)();
  }

  return cookieOptions;
}

function getDatakitUrlUrl(url) {
  if (url.lastIndexOf('/') === url.length - 1) return url + 'v1/write/rum';
  return url + '/v1/write/rum';
}

function commonInit(userConfiguration, buildEnv) {
  var transportConfiguration = {
    applicationId: userConfiguration.applicationId,
    env: userConfiguration.env || '',
    version: userConfiguration.version || '',
    sdkVersion: buildEnv.sdkVersion,
    sdkName: buildEnv.sdkName,
    datakitUrl: getDatakitUrlUrl(userConfiguration.datakitUrl),
    tags: userConfiguration.tags || [],
    cookieOptions: buildCookieOptions(userConfiguration)
  };
  return (0, _tools.extend2Lev)(DEFAULT_CONFIGURATION, transportConfiguration);
}

function mustUseSecureCookie(userConfiguration) {
  return !!userConfiguration.useSecureSessionCookie || !!userConfiguration.useCrossSiteSessionCookie;
}

function isIntakeRequest(url, configuration) {
  return (0, _urlPolyfill.haveSameOrigin)(url, configuration.datakitUrl);
}