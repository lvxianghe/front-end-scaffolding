<template>
  <div class="digital-rain-container">
    <!-- 退出按钮 -->
    <div class="exit-button" @click="goBack">
      <el-icon><Back /></el-icon>
      <span>返回</span>
    </div>
    
    <!-- 数字雨画布 -->
    <canvas ref="canvas" class="digital-rain-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Back } from '@element-plus/icons-vue'

const router = useRouter()
const canvas = ref(null)
let animationId = null

// 返回上一页
const goBack = () => {
  router.push('/home')
}

onMounted(() => {
  initDigitalRain()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

const initDigitalRain = () => {
  const canvasEl = canvas.value
  const ctx = canvasEl.getContext('2d')
  
  // 设置画布大小为窗口大小
  const resizeCanvas = () => {
    canvasEl.width = window.innerWidth
    canvasEl.height = window.innerHeight
  }
  
  // 初始调整大小
  resizeCanvas()
  
  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas)
  
  // 数字雨效果的实现
  const fontSize = 16
  const columns = Math.floor(canvasEl.width / fontSize)
  const drops = []
  
  // 初始化每列的Y位置
  for (let i = 0; i < columns; i++) {
    drops[i] = 1
  }
  
  // 字符集
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  
  // 绘制数字雨
  const draw = () => {
    // 半透明黑色背景，形成拖尾效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)
    
    // 设置文字颜色和字体
    ctx.fillStyle = '#0F0' // 绿色
    ctx.font = `${fontSize}px monospace`
    
    // 逐列绘制字符
    for (let i = 0; i < drops.length; i++) {
      // 随机选择一个字符
      const text = chars[Math.floor(Math.random() * chars.length)]
      
      // 绘制字符
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)
      
      // 字符下落到底部后，有一定概率重新回到顶部
      if (drops[i] * fontSize > canvasEl.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      
      // 递增Y位置
      drops[i]++
    }
    
    // 请求下一帧动画
    animationId = requestAnimationFrame(draw)
  }
  
  // 开始动画
  draw()
}
</script>

<style lang="less" scoped>
.digital-rain-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
  
  .digital-rain-canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
  
  .exit-button {
    position: fixed;
    top: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: #0F0;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    z-index: 10;
    border: 1px solid rgba(0, 255, 0, 0.3);
    transition: all 0.3s;
    
    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(0, 255, 0, 0.8);
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    }
    
    .el-icon {
      font-size: 18px;
    }
    
    span {
      font-size: 16px;
    }
  }
}
</style> 