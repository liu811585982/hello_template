import http from './api'
// import JSEncrypt from 'jsencrypt';

export default {
  /**
   * 通用http请求
   * @param {any} data
   * @returns
   */
  getRequest (url, method, data, timeout, header) {
    // 给get请求加一个随机数，解决缓存的问题
    if (method === 'get') {
      let random = +new Date()
      if (url.indexOf('?') !== -1) {
        url = url + '&v=' + random
      } else {
        url = url + '?v=' + random
      }
    }

    method = method || 'post'
    data = data || {}
    timeout && (http.defaults.timeout = timeout)

    if (header) {
      for (let p in header) {
        http.defaults.headers[p] = header[p]
      }
    }

    return http[method](url, data)
  },

  /**
   * 通用列表数据请求
   * @param {any} data
   * @returns
   */
  getList (url, params) {
    return http.post(url, params)
  },

  // 判断是否有权限
  isHasValidate (url, callback) {
    this.getRequest(url, 'post')
      .then(res => {
        if (res.status === true) {
          callback()
        }
      })
  }
}
