/*
 * @Author: zhangxin14
 * @Date: 2017-07-04 15:31:25
 * @Last Modified by: zhangxin14
 * @Last Modified time: 2017-07-04 16:09:25
 */
import {
  SET_TOKEN,
  SET_BREAD,
  SET_LANG,
  SET_QUERY,
  SET_MASK,
  SET_CLOUD,
  SET_HEIGHT,
  SET_RESIZE
} from './mutations-type'

export default{
  setToken ({ commit }, token) {
    commit(SET_TOKEN, token)
  },
  setBread ({ commit }, bread) {
    commit(SET_BREAD, bread)
  },
  setLang ({ commit }, bread) {
    commit(SET_LANG, bread)
  },
  setQuery ({ commit }, bread) {
    commit(SET_QUERY, bread)
  },
  setMask ({ commit }, bread) {
    commit(SET_MASK, bread)
  },
  setCloud ({ commit }, bread) {
    commit(SET_CLOUD, bread)
  },
  setHeight ({ commit }, height) {
    commit(SET_HEIGHT, height)
  },
  setResize ({ commit }, resize) {
    commit(SET_RESIZE, resize)
  }
}
