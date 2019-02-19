import axios from 'axios'
import configure from '../config/dolphin.config'

const http = axios.create({
  timeout: 20000,
  withCredentials: true,
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

// 添加响应拦截器
http.interceptors.response.use(function (response) {
  // 根据项目实际情况添加业务逻辑
  if (response.status === 200) {
    return Promise.resolve(response.data)
  }
}, function (err) {
  // 根据项目实际对请求错误进行处理
  return Promise.reject(err)
})

// 请求拦截器
http.interceptors.request.use(function (config) {
  // 请求url添加统一前缀
  if (!config.url.includes('json')) {
    config.url = configure.apiPrefix ? `${configure.apiPrefix + config.url}` : config.url
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default http
