import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('@/views/leaderboard/index.vue'),
    meta: {
      title: '营销绩效排行榜',
      icon: 'TrophyBase',
      keepAlive: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/index.vue'),
    meta: {
      title: '个人主页',
      icon: 'User',
      keepAlive: true,
      hide: true // 在导航菜单中隐藏
    }
  }
]

export default routes 