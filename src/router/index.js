import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/view/layout/Layout'
import managerRouter from './modules/manager'
import DB from '@/view/DB0';
import nav from '@/view/nav'
import shopRouter from './modules/shop'
import orderRouter from './modules/order'
import wuyeRouter from './modules/wuye'
import infoRouter from './modules/info'
import userRouter from './modules/user'
import baseRouter from './modules/base'
import communityRouter from './modules/community'
import banshichuRouter from './modules/banshichu'
import shenghuoRouter from './modules/shenghuo'
import renwuRouter from './modules/renwu'
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/view/login/index'),
    hidden: true,
    meta: {
      title: '叮当优家管理系统'
    }
  }, 
   
  {
    path: '/',
    component:Layout,
    hidden: true,
    children: [
      {
        path: 'console',
        component: () => import('@/view/console'),
        meta: {
          title: '欢迎'
        }
      },
    ]
  },
  {
    path: '/redis',
    component: Layout,
    children: [
      {
        path: '',
        component: nav,
        children:[
          {
            path: 'DB:id',
            component:DB,
            meta: { title: 'DB'}
          },
          {
            path: 'index',
            component: () => import('@/view/index'),
            meta: { title: '控制台'}
          },
        ]
      },
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/view/errorPage/401'),
        name: 'Page401',
        meta: { title: '401',}
      },
      {
        path: '404',
        component: () => import('@/view/errorPage/404'),
        name: 'Page404',
        meta: { title: '404'}
      }
    ]
  },
  managerRouter,
  orderRouter,
  shopRouter,
  wuyeRouter,
  infoRouter,
  userRouter,
  baseRouter,
  communityRouter,
  banshichuRouter,
  shenghuoRouter,
  renwuRouter
]
const router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  to.meta.keepAlive = false;
  next()
})

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
export default router