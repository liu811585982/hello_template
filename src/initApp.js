import axios from 'axios'
import store from '@/store'
import {getI18n} from '@/i18n'
import dolphinConfig from './config/dolphin.config'
import { Utils } from 'dolphin_common'
import token from 'index@/libs/token'
// TODO: 后续考虑开发环境下也加载上下文，与生产环境保持一致
// 开发态与生产环境下上下文不一样
const path = process.env.NODE_ENV === 'production' ? '/static' : '/static'
const context = process.env.NODE_ENV === 'production' ? '' : ''
// 配置token
token.set()
// 设置皮肤
async function setSkin (skin) {
  // 后端返回的有可能是空字符串
  skin = skin || 'redblack'
  let skinData = await axios.get(`${path}/skin/${skin}/skin.json`)
  return Utils.renderSkin(skin, skinData.data.packages, context)
}

async function initApp (Vue, config) {
  await setSkin('blue')
  store.commit('SET_USER_INFO', dolphinConfig.userInfo)
  mountVueIntance(Vue, config)
}

async function mountVueIntance (Vue, config) {
  const i18n = await getI18n()
  window.vm = new Vue({
    ...config,
    i18n
  }).$mount('#app')
}

export default initApp
