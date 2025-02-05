<template>
  <div class="chatgpt-container">
    <GridNav />
    <div class="content">
      <div class="chat-container">
        <!-- 左侧会话列表 -->
        <div class="chat-list">
          <div class="new-chat" @click="createNewChat">
            <el-button>
              <el-icon><Plus /></el-icon>
              新建会话
            </el-button>
          </div>
          <div class="history-list">
            <div 
              v-for="chat in chatList" 
              :key="chat.id"
              class="chat-item"
              :class="{ active: currentChat?.id === chat.id }"
              @click="switchChat(chat)"
            >
              <el-icon><ChatDotRound /></el-icon>
              <span class="title">{{ chat.title }}</span>
              <el-icon class="delete" @click.stop="deleteChat(chat)"><Delete /></el-icon>
            </div>
          </div>
        </div>

        <!-- 右侧聊天区域 -->
        <div class="chat-main">
          <!-- 聊天记录 -->
          <div class="message-list" ref="messageList">
            <template v-if="currentChat?.messages.length">
              <div 
                v-for="msg in currentChat.messages" 
                :key="msg.id"
                class="message-item"
                :class="msg.role"
              >
                <div class="avatar">
                  <el-avatar 
                    :size="40" 
                    :src="msg.role === 'user' ? userAvatar : botAvatar"
                  />
                </div>
                <div class="message-content">
                  <div class="name">{{ msg.role === 'user' ? '你' : 'ChatGPT' }}</div>
                  <div class="content markdown-body" v-html="renderMessage(msg.content)" />
                  <div class="actions">
                    <el-button 
                      v-if="msg.role === 'assistant'"
                      text 
                      size="small"
                      @click="copyMessage(msg.content)"
                    >
                      <el-icon><DocumentCopy /></el-icon>
                      复制
                    </el-button>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="empty-state">
              <div class="title">ChatGPT</div>
              <div class="subtitle">AI 助手</div>
              <div class="examples">
                <div 
                  v-for="example in examples" 
                  :key="example"
                  class="example-item"
                  @click="sendMessage(example)"
                >
                  {{ example }}
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="input-area">
            <div class="input-wrapper">
              <el-input
                v-model="inputMessage"
                type="textarea"
                :rows="1"
                :autosize="{ minRows: 1, maxRows: 4 }"
                placeholder="输入消息，Shift + Enter 换行，Enter 发送"
                @keydown.enter.exact.prevent="sendMessage"
                @keydown.enter.shift.exact="newline"
                :disabled="isTyping"
              >
                <template #append>
                  <el-button 
                    class="send-btn"
                    :class="{ 'can-send': inputMessage.trim() }"
                    :disabled="isTyping"
                    @click="sendMessage"
                  >
                    <el-icon v-if="!isTyping"><Position /></el-icon>
                    <el-icon v-else class="loading"><Loading /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </div>
            <div class="tips">
              <el-icon><InfoFilled /></el-icon>
              ChatGPT 可能会生成错误信息。考虑检查重要信息。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import hljs from 'highlight.js'
import GridNav from '@/components/GridNav.vue'

// 配置 marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface Chat {
  id: number
  title: string
  messages: Message[]
}

const userAvatar = 'https://picsum.photos/40/40'
const botAvatar = '/chatgpt-icon.png' // 替换为实际的 ChatGPT 图标

const messageList = ref<HTMLElement | null>(null)
const inputMessage = ref('')
const isTyping = ref(false)

const examples = [
  '解释一下 Vue3 的 Composition API',
  '帮我写一个快速排序算法',
  '如何使用 TypeScript 的泛型',
  '介绍下 CSS Grid 布局'
]

const chatList = reactive<Chat[]>([])
const currentChat = ref<Chat | null>(null)

const createNewChat = () => {
  const newChat: Chat = {
    id: Date.now(),
    title: '新会话',
    messages: []
  }
  chatList.unshift(newChat)
  currentChat.value = newChat
}

const switchChat = (chat: Chat) => {
  currentChat.value = chat
  nextTick(() => {
    scrollToBottom()
  })
}

const deleteChat = (chat: Chat) => {
  const index = chatList.indexOf(chat)
  if (index > -1) {
    chatList.splice(index, 1)
    if (currentChat.value === chat) {
      currentChat.value = chatList[0] || null
    }
  }
}

const renderMessage = (content: string) => {
  return marked(content)
}

const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

const scrollToBottom = () => {
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight
  }
}

