/**
 * 项目基础配置文件
 */
const baseContext = ''
export default {
  sysName: baseContext,
  sysPath: process.env.NODE_ENV !== 'development' ? `/${baseContext}` : '',
  urlPrefix: '/hik',
  apiPrefix: '/api',
  userInfo: {
    'languageId': 'zh_CN',
    'skin': 'blue',
    'breadcrumb': {
      '002': [{
        'title': 'menu.demo',
        'router': '/hik/demo'
      }]
    }
  }
}
