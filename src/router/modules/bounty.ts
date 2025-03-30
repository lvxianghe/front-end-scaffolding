import { RouteRecordRaw } from 'vue-router';

const bountyRoutes: RouteRecordRaw = {
  path: '/bounty',
  name: 'Bounty',
  component: () => import('@/views/bounty/index.vue'),
  meta: {
    title: '悬赏金',
    icon: 'Money',
    requiresAuth: true // 需要认证才能访问
  }
};

export default bountyRoutes; 