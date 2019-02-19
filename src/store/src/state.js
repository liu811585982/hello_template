/**
 * state
 */
export default {
  userInfo: null,
  loginUser: {}, // 当前登录用户
  accessToken: null, // token设置
  breadTag: true, // 是否显示面包屑设置
  lang: null, // 语言设置
  editor: {},
  query: false, // 查询条件默认收缩
  mask: false, // 全局loading
  cloudList: [], // 云列表
  height: document.body.clientHeight - 45, // 页面高度
  resize: false, // 自适应触发标记
  queryObj: null, // 用于列表页面 传到详情页面
  backObj: null, // 用于详情页面 传到列表页面
  gCloudId: window.localStorage.gCloudId, // 用于记住配置页面的云id
  gDeployMode: window.localStorage.gDeployMode, // 用于标记云模式
  gCloudType: window.localStorage.gCloudType, // 用于标记标准云、微视云
  isNeedPassword: false, // 重要操作是否需要输入密码
  reloadAnyway: true, // 点击菜单后无论路由是否相同都重新加载
  headerHeight: 45, // 导航栏高度
  skinColor: '' // 皮肤颜色
}
