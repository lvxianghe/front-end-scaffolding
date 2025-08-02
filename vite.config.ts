import { defineConfig, loadEnv } from 'vite';
import type { UserConfig, ConfigEnv } from 'vite';
import { fileURLToPath } from 'url';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// 依赖引入
import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";
import ElementPlus from "unplugin-element-plus/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
    // 获取当前工作目录
    const root = process.cwd();
    // 获取环境变量
    const env = loadEnv(mode, root);

    return {
        // 项目根目录
        root,
        // 项目部署的基础路径
        base: '/',
        publicDir: fileURLToPath(new URL('./public', import.meta.url)),
        assetsInclude: fileURLToPath(new URL('./src/assets', import.meta.url)),

        plugins: [
            // Vue模板文件编译插件
            vue(),
            // jsx文件编译插件
            vueJsx(),
            // 开启mock服务器
            viteMockServe({
                mockPath: 'mock',
                localEnabled: mode === 'development',
                prodEnabled: false,
            }),
            // 开启ElementPlus自动引入CSS
            ElementPlus({}),
            // 自动引入组件及ICON
            AutoImport({
                resolvers: [IconsResolver(), ElementPlusResolver()],
                dts: fileURLToPath(new URL("./src/types/auto-imports.d.ts", import.meta.url)),
            }),
            // 自动注册组件
            Components({
                resolvers: [IconsResolver(), ElementPlusResolver()],
                dts: fileURLToPath(new URL("./src/types/components.d.ts", import.meta.url)),
            }),
            // 自动安装图标
            Icons({
                autoInstall: true,
            }),
        ],

        // 开发服务器配置
        server: {
            host: true,
            port: 7777,
            open: false,
            cors: true,
            // 根据需要配置代理
            proxy: {
                '/api': {
                    target: env.VITE_APP_API_BASEURL || 'http://localhost:28922',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                }
            },
        },

        // 打包配置
        build: {
            sourcemap: false,
            chunkSizeWarningLimit: 400,
            rollupOptions: {
                input: {
                    index: fileURLToPath(new URL('./index.html', import.meta.url)),
                },
                output: {
                    format: 'esm',
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                },
            },
        },

        // 配置别名
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '#': fileURLToPath(new URL('./src/types', import.meta.url)),
            },
        },
    };
});