<template>
  <div class="redbook-container">
    <GridNav />
    <div class="content">
      <!-- 顶部搜索栏 -->
      <div class="header">
        <div class="search-bar">
          <el-input
            v-model="searchText"
            placeholder="搜索你感兴趣的内容"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #suffix>
              <el-icon class="camera-icon"><Camera /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 内容分类 -->
      <div class="category-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="推荐" name="recommend" />
          <el-tab-pane label="关注" name="follow">
            <div class="follow-list" v-if="activeTab === 'follow'">
              <div class="stories">
                <div 
                  v-for="user in followingUsers" 
                  :key="user.id" 
                  class="story-item"
                  :class="{ 'has-update': user.hasUpdate }"
                >
                  <div class="avatar-wrapper">
                    <el-avatar :size="64" :src="user.avatar" />
                    <div class="status-ring" v-if="user.hasUpdate"></div>
                  </div>
                  <span class="username">{{ user.name }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="附近" name="nearby" />
        </el-tabs>
      </div>

      <!-- 瀑布流内容区 -->
      <div class="waterfall-content" v-if="activeTab === 'recommend'">
        <div 
          v-for="item in contentList" 
          :key="item.id" 
          class="waterfall-item"
          :style="{ 'grid-row-end': `span ${item.spanSize}` }"
          @click="showDetail(item)"
        >
          <div class="item-image">
            <el-image :src="item.image" fit="cover" />
            <div class="hover-info">
              <div class="stats">
                <span><el-icon><Star /></el-icon> {{ item.likes }}</span>
                <span><el-icon><ChatDotRound /></el-icon> {{ item.comments }}</span>
              </div>
            </div>
          </div>
          <div class="item-info">
            <h3 class="title">{{ item.title }}</h3>
            <p class="description">{{ item.description }}</p>
            <div class="user-info">
              <el-avatar :size="24" :src="item.avatar" />
              <span class="username">{{ item.username }}</span>
              <el-button size="small" round>关注</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 关注页面 -->
      <div class="follow-page" v-if="activeTab === 'follow'">
        <!-- 关注分类 -->
        <div class="follow-categories">
          <el-radio-group v-model="followCategory" size="large">
            <el-radio-button label="all">全部关注</el-radio-button>
            <el-radio-button label="new">新关注</el-radio-button>
            <el-radio-button label="friends">好友</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 关注列表 -->
        <div class="follow-grid">
          <div v-for="user in followingUsers" :key="user.id" class="follow-card">
            <div class="user-header">
              <el-avatar :size="80" :src="user.avatar" />
              <div class="user-status" v-if="user.online">在线</div>
            </div>
            <div class="user-info">
              <h3 class="name">{{ user.name }}</h3>
              <p class="bio">{{ user.bio }}</p>
              <div class="stats">
                <div class="stat-item">
                  <div class="number">{{ user.followers }}</div>
                  <div class="label">粉丝</div>
                </div>
                <div class="stat-item">
                  <div class="number">{{ user.following }}</div>
                  <div class="label">关注</div>
                </div>
                <div class="stat-item">
                  <div class="number">{{ user.likes }}</div>
                  <div class="label">获赞</div>
                </div>
              </div>
            </div>
            <div class="recent-posts">
              <div v-for="post in user.recentPosts" :key="post.id" class="post-preview">
                <el-image :src="post.cover" fit="cover" />
                <div class="post-info">
                  <span class="likes">{{ post.likes }}赞</span>
                </div>
              </div>
            </div>
            <div class="actions">
              <el-button type="danger" round>已关注</el-button>
              <el-button round>私信</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 悬浮发布按钮 -->
      <div class="publish-btn">
        <el-button type="danger" circle>
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 帖子详情弹窗 -->
    <div 
      class="post-detail-modal" 
      v-if="currentPost"
      @click.self="closeDetail"
    >
      <div class="modal-content">
        <!-- 左侧图片区 -->
        <div class="image-section">
          <el-carousel 
            trigger="click" 
            indicator-position="outside"
            height="100%"
          >
            <el-carousel-item v-for="img in currentPost.images" :key="img">
              <el-image :src="img" fit="contain" />
            </el-carousel-item>
          </el-carousel>
        </div>

        <!-- 右侧内容区 -->
        <div class="content-section">
          <!-- 作者信息 -->
          <div class="author-info">
            <el-avatar :size="40" :src="currentPost.avatar" />
            <div class="info">
              <div class="name">{{ currentPost.username }}</div>
              <div class="location" v-if="currentPost.location">
                <el-icon><Location /></el-icon>
                {{ currentPost.location }}
              </div>
            </div>
            <el-button type="danger" round>关注</el-button>
          </div>

          <!-- 帖子内容 -->
          <div class="post-content">
            <h2 class="title">{{ currentPost.title }}</h2>
            <p class="description">{{ currentPost.description }}</p>
            <div class="tags">
              <span v-for="tag in currentPost.tags" :key="tag" class="tag">
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- 互动数据 -->
          <div class="interaction-data">
            <div class="data-item">
              <el-icon><Star /></el-icon>
              <span>{{ currentPost.likes }}</span>
            </div>
            <div class="data-item">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ currentPost.comments }}</span>
            </div>
            <div class="data-item">
              <el-icon><Share /></el-icon>
              <span>收藏</span>
            </div>
          </div>

          <!-- 评论区 -->
          <div class="comments-section">
            <h3>评论 {{ currentPost.comments }}</h3>
            <div class="comment-list">
              <div v-for="comment in currentPost.commentList" :key="comment.id" class="comment-item">
                <el-avatar :size="32" :src="comment.avatar" />
                <div class="comment-content">
                  <div class="comment-user">{{ comment.username }}</div>
                  <div class="comment-text">{{ comment.content }}</div>
                  <div class="comment-meta">
                    <span class="time">{{ comment.time }}</span>
                    <span class="like">
                      <el-icon><Star /></el-icon>
                      {{ comment.likes }}
                    </span>
                    <span class="reply">回复</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 评论输入框 -->
          <div class="comment-input">
            <el-input
              v-model="commentText"
              placeholder="说点什么..."
              :suffix-icon="Smile"
            >
              <template #append>
                <el-button>发送</el-button>
              </template>
            </el-input>
          </div>
        </div>

        <!-- 关闭按钮 -->
        <div class="close-btn" @click="closeDetail">
          <el-icon><Close /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import GridNav from '@/components/GridNav.vue'

