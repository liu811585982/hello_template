import Vue from 'vue'
import Vuex from 'vuex'
import state from './src/state'
import getters from './src/getters'
import mutations from './src/mutations'
import actions from './src/actions'

const requireAll = requireContext => {
  const resource = {}
  requireContext.keys().forEach(item => {
    const src = item.replace(/(?:.*?)(\w+)\.js$/, '$1')
    const result = requireContext(item)
    resource[src] = ('default' in result)
      ? {namespaced: true, ...result.default}
      : {namespaced: true, ...result}
  })
  return resource
}

const modules = requireAll(require.context('./src/modules', false, /\.js$/))

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
})
