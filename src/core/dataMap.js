import { RumEventType } from '../helper/enums'
export default {
  rum_web_page_performance: {
    type: RumEventType.VIEW,
    tags: {
      app_id: 'application.id',
      env: '_dd.env',
      version: '_dd.version',
      sdk_name: '_dd.skd_name',
      sdk_version: '_dd.sdk_version',
      is_signin: 'user.origin_id',
      os: 'device.os',
      os_version: 'device.os_version',
      browser: 'device.browser',
      browser_version: 'device.browser_version',
      screen_size: 'device.screen_size',
      page_host: 'page.host'
    },
    fields: {
      page_fmp: 'page.fmp',
      page_fpt: 'page.fpt',
      page_tti: 'page.tti',
      page_dom_ready: 'page.dom_ready',
      page_load: 'page.load',
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
      sdk_name: '_dd.skd_name',
      sdk_version: '_dd.sdk_version',
      is_signin: 'user.origin_id',
      os: 'device.os',
      os_version: 'device.os_version',
      browser: 'device.browser',
      browser_version: 'device.browser_version',
      screen_size: 'device.screen_size',
      page_host: 'page.host',
      resource_url: 'resource.url',
      resource_url_host: 'resource.url_host',
      resource_url_path: 'resource.url_path',
      resource_type: 'resource.type',
      resource_status: 'resource.status',
      resource_method: 'resource.method',
      response_connection: 'resource.connection',
      response_server: 'resource.server',
      response_content_type: 'resource.content_type',
      response_content_encoding: 'resource.content_encoding'
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
      sdk_name: '_dd.skd_name',
      sdk_version: '_dd.sdk_version',
      is_signin: 'user.origin_id',
      os: 'device.os',
      os_version: 'device.os_version',
      browser: 'device.browser',
      browser_version: 'device.browser_version',
      screen_size: 'device.screen_size',
      origin_id: 'user.origin_id',
      user_id: 'user.user_id',
      error_name: 'error.name',
      error_type: 'error.type',
      page_id: 'page.id',
      page_host: 'page.host',
      page_path: 'page.path',
      page_url: 'page.url',
      page_referer: 'page.referer'
    },
    fields: {
      error_starttime: 'error.starttime',
      error_message: 'error.message',
      error_stack: 'error.stack'
    }
  },
  page: {
    type: RumEventType.VIEW,
    tags: {
      app_id: 'application.id',
      env: '_dd.env',
      version: '_dd.version',
      sdk_name: '_dd.skd_name',
      sdk_version: '_dd.sdk_version',
      is_signin: 'user.origin_id',
      os: 'device.os',
      os_version: 'device.os_version',
      browser: 'device.browser',
      browser_version: 'device.browser_version',
      screen_size: 'device.screen_size',
      origin_id: 'user.origin_id',
      user_id: 'user.user_id',
      page_id: 'page.id',
      page_host: 'page.host',
      page_path: 'page.path',
      page_url: 'page.url',
      page_referer: 'page.referer'
    },
    fields: {
      page_fmp: 'page.fmp',
      page_fpt: 'page.fpt',
      page_tti: 'page.tti',
      page_dom_ready: 'page.dom_ready',
      page_load: 'page.load',
      page_dom: 'page.dom',
      page_resource_load_time: 'page.resource_load_time'
    }
  },
  resource: {
    type: RumEventType.RESOURCE,
    tags: {
      app_id: 'application.id',
      env: '_dd.env',
      version: '_dd.version',
      sdk_name: '_dd.skd_name',
      sdk_version: '_dd.sdk_version',
      is_signin: 'user.origin_id',
      os: 'device.os',
      os_version: 'device.os_version',
      browser: 'device.browser',
      browser_version: 'device.browser_version',
      screen_size: 'device.screen_size',
      origin_id: 'user.origin_id',
      user_id: 'user.user_id',
      page_id: 'page.id',
      page_host: 'page.host',
      page_path: 'page.path',
      page_url: 'page.url',
      page_referer: 'page.referer',
      resource_url: 'resource.url',
      resource_url_host: 'resource.url_host',
      resource_url_path: 'resource.url_path',
      resource_type: 'resource.type',
      resource_status: 'resource.status',
      resource_method: 'resource.method',
      response_connection: 'resource.connection',
      response_server: 'resource.server',
      response_content_type: 'resource.content_type',
      response_content_encoding: 'resource.content_encoding'
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
      request_header: 'request.header',
      response_header: 'response.header'
    }
  }
}
