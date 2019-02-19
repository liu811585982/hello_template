/**
 * 全局安装过滤器
 */
import * as filters from './filters'

const install = (Vue) => {
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })
}

export default install
