import Layout from '@/view/layout/Layout'
const wuyeRouter = {
  path: '/wuye',
  component: Layout,
  alwaysShow: true,
  redirect: '/wuye/wuye-list',
  name:'wuye',
  title: 'title',
  children: [
    {
      path: 'wuye-list',
      component: () => import('@/view/wuye/wuye-list'),
      meta: {
        title: '物业列表'
      }
    },
    {
      path: 'wuye-zhanghu',
      component: () => import('@/view/wuye/wuye-zhanghu'),
      meta: {
        title: '物业账户'
      }
    },
    {
      path: 'wuye-role',
      component: () => import('@/view/wuye/wuye-role'),
      meta: {
        title: '物业角色'
      }
    },
    {
      path: 'wuye-menu',
      component: () => import('@/view/wuye/wuye-menu'),
      meta: {
        title: '物业菜单'
      }
    },
    {
      path: 'wuye-list/wuye-renyuan',
      component: () => import('@/view/wuye/wuye-renyuan'),
      meta: {
        title: '物业人员'
      }
    },
  ]
}
export default wuyeRouter
