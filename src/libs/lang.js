import Vue from 'vue'
import store from '../store/index'

export default {
  set (lang) {
    // 登录成功后重新设置token
    if (lang) {
      window.localStorage.setItem('language', lang)
    }

    // 处理刷新的时候vuex被清空但是用户已经登录的情况
    store.dispatch('setLang', window.localStorage.language);

    // 登录成功之后需要重置axios请求头携带的参数默认值,否则请求无法通过服务验证
    if (Vue.http) {
        Vue.http.defaults.headers['language'] = window.localStorage.language;
    }
  }
}
