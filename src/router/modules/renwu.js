

import Layout from '@/view/layout/Layout'
const renwuRouter = {
  path: '/renwu',
  component: Layout,
  alwaysShow: true,
  redirect: '/renwu/qiandao',
  name:'renwu',
  title: 'title',
  children: [
    {
      path: 'qiandao',
      component: () => import('@/view/renwu/qiandao'),
      meta: {
        title: '签到管理'
      }
    },
  ]
}
export default renwuRouter
