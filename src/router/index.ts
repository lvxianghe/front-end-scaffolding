import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/english',
    name: 'English',
    component: () => import('@/views/english/index.vue'),
    meta: {
      title: '英语学习',
      requiresAuth: false
    }
  },
  {
    path: '/wealth',
    name: 'Wealth',
    component: () => import('@/views/wealth/index.vue'),
    meta: {
      title: '财富管理',
      requiresAuth: false
    }
  },
  {
    path: '/agent',
    name: 'Agent',
    component: () => import('@/views/agent/index.vue'),
    meta: {
      title: 'AI助手',
      requiresAuth: false
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 吕相赫的前端世界`;
  }
  next();
});

export default router;