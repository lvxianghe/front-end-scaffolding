import { RouteRecordRaw } from 'vue-router';

const digitalRainRoutes: RouteRecordRaw = {
  path: '/digital-rain',
  name: 'DigitalRain',
  component: () => import('@/views/digital-rain/index.vue'),
  meta: {
    title: '数字雨效果',
    icon: 'Connection',
    requiresAuth: false
  }
};

export default digitalRainRoutes; 