const newline = (e: KeyboardEvent) => {
  const target = e.target as HTMLTextAreaElement
  const start = target.selectionStart
  const end = target.selectionEnd
  inputMessage.value = 
    inputMessage.value.substring(0, start) + 
    '\n' + 
    inputMessage.value.substring(end)
  nextTick(() => {
    target.selectionStart = target.selectionEnd = start + 1
  })
}

// 模拟一个较长的回复
const mockResponse = `让我为你详细解释一下 Vue3 的 Composition API。

Composition API 是 Vue3 中最重要的新特性之一，它提供了一种全新的组织组件逻辑的方式。

主要特点：

1. 更好的代码组织
与 Options API 相比，Composition API 允许我们将相关的代码组织在一起，而不是分散在不同的选项中。

2. 更好的类型推导
TypeScript 可以更好地推导 Composition API 的类型，提供更好的类型支持。

让我们看一个例子：

\`\`\`typescript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    // 响应式状态
    const count = ref(0)
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    // 生命周期钩子
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    // 返回需要暴露给模板的内容
    return {
      count,
      doubleCount,
      increment
    }
  }
}
\`\`\`

3. 更好的逻辑复用
通过组合式函数（Composables），我们可以轻松地在不同组件之间复用逻辑：

\`\`\`typescript
// useCounter.ts
import { ref, computed } from 'vue'

export function useCounter() {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  return {
    count,
    doubleCount,
    increment
  }
}
\`\`\`

4. 更好的性能
Composition API 的代码更容易被 tree-shaking，可以实现更好的打包优化。

总的来说，Composition API 为 Vue 开发带来了更多的灵活性和可维护性。虽然它的学习曲线可能比 Options API 更陡，但带来的好处是值得的。`

// 修改流式打印效果函数
const streamResponse = async (response: string) => {
  const message: Message = {
    id: Date.now(),
    role: 'assistant',
    content: '',
    timestamp: Date.now()
  }
  currentChat.value?.messages.push(message)
  
  // 按字符打印，但代码块整块显示
  let buffer = ''
  let inCodeBlock = false
  
  for (let i = 0; i < response.length; i++) {
    const char = response[i]
    const nextThree = response.slice(i, i + 3)
    
    if (nextThree === '```') {
      if (inCodeBlock) {
        // 结束代码块，一次性显示
        message.content += buffer + '```'
        buffer = ''
        inCodeBlock = false
        i += 2 // 跳过剩余的 ` 字符
      } else {
        // 开始代码块
        message.content += char
        inCodeBlock = true
      }
    } else if (inCodeBlock) {
      // 在代码块内，累积到缓冲区
      buffer += char
    } else {
      // 正常文本，直接显示
      message.content += char
      await new Promise(resolve => setTimeout(resolve, 30))
    }
    
    scrollToBottom()
  }
  
  // 确保所有内容都显示出来
  if (buffer) {
    message.content += buffer
  }
}

const sendMessage = async (content?: string) => {
  const message = content || inputMessage.value.trim()
  if (!message || isTyping.value) return
  
  if (!currentChat.value) {
    createNewChat()
  }
  
  // 添加用户消息
  currentChat.value?.messages.push({
    id: Date.now(),
    role: 'user',
    content: message,
    timestamp: Date.now()
  })
  
  inputMessage.value = ''
  scrollToBottom()
  
  // 模拟 AI 响应
  isTyping.value = true
  
  try {
    // 根据不同的问题返回不同的回复
    let response = mockResponse
    if (message.includes('Vue3')) {
      response = mockVue3Response
    } else if (message.includes('排序')) {
      response = mockSortResponse
    } else if (message.includes('TypeScript')) {
      response = mockTypeScriptResponse
    } else if (message.includes('CSS')) {
      response = mockCSSResponse
    }
    
    await streamResponse(response)
  } catch (error) {
    console.error('Error:', error)
    // 添加错误消息
    currentChat.value?.messages.push({
      id: Date.now(),
      role: 'assistant',
      content: '抱歉，出现了一些错误，请稍后重试。',
      timestamp: Date.now()
    })
  } finally {
    isTyping.value = false
  }
  
  // 更新会话标题
  if (currentChat.value?.messages.length === 2) {
    currentChat.value.title = message.slice(0, 20) + (message.length > 20 ? '...' : '')
  }
}

