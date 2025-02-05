<template>
  <div class="douyin-container">
    <GridNav />
    <div class="content">
      <!-- 视频容器 -->
      <div class="video-container" @wheel="handleScroll" ref="videoContainer">
        <div 
          v-for="(video, index) in videos" 
          :key="video.id" 
          class="video-wrapper"
          :class="{ active: currentIndex === index }"
          :style="{ transform: `translateY(${-100 * currentIndex}%)` }"
        >
          <video
            :src="video.url"
            class="video-player"
            :ref="el => { if (el) videoRefs[index] = el }"
            loop
            preload="auto"
            :muted="currentIndex !== index"
            @click="togglePlay(index)"
          />
          
          <!-- 视频信息浮层 -->
          <div class="video-overlay">
            <div class="author">
              <el-avatar :size="40" :src="video.avatar" />
              <span class="name">{{ video.author }}</span>
              <el-button size="small" type="danger" round>关注</el-button>
            </div>
            <div class="description">{{ video.description }}</div>
            <div class="music">
              <el-icon><Headset /></el-icon>
              {{ video.music }}
            </div>
          </div>

          <!-- 右侧操作栏 -->
          <div class="action-bar">
            <div class="action-item">
              <el-avatar :size="50" :src="video.avatar" />
              <div class="follow-btn">
                <el-icon><Plus /></el-icon>
              </div>
            </div>
            <div class="action-item">
              <div class="icon-btn like" :class="{ active: video.isLiked }" @click="toggleLike(index)">
                <el-icon><Star /></el-icon>
              </div>
              <span>{{ formatNumber(video.likes) }}</span>
            </div>
            <div class="action-item">
              <div class="icon-btn">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <span>{{ formatNumber(video.comments) }}</span>
            </div>
            <div class="action-item">
              <div class="icon-btn">
                <el-icon><Share /></el-icon>
              </div>
              <span>{{ formatNumber(video.shares) }}</span>
            </div>
            <div class="action-item">
              <div class="music-disc">
                <el-avatar :size="40" :src="video.music_cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部导航 -->
      <div class="bottom-nav">
        <div class="nav-item active">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </div>
        <div class="nav-item">
          <el-icon><Location /></el-icon>
          <span>附近</span>
        </div>
        <div class="nav-item">
          <div class="publish-btn">
            <el-icon><Plus /></el-icon>
          </div>
        </div>
        <div class="nav-item">
          <el-icon><Message /></el-icon>
          <span>消息</span>
        </div>
        <div class="nav-item">
          <el-icon><User /></el-icon>
          <span>我</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import GridNav from '@/components/GridNav.vue'

const videoContainer = ref<HTMLElement | null>(null)
const videoRefs = ref<HTMLVideoElement[]>([])
const currentIndex = ref(0)
const isScrolling = ref(false)

// 模拟视频数据
const videos = ref([
  {
    id: 1,
    url: 'https://example.com/video1.mp4',
    author: '用户1',
    avatar: 'https://picsum.photos/50/50?random=1',
    description: '第一个视频描述...',
    music: '音乐名称 - 歌手',
    music_cover: 'https://picsum.photos/40/40?random=1',
    likes: 12345,
    comments: 666,
    shares: 234,
    isLiked: false
  },
  // ... 添加更多视频数据
])

// 处理滚动
const handleScroll = (e: WheelEvent) => {
  if (isScrolling.value) return
  
  isScrolling.value = true
  setTimeout(() => {
    isScrolling.value = false
  }, 800) // 防抖时间

  if (e.deltaY > 0 && currentIndex.value < videos.value.length - 1) {
    // 向下滑
    pauseCurrentVideo()
    currentIndex.value++
    playCurrentVideo()
  } else if (e.deltaY < 0 && currentIndex.value > 0) {
    // 向上滑
    pauseCurrentVideo()
    currentIndex.value--
    playCurrentVideo()
  }
}

// 播放/暂停视频
const togglePlay = (index: number) => {
  const video = videoRefs.value[index]
  if (video) {
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }
}

// 暂停当前视频
const pauseCurrentVideo = () => {
  const video = videoRefs.value[currentIndex.value]
  if (video) {
    video.pause()
  }
}

// 播放当前视频
const playCurrentVideo = () => {
  const video = videoRefs.value[currentIndex.value]
  if (video) {
    video.play()
  }
}

// 点赞功能
const toggleLike = (index: number) => {
  const video = videos.value[index]
  video.isLiked = !video.isLiked
  video.likes += video.isLiked ? 1 : -1
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

// 监听触摸事件
let touchStartY = 0
const handleTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0].clientY
}

const handleTouchEnd = (e: TouchEvent) => {
  const touchEndY = e.changedTouches[0].clientY
  const deltaY = touchEndY - touchStartY
  
  if (Math.abs(deltaY) > 50) { // 最小滑动距离
    handleScroll({ deltaY: -deltaY } as WheelEvent)
  }
}

onMounted(() => {
  // 播放第一个视频
  playCurrentVideo()
  
  // 添加触摸事件监听
  if (videoContainer.value) {
    videoContainer.value.addEventListener('touchstart', handleTouchStart)
    videoContainer.value.addEventListener('touchend', handleTouchEnd)
  }
})

onUnmounted(() => {
  // 移除触摸事件监听
  if (videoContainer.value) {
    videoContainer.value.removeEventListener('touchstart', handleTouchStart)
    videoContainer.value.removeEventListener('touchend', handleTouchEnd)
  }
})
</script>

<style lang="less" scoped>
.douyin-container {
  height: 100vh;
  background: #000;
  
  .content {
    height: calc(100vh - 120px);
    position: relative;
    overflow: hidden;
    
    .video-container {
      height: 100%;
      position: relative;
      
      .video-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease-out;
        
        .video-player {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .video-overlay {
          position: absolute;
          bottom: 80px;
          left: 20px;
          right: 80px;
          color: white;
          z-index: 1;
          
          .author {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            
            .name {
              font-weight: 600;
            }
          }
          
          .description {
            margin-bottom: 8px;
            font-size: 15px;
          }
          
          .music {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 14px;
          }
        }
        
        .action-bar {
          position: absolute;
          right: 12px;
          bottom: 120px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          z-index: 1;
          
          .action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            color: white;
            
            .follow-btn {
              position: absolute;
              bottom: -16px;
              background: #fe2c55;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .icon-btn {
              width: 48px;
              height: 48px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.3s;
              
              &:hover {
                background: rgba(255, 255, 255, 0.2);
              }
              
              &.active {
                color: #fe2c55;
              }
              
              .el-icon {
                font-size: 24px;
              }
            }
            
            span {
              font-size: 13px;
            }
            
            .music-disc {
              animation: rotate 8s linear infinite;
              
              .el-avatar {
                border-radius: 50%;
              }
            }
          }
        }
      }
    }

    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 20px;

      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;

        &.active {
          color: white;
        }

        .el-icon {
          font-size: 24px;
        }

        span {
          font-size: 12px;
        }

        .publish-btn {
          width: 44px;
          height: 30px;
          background: linear-gradient(to right, #fe2c55, #ff4f81);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
      }
    }
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 