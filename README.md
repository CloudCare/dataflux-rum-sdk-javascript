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
  datakitOrigin: '<DATAKIT ORIGIN>'
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
      datakitOrigin: '<DATAKIT ORIGIN>'
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
      datakitOrigin: '<DATAKIT ORIGIN>'
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
| `datakitOrigin`                | String  | 是       |         | datakit 数据上报 Origin                                                                                   |
| `env`                          | String  | 否       |         | web 应用当前环境， 如 prod：线上环境；gray：灰度环境；pre：预发布环境 common：日常环境；local：本地环境； |
| `version`                      | String  | 否       |         | web 应用的版本号                                                                                          |
| `resourceSampleRate`           | Number  | 否       | `100`   | 资源指标数据收集百分比: `100`表示全收集，`0`表示不收集                                                    |
| `sampleRate`                   | Number  | 否       | `100`   | 指标数据收集百分比: `100`表示全收集，`0`表示不收集                                                        |
| `trackSessionAcrossSubdomains` | Boolean | 否       | `false` | 同一个域名下面的子域名共享缓存                                                                            |

## 问题

### 产生 Script error 消息的原因
在使用 DataFlux Web Rum Sdk 进行 Web 端错误收集的时候，经常会在`js_error`中看到 Script error. 这样的错误信息，同时并没有包含任何详细信息。
### 可能出现上面问题的原因
1. 用户使用的浏览器不支持错误的捕获 (概率极小)。
2. 出错的脚本文件是跨域加载到页面的。
对于用户浏览器不支持的情况，这种我们是无法处理的；这里主要解决跨域脚本错误无法收集的原因和解决方案。

### 原因
一般情况下脚本文件是使用 `<script>` 标签加载，对于同源脚本出错，在使用浏览器的 `GlobalEventHandlers API` 时，收集到的错误信息会包含详细的错误信息；当不同源脚本出错时，收集到的错误信息只有 `Script error.` 文本，这是由浏览器的同源策略控制的，也是正常的情况。对于非同源脚本我们只需要进行非同源资源共享（也称 HTTP访问控制 / CORS）的操作即可。

### 解决方法

#### 1.脚本文件直接存放在服务器
在服务器上静态文件输出时添加 Header

```
Access-Control-Allow-Origin: *
```
在非同源脚本所在的 Script 标签上添加属 crossorigin="anonymous"

```
<script type="text/javascript" src="path/to/your/script.js" crossorigin="anonymous"></script>
```
#### 2.脚本文件存放 CDN 上
在 CDN 设置中添加 Header

```
Access-Control-Allow-Origin: *
```
在非同源脚本所在的 Script 标签上添加属 crossorigin="anonymous"

```
<script type="text/javascript" src="path/to/your/script.js" crossorigin="anonymous"></script>
```
#### 3. 脚本文件从第三方加载
在非同源脚本所在的 Script 标签上添加属 crossorigin="anonymous"

```
<script type="text/javascript" src="path/to/your/script.js" crossorigin="anonymous"></script>
```

### 参考及扩展阅读
[GlobalEventHandlers.onerror](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror)

[Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

[The Script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

[CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)


### 资源数据(ssl, tcp, dns, trans,ttfb)收集不完整问题
在数据上报过程中，部分资源timing数据有可能收集不完整。比如tcp，dns数据没有收集上报。
### 出现上面问题原因
1. 比如dns数据没有收集到，有可能是您应用的这个资源请求是以`keep-alive`保持链接的，这种情况只有在你第一次请求的时候，会有创建链接的过程，之后的请求都会保持同一连接，不会再重新创建tcp连接。所以会出现dns数据没有的情况，或者数据为`0`。
2. 应用的资源是以跨域的形式加载到页面的，和你的网站并非是同源（主要原因）。
3. 浏览器不支持`Performance API`(极少数情况)
   
### 针对跨域资源的问题
#### 1.资源文件直接存放在服务器

在服务器上资源文件输出时添加 Header

```
Timing-Allow-Origin: *
```

#### 2.资源文件存放 CDN 上
在 CDN 设置中添加 Header

```
Timing-Allow-Origin: *
```
### 参考以及拓展
[Coping_with_CORS](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API#Coping_with_CORS)


[Resource Timing Standard; W3C Editor's Draft](https://w3c.github.io/resource-timing/)

[Resource Timing practical tips; Steve Souders](http://www.stevesouders.com/blog/2014/08/21/resource-timing-practical-tips/)

[Measuring network performance with Resource Timing API](http://googledevelopers.blogspot.ca/2013/12/measuring-network-performance-with.html)