import Layout from '@/view/layout/Layout'
const infoRouter = {
  path: '/info',
  component: Layout,
  alwaysShow: true,
  redirect: '/info/info-list',
  name:'info',
  title: 'title',
  children: [
    {
      path: 'info-list',
      component: () => import('@/view/info/info-list'),
      meta: {
        title: '通知列表'
      }
    },
    {
      path: 'notice-list',
      component: () => import('@/view/info/notice-list'),
      meta: {
        title: '默认新闻'
      }
    },
    {
      path: 'notice-list/add-notice',
      component: () => import('@/view/info/add-notice'),
      meta: {
        title: '默认新闻'
      }
    },
    {
      path: 'info-detault',
      component: () => import('@/view/info/info-detault'),
      meta: {
        title: '默认通知'
      }
    },
    {
      path: 'info-detault/add-info-detault',
      component: () => import('@/view/info/add-info-detault'),
      meta: {
        title: '默认通知'
      }
    },
    {
      path: 'info-advise',
      component: () => import('@/view/info/info-advise'),
      meta: {
        title: '投诉建议'
      }
    },
  ]
}
export default infoRouter
