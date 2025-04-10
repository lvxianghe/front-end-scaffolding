import { RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import mainRoutes from './modules/main'
import loginRouter from './modules/login'
import homeRoutes from './modules/home'
import digitalRainRoutes from './modules/digital-rain'
// import registerRouter from './modules/register'
import solarSystemRoutes from './modules/solar-system'
import forbiddenCityRoutes from './modules/forbidden-city'
import knowledgeGraphRoutes from './modules/knowledge-graph'
import leaderboardRoutes from './modules/leaderboard'
import bountyRoutes from './modules/bounty'
import dragDropRoutes from './modules/drag-drop'

// 配置路由
// const routes: Array<RouteRecordRaw> = [
//     {
//         path: '/',
//         name: 'home',
//         component: () => import('../views//home/index.vue'),
//         meta: {},
//         children: [],
//     },
// ];

export const aboutRouter = {
    path: '/about',
    name: 'about',
    component: () => import('@/views/about/index.vue'),
    meta: {},
    children: [],
} as RouteRecordRaw;

// 组合路由信息
// import.meta.glob 为 vite 提供的特殊导入方式
// 它可以将模块中全部内容导入并返回一个Record对象
// 默认为懒加载模式 加入配置项 eager 取消懒加载
const modules: Record<string, any> = import.meta.glob(['./modules/*.ts'], {
    eager: true,
});
// 配置路由
const routes: Array<RouteRecordRaw> = [
  // 不使用布局组件，直接列出所有路由
  {
    path: '/',
    redirect: '/login'
  },
  // 添加home路由
  homeRoutes
];

// 添加登录路由
routes.push(loginRouter);

// 注册路由
routes.push({
  path: '/register',
  name: 'Register',
  component: () => import('@/views/login/index.vue'),
  props: { isRegister: true }
});

// 将各模块路由添加到主路由数组中
// 处理mainRoutes（可能是数组）
if (Array.isArray(mainRoutes)) {
  routes.push(...mainRoutes);
} else {
  routes.push(mainRoutes);
}

// 确保导入的路由模块都存在
const ensureDragDropRoutes = typeof dragDropRoutes === 'undefined' ? null : dragDropRoutes;

// 处理其他模块路由
[digitalRainRoutes, solarSystemRoutes, forbiddenCityRoutes, knowledgeGraphRoutes, leaderboardRoutes, bountyRoutes, ensureDragDropRoutes].forEach(moduleRoutes => {
  if (moduleRoutes) {
    if (Array.isArray(moduleRoutes)) {
      routes.push(...moduleRoutes);
    } else {
      routes.push(moduleRoutes);
    }
  }
});

// 添加关于页面路由
routes.push(aboutRouter);

// 客户画像模块路由
routes.push({
  path: '/customer-profile',
  name: 'CustomerProfile',
  component: () => import('@/views/customer-profile/index.vue'),
  meta: {
    title: '客户画像',
    requiresAuth: true
  }
});

// 抽奖模块路由
routes.push({
  path: '/lucky-draw',
  name: 'LuckyDraw',
  component: () => import('@/views/lucky-draw/index.vue'),
  meta: {
    title: '幸运抽奖',
    requiresAuth: false
  }
});

// 小型博美模块路由
routes.push({
  path: '/pomeranian',
  name: 'Pomeranian',
  component: () => import('@/views/pomeranian/index.vue'),
  meta: {
    title: '小型博美',
    requiresAuth: false
  }
});

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
      // 始终滚动到顶部
      return { top: 0 }
    },
});
router.beforeEach(async (to, from, next) => {
    NProgress.start();
    
    try {
        // 获取用户角色
        const userRole = localStorage.getItem('userRole');
        
        // 如果是需要认证的页面，但用户未登录或是游客，则重定向到登录页面
        if (to.meta.requiresAuth && (!userRole || userRole === 'guest')) {
            next({ path: '/login' });
        } else {
            next();
        }
    } catch (error) {
        console.error('路由导航出错:', error);
        next();
    }
});
router.afterEach((_to) => {
    try {
        NProgress.done();
    } catch (error) {
        console.error('路由afterEach处理出错:', error);
    }
});
export default router;
