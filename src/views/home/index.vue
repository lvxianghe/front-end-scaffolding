<template>
  <div class="home-container">
    <div class="grid-layout">
      <!-- 大红书模块 -->
      <div class="grid-item redbook" @click="handleModuleClick('redbook')">
        <div class="content">
          <el-icon><Promotion /></el-icon>
          <span>大红书</span>
          <div class="description">分享生活，发现美</div>
        </div>
      </div>

      <!-- ChatGPT模块 -->
      <div class="grid-item chatgpt" @click="handleModuleClick('chatgpt')">
        <div class="content">
          <el-icon><ChatDotRound /></el-icon>
          <span>ChatGPT</span>
        </div>
      </div>

      <!-- 微信模块 -->
      <div class="grid-item wechat" @click="handleModuleClick('wechat')">
        <div class="content">
          <el-icon><Message /></el-icon>
          <span>微信</span>
        </div>
      </div>

      <!-- 抖音模块 -->
      <div class="grid-item douyin" @click="handleModuleClick('douyin')">
        <div class="content">
          <el-icon><VideoPlay /></el-icon>
          <span>抖音</span>
        </div>
      </div>

      <!-- 管理模块 -->
      <div class="grid-item admin" @click="handleModuleClick('admin')">
        <div class="content">
          <el-icon><Setting /></el-icon>
          <span>管理中心</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 20px;

  .grid-layout {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 200px);
    gap: 20px;
    max-width: 1400px;
    margin: 0 auto;

    .grid-item {
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.1);
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

        &::before {
          opacity: 1;
        }
      }

      &:active {
        transform: scale(0.98);
      }

      .content {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        
        .el-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        span {
          font-size: 20px;
          font-weight: 500;
        }

        .description {
          font-size: 14px;
          opacity: 0.8;
          margin-top: 8px;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s;
        }
      }

      &:hover {
        .description {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }

    // 大红书模块 - 占据2x2的格子
    .redbook {
      grid-column: 1 / 3;
      grid-row: 1 / 3;
      background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
    }

    // ChatGPT模块 - 占据2x1的格子
    .chatgpt {
      grid-column: 3 / 5;
      grid-row: 1 / 2;
      background: linear-gradient(135deg, #2f3542 0%, #57606f 100%);
    }

    // 微信模块
    .wechat {
      grid-column: 3 / 4;
      grid-row: 2 / 3;
      background: linear-gradient(135deg, #4cd137 0%, #7bed9f 100%);
    }

    // 抖音模块
    .douyin {
      grid-column: 4 / 5;
      grid-row: 2 / 3;
      background: linear-gradient(135deg, #1e272e 0%, #485460 100%);
    }

    // 管理模块 - 占据4x1的格子
    .admin {
      grid-column: 1 / 5;
      grid-row: 3 / 4;
      background: linear-gradient(135deg, #3498db 0%, #5352ed 100%);
    }
  }
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleModuleClick = (module: string) => {
  switch (module) {
    case 'redbook':
      router.push('/redbook')
      break
    case 'chatgpt':
      router.push('/chatgpt')
      break
    case 'wechat':
      router.push('/wechat')
      break
    case 'douyin':
      router.push('/douyin')
      break
    case 'admin':
      router.push('/admin')
      break
  }
}
</script>