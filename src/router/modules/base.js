

import Layout from '@/view/layout/Layout'
const baseRouter = {
  path: '/base',
  component: Layout,
  alwaysShow: true,
  redirect: '/base/banner-list',
  name:'base',
  title: 'title',
  children: [
    {
      path: 'jifen',
      component: () => import('@/view/base/jifen'),
      meta: {
        title: '积分配置'
      }
    },
    {
      path: 'zhifu',
      component: () => import('@/view/base/zhifu'),
      meta: {
        title: '商城支付配置'
      }
    },
    {
      path: 'banner-list',
      component: () => import('@/view/base/banner-list'),
      meta: {
        title: '轮播(商城)'
      }
    },
    {
      path: 'banshichu-banner',
      component: () => import('@/view/base/banshichu-banner'),
      meta: {
        title: '轮播(办事处)'
      }
    },
    {
      path: 'navconfig',
      component: () => import('@/view/base/navconfig'),
      meta: {
        title: '总栏目(商城)'
      }
    },
    {
      path: 'meiju',
      component: () => import('@/view/base/meiju'),
      meta: {
        title: '枚举配置'
      }
    },
    {
      path: 'ads',
      component: () => import('@/view/base/ads'),
      meta: {
        title: '广告位(商城)'
      }
    },
    {
      path: 'index-nav',
      component: () => import('@/view/base/index-nav'),
      meta: {
        title: '首页导航(商城)'
      }
    },
    {
      path: 'index-nav-mofang',
      component: () => import('@/view/base/index-nav-mofang'),
      meta: {
        title: '首页导航(魔方)'
      }
    },
    {
      path: 'navconfig-mofang',
      component: () => import('@/view/base/navconfig-mofang'),
      meta: {
        title: '总栏目(魔方)'
      }
    },
    {
      path: 'navconfig-banshi',
      component: () => import('@/view/base/navconfig-banshi'),
      meta: {
        title: '总栏目(办事处)'
      }
    },
    {
      path: 'navconfig-wuye',
      component: () => import('@/view/base/navconfig-wuye'),
      meta: {
        title: '总栏目(物业)'
      }
    },
    {
      path: 'ads-banshi',
      component: () => import('@/view/base/ads-banshi'),
      meta: {
        title: '广告位(办事处)'
      }
    },
    {
      path: 'shuoming',
      component: () => import('@/view/base/shuoming'),
      meta: {
        title: '系统说明'
      }
    },
    {
      path: 'share',
      component: () => import('@/view/base/share'),
      meta: {
        title: '微信分享'
      }
    },
    {
      path: 'base-role',
      component: () => import('@/view/base/base-role'),
      meta: {
        title: '小程序角色管理'
      }
    },
    {
      path: 'base-menu',
      component: () => import('@/view/base/base-menu'),
      meta: {
        title: '小程序菜单管理'
      }
    },
  ]
}
export default baseRouter
