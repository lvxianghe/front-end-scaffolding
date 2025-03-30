<template>
  <div class="grid-nav" :class="{ 'collapsed': isCollapsed }">
    <div class="toggle-btn" @click="toggleCollapse">
      <el-icon :class="{ 'rotate': isCollapsed }">
        <ArrowUp />
      </el-icon>
    </div>
    
    <div class="nav-container">
      <div v-if="route.path !== '/home'" class="nav-item home" @click="goToHome">
        <div class="content">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </div>
      </div>
      
      <div class="nav-item redbook" @click="handleModuleClick('redbook')">
        <div class="content">
          <el-icon><Promotion /></el-icon>
          <span>大红书</span>
          <div class="description">分享生活，发现美</div>
        </div>
      </div>

      <div class="nav-item chatgpt" @click="handleModuleClick('chatgpt')">
        <div class="content">
          <el-icon><ChatDotRound /></el-icon>
          <span>ChatGPT</span>
        </div>
      </div>

      <div class="nav-item wechat" @click="handleModuleClick('wechat')">
        <div class="content">
          <el-icon><Message /></el-icon>
          <span>微信</span>
        </div>
      </div>

      <div class="nav-item douyin" @click="handleModuleClick('douyin')">
        <div class="content">
          <el-icon><VideoPlay /></el-icon>
          <span>抖音</span>
        </div>
      </div>

      <div class="nav-item admin" @click="handleModuleClick('admin')">
        <div class="content">
          <el-icon><Setting /></el-icon>
          <span>管理中心</span>
        </div>
      </div>

      <div class="nav-item google" @click="handleModuleClick('google')">
        <div class="content">
          <el-icon><Search /></el-icon>
          <span>搜索引擎</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HomeFilled, Promotion, ChatDotRound, Message, VideoPlay, Setting, Search } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const isCollapsed = ref(false)

// 添加调试输出
onMounted(() => {
  console.log('GridNav mounted, route path:', route.path)
})

// 监听路由变化
watch(() => route.path, (newPath) => {
  console.log('Route changed to:', newPath)
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleModuleClick = (module: string) => {
  const targetPath = `/${module}`
  if (route.path === targetPath) return
  router.push(targetPath)
}

const goToHome = () => {
  router.push('/home')
}
</script>

<style lang="less" scoped>
.grid-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2001;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 12px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .nav-container {
    display: flex;
    gap: 12px;
    max-width: 1400px;
    margin: 0 auto;
    height: 100%;
    
    .nav-item {
      flex: 1;
      min-width: 110px; /* 设置最小宽度 */
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
      height: 100%;
      
      &.home {
        background: linear-gradient(135deg, #6C7BFF 0%, #2CD9FF 100%);
      }
      
      &.redbook {
        background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
      }
      
      &.chatgpt {
        background: linear-gradient(135deg, #2f3542 0%, #57606f 100%);
      }
      
      &.wechat {
        background: linear-gradient(135deg, #4cd137 0%, #7bed9f 100%);
      }
      
      &.douyin {
        background: linear-gradient(135deg, #1e272e 0%, #485460 100%);
      }
      
      &.admin {
        background: linear-gradient(135deg, #3498db 0%, #5352ed 100%);
      }

      &.google {
        background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
      }

      .content {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        
        .el-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        span {
          font-size: 14px;
          font-weight: 500;
        }
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }

  .toggle-btn {
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    width: 48px;
    height: 24px;
    background: white;
    border-radius: 0 0 24px 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;

    .el-icon {
      font-size: 16px;
      transition: all 0.3s;
      color: #666;
      
      &.rotate {
        transform: rotate(180deg);
      }
    }

    &:hover {
      background: #f5f5f5;
    }
  }

  &.collapsed {
    transform: translateY(-100%);

    .toggle-btn {
      transform: translate(-50%, 100%);
    }
  }
}

// 添加媒体查询以确保在较小屏幕上导航项也有合理宽度
@media (max-width: 1200px) {
  .grid-nav .nav-container .nav-item {
    min-width: 90px;
  }
}

@media (max-width: 900px) {
  .grid-nav .nav-container {
    flex-wrap: wrap;
    
    .nav-item {
      min-width: 80px;
      flex-basis: calc(25% - 12px);
    }
  }
}
</style> 