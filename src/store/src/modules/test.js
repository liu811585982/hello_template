/**
 * 测试模块
 */
export default {
  state: {
    testInfo: {
      name: 'test'
    }
  },
  mutations: {
    'asignTestInfo' (state, res) {
      state.testInfo = Object.assign({}, state.testInfo, res)
    }
  }
}