// 添加更多示例回复
const mockVue3Response = `Vue3 的 Composition API 是一个革命性的特性...`
const mockSortResponse = `快速排序算法的实现如下：\n\`\`\`typescript...`
const mockTypeScriptResponse = `TypeScript 的泛型是一个强大的特性...`
const mockCSSResponse = `CSS Grid 布局是一个二维布局系统...`

onMounted(() => {
  createNewChat()
})
</script>

<style lang="less" scoped>
.chatgpt-container {
  min-height: 100vh;
  background: #343541;
  padding-top: 120px;
  
  .content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;

    .chat-container {
      display: flex;
      gap: 20px;
      height: calc(100vh - 140px);
      
      .chat-list {
        width: 260px;
        background: #202123;
        border-radius: 12px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        
        .new-chat {
          margin-bottom: 20px;
          
          .el-button {
            width: 100%;
            background: #444654;
            border: none;
            color: white;
            height: 44px;
            
            &:hover {
              background: #40414f;
            }
          }
        }
        
        .history-list {
          flex: 1;
          overflow-y: auto;
          
          .chat-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px;
            color: #fff;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.3s;
            
            .title {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            
            .delete {
              opacity: 0;
              transition: opacity 0.3s;
            }
            
            &:hover {
              background: #2a2b32;
              
              .delete {
                opacity: 1;
              }
            }
            
            &.active {
              background: #343541;
            }
          }
        }
      }
      
      .chat-main {
        flex: 1;
        background: #343541;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        
        .message-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px 0;
          
          .message-item {
            display: flex;
            padding: 20px;
            
            &.user {
              background: #343541;
            }
            
            &.assistant {
              background: #444654;
            }
            
            .avatar {
              margin-right: 16px;
            }
            
            .message-content {
              flex: 1;
              max-width: 800px;
              margin: 0 auto;
              
              .name {
                font-size: 14px;
                color: #999;
                margin-bottom: 8px;
              }
              
              .content {
                color: white;
                line-height: 1.6;
                font-size: 15px;
                white-space: pre-wrap;
                word-break: break-word;
                
                :deep(pre) {
                  background: #1e1e1e;
                  padding: 12px;
                  border-radius: 6px;
                  margin: 12px 0;
                  
                  code {
                    color: #d4d4d4;
                  }
                }
                
                :deep(p) {
                  margin: 12px 0;
                }
              }
              
              .actions {
                margin-top: 12px;
                opacity: 0;
                transition: opacity 0.3s;
                
                .el-button {
                  color: #999;
                  
                  &:hover {
                    color: white;
                  }
                }
              }
            }
            
            &:hover {
              .actions {
                opacity: 1;
              }
            }
          }
          
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: white;
            
            .title {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 12px;
            }
            
            .subtitle {
              font-size: 16px;
              color: #999;
              margin-bottom: 32px;
            }
            
            .examples {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              max-width: 600px;
              
              .example-item {
                background: #444654;
                padding: 16px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
                
                &:hover {
                  background: #40414f;
                  transform: translateY(-2px);
                }
              }
            }
          }
        }
        
        .input-area {
          padding: 20px;
          background: #343541;
          border-top: 1px solid #565869;
          
          .input-wrapper {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            
            .el-input {
              :deep(.el-textarea__wrapper) {
                background: #40414f;
                border: none;
                box-shadow: none !important;
                border-radius: 12px;
                padding: 12px;
                
                &:hover, &.is-focus {
                  background: #40414f;
                }
                
                .el-textarea__inner {
                  color: white;
                  font-size: 15px;
                  line-height: 1.5;
                  
                  &::placeholder {
                    color: #8e8ea0;
                  }
                }
              }
              
              :deep(.el-input__suffix) {
                padding: 0;
                
                .send-btn {
                  width: 32px;
                  height: 32px;
                  min-width: unset;
                  padding: 0;
                  border: none;
                  background: transparent;
                  opacity: 0.6;
                  transition: all 0.3s;
                  margin-right: 8px;
                  
                  .el-icon {
                    font-size: 16px;
                  }
                  
                  &.can-send {
                    opacity: 1;
                    background: #19c37d;
                    border-radius: 8px;
                    
                    &:hover {
                      background: #1a8870;
                      transform: translateY(-1px);
                    }
                  }
                  
                  .loading {
                    animation: rotate 1s linear infinite;
                  }
                }
              }
            }
          }
          
          .tips {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #8e8ea0;
            font-size: 12px;
            margin-top: 12px;
            justify-content: center;
          }
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
