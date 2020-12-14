import { ONE_KILO_BYTE, ONE_SECOND, extend2Lev } from '../helper/tools'
import { getCurrentSite } from './cookie'
import { getPathName, haveSameOrigin } from '../helper/urlPolyfill'
export var DEFAULT_CONFIGURATION = {
  resourceSampleRate: 100,
  sampleRate: 100,
  flushTimeout: 30 * ONE_SECOND,
  maxErrorsByMinute: 3000,
  /**
   * Logs intake limit
   */
  maxBatchSize: 50,
  maxMessageSize: 256 * ONE_KILO_BYTE,

  /**
   * beacon payload max queue size implementation is 64kb
   * ensure that we leave room for logs, rum and potential other users
   */
  batchBytesLimit: 16 * ONE_KILO_BYTE,
  datawayUrl: '',
  allowedTracingOrigins: []
}
export function buildCookieOptions(userConfiguration) {
  var cookieOptions = {}

  cookieOptions.secure = mustUseSecureCookie(userConfiguration)
  cookieOptions.crossSite = !!userConfiguration.useCrossSiteSessionCookie

  if (!!userConfiguration.trackSessionAcrossSubdomains) {
    cookieOptions.domain = getCurrentSite()
  }

  return cookieOptions
}
function getDataWayUrl(url) {
  if (url.lastIndexOf('/') === url.length - 1) return url + 'v1/write/rum'
  return url + '/v1/write/rum'
}
export function commonInit(userConfiguration, buildEnv) {
  var transportConfiguration = {
    applicationId: userConfiguration.applicationId,
    env: userConfiguration.env || '',
    version: userConfiguration.version || '',
    sdkVersion: buildEnv.sdkVersion,
    sdkName: buildEnv.sdkName,
    datawayUrl: getDataWayUrl(userConfiguration.datawayUrl),
    tags: userConfiguration.tags || [],
    cookieOptions: buildCookieOptions(userConfiguration)
  }
  return extend2Lev(DEFAULT_CONFIGURATION, transportConfiguration)
}
function mustUseSecureCookie(userConfiguration) {
  return (
    !!userConfiguration.useSecureSessionCookie ||
    !!userConfiguration.useCrossSiteSessionCookie
  )
}

export function isIntakeRequest(url, configuration) {
  return haveSameOrigin(url, configuration.datawayUrl)
}
