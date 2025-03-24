<template>
  <!-- 一般vue项目都会使用vue-router -->
  <!-- 所以我们这里直接写一个 router-view -->
  <div id="app">
    <!-- 页面内容 -->
    <main class="app-content" :class="{ 'no-header': route.path.includes('/login') || route.path.includes('/register') || route.path === '/home' || route.path === '/' || route.path === '/digital-rain' }">
      <router-view />
    </main>
    
    <!-- 根据路由条件显示导航栏 -->
    <grid-nav v-if="shouldShowNav" class="app-main-nav" />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { ref, computed, watch } from 'vue'
// 导入需要的图标
import { HomeFilled, Promotion, ChatDotRound, Message, VideoPlay, Setting, Search } from '@element-plus/icons-vue'
import GridNav from '@/components/GridNav.vue'
// 不要导入GlobalGridNav

const router = useRouter()
const route = useRoute()

// 计算属性：根据当前路由决定是否显示导航栏
const shouldShowNav = computed(() => {
  // 在这些页面不显示导航栏
  const hideNavRoutes = ['/login', '/register', '/home', '/', '/digital-rain']
  return !hideNavRoutes.includes(route.path)
})

// 跳转到首页的方法
const goToHome = () => {
  router.push('/home')
}

// 导航到指定页面
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style lang="less" scoped>
.app-container {
  /* ... 现有样式 ... */
  
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    height: 60px;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    
    .header-left {
      padding: 0 20px;
      
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
    
    .nav-menu {
      display: flex;
      height: 100%;
      
      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        height: 100%;
        min-width: 100px;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        color: #606266;
        
        .el-icon {
          font-size: 24px;
          margin-bottom: 4px;
        }
        
        span {
          font-size: 14px;
        }
        
        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        &.active {
          color: #fff;
        }
        
        &.home {
          background: linear-gradient(135deg, #4B6EFF 0%, #2CD9FF 100%);
          &.active, &:hover {
            background: linear-gradient(135deg, #4B6EFF 0%, #2CD9FF 100%);
          }
        }
        
        &.redbook {
          background: linear-gradient(135deg, #FF4A6B 0%, #FF7CAD 100%);
          &.active, &:hover {
            background: linear-gradient(135deg, #FF4A6B 0%, #FF7CAD 100%);
          }
        }
        
        &.chatgpt {
          background: #2C3E50;
          &.active, &:hover {
            background: #2C3E50;
          }
        }
        
        &.wechat {
          background: #07C160;
          &.active, &:hover {
            background: #07C160;
          }
        }
        
        &.douyin {
          background: #333333;
          &.active, &:hover {
            background: #333333;
          }
        }
        
        &.admin {
          background: linear-gradient(135deg, #4B6EFF 0%, #2CD9FF 100%);
          &.active, &:hover {
            background: linear-gradient(135deg, #4B6EFF 0%, #2CD9FF 100%);
          }
        }
        
        &.search {
          background: linear-gradient(135deg, #13C2C2 0%, #5CDEDE 100%);
          &.active, &:hover {
            background: linear-gradient(135deg, #13C2C2 0%, #5CDEDE 100%);
          }
        }
      }
    }
    
    .header-right {
      padding: 0 20px;
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