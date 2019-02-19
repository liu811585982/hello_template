/*
 * @Author: zhangxin14
 * @Date: 2017-07-04 15:27:55
 * @Last Modified by: zhangxin14
 * @Last Modified time: 2017-07-05 13:42:48
 */
export default {
  /**
   * 获取token
   * @param {Object} state
   */
  getToken (state) {
    return state.accessToken
  },

  /**
   * 获取breadTag
   * @param {Object} state
   */
  getBread (state) {
    return state.breadTag
  },

  /**
   * 获取mask
   * @param {Object} mask
   */
  getMask (state) {
    return state.mask
  }
}
