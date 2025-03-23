<template>
  <!-- 一般vue项目都会使用vue-router -->
  <!-- 所以我们这里直接写一个 router-view -->
  <div class="app-container">
    <!-- 顶部导航栏 - 在非登录页面和非首页显示 -->
    <header v-if="!route.path.includes('/login') && route.path !== '/home'" class="app-header">
      <div class="header-left">
        <!-- 添加首页链接 - 在非home页面显示 -->
        <div v-if="route.path !== '/home'" class="home-link" @click="goToHome">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </div>
      </div>
      
      <!-- 现有的顶部内容 -->
      <div class="header-center">
        <!-- ... 现有内容 ... -->
      </div>
      
      <div class="header-right">
        <!-- ... 现有内容 ... -->
      </div>
    </header>
    
    <!-- 页面内容 -->
    <main class="app-content" :class="{ 'no-header': route.path.includes('/login') || route.path === '/home' }">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
// 导入需要的图标
import { HomeFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 跳转到首页的方法
const goToHome = () => {
  router.push('/home')
}
</script>

<style lang="less" scoped>
.app-container {
  /* ... 现有样式 ... */
  
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 60px;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    
    .home-link {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #6C7BFF;
      font-weight: 500;
      
      .el-icon {
        margin-right: 5px;
      }
      
      &:hover {
        color: #2CD9FF;
      }
    }
  }
  
  .app-content {
    /* ... 现有样式 ... */
    
    &.no-header {
      /* 当没有顶部导航栏时，调整内容区域样式 */
      padding-top: 0;
      height: 100vh; /* 使内容区域占满整个视口高度 */
    }
  }
}
</style>