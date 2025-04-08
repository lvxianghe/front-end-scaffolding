<template>
  <div class="error-center-container">
    <!-- 返回按钮 -->
    <div class="exit-button" @click="goBack">
      <el-icon><Back /></el-icon>
      <span>返回</span>
    </div>
    
    <div class="page-header">
      <h1>错误诊断中心</h1>
    </div>
    
    <div class="error-center-content">
      <el-empty description="错误诊断功能即将上线，敬请期待！">
        <template #image>
          <el-icon class="empty-icon"><Warning /></el-icon>
        </template>
        <el-button type="primary" @click="goBack">返回首页</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Back, Warning } from '@element-plus/icons-vue'

const router = useRouter()

// 返回首页
const goBack = () => {
  router.push('/home')
}
</script>

<style lang="less" scoped>
.error-center-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  .exit-button {
    position: fixed;
    top: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #409EFF;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    z-index: 10;
    border: 1px solid rgba(64, 158, 255, 0.2);
    transition: all 0.3s;
    
    &:hover {
      background: #ffffff;
      border-color: rgba(64, 158, 255, 0.4);
      box-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
    }
    
    .el-icon {
      font-size: 18px;
    }
    
    span {
      font-size: 16px;
    }
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 30px;
    padding-top: 40px;
    
    h1 {
      font-size: 28px;
      color: #303133;
      margin: 0;
    }
  }
  
  .error-center-content {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 40px;
    min-height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .empty-icon {
      font-size: 60px;
      color: #f56c6c;
    }
  }
}
</style> 