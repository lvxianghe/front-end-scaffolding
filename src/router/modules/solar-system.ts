import { RouteRecordRaw } from 'vue-router';

const solarSystemRoutes: RouteRecordRaw = {
  path: '/solar-system',
  name: 'SolarSystem',
  component: () => import('@/views/solar-system/index.vue'),
  meta: {
    title: '太阳系模拟',
    icon: 'Connection',
    requiresAuth: false
  }
};

export default solarSystemRoutes; 