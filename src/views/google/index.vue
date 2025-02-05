<template>
  <div class="google-container">
    <GridNav />
    
    <!-- 头部导航 -->
    <div class="header">
      <div class="nav-right">
        <a href="#" class="nav-item">Gmail</a>
        <a href="#" class="nav-item">图片</a>
        <el-button class="apps-btn" circle>
          <el-icon><Grid /></el-icon>
        </el-button>
        <el-avatar :size="32" src="https://picsum.photos/32/32" />
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="logo">
        <div class="google-text">
          <span style="color: #4285f4">G</span>
          <span style="color: #ea4335">o</span>
          <span style="color: #fbbc05">o</span>
          <span style="color: #4285f4">g</span>
          <span style="color: #34a853">l</span>
          <span style="color: #ea4335">e</span>
        </div>
      </div>
      
      <div class="search-box">
        <div class="search-input">
          <el-icon class="search-icon"><Search /></el-icon>
          <input 
            v-model="searchText" 
            type="text"
            @focus="showSuggestions = true"
            @blur="handleBlur"
          />
          <div class="input-tools">
            <el-button v-if="searchText" class="clear-btn" circle @click="searchText = ''">
              <el-icon><Close /></el-icon>
            </el-button>
            <div class="divider"></div>
            <el-button class="voice-btn" circle>
              <el-icon><Microphone /></el-icon>
            </el-button>
            <el-button class="camera-btn" circle>
              <el-icon><Camera /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 搜索建议 -->
        <div class="search-suggestions" v-if="showSuggestions && suggestions.length">
          <div 
            v-for="suggestion in suggestions" 
            :key="suggestion"
            class="suggestion-item"
            @mousedown.prevent="handleSearch(suggestion)"
          >
            <el-icon><Search /></el-icon>
            <span>{{ suggestion }}</span>
          </div>
        </div>
      </div>

      <div class="search-buttons">
        <el-button>Google 搜索</el-button>
        <el-button>手气不错</el-button>
      </div>

      <div class="language-hint">
        Google 提供: 
        <a href="#">English</a>
        <a href="#">粤语</a>
        <a href="#">文言文</a>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="footer">
      <div class="location">中国</div>
      <div class="links">
        <div class="left">
          <a href="#">关于</a>
          <a href="#">广告</a>
          <a href="#">商务</a>
          <a href="#">搜索的运作方式</a>
        </div>
        <div class="right">
          <a href="#">隐私权</a>
          <a href="#">条款</a>
          <a href="#">设置</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import GridNav from '@/components/GridNav.vue'

const searchText = ref('')
const showSuggestions = ref(false)
const suggestions = ref<string[]>([])

// 模拟搜索建议
watch(searchText, (newValue) => {
  if (!newValue.trim()) {
    suggestions.value = []
    return
  }
  
  // 这里可以替换为实际的API调用
  suggestions.value = [
    `${newValue} 的意思`,
    `${newValue} 怎么读`,
    `${newValue} 相关内容`,
    `${newValue} 最新消息`,
    `${newValue} 图片`
  ]
})

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const handleSearch = (text: string) => {
  searchText.value = text
  showSuggestions.value = false
  // 执行搜索
  console.log('搜索:', text)
}
</script>

<style lang="less" scoped>
.google-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;

  .header {
    padding: 16px;
    display: flex;
    justify-content: flex-end;

    .nav-right {
      display: flex;
      align-items: center;
      gap: 16px;

      .nav-item {
        color: #000;
        text-decoration: none;
        font-size: 13px;

        &:hover {
          text-decoration: underline;
        }
      }

      .apps-btn {
        color: #5f6368;
      }
    }
  }

  .search-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 120px;

    .logo {
      margin-bottom: 32px;
      
      .google-text {
        font-size: 92px;
        font-family: 'Product Sans', Arial, sans-serif;
        font-weight: 400;
        letter-spacing: -3px;
        
        span {
          display: inline-block;
          line-height: 1;
        }
      }
    }

    .search-box {
      width: 100%;
      max-width: 584px;
      position: relative;

      .search-input {
        display: flex;
        align-items: center;
        height: 46px;
        border: 1px solid #dfe1e5;
        border-radius: 24px;
        padding: 0 16px;
        transition: all 0.3s;

        &:hover, &:focus-within {
          box-shadow: 0 1px 6px rgba(32,33,36,.28);
          border-color: transparent;
        }

        .search-icon {
          color: #9aa0a6;
          font-size: 20px;
          margin-right: 12px;
        }

        input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          color: #202124;
          background: transparent;
        }

        .input-tools {
          display: flex;
          align-items: center;
          gap: 8px;

          .clear-btn {
            color: #70757a;
          }

          .divider {
            width: 1px;
            height: 24px;
            background: #dfe1e5;
          }

          .voice-btn, .camera-btn {
            color: #4285f4;
          }
        }
      }

      .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 12px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(32,33,36,.28);
        padding: 8px 0;

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 24px;
          cursor: pointer;
          color: #202124;

          &:hover {
            background: #f8f9fa;
          }

          .el-icon {
            color: #9aa0a6;
          }
        }
      }
    }

    .search-buttons {
      margin-top: 24px;
      display: flex;
      gap: 12px;

      .el-button {
        background: #f8f9fa;
        border: 1px solid #f8f9fa;
        color: #3c4043;
        font-size: 14px;
        padding: 0 16px;
        height: 36px;

        &:hover {
          box-shadow: 0 1px 1px rgba(0,0,0,.1);
          border-color: #dadce0;
        }
      }
    }

    .language-hint {
      margin-top: 24px;
      font-size: 13px;
      color: #4d5156;

      a {
        color: #1a0dab;
        text-decoration: none;
        margin: 0 4px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .footer {
    background: #f2f2f2;
    color: #70757a;
    font-size: 14px;

    .location {
      padding: 12px 24px;
      border-bottom: 1px solid #dadce0;
    }

    .links {
      display: flex;
      justify-content: space-between;
      padding: 12px 24px;

      .left, .right {
        display: flex;
        gap: 24px;
      }

      a {
        color: #70757a;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style> 