const searchText = ref('')
const activeTab = ref('recommend')

const followCategory = ref('all')

// 关注的用户数据
const followingUsers = reactive([
  {
    id: 1,
    name: '设计师小王',
    avatar: 'https://picsum.photos/80/80?random=1',
    bio: '分享生活美学，探索设计灵感',
    online: true,
    followers: '12.5w',
    following: '286',
    likes: '45.8w',
    hasUpdate: true,
    recentPosts: [
      { id: 1, cover: 'https://picsum.photos/200/200?random=1', likes: '2.3w' },
      { id: 2, cover: 'https://picsum.photos/200/200?random=2', likes: '1.8w' },
      { id: 3, cover: 'https://picsum.photos/200/200?random=3', likes: '3.1w' }
    ]
  },
  {
    id: 2,
    name: '美食达人',
    avatar: 'https://picsum.photos/64/64?random=2',
    hasUpdate: true
  },
  // 添加更多用户...
])

// 瀑布流内容
const contentList = reactive([
  {
    id: 1,
    image: 'https://picsum.photos/300/400?random=1',
    title: '超级可爱的下午茶',
    description: '今天和闺蜜一起去了新开的甜品店，环境超级好，甜点也很精致...',
    avatar: 'https://picsum.photos/50/50?random=1',
    username: '甜甜圈爱好者',
    likes: '1.2w',
    comments: '866',
    spanSize: 2 // 控制卡片高度
  },
  // 添加更多内容...
])

const currentPost = ref<any>(null)
const commentText = ref('')

const showDetail = (post: any) => {
  currentPost.value = {
    ...post,
    images: [post.image, 'https://picsum.photos/400/600', 'https://picsum.photos/400/500'],
    location: '杭州市',
    tags: ['美食', '下午茶', '生活记录'],
    commentList: [
      {
        id: 1,
        username: '美食评论家',
        avatar: 'https://picsum.photos/32/32?random=1',
        content: '看起来好好吃！请问这家店在哪里呀？',
        time: '2小时前',
        likes: '123'
      },
      // ... 添加更多评论
    ]
  }
  document.body.style.overflow = 'hidden'
}

const closeDetail = () => {
  currentPost.value = null
  document.body.style.overflow = 'auto'
}
</script>

