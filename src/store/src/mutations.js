/*
 * @Author: zhangxin14
 * @Date: 2017-07-04 15:24:27
 * @Last Modified by: zhangxin14
 * @Last Modified time: 2017-07-05 13:38:29
 */

import {
  SET_TOKEN,
  SET_EDITOR,
  SET_BREAD,
  SET_LANG,
  SET_QUERY,
  SET_MASK,
  SET_CLOUD,
  SET_HEIGHT,
  SET_RESIZE,
  SET_USER_INFO,
  SET_SKIN_COLOR,
  SET_LOGIN_USER
} from './mutations-type'

export default {
  /**
   * 设置token
   *
   * @param {any} state
   * @param {any} token
   */
  [SET_TOKEN] (state, token) {
    state.accessToken = token
  },

  /**
   * 新增、编辑时所需参数
   *
   * @param {any} state
   * @param {any} editor
   */
  [SET_EDITOR] (state, editor) {
    state.editor = editor
  },

  /**
   * 新增、编辑时所需参数
   *
   * @param {any} state
   * @param {any} editor
   */
  [SET_BREAD] (state, editor) {
    state.breadTag = editor
  },

  /**
   * 新增、编辑时所需参数
   *
   * @param {any} state
   * @param {any} lang
   */
  [SET_LANG] (state, lang) {
    state.lang = lang
  },
  /**
   * 新增、编辑时所需参数
   *
   * @param {any} state
   * @param {any} lang
   */
  [SET_QUERY] (state, query) {
    state.query = query
  },
  /**
   * 新增、编辑时所需参数
   *
   * @param {any} state
   * @param {any} mask
   */
  [SET_MASK] (state, mask) {
    state.mask = mask
  },
  /**
   * 新增、编辑时所需参数
   *
   * @param {any} state
   * @param {any} list
   */
  [SET_CLOUD] (state, list) {
    state.cloudList = list
  },
  /**
   * 新增、编辑时所需参数
   *
   * @param {any} state
   * @param {any} height
   */
  [SET_HEIGHT] (state, height) {
    state.height = height
  },
  /**
   * 新增、编辑时所需参数
   *
   * @param {any} state
   * @param {any} resize
   */
  [SET_RESIZE] (state, resize) {
    state.resize = resize
  },

  [SET_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  /**
   * 设置皮肤颜色
   */
  [SET_SKIN_COLOR] (state, color) {
    state.skinColor = color
  },
  /**
   * @param state
   * @param loginUser 登录用户
   */
  [SET_LOGIN_USER] (state, loginUser) {
    state.loginUser = loginUser
  }
}
