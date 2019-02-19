/*
 * @Author: xiangxiao3
 * @项目路由
 * @Date: 2017-11-23 16:28:21
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-14 17:38:36
 */
import Vue from 'vue'
import Router from 'vue-router'

import routes from '../router.config.json'
import configure from '../config/dolphin.config'

Vue.use(Router)

const Login = resolve => require(['index@/pages/login'], resolve)
const initPass = resolve => require(['index@/pages/initPass'], resolve)
const Home = resolve => require(['index@/pages/home'], resolve)
const SvgViewer = resolve => require(['index@/pages/svgViewer'], resolve)

const createRoute = (routes) => {
  return routes.reduce((processedRoutes, currentRoute) => {
    processedRoutes.push(processRouteObj(currentRoute))
    return processedRoutes
  }, [])
}

/**
 * 路由统一转换方法
 * 面包削做了一次合并
 * @param {*} param0
 */
const processRouteObj = ({ menuCode, breadcrumb, children, component, ...args }) => {
  return Object.assign({
    meta: { menuCode },
    props: {
      breadcrumbObj: {
        content: breadcrumb || [],
        menuCode: menuCode
      }
    },
    component: () => import(`@/pages/${component}`),
    children: children ? createRoute(children) : []
  }, args)
}

const { urlPrefix } = configure

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: urlPrefix
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: `${urlPrefix}/initPass`,
      component: initPass
    },
    {
      path: urlPrefix,
      component: Home,
      children: createRoute(routes)
    },
    {
      path: `${urlPrefix}/svg`,
      component: SvgViewer
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  // if (to.path === '/login' || to.path === '/hik/initPass' || store.state.accessToken) {
  //   next()
  // } else {
  //   next({
  //     path: '/login'
  //   })
  // }
  next()
})

export default router
