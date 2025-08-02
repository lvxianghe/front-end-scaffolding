import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// 全局样式
import 'element-plus/dist/index.css';
import '@/assets/styles/index.css'; // 你的全局样式文件

// 创建Vue应用实例
const app = createApp(App);

// 创建Pinia状态管理
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 注册插件
app.use(router);
app.use(pinia);

// 挂载应用
app.mount('#app');