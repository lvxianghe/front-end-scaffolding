<template>
  <div class="excalidraw-container">
    <!-- 返回按钮 -->
    <div class="exit-button" @click="goBack">
      <el-icon><Back /></el-icon>
      <span>返回</span>
    </div>
    
    <!-- Excalidraw 容器 -->
    <iframe 
      src="https://excalidraw.com/" 
      class="excalidraw-frame"
      ref="excalidrawFrame"
    ></iframe>
    
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button-group>
        <el-button type="primary" @click="saveDrawing">
          <el-icon><Download /></el-icon>
          保存
        </el-button>
        <el-button @click="openInNewTab">
          <el-icon><Link /></el-icon>
          新窗口打开
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Back, Download, Link } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const excalidrawFrame = ref(null)

// 返回上一页
const goBack = () => {
  router.push('/home')
}

// 保存绘图 (提示用户使用 Excalidraw 内置的保存功能)
const saveDrawing = () => {
  ElMessage.info('请使用 Excalidraw 内置的保存功能 (右上角菜单)')
}

// 在新标签页中打开
const openInNewTab = () => {
  window.open('https://excalidraw.com/', '_blank')
}

onMounted(() => {
  ElMessage.success('Excalidraw 已加载')
})
</script>

<style lang="less" scoped>
.excalidraw-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #f5f5f5;
  
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
    z-index: 100;
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
  
  .excalidraw-frame {
    width: 100%;
    height: 100%;
    border: none;
    position: absolute;
    top: 0;
    left: 0;
  }
  
  .toolbar {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 100;
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style> 