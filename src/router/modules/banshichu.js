import Layout from '@/view/layout/Layout'
const banshichuRouter = {
  path: '/banshichu',
  component: Layout,
  alwaysShow: true,
  redirect: '/banshichu/banshichu-list',
  name:'banshichu',
  title: 'title',
  children: [
    {
      path: 'banshichu-list',
      component: () => import('@/view/banshichu/banshichu-list'),
      meta: {
        title: '街道办列表'
      }
    },
    {
      path: 'banshichu-zhanghu',
      component: () => import('@/view/banshichu/banshichu-zhanghu'),
      meta: {
        title: '街道办账户'
      }
    },
    {
      path: 'banshichu-role',
      component: () => import('@/view/banshichu/banshichu-role'),
      meta: {
        title: '街道办角色'
      }
    },
    {
      path: 'banshichu-menu',
      component: () => import('@/view/banshichu/banshichu-menu'),
      meta: {
        title: '街道办菜单'
      }
    },
    {
      path: 'banshichu-list/banner-list-banshi',
      component: () => import('@/view/banshichu/banner-list-banshi'),
      meta: {
        title: '轮播(街道办)'
      }
    },
    {
      path: 'banshichu-list/ads-list-banshi',
      component: () => import('@/view/banshichu/ads-list-banshi'),
      meta: {
        title: '广告位(街道办)'
      }
    },
    {
      path: 'banshichu-list/news-list',
      component: () => import('@/view/banshichu/news/news-list'),
      meta: {
        title: '新闻列表'
      }
    },
    {
      path: 'banshichu-list/add-new',
      component: () => import('@/view/banshichu/news/add-new'),
      meta: {
        title: '新闻增改'
      }
    },   {
      path: 'banshichu-list/notice-list',
      component: () => import('@/view/banshichu/notice/notice-list'),
      meta: {
        title: '公告列表'
      }
    },
    {
      path: 'banshichu-list/add-notice',
      component: () => import('@/view/banshichu/notice/add-notice'),
      meta: {
        title: '公告增改'
      }
    },
    {
      path: 'banshichu-list/advise',
      component: () => import('@/view/banshichu/service/advise'),
      meta: {
        title: '意见反馈'
      }
    },
    {
      path: 'banshichu-list/huifu',
      component: () => import('@/view/banshichu/service/huifu'),
      meta: {
        title: '反馈详情'
      }
    },
    {
      path: 'banshichu-list/activity-list',
      component: () => import('@/view/banshichu/activity/activity-list'),
      meta: {
        title: '活动列表'
      }
    },
    {
      path: 'banshichu-list/add-activity',
      component: () => import('@/view/banshichu/activity/add-activity'),
      meta: {
        title: '活动增改增改'
      }
    },
    {
      path: 'banshichu-list/activity-renyuan',
      component: () => import('@/view/banshichu/activity/activity-renyuan'),
      meta: {
        title: '活动参与人员'
      }
    },
    {
      path: 'banshichu-list/range-list',
      component: () => import('@/view/banshichu/range/range-list'),
      meta: {
        title: '排行榜列表'
      }
    },
  ]
}
export default banshichuRouter
