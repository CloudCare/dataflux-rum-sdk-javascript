import { RumEventType } from '../helper/enums'
// 需要用双引号将字符串类型的field value括起来， 这里有数组标示[string, path]
export default {
  rum_web_page_performance: {
    type: RumEventType.VIEW,
    tags: {
      app_id: 'application.id',
      env: '_dd.env',
      version: '_dd.version',
      sdk_name: '_dd.sdk_name',
      sdk_version: '_dd.sdk_version',
      is_signin: 'user.is_signin',
      os: 'device.os',
      browser: 'device.browser',
      screen_size: 'device.screen_size',
      page_host: 'page.host',
      page_apdex_level: 'page.apdex_level',
      network_type: 'device.network_type'
    },
    fields: {
      page_fmp: 'page.fmp',
      page_fpt: 'page.fpt',
      page_tti: 'page.tti',
      page_dom_ready: 'page.dom_ready',
      page_js_error_count: 'page.error.count',
      page_dom: 'page.dom',
      page_resource_load_time: 'page.resource_load_time'
    }
  },
  rum_web_resource_performance: {
    type: RumEventType.RESOURCE,
    tags: {
      app_id: 'application.id',
      env: '_dd.env',
      version: '_dd.version',
      sdk_name: '_dd.sdk_name',
      sdk_version: '_dd.sdk_version',
      is_signin: 'user.is_signin',
      os: 'device.os',
      browser: 'device.browser',
      screen_size: 'device.screen_size',
      network_type: 'device.network_type',
      page_host: 'page.host',
      resource_status_group: 'resource.status_group',
      resource_url_host: 'resource.url_host',
      resource_type: 'resource.type',
      resource_status: 'resource.status',
      resource_method: 'resource.method',
      response_connection: 'resource.response_connection',
      response_server: 'resource.response_server',
      response_content_type: 'resource.response_content_type',
      response_content_encoding: 'resource.response_content_encoding'
    },
    fields: {
      resource_size: 'resource.size',
      resource_load: 'resource.load',
      resource_dns: 'resource.dns',
      resource_tcp: 'resource.tcp',
      resource_ssl: 'resource.ssl',
      resource_ttfb: 'resource.ttfb',
      resource_trans: 'resource.trans',
      resource_firstbyte: 'resource.firstbyte'
    }
  },
  js_error: {
    type: RumEventType.ERROR,
    tags: {
      app_id: 'application.id',
      env: '_dd.env',
      version: '_dd.version',
      sdk_name: '_dd.sdk_name',
      sdk_version: '_dd.sdk_version',
      is_signin: 'user.is_signin',
      os: 'device.os',
      browser: 'device.browser',
      browser_version: 'device.browser_version',
      screen_size: 'device.screen_size',
      network_type: 'device.network_type',
      origin_id: 'user.origin_id',
      userid: 'user.user_id',
      error_name: 'error.name',
      error_type: 'error.type',
      page_id: 'page.id',
      page_host: 'page.host',
      page_path: 'page.path',
      page_url: 'page.url',
      page_referer: 'page.referrer'
    },
    fields: {
      error_starttime: 'error.starttime',
      error_message: ['string', 'error.message'],
      error_stack: ['string', 'error.stack']
    }
  },
  page: {
    type: RumEventType.VIEW,
    tags: {
      app_id: 'application.id',
      env: '_dd.env',
      version: '_dd.version',
      sdk_name: '_dd.sdk_name',
      sdk_version: '_dd.sdk_version',
      is_signin: 'user.is_signin',
      os: 'device.os',
      browser: 'device.browser',
      browser_version: 'device.browser_version',
      screen_size: 'device.screen_size',
      network_type: 'device.network_type',
      origin_id: 'user.origin_id',
      userid: 'user.user_id',
      page_id: 'page.id',
      page_host: 'page.host',
      page_path: 'page.path',
      page_url: 'page.url',
      page_referer: 'page.referrer',
      page_apdex_level: 'page.apdex_level'
    },
    fields: {
      page_fmp: 'page.fmp',
      page_fpt: 'page.fpt',
      page_tti: 'page.tti',
      page_dom_ready: 'page.dom_ready',
      page_load: 'page.load',
      page_dom: 'page.dom',
      page_resource_load_time: 'page.resource_load_time',
      page_js_error_count: 'page.error.count'
    }
  },
  resource: {
    type: RumEventType.RESOURCE,
    tags: {
      app_id: 'application.id',
      env: '_dd.env',
      version: '_dd.version',
      sdk_name: '_dd.sdk_name',
      sdk_version: '_dd.sdk_version',
      is_signin: 'user.is_signin',
      os: 'device.os',
      os_version: 'device.os_version',
      browser: 'device.browser',
      browser_version: 'device.browser_version',
      screen_size: 'device.screen_size',
      network_type: 'device.network_type',
      origin_id: 'user.origin_id',
      userid: 'user.user_id',
      page_id: 'page.id',
      page_host: 'page.host',
      page_path: 'page.path',
      trace_id: '_dd.trace_id',
      span_id: '_dd.span_id',
      resource_url: 'resource.url',
      resource_url_host: 'resource.url_host',
      resource_url_path: 'resource.url_path',
      resource_type: 'resource.type',
      resource_status: 'resource.status',
      resource_status_group: 'resource.status_group',
      resource_method: 'resource.method',
      response_connection: 'resource.response_connection',
      response_server: 'resource.response_server',
      response_content_type: 'resource.response_content_type',
      response_content_encoding: 'resource.response_content_encoding'
    },
    fields: {
      resource_size: 'resouce.size',
      resource_load: 'resource.load',
      resource_dns: 'resource.dns',
      resource_tcp: 'resource.tcp',
      resource_ssl: 'resource.ssl',
      resource_ttfb: 'resource.ttfb',
      resource_trans: 'resource.trans',
      resource_firstbyte: 'resource.firstbyte',
      request_header: ['string', 'request.header'],
      response_header: ['string', 'response.header'],
      page_url: ['string', 'page.url'],
      page_referer: ['string', 'page.referrer']
    }
  }
}
