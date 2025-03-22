import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import mainRoutes from './modules/main'
import loginRouter from './modules/login'
import homeRoutes from './modules/home'

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
  {
    path: '/',
    redirect: '/login'
  },
  loginRouter,
  homeRoutes,
  ...mainRoutes
];
routes.push(aboutRouter);
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
router.beforeEach(async (to, from, next) => {
    NProgress.start();
    
    // 获取用户角色
    const userRole = localStorage.getItem('userRole');
    
    // 如果是需要认证的页面，但用户是游客，则重定向到允许游客访问的页面
    if (to.meta.requiresAuth && userRole === 'guest') {
        next({ path: '/home' });
    } else {
        next();
    }
});
router.afterEach((_to) => {
    NProgress.done();
});
export default router;
