/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 基础API配置
  readonly VITE_APP_API_BASEURL: string;
  readonly VITE_APP_USE_MOCK: string;
  readonly VITE_APP_MOCK_BASEURL: string;

  // 应用配置
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;

  // 第三方服务配置
  readonly VITE_APP_AI_API_URL: string;

  // 其他环境配置
  readonly VITE_APP_BUILD_TIME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Vue组件类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 静态资源类型声明
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}