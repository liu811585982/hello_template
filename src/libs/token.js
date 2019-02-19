import http from '@/api/api'
import store from '../store/index'

export default {
  set (token) {
    // 登录成功后重新设置token
    if (token) {
      window.localStorage.setItem('accessToken', token)
    }

    // 处理刷新的时候vuex被清空但是用户已经登录的情况
    store.dispatch('setToken', window.localStorage.accessToken)

    // 登录成功之后需要重置axios请求头携带的参数默认值,否则请求无法通过服务验证
    http.defaults.headers['token'] = window.localStorage.accessToken;
  },

  clear () {
    http.defaults.headers['token'] = '';
  }
}
