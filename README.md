# DataFlux RUM Web 端数据指标监控

## 简介

DataFlux RUM 能够通过收集各个应用的指标数据，以可视化的方式分析各个应用端的性能

### 你可以从下面几种方式中选择一种接入到你的 Web 应用中

| 接入方式     | 简介                                                                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NPM          | 通过把 SDK 代码一起打包到你的前端项目中，此方式可以确保对前端页面的性能不会有任何影响，不过可能会错过 SDK 初始化之前的的请求、错误的收集。                       |
| CDN 异步加载 | 通过 CDN 加速缓存，以异步脚本引入的方式，引入 SDK 脚本，此方式可以确保 SDK 脚本的下载不会影响页面的加载性能，不过可能会错过 SDK 初始化之前的的请求、错误的收集。 |
| CDN 同步加载 | 通过 CDN 加速缓存，以同步脚本引入的方式，引入 SDK 脚本，此方式可以确保能够收集到所有的错误，资源，请求，性能指标。不过可能会影响页面的加载性能。                 |

### NPM

```javascript
import { datafluxRum } from '@cloudcare/browser-rum'

datafluxRum.init({
  applicationId: '<DATAFLUX_APPLICATION_ID>',
  datawayUrl: '<DATAWAYURL>'
  //  service: 'my-web-application',
  //  env: 'production',
  //  version: '1.0.0',
})
```

### CDN 异步加载

```html
<script>
  ;(function (h, o, u, n, d) {
    h = h[d] = h[d] || {
      q: [],
      onReady: function (c) {
        h.q.push(c)
      }
    }
    d = o.createElement(u)
    d.async = 1
    d.src = n
    n = o.getElementsByTagName(u)[0]
    n.parentNode.insertBefore(d, n)
  })(
    window,
    document,
    'script',
    'https://static.dataflux.cn/js-sdk/dataflux-rum.js',
    'DATAFLUX_RUM'
  )
  DATAFLUX_RUM.onReady(function () {
    DATAFLUX_RUM.init({
      applicationId: '<DATAFLUX_APPLICATION_ID>',
      datawayUrl: '<DATAWAYURL>'
      //  service: 'my-web-application',
      //  env: 'production',
      //  version: '1.0.0',
    })
  })
</script>
```

### CDN 同步加载

```html
<script
  src="https://static.dataflux.cn/js-sdk/dataflux-rum.js"
  type="text/javascript"
></script>
<script>
  window.DATAFLUX_RUM &&
    window.DATAFLUX_RUM.init({
      applicationId: '<DATAFLUX_APPLICATION_ID>',
      datawayUrl: '<DATAWAYURL>'
      //  service: 'my-web-application',
      //  env: 'production',
      //  version: '1.0.0',
    })
</script>
```

## 配置

### 初始化参数

| 参数                           | 类型    | 是否必须 | 默认值  | 描述                                                                                                      |
| ------------------------------ | ------- | -------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `applicationId`                | String  | 是       |         | 从 dataflux 创建的应用 ID                                                                                 |
| `datawayUrl`                   | String  | 是       |         | datakit 数据上报地址                                                                                      |
| `service`                      | String  | 否       |         | web 应用的名称                                                                                            |
| `env`                          | String  | 否       |         | web 应用当前环境， 如 prod：线上环境；gray：灰度环境；pre：预发布环境 common：日常环境；local：本地环境； |
| `version`                      | String  | 否       |         | web 应用的版本号                                                                                          |
| `resourceSampleRate`           | Number  | 否       | `100`   | 资源指标数据收集百分比: `100`表示全收集，`0`表示不收集                                                    |
| `sampleRate`                   | Number  | 否       | `100`   | 指标数据收集百分比: `100`表示全收集，`0`表示不收集                                                        |
| `trackSessionAcrossSubdomains` | Boolean | 否       | `false` | 同一个域名下面的子域名共享缓存                                                                            |
