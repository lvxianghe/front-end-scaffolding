<template>
  <div class="wechat-container">
    <GridNav />
    <div class="content">
      <div class="wechat-layout">
        <!-- 左侧菜单 -->
        <div class="sidebar">
          <div class="user-info">
            <el-avatar :size="50" src="https://picsum.photos/50/50" />
            <span class="username">用户名</span>
          </div>
          <div class="menu-list">
            <div 
              v-for="menu in menuList" 
              :key="menu.key"
              class="menu-item"
              :class="{ active: currentMenu === menu.key }"
              @click="currentMenu = menu.key"
            >
              <el-icon><component :is="menu.icon" /></el-icon>
              <span>{{ menu.label }}</span>
              <el-badge v-if="menu.badge" :value="menu.badge" class="badge" />
            </div>
          </div>
        </div>

        <!-- 通讯录列表 -->
        <div v-if="currentMenu === 'contacts'" class="contacts-section">
          <div class="search-bar">
            <el-input
              v-model="searchText"
              placeholder="搜索"
              prefix-icon="Search"
            />
          </div>

          <div class="contacts-list">
            <!-- 常用联系人 -->
            <div class="contact-group">
              <div class="group-title">常用联系人</div>
              <div class="contact-items">
                <div class="contact-item" v-for="contact in frequentContacts" :key="contact.id">
                  <el-avatar :size="40" :src="contact.avatar" />
                  <div class="info">
                    <div class="name">{{ contact.name }}</div>
                    <div class="signature">{{ contact.signature }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 按字母分组的联系人 -->
            <div v-for="group in groupedContacts" :key="group.letter" class="contact-group">
              <div class="group-title">{{ group.letter }}</div>
              <div class="contact-items">
                <div class="contact-item" v-for="contact in group.contacts" :key="contact.id">
                  <el-avatar :size="40" :src="contact.avatar" />
                  <div class="info">
                    <div class="name">{{ contact.name }}</div>
                    <div class="signature">{{ contact.signature }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 字母导航 -->
          <div class="letter-nav">
            <div 
              v-for="letter in letters" 
              :key="letter"
              class="letter-item"
              :class="{ active: currentLetter === letter }"
              @click="scrollToLetter(letter)"
            >
              {{ letter }}
            </div>
          </div>
        </div>

        <!-- 聊天区域 -->
        <div v-else-if="currentMenu === 'chat'" class="chat-section">
          <!-- 聊天列表 -->
          <div class="chat-list">
            <div class="search-bar">
              <el-input
                v-model="searchText"
                placeholder="搜索"
                prefix-icon="Search"
              />
            </div>
            <div class="list-content">
              <div 
                v-for="chat in chatList" 
                :key="chat.id"
                class="chat-item"
                :class="{ active: currentChat?.id === chat.id }"
                @click="selectChat(chat)"
              >
                <el-avatar :size="40" :src="chat.avatar" />
                <div class="chat-info">
                  <div class="top">
                    <span class="name">{{ chat.name }}</span>
                    <span class="time">{{ chat.lastTime }}</span>
                  </div>
                  <div class="bottom">
                    <span class="message">{{ chat.lastMessage }}</span>
                    <el-badge v-if="chat.unread" :value="chat.unread" class="unread" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 聊天内容 -->
          <div class="chat-content">
            <template v-if="currentChat">
              <div class="chat-header">
                <h3>{{ currentChat.name }}</h3>
              </div>
              <div class="message-list">
                <div 
                  v-for="msg in currentChat.messages" 
                  :key="msg.id"
                  class="message-item"
                  :class="msg.type"
                >
                  <el-avatar 
                    :size="36" 
                    :src="msg.type === 'received' ? currentChat.avatar : 'https://picsum.photos/50/50'" 
                  />
                  <div class="bubble">{{ msg.content }}</div>
                </div>
              </div>
              <div class="input-area">
                <div class="toolbar">
                  <el-icon><Microphone /></el-icon>
                  <el-icon><PictureRounded /></el-icon>
                  <el-icon><Folder /></el-icon>
                </div>
                <el-input
                  v-model="inputMessage"
                  type="textarea"
                  :rows="3"
                  placeholder="输入消息"
                />
                <el-button type="primary">发送</el-button>
              </div>
            </template>
            <div v-else class="no-chat">
              <el-empty description="选择一个聊天" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import GridNav from '@/components/GridNav.vue'

const searchText = ref('')
const currentMenu = ref('contacts')
const currentLetter = ref('A')

const menuList = [
  { key: 'chat', label: '聊天', icon: 'ChatDotRound' },
  { key: 'contacts', label: '通讯录', icon: 'UserFilled', badge: 2 },
  { key: 'discover', label: '发现', icon: 'Compass' },
  { key: 'me', label: '我', icon: 'User' }
]

// 常用联系人
const frequentContacts = reactive([
  {
    id: 1,
    name: '张三',
    avatar: 'https://picsum.photos/40/40?random=1',
    signature: '这是个性签名'
  },
  // ... 添加更多常用联系人
])

// 所有联系人数据
const contacts = reactive([
  {
    id: 1,
    name: 'Alice',
    pinyin: 'alice',
    avatar: 'https://picsum.photos/40/40?random=1',
    signature: 'Hello World'
  },
  // ... 添加更多联系人
])

// 字母表
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

// 按字母分组的联系人
const groupedContacts = computed(() => {
  const groups: Record<string, any[]> = {}
  letters.forEach(letter => {
    groups[letter] = contacts.filter(contact => 
      contact.pinyin.toUpperCase().startsWith(letter)
    )
  })
  
  return Object.entries(groups)
    .filter(([_, contacts]) => contacts.length > 0)
    .map(([letter, contacts]) => ({
      letter,
      contacts
    }))
})

const scrollToLetter = (letter: string) => {
  currentLetter.value = letter
  const element = document.querySelector(`[data-letter="${letter}"]`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

interface ChatMessage {
  id: number
  type: 'sent' | 'received'
  content: string
  timestamp: number
}

interface Chat {
  id: number
  name: string
  avatar: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: ChatMessage[]
}

const chatList = reactive<Chat[]>([
  {
    id: 1,
    name: '张三',
    avatar: 'https://picsum.photos/42/42',
    lastMessage: '好的，明天见！',
    lastTime: '12:30',
    unread: 2,
    messages: [
      { id: 1, type: 'received', content: '你好，在吗？', timestamp: Date.now() - 1000 },
      { id: 2, type: 'sent', content: '在的，什么事？', timestamp: Date.now() }
    ]
  }
])

const currentChat = ref<Chat | null>(null)
const inputMessage = ref('')

const selectChat = (chat: Chat) => {
  currentChat.value = chat
}
</script>

<style lang="less" scoped>
.wechat-container {
  min-height: 100vh;
  background: #f0f2f5;
  padding-top: 120px;

  .content {
    max-width: 1200px;
    margin: 0 auto;
    height: calc(100vh - 140px);

    .wechat-layout {
      display: flex;
      height: 100%;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .sidebar {
        width: 60px;
        background: #2e3238;
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        align-items: center;

        .user-info {
          margin-bottom: 24px;
          text-align: center;

          .username {
            font-size: 12px;
            color: #fff;
            margin-top: 8px;
          }
        }

        .menu-list {
          .menu-item {
            width: 100%;
            height: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #989898;
            cursor: pointer;
            position: relative;

            .el-icon {
              font-size: 24px;
              margin-bottom: 4px;
            }

            span {
              font-size: 12px;
            }

            .badge {
              position: absolute;
              top: 0;
              right: 4px;
            }

            &:hover {
              background: #3a3f45;
            }

            &.active {
              color: #07c160;
              background: #3a3f45;
            }
          }
        }
      }

      .contacts-section {
        width: 250px;
        border-right: 1px solid #eee;
        display: flex;
        flex-direction: column;

        .search-bar {
          padding: 12px;
          border-bottom: 1px solid #eee;

          .el-input {
            :deep(.el-input__wrapper) {
              background: #f5f5f5;
              box-shadow: none !important;
              border-radius: 4px;
            }
          }
        }

        .contacts-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px 0;

          .contact-group {
            margin-bottom: 16px;

            .group-title {
              padding: 0 12px;
              font-size: 12px;
              color: #999;
              margin-bottom: 8px;
            }

            .contact-items {
              .contact-item {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                cursor: pointer;

                &:hover {
                  background: #f5f5f5;
                }

                .info {
                  margin-left: 12px;

                  .name {
                    font-size: 14px;
                    color: #333;
                    margin-bottom: 4px;
                  }

                  .signature {
                    font-size: 12px;
                    color: #999;
                  }
                }
              }
            }
          }
        }

        .letter-nav {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          padding: 8px 4px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;

          .letter-item {
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: white;
            cursor: pointer;
            border-radius: 4px;

            &:hover, &.active {
              background: #07c160;
            }
          }
        }
      }

      .chat-section {
        flex: 1;
        display: flex;
        flex-direction: column;

        .chat-list {
          width: 250px;
          border-right: 1px solid #eee;
          display: flex;
          flex-direction: column;
          
          .search-bar {
            padding: 12px;
            border-bottom: 1px solid #eee;
          }
          
          .list-content {
            flex: 1;
            overflow-y: auto;
            
            .chat-item {
              display: flex;
              padding: 12px;
              cursor: pointer;
              
              &:hover, &.active {
                background: #f5f5f5;
              }
              
              .chat-info {
                flex: 1;
                margin-left: 12px;
                
                .top {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 4px;
                  
                  .name {
                    font-weight: 500;
                  }
                  
                  .time {
                    font-size: 12px;
                    color: #999;
                  }
                }
                
                .bottom {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  
                  .message {
                    color: #999;
                    font-size: 13px;
                  }
                }
              }
            }
          }
        }
        
        .chat-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          
          .chat-header {
            padding: 12px 20px;
            border-bottom: 1px solid #eee;
            
            h3 {
              margin: 0;
              font-size: 16px;
            }
          }
          
          .message-list {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            
            .message-item {
              display: flex;
              align-items: flex-start;
              margin-bottom: 20px;
              
              &.received {
                .bubble {
                  background: white;
                  margin-left: 12px;
                }
              }
              
              &.sent {
                flex-direction: row-reverse;
                
                .bubble {
                  background: #95ec69;
                  margin-right: 12px;
                }
              }
              
              .bubble {
                max-width: 60%;
                padding: 10px 16px;
                border-radius: 4px;
                word-break: break-all;
              }
            }
          }
          
          .input-area {
            border-top: 1px solid #eee;
            padding: 12px 20px;
            
            .toolbar {
              display: flex;
              gap: 16px;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
              margin-bottom: 12px;
              
              .el-icon {
                font-size: 24px;
                color: #7c7c7c;
                cursor: pointer;
                
                &:hover {
                  color: #07c160;
                }
              }
            }
            
            .el-input {
              margin-bottom: 12px;
            }
            
            .el-button {
              float: right;
            }
          }
          
          .no-chat {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
