import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/redbook',
    name: 'redbook',
    component: () => import('@/views/redbook/index.vue')
  },
  {
    path: '/chatgpt',
    name: 'chatgpt',
    component: () => import('@/views/chatgpt/index.vue')
  },
  {
    path: '/wechat',
    name: 'wechat',
    component: () => import('@/views/wechat/index.vue')
  },
  {
    path: '/douyin',
    name: 'douyin',
    component: () => import('@/views/douyin/index.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/index.vue')
  }
]

export default routes 