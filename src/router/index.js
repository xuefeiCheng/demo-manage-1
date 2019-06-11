import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import Cookies from 'js-cookie'
import sessionStore from '../utils/sessionStore'
import store from '@/store/index' // 引入全局store

// 导入路由模块
Vue.use(Router)

const initialRouteMap = [
  { path: '/login', component: () => import('@/view/loginPage/Login') },
  {
    path: '/error',
    redirect: '/error/p404',
    name: 'view',
    component: {
      render (c) { return c('router-view') }
    },
    children: [{ path: '404', name: 'Page404', component: () => import('@/view/errorPages/Page404') },
      { path: '500', name: 'Page500', component: () => import('@/view/errorPages/Page500') }
    ]
  }
]

const router = new Router({
  routes: initialRouteMap
})
// 静态目录
const token = 'b0e5021e-8a4e-45cb-bb41-0a0b6b65090b'
const menusData = [
  {
    menuId: 'home',
    menuName: '首页'
  },
  {
    menuId: 'ManageOne',
    menuName: '宣传提醒'
  },
  {
    menuId: 'ManageTwo',
    menuName: '查询统计'
  },
  {
    menuId: 'homePage',
    menuName: '首页',
    parentMenu: 'home'
  },
  {
    menuId: 'adv',
    menuName: '定向宣传',
    parentMenu: 'ManageOne'
  },
  {
    menuId: 'casePhone',
    menuName: '案件收集',
    parentMenu: 'ManageOne'
  },
  {
    menuId: 'phone',
    menuName: '疑似号码查询',
    parentMenu: 'ManageTwo'
  },
  {
    menuId: 'remaind',
    menuName: '提醒记录查询',
    parentMenu: 'ManageTwo'
  },
  {
    menuId: 'statistics',
    menuName: '统计报表',
    parentMenu: 'ManageTwo'
  }
]
const name = 'admin'
Cookies.set('Admin-Token', token)
store.commit('SET_TOKEN', token)
store.commit('SET_MENUS', menusData)
sessionStore.setItemData('menus', menusData)
store.commit('SET_NAME', name)
Cookies.set('user-name', name)

// 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

// 全局路由开始守卫
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.getters.token && store.getters.menus) { // 已登录并且菜单已生成
    if (store.getters.addRouterMap.length === 0) { // 尚未生成一级菜单
      // 根据路由树生成路由、一级菜单
      store.dispatch('generateAddRouterMapAndMenu', store.getters.menus).then(() => {
        // 由于添加的路由表是异步的，在没有填进去之前是重新路由
        router.addRoutes([{path: '/', redirect: store.getters.addRouterMap[0].path}])
        router.addRoutes(store.getters.addRouterMap)
        router.addRoutes([{ path: '*', redirect: '/error/404' }])
        next({ ...to, replace: true })
      })
    } else { // 已经生成二级菜单
      // 登录进来之后进入添加路由的第一路由或者已经登录成功之后
      if (to.fullPath === '/' || to.fullPath === '/login') {
        next(store.getters.addRouterMap[0].path)
      } else {
        store.dispatch('generateCurrentSiderMenus', to)
        next()
      }
    }
  } else { // 未登录
    if (to.path === '/login') {
      next()
    } else {
      // 走登录页面登录
      next('/login')
    }
    NProgress.done()
  }
})

// 全局路由结束守卫
router.afterEach(() => {
  NProgress.done()
})

export default router