<style lang="less" scoped>
.redbook-container {
  min-height: 100vh;
  background: #f4f4f4;
  padding-top: 120px;
  
  .content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    .header {
      margin-bottom: 24px;
      
      .search-bar {
        max-width: 600px;
        margin: 0 auto;
        
        .search-input {
          :deep(.el-input__wrapper) {
            background: white;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
            border-radius: 24px;
            padding: 8px 16px;
            
            &:hover {
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            }
            
            &.is-focus {
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            }
          }
          
          :deep(.el-input__inner) {
            height: 40px;
            font-size: 16px;
          }
          
          .camera-icon {
            color: #999;
            cursor: pointer;
            font-size: 20px;
            
            &:hover {
              color: #666;
            }
          }
        }
      }
    }

    .category-tabs {
      margin-bottom: 24px;
      
      :deep(.el-tabs__header) {
        margin-bottom: 24px;
      }
      
      :deep(.el-tabs__nav-wrap::after) {
        height: 1px;
        background: rgba(0, 0, 0, 0.05);
      }
      
      :deep(.el-tabs__item) {
        font-size: 16px;
        padding: 0 24px;
        
        &.is-active {
          color: #ff4757;
        }
      }
      
      .follow-list {
        .stories {
          display: flex;
          gap: 20px;
          padding: 20px 0;
          overflow-x: auto;
          
          .story-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            
            .avatar-wrapper {
              position: relative;
              padding: 2px;
              
              .status-ring {
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border: 2px solid #ff4757;
                border-radius: 50%;
                animation: pulse 2s infinite;
              }
            }
            
            .username {
              font-size: 14px;
              color: #333;
              max-width: 64px;
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            
            &:hover {
              .username {
                color: #ff4757;
              }
            }
          }
        }
      }
    }

    .waterfall-content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      padding: 20px 0;
      
      .waterfall-item {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        transition: transform 0.3s;
        
        &:hover {
          transform: translateY(-5px);
          
          .hover-info {
            opacity: 1;
          }
        }
        
        .item-image {
          position: relative;
          width: 100%;
          padding-bottom: 133.33%;
          
          .el-image {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .hover-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
            opacity: 0;
            transition: opacity 0.3s;
            
            .stats {
              display: flex;
              gap: 16px;
              color: white;
              
              span {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 14px;
              }
            }
          }
        }
        
        .item-info {
          padding: 16px;
          
          .title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .description {
            font-size: 14px;
            color: #666;
            margin-bottom: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .user-info {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .username {
              flex: 1;
              font-size: 14px;
              color: #333;
            }
            
            .el-button {
              background: #ff4757;
              border: none;
              color: white;
              
              &:hover {
                background: #ff6b81;
              }
            }
          }
        }
      }
    }

    .follow-page {
      .follow-categories {
        margin-bottom: 32px;
        text-align: center;
      }

      .follow-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;

        .follow-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          }

          .user-header {
            position: relative;
            text-align: center;
            margin-bottom: 16px;

            .user-status {
              position: absolute;
              bottom: 0;
              right: 50%;
              transform: translateX(50%);
              background: #4cd137;
              color: white;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
            }
          }

          .user-info {
            text-align: center;
            margin-bottom: 20px;

            .name {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 8px;
            }

            .bio {
              color: #666;
              font-size: 14px;
              margin-bottom: 16px;
            }

            .stats {
              display: flex;
              justify-content: space-around;
              padding: 16px 0;
              border-top: 1px solid #f0f0f0;
              border-bottom: 1px solid #f0f0f0;

              .stat-item {
                .number {
                  font-size: 16px;
                  font-weight: 600;
                  color: #333;
                }

                .label {
                  font-size: 12px;
                  color: #999;
                  margin-top: 4px;
                }
              }
            }
          }

          .recent-posts {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 20px;

            .post-preview {
              position: relative;
              padding-bottom: 100%;

              .el-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 8px;
              }

              .post-info {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 8px;
                background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
                border-radius: 0 0 8px 8px;

                .likes {
                  color: white;
                  font-size: 12px;
                }
              }
            }
          }

          .actions {
            display: flex;
            gap: 12px;

            .el-button {
              flex: 1;
            }
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.post-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .modal-content {
    display: flex;
    width: 90%;
    max-width: 1200px;
    height: 80vh;
    background: white;
    border-radius: 20px;
    position: relative;
    
    .image-section {
      width: 60%;
      background: #000;
      border-radius: 20px 0 0 20px;
      overflow: hidden;
      
      .el-carousel {
        height: 100%;
        
        :deep(.el-carousel__container) {
          height: 100%;
        }
        
        .el-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    
    .content-section {
      width: 40%;
      padding: 24px;
      display: flex;
      flex-direction: column;
      
      .author-info {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        
        .info {
          flex: 1;
          
          .name {
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .location {
            font-size: 12px;
            color: #999;
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
      
      .post-content {
        margin-bottom: 20px;
        
        .title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        
        .description {
          font-size: 15px;
          line-height: 1.6;
          color: #333;
          margin-bottom: 16px;
        }
        
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          
          .tag {
            color: #ff4757;
            font-size: 14px;
            cursor: pointer;
            
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
      
      .interaction-data {
        display: flex;
        justify-content: space-around;
        padding: 20px 0;
        border-top: 1px solid #f0f0f0;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 20px;
        
        .data-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          cursor: pointer;
          
          &:hover {
            color: #ff4757;
          }
        }
      }
      
      .comments-section {
        flex: 1;
        overflow-y: auto;
        
        h3 {
          margin-bottom: 16px;
        }
        
        .comment-item {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          
          .comment-content {
            flex: 1;
            
            .comment-user {
              font-weight: 600;
              margin-bottom: 4px;
            }
            
            .comment-text {
              font-size: 14px;
              line-height: 1.6;
              color: #333;
            }
            
            .comment-meta {
              margin-top: 8px;
              font-size: 12px;
              color: #999;
              display: flex;
              gap: 16px;
              
              span {
                cursor: pointer;
                
                &:hover {
                  color: #ff4757;
                }
              }
            }
          }
        }
      }
      
      .comment-input {
        margin-top: auto;
        padding-top: 16px;
        border-top: 1px solid #f0f0f0;
      }
    }
    
    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      transition: all 0.3s;
      
      &:hover {
        background: rgba(0, 0, 0, 0.7);
        transform: rotate(90deg);
      }
      
      .el-icon {
        font-size: 20px;
      }
    }
  }
}
</style> 