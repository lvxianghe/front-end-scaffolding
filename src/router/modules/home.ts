import { RouteRecordRaw } from 'vue-router'

const homeRoutes: RouteRecordRaw = {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
        // 可以添加一些元信息，如是否需要身份验证
        requiresAuth: false
    }
};

export default homeRoutes
