// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import hui from 'hui'
import common from 'dolphin_common'
import initApp from './initApp'
import filters from './filters'
import './icons'
import '@/mock'

Vue.use(hui)
Vue.use(common)
Vue.use(filters)

// 全局混合，对面包屑的多语言进行处理
Vue.mixin({
  computed: {
    i18nBreadcrumb () {
      if (this.breadcrumbObj && Array.isArray(this.$store.state.userInfo.breadcrumb[this.breadcrumbObj.menuCode])) {
        let breadcrumbList = this.$store.state.userInfo.breadcrumb[this.breadcrumbObj.menuCode]

        return breadcrumbList.map(item => ({
          title: this.$t(item.title),
          router: item.router
        })).concat(this.breadcrumbObj.content ? this.breadcrumbObj.content.map((bd, i) => ({
          title: this.$t(bd),
          router: this.breadcrumbObj.router ? this.breadcrumbObj.router[i] : this.breadcrumbObj.path
        })) : [])
      } else {
        return []
      }
    }
  }
})

initApp(Vue, {
  store,
  router,
  template: '<App/>',
  components: { App }
})
