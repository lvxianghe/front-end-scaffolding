import { RouteRecordRaw } from 'vue-router'

const loginRouter: RouteRecordRaw = {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {},
    children: [],
};

export default loginRouter
