import Layout from '@/view/layout/Layout'
const shenghuoRouter = {
  path: '/shenghuo',
  component: Layout,
  alwaysShow: true,
  redirect: '/shenghuo/shenghuo-list',
  name:'shenghuo',
  title: 'title',
  children: [
    {
      path: 'shenghuo-list',
      component: () => import('@/view/shenghuo/news-list'),
      meta: {
        title: '信息列表'
      }
    },
    {
      path: 'shenghuo-list/add-new',
      component: () => import('@/view/shenghuo/add-new'),
      meta: {
        title: '默认新闻'
      }
    },
  ]
}
export default shenghuoRouter
