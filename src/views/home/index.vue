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

      <!-- Google搜索模块 -->
      <div class="grid-item google" @click="handleModuleClick('google')">
        <div class="content">
          <el-icon><Search /></el-icon>
          <span>搜索引擎</span>
          <div class="description">高仿 Google 搜索</div>
        </div>
      </div>

      <!-- 管理模块 -->
      <div class="grid-item admin" @click="handleModuleClick('admin')">
        <div class="content">
          <el-icon><Setting /></el-icon>
          <span>管理中心</span>
        </div>
      </div>
      
      <!-- 黑客帝国方块 - 放在管理中心下方 -->
      <div class="grid-item matrix" @click="goToDigitalRain">
        <div class="content">
          <div class="matrix-canvas-container">
            <canvas ref="matrixCanvas" class="matrix-canvas"></canvas>
          </div>
          <span>黑客帝国</span>
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
    grid-template-rows: repeat(4, 200px); // 增加一行用于黑客帝国方块
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

    // ChatGPT模块 - 占据1x1的格子
    .chatgpt {
      grid-column: 3 / 4;
      grid-row: 1 / 2;
      background: linear-gradient(135deg, #2f3542 0%, #57606f 100%);
    }

    // Google搜索模块 - 占据1x1的格子
    .google {
      grid-column: 4 / 5;
      grid-row: 1 / 2;
      background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
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
    
    // 黑客帝国方块 - 占据1x1的格子，放在管理中心下方
    .matrix {
      grid-column: 1 / 2; // 只占第一列
      grid-row: 4 / 5; // 放在第四行
      background: #000; // 黑色背景
      
      .content {
        position: relative;
        
        .matrix-canvas-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        span {
          position: relative;
          z-index: 2;
          color: #0F0; // 绿色文字
          text-shadow: 0 0 5px #0F0; // 发光效果
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .home-container .grid-layout {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    
    .redbook {
      grid-column: 1 / 3;
      grid-row: 1 / 3;
    }
    
    .chatgpt, .google, .wechat, .douyin {
      grid-column: auto;
      grid-row: auto;
    }
    
    .admin {
      grid-column: 1 / 3;
      grid-row: auto;
    }
    
    .matrix {
      grid-column: 1 / 2;
      grid-row: auto;
    }
  }
}

@media (max-width: 480px) {
  .home-container .grid-layout {
    grid-template-columns: 1fr;
    
    .redbook, .admin, .matrix {
      grid-column: 1;
    }
  }
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Connection } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted } from 'vue'

const router = useRouter()

const matrixCanvas = ref(null)
let matrixInterval = null

onMounted(() => {
  initMatrix()
})

onUnmounted(() => {
  if (matrixInterval) {
    clearInterval(matrixInterval)
  }
})

const initMatrix = () => {
  const canvas = matrixCanvas.value
  if (!canvas) return // 防止canvas未加载完成
  
  const ctx = canvas.getContext('2d')
  
  // 设置画布大小为容器大小
  const resizeCanvas = () => {
    const container = canvas.parentElement
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
  }
  
  // 初始调整大小
  resizeCanvas()
  
  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas)
  
  // 黑客帝国效果的实现
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const fontSize = 14
  const columns = Math.floor(canvas.width / fontSize)
  const drops = []
  
  // 初始化每列的Y位置
  for (let i = 0; i < columns; i++) {
    drops[i] = 1
  }
  
  // 绘制黑客帝国效果
  const draw = () => {
    // 半透明黑色背景，形成拖尾效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // 设置文字颜色和字体
    ctx.fillStyle = '#0F0' // 绿色
    ctx.font = `${fontSize}px monospace`
    
    // 逐列绘制字符
    for (let i = 0; i < drops.length; i++) {
      // 随机选择一个字符
      const text = characters[Math.floor(Math.random() * characters.length)]
      
      // 绘制字符
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)
      
      // 字符下落到底部后，有一定概率重新回到顶部
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      
      // 递增Y位置
      drops[i]++
    }
  }
  
  // 设置定时器，定期重绘
  matrixInterval = setInterval(draw, 33) // 约30fps
}

const handleModuleClick = (module: string) => {
  router.push(`/${module}`)
}

// 跳转到数字雨效果页面
const goToDigitalRain = () => {
  router.push('/digital-rain')
}
</script>