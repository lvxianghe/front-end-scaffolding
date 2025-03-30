import { RouteRecordRaw } from 'vue-router';

const forbiddenCityRoutes: RouteRecordRaw = {
  path: '/forbidden-city',
  name: 'ForbiddenCity',
  component: () => import('@/views/forbidden-city/index.vue'),
  meta: {
    title: '故宫模拟',
    icon: 'Connection',
    requiresAuth: false
  }
};

export default forbiddenCityRoutes; 