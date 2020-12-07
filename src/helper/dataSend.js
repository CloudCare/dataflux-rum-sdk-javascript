import { base64Encode, hashCode, indexOf, isSupportCors } from './tools'
import params from './params'
var dataSend = {}

dataSend.getSendUrl = function (url, data) {
  var base64Data = base64Encode(data)
  var crc = 'crc=' + hashCode(base64Data)
  if (url.indexOf('?') !== -1) {
    return (
      url +
      '&data=' +
      encodeURIComponent(base64Data) +
      '&ext=' +
      encodeURIComponent(crc)
    )
  } else {
    return (
      url +
      '?data=' +
      encodeURIComponent(base64Data) +
      '&ext=' +
      encodeURIComponent(crc)
    )
  }
}

dataSend.getSendData = function (data) {
  var base64Data = base64Encode(data)
  var crc = 'crc=' + hashCode(base64Data)
  return (
    'data=' + encodeURIComponent(base64Data) + '&ext=' + encodeURIComponent(crc)
  )
}

dataSend.getInstance = function (data) {
  var sendType = this.getSendType(data)
  var obj = new this[sendType](data)
  var start = obj.start
  obj.start = function () {
    var me = this
    start.apply(this, arguments)
    setTimeout(function () {
      me.isEnd(true)
    }, params.callbackTimeout)
  }
  obj.end = function () {
    this.callback && this.callback()
    var self = this
    setTimeout(function () {
      self.lastClear && self.lastClear()
    }, params.datasendTimeout - params.callbackTimeout)
  }
  obj.isEnd = function (isDelay) {
    if (!this.received) {
      this.received = true
      this.end()
      var self = this
      if (isDelay) {
        if (params.queueTimeout - params.callbackTimeout <= 0) {
          self.close()
        } else {
          setTimeout(function () {
            self.close()
          }, params.queueTimeout - params.callbackTimeout)
        }
      } else {
        self.close()
      }
    }
  }

  return obj
}

dataSend.getSendType = function (data) {
  var supportedSendTypes = ['image', 'ajax', 'beacon']
  var sendType = supportedSendTypes[0]

  if (data.config && indexOf(supportedSendTypes, data.config.send_type) > -1) {
    sendType = data.config.send_type
  } else {
    sendType = 'ajax'
  }

  if (sendType === 'beacon' && typeof navigator.sendBeacon !== 'function') {
    sendType = 'image'
  }

  if (sendType === 'ajax' && isSupportCors() === false) {
    sendType = 'image'
  }

  return sendType
}

dataSend.image = function (para) {
  this.callback = para.callback
  this.img = document.createElement('img')
  this.img.width = 1
  this.img.height = 1
  this.img.crossOrigin = 'anonymous'
  this.data = para.data
  this.server_url = dataSend.getSendUrl(para.server_url, para.data)
}
dataSend.image.prototype.start = function () {
  var me = this
  this.img.onload = function () {
    this.onload = null
    this.onerror = null
    this.onabort = null
    me.isEnd()
  }
  this.img.onerror = function () {
    this.onload = null
    this.onerror = null
    this.onabort = null
    me.isEnd()
  }
  this.img.onabort = function () {
    this.onload = null
    this.onerror = null
    this.onabort = null
    me.isEnd()
  }
  this.img.src = this.server_url
}

dataSend.image.prototype.lastClear = function () {
  this.img.src = ''
}

dataSend.ajax = function (para) {
  this.callback = para.callback
  this.server_url = para.server_url
  this.data = dataSend.getSendData(para.data)
}
dataSend.ajax.prototype.start = function () {
  var me = this
  _.ajax({
    url: this.server_url,
    type: 'POST',
    data: this.data,
    credentials: false,
    timeout: params.datasendTimeout,
    cors: true,
    success: function () {
      me.isEnd()
    },
    error: function () {
      me.isEnd()
    }
  })
}

dataSend.beacon = function (para) {
  this.callback = para.callback
  this.server_url = para.server_url
  this.data = dataSend.getSendData(para.data)
}

dataSend.beacon.prototype.start = function () {
  var me = this
  if (
    typeof navigator === 'object' &&
    typeof navigator.sendBeacon === 'function'
  ) {
    navigator.sendBeacon(this.server_url, this.data)
  }
  setTimeout(function () {
    me.isEnd()
  }, 40)
}

export default dataSend
