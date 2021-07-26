

import Layout from '@/view/layout/Layout'
const orderRouter = {
  path: '/order',
  component: Layout,
  alwaysShow: true,
  redirect: '/order/order-list',
  name:'order',
  title: 'title',
  children: [
    {
      path: 'order-list',
      component: () => import('@/view/order/order-list'),
      meta: {
        title: '订单列表'
      }
    },
    {
      path: 'postgood',
      component: () => import('@/view/order/postgood'),
      meta: {
        title: '物流管理'
      }
    },
  ]
}
export default orderRouter
