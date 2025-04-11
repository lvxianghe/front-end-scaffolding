<template>
  <div class="chat-container">
    <!-- 侧边栏切换按钮 - 当侧边栏折叠时显示 -->
    <div class="sidebar-toggle" v-if="sidebarCollapsed" @click="toggleSidebar" title="展开侧边栏">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"></path>
      </svg>
    </div>
    
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{'sidebar-collapsed': sidebarCollapsed}">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#333333" stroke="none">
                <path d="M2330 5110 c-192 -19 -372 -56 -550 -112 -101 -32 -107 -33 -170 -21
                -147 28 -348 7 -490 -51 -264 -108 -459 -334 -531 -614 -10 -41 -19 -89 -19
                -106 0 -23 -18 -56 -66 -121 -643 -879 -672 -2055 -72 -2947 135 -202 343
                -428 533 -580 600 -480 1387 -662 2150 -498 228 50 562 179 584 226 16 35 14
                48 -10 78 -28 36 -58 34 -169 -15 -361 -156 -780 -224 -1165 -189 -470 44
                -875 200 -1254 483 -123 92 -366 335 -458 458 -196 262 -336 547 -412 841
                -165 638 -71 1296 266 1859 l77 130 26 -83 c34 -107 59 -154 107 -200 56 -55
                115 -78 199 -78 87 0 155 31 213 96 75 85 90 188 45 315 -21 60 -25 86 -21
                140 7 104 42 164 150 255 43 36 48 68 16 108 -27 34 -63 34 -120 -2 -165 -105
                -243 -352 -170 -542 26 -69 27 -116 1 -157 -27 -46 -72 -66 -132 -61 -69 7
                -99 39 -132 140 -117 352 30 722 353 892 119 62 199 81 346 81 117 0 139 -3
                219 -29 100 -33 140 -61 156 -112 17 -51 5 -99 -35 -139 -47 -46 -90 -53 -161
                -26 -70 26 -108 27 -134 1 -26 -26 -26 -81 -2 -103 10 -10 52 -29 93 -43 57
                -20 86 -25 126 -21 106 11 192 69 241 162 21 41 26 63 25 125 0 84 -16 130
                -64 185 -18 20 -30 37 -28 39 7 7 174 45 264 61 228 40 521 44 746 10 110 -17
                318 -61 327 -70 3 -3 -6 -18 -20 -33 -101 -108 -97 -291 10 -395 84 -82 207
                -104 329 -58 52 20 76 23 140 19 90 -5 143 -28 202 -87 88 -88 112 -211 67
                -340 -44 -125 -30 -227 40 -310 56 -65 113 -93 200 -99 166 -11 273 85 330
                294 l17 65 47 -73 c356 -561 467 -1246 305 -1888 -142 -564 -495 -1071 -976
                -1400 -48 -33 -89 -67 -93 -76 -19 -50 16 -104 68 -104 60 0 310 195 501 391
                203 209 338 400 465 661 415 849 326 1855 -234 2628 -55 77 -76 113 -76 136 0
                43 -33 169 -65 245 -62 147 -199 311 -337 399 -177 115 -433 166 -638 127 -63
                -12 -68 -12 -170 21 -124 40 -275 75 -420 97 -124 18 -469 27 -590 15z"/>
                <path d="M1735 2940 c-77 -40 -80 -48 -83 -282 -3 -230 0 -245 61 -292 49 -37
                102 -42 156 -14 83 43 86 51 89 286 3 203 3 208 -20 241 -51 76 -130 99 -203
                61z"/>
                <path d="M3245 2936 c-68 -42 -78 -70 -83 -233 -3 -78 -1 -172 3 -210 6 -62
                11 -71 49 -109 53 -53 105 -64 169 -36 24 11 55 35 68 53 24 33 24 38 24 246
                0 198 -1 213 -21 239 -54 73 -139 94 -209 50z"/>
                <path d="M2479 2295 c-25 -8 -66 -33 -91 -55 -144 -126 -116 -354 54 -441 21
                -11 38 -24 38 -29 0 -22 -43 -100 -76 -138 -19 -23 -60 -53 -92 -69 -48 -24
                -70 -28 -137 -28 -67 0 -89 4 -137 28 -96 47 -161 142 -174 254 -12 95 -75
                133 -129 78 -30 -29 -32 -73 -10 -160 56 -212 241 -355 461 -355 48 0 61 -4
                97 -34 165 -133 377 -137 546 -10 54 40 63 44 118 44 110 0 227 44 312 117 84
                71 149 207 152 318 2 52 -1 61 -25 82 -59 50 -110 13 -126 -91 -18 -114 -72
                -190 -173 -243 -71 -37 -187 -39 -262 -5 -63 29 -120 83 -151 144 -31 61 -30
                74 6 93 195 101 202 375 12 478 -62 34 -148 43 -213 22z"/>
              </g>
            </svg>
          </div>
          <span>小型博美</span>
        </div>
        <div class="header-buttons">
          <button class="exit-btn" @click="goToHome" title="返回首页">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </button>
          <button class="collapse-btn" @click="toggleSidebar" :title="sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6" v-if="!sidebarCollapsed"></path>
              <path d="M9 18l6-6-6-6" v-else></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="sidebar-actions">
        <button class="new-chat-btn" @click="startNewChat">
          <span class="btn-icon">+</span> 新建对话
        </button>
      </div>
      <div class="history-list">
        <div class="history-item" v-for="(item, index) in chatHistory" :key="index" @click="showToast('历史记录功能开发中')">
          <div class="history-title">{{ item.title }}</div>
          <div class="history-time">{{ item.time }}</div>
          <button class="delete-history-btn" @click.stop="deleteHistory(index)" title="删除此对话">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="sidebar-footer">
        <button class="settings-btn" @click="showToast('设置功能开发中')">
          <span class="btn-icon">⚙️</span> 设置
        </button>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-content" :class="{'full-width': sidebarCollapsed}">
      <div class="chat-content" ref="chatContentRef">
        <template v-if="messages.length === 0">
          <div class="welcome-container">
            <div class="bot-avatar">
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#FFFFFF" stroke="none">
                  <path d="M2330 5110 c-192 -19 -372 -56 -550 -112 -101 -32 -107 -33 -170 -21
                  -147 28 -348 7 -490 -51 -264 -108 -459 -334 -531 -614 -10 -41 -19 -89 -19
                  -106 0 -23 -18 -56 -66 -121 -643 -879 -672 -2055 -72 -2947 135 -202 343
                  -428 533 -580 600 -480 1387 -662 2150 -498 228 50 562 179 584 226 16 35 14
                  48 -10 78 -28 36 -58 34 -169 -15 -361 -156 -780 -224 -1165 -189 -470 44
                  -875 200 -1254 483 -123 92 -366 335 -458 458 -196 262 -336 547 -412 841
                  -165 638 -71 1296 266 1859 l77 130 26 -83 c34 -107 59 -154 107 -200 56 -55
                  115 -78 199 -78 87 0 155 31 213 96 75 85 90 188 45 315 -21 60 -25 86 -21
                  140 7 104 42 164 150 255 43 36 48 68 16 108 -27 34 -63 34 -120 -2 -165 -105
                  -243 -352 -170 -542 26 -69 27 -116 1 -157 -27 -46 -72 -66 -132 -61 -69 7
                  -99 39 -132 140 -117 352 30 722 353 892 119 62 199 81 346 81 117 0 139 -3
                  219 -29 100 -33 140 -61 156 -112 17 -51 5 -99 -35 -139 -47 -46 -90 -53 -161
                  -26 -70 26 -108 27 -134 1 -26 -26 -26 -81 -2 -103 10 -10 52 -29 93 -43 57
                  -20 86 -25 126 -21 106 11 192 69 241 162 21 41 26 63 25 125 0 84 -16 130
                  -64 185 -18 20 -30 37 -28 39 7 7 174 45 264 61 228 40 521 44 746 10 110 -17
                  318 -61 327 -70 3 -3 -6 -18 -20 -33 -101 -108 -97 -291 10 -395 84 -82 207
                  -104 329 -58 52 20 76 23 140 19 90 -5 143 -28 202 -87 88 -88 112 -211 67
                  -340 -44 -125 -30 -227 40 -310 56 -65 113 -93 200 -99 166 -11 273 85 330
                  294 l17 65 47 -73 c356 -561 467 -1246 305 -1888 -142 -564 -495 -1071 -976
                  -1400 -48 -33 -89 -67 -93 -76 -19 -50 16 -104 68 -104 60 0 310 195 501 391
                  203 209 338 400 465 661 415 849 326 1855 -234 2628 -55 77 -76 113 -76 136 0
                  43 -33 169 -65 245 -62 147 -199 311 -337 399 -177 115 -433 166 -638 127 -63
                  -12 -68 -12 -170 21 -124 40 -275 75 -420 97 -124 18 -469 27 -590 15z m1525
                  -295 c352 -93 590 -439 546 -792 -14 -112 -56 -234 -92 -269 -58 -55 -167 -41
                  -209 29 -26 41 -25 88 1 157 27 70 36 190 19 261 -65 277 -340 425 -616 333
                  -82 -27 -83 -27 -128 -10 -73 28 -109 100 -86 169 14 45 44 71 110 97 129 51
                  319 62 455 25z"/>
                  <path d="M1735 2940 c-77 -40 -80 -48 -83 -282 -3 -230 0 -245 61 -292 49 -37
                  102 -42 156 -14 83 43 86 51 89 286 3 203 3 208 -20 241 -51 76 -130 99 -203
                  61z"/>
                  <path d="M3245 2936 c-68 -42 -78 -70 -83 -233 -3 -78 -1 -172 3 -210 6 -62
                  11 -71 49 -109 53 -53 105 -64 169 -36 24 11 55 35 68 53 24 33 24 38 24 246
                  0 198 -1 213 -21 239 -54 73 -139 94 -209 50z"/>
                  <path d="M2479 2295 c-25 -8 -66 -33 -91 -55 -144 -126 -116 -354 54 -441 21
                  -11 38 -24 38 -29 0 -22 -43 -100 -76 -138 -19 -23 -60 -53 -92 -69 -48 -24
                  -70 -28 -137 -28 -67 0 -89 4 -137 28 -96 47 -161 142 -174 254 -12 95 -75
                  133 -129 78 -30 -29 -32 -73 -10 -160 56 -212 241 -355 461 -355 48 0 61 -4
                  97 -34 165 -133 377 -137 546 -10 54 40 63 44 118 44 110 0 227 44 312 117 84
                  71 149 207 152 318 2 52 -1 61 -25 82 -59 50 -110 13 -126 -91 -18 -114 -72
                  -190 -173 -243 -71 -37 -187 -39 -262 -5 -63 29 -120 83 -151 144 -31 61 -30
                  74 6 93 195 101 202 375 12 478 -62 34 -148 43 -213 22z m189 -817 c23 -18 42
                  -35 42 -39 0 -15 -98 -44 -150 -44 -52 0 -150 29 -150 44 0 4 13 14 29 24 16
                  9 51 41 78 70 l48 53 30 -37 c17 -21 49 -53 73 -71z"/>
                </g>
              </svg>
            </div>
            <div class="welcome-title">我是 小型博美, 很高兴见到你!</div>
            <div class="welcome-subtitle">我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~</div>
          </div>
        </template>
        
        <div class="message-container" v-else>
          <div v-for="(message, index) in messages" :key="index" 
               :class="['message-item', message.role === 'user' ? 'user-message' : 'bot-message']">
            <div class="message-avatar">
              {{ message.role === 'user' ? '👤' : '🤖' }}
            </div>
            <div class="message-content">
              <div class="message-text" v-html="message.content"></div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
          <div class="typing-indicator" v-if="isTyping">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
      
      <!-- 中央输入区域 -->
      <div class="chat-input-wrapper" :class="{'with-messages': messages.length > 0}">
        <div class="chat-input-area">
          <div class="mode-selector-inner">
            <button class="mode-btn deep-think-btn" @click="showToast('深度思考功能开发中')" title="深度思考">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 1 0 9 10 10 0 0 0 0-18z"></path>
                <path d="M12 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0-5"></path>
              </svg>
              <span>深度思考 (R1)</span>
            </button>
            <button class="mode-btn web-search-btn" @click="showToast('联网搜索功能开发中')" title="联网搜索">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>联网搜索</span>
            </button>
          </div>
          
          <textarea 
            v-model="userInput" 
            class="chat-input" 
            placeholder="给 小型博美 发送消息" 
            @keydown.enter.prevent="sendMessage"
            rows="1"
            ref="inputRef"
          ></textarea>
          
          <div class="input-tools">
            <button class="tool-btn upload-btn" @click="showToast('文件上传功能正在开发中')" title="上传文件">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </button>
            <button class="send-btn" @click="sendMessage" :disabled="!userInput.trim()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast 消息提示 -->
    <div class="toast-container" v-if="toast.show" :class="{ 'toast-show': toast.show }">
      <div class="toast-message">{{ toast.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';

// 聊天消息
interface Message {
  role: 'user' | 'bot';
  content: string;
  time: string;
}

// 历史记录
interface HistoryItem {
  id: number;
  title: string;
  time: string;
}

const userInput = ref('');
const messages = ref<Message[]>([]);
const isTyping = ref(false);
const chatContentRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLTextAreaElement | null>(null);
const sidebarCollapsed = ref(false);

// 模拟历史记录
const chatHistory = ref<HistoryItem[]>([
  { id: 1, title: '企业知识库问答示例', time: '今天' },
  { id: 2, title: '如何接入知识库', time: '昨天' },
  { id: 3, title: '多轮对话演示', time: '2天前' },
  { id: 4, title: '文档处理流程', time: '3天前' },
]);

// Toast 消息状态
const toast = ref({
  show: false,
  message: ''
});

// 功能特点展示
const features = [
  {
    icon: '🔍',
    title: '知识库检索',
    description: '精准检索企业知识库，回答专业问题'
  },
  {
    icon: '💬',
    title: '多轮对话',
    description: '支持上下文理解与状态保持'
  },
  {
    icon: '📄',
    title: '文档处理',
    description: '自动解析多种格式文档并向量化'
  },
  {
    icon: '⚡',
    title: '流式响应',
    description: '实时打字效果，提升用户体验'
  }
];

// 显示 Toast 消息
const showToast = (message: string) => {
  toast.value.message = message;
  toast.value.show = true;
  
  // 3秒后自动关闭
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  // 本地存储用户偏好
  localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed.value));
};

// 删除历史记录
const deleteHistory = (index: number) => {
  chatHistory.value.splice(index, 1);
  showToast('已删除该对话');
};

// 新建对话
const startNewChat = () => {
  messages.value = [];
  showToast('新建对话成功');
};

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim()) return;
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userInput.value,
    time: getCurrentTime()
  });
  
  const question = userInput.value;
  userInput.value = '';
  
  // 自动调整输入框高度
  if (inputRef.value) {
    inputRef.value.style.height = 'auto';
  }
  
  // 滚动到底部
  await nextTick();
  scrollToBottom();
  
  // 模拟机器人响应
  isTyping.value = true;
  setTimeout(() => {
    isTyping.value = false;
    messages.value.push({
      role: 'bot',
      content: '该功能正在开发中，敬请期待！我们的智能问答系统将很快为您提供精准的知识库检索和专业的问题解答服务。',
      time: getCurrentTime()
    });
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom();
    });
  }, 1500);
};

// 滚动到底部
const scrollToBottom = () => {
  if (chatContentRef.value) {
    chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
  }
};

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  nextTick(() => {
    scrollToBottom();
  });
});

// 监听输入框内容变化，自动调整高度
watch(userInput, () => {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = 'auto';
      const newHeight = Math.min(inputRef.value.scrollHeight, 150);
      inputRef.value.style.height = `${newHeight}px`;
    }
  });
});

// 返回首页
const goToHome = () => {
  // 使用Vue Router导航到首页
  window.location.href = '/home';
  // 也可以使用router.push('/home') 如果有引入router
};

onMounted(() => {
  // 自动聚焦输入框
  if (inputRef.value) {
    inputRef.value.focus();
  }
  
  // 恢复侧边栏状态
  const savedState = localStorage.getItem('sidebarCollapsed');
  if (savedState) {
    sidebarCollapsed.value = savedState === 'true';
  }
});
</script>

<style lang="less" scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background-color: #f7f7f9;
  color: #333;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  position: relative;
}

/* 侧边栏切换按钮 */
.sidebar-toggle {
  position: fixed;
  left: 10px;
  top: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 30;
  border: none;
  color: #666;
  transition: all 0.2s;
  
  &:hover {
    background: #f0f0f3;
    color: #333;
    transform: scale(1.05);
  }
  
  svg {
    stroke: currentColor;
  }
}

/* 侧边栏样式 */
.sidebar {
  width: 280px;
  background: #f0f0f3;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  
  &.sidebar-collapsed {
    width: 0;
    margin-left: -10px;
    border: none;
  }
  
  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 60px;
    
    .logo {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 8px;
      
      .logo-icon {
        width: 28px;
        height: 28px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        
        svg {
          width: 100%;
          height: 100%;
        }
      }
      
      span {
        position: relative;
        top: 1px;
      }
    }
    
    .header-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }
    
    .exit-btn,
    .collapse-btn {
      background: transparent;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #666;
      transition: all 0.2s;
      
      &:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #333;
      }
    }
    
    .exit-btn:hover {
      color: #e74c3c;
      background: rgba(231, 76, 60, 0.1);
    }
  }
  
  .sidebar-actions {
    padding: 16px;
    
    .new-chat-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background: linear-gradient(135deg, #FF9A8B, #FF6B95);
      color: white;
      border: none;
      border-radius: 18px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 10px rgba(255, 107, 149, 0.3);
      font-weight: 600;
      
      &:hover {
        background: linear-gradient(135deg, #FF8A7B, #FF5B85);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(255, 107, 149, 0.4);
      }
      
      .btn-icon {
        margin-right: 8px;
        font-weight: bold;
        font-size: 1.2rem;
      }
    }
  }
  
  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    
    .history-item {
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: background 0.2s;
      position: relative;
      
      &:hover {
        background: #e8e8e8;
        
        .delete-history-btn {
          opacity: 1;
        }
      }
      
      .history-title {
        font-size: 0.9rem;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 24px;
      }
      
      .history-time {
        font-size: 0.8rem;
        color: #888;
      }
      
      .delete-history-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        color: #999;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: all 0.2s;
        
        &:hover {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
        }
      }
    }
  }
  
  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid #e5e5e5;
    
    .settings-btn {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 0.95rem;
      cursor: pointer;
      
      &:hover {
        background: #f5f5f5;
      }
      
      .btn-icon {
        margin-right: 8px;
      }
    }
  }
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.full-width {
    width: 100%;
  }
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  
  .welcome-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: -100px;
    
    .bot-avatar {
      margin-bottom: 20px;
      width: 150px;
      height: 150px;
      background: linear-gradient(135deg, #FF9A8B, #FF6B95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(255, 107, 149, 0.4);
      position: relative;
      overflow: hidden;
      
      svg {
        width: 180px;
        height: 180px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -42%);
        
        g {
          filter: drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.15));
        }
      }
    }
    
    .welcome-title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 16px;
      color: #333;
    }
    
    .welcome-subtitle {
      font-size: 1.1rem;
      color: #666;
      max-width: 600px;
      line-height: 1.5;
    }
  }
  
  .message-container {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
    
    .message-item {
      display: flex;
      margin-bottom: 24px;
      
      .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
        margin-right: 12px;
      }
      
      .message-content {
        background: white;
        border-radius: 12px;
        padding: 12px 16px;
        max-width: calc(100% - 60px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        
        .message-text {
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .message-time {
          font-size: 0.8rem;
          color: #999;
          margin-top: 6px;
          text-align: right;
        }
      }
      
      &.user-message {
        flex-direction: row-reverse;
        
        .message-avatar {
          margin-right: 0;
          margin-left: 12px;
          background: #deeaff;
        }
        
        .message-content {
          background: #2c3e50;
          color: white;
          
          .message-time {
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }
      
      &.bot-message {
        .message-avatar {
          background: #f0f7ff;
        }
      }
    }
    
    .typing-indicator {
      display: flex;
      padding: 12px 16px;
      background: white;
      border-radius: 12px;
      width: fit-content;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      
      .typing-dot {
        width: 8px;
        height: 8px;
        background: #888;
        border-radius: 50%;
        margin: 0 2px;
        animation: typing-dot 1.4s infinite ease-in-out both;
        
        &:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        &:nth-child(2) {
          animation-delay: -0.16s;
        }
      }
    }
  }
}

.chat-input-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  transition: all 0.3s ease;
  
  &.with-messages {
    position: relative;
    bottom: 0;
    padding: 20px;
    margin-top: 20px;
  }
  
  .chat-input-area {
    display: flex;
    position: relative;
    flex-direction: column;
    background: white;
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    
    .mode-selector-inner {
      display: flex;
      margin-bottom: 10px;
      gap: 8px;
      
      .mode-btn {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        border-radius: 20px;
        background-color: rgba(0, 0, 0, 0.05);
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
        color: #333;
        
        svg {
          margin-right: 6px;
        }
        
        &.deep-think-btn {
          background-color: rgba(100, 80, 220, 0.1);
          color: #5140a7;
          
          svg {
            stroke: #5140a7;
          }
          
          &:hover {
            background-color: rgba(100, 80, 220, 0.2);
          }
        }
        
        &.web-search-btn {
          background-color: rgba(14, 165, 233, 0.1);
          color: #0284c7;
          
          svg {
            stroke: #0284c7;
          }
          
          &:hover {
            background-color: rgba(14, 165, 233, 0.2);
          }
        }
      }
    }
    
    .chat-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 1.05rem;
      resize: none;
      outline: none;
      line-height: 1.5;
      max-height: 150px;
      min-height: 36px;
      padding: 8px 0;
      font-family: inherit;
      margin-bottom: 8px;
    }
    
    .input-tools {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      
      .tool-btn {
        background: transparent;
        border: none;
        color: #666;
        padding: 6px 8px;
        margin-right: 6px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #333;
        }
      }
      
      .send-btn {
        color: #4665ee;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 6px 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          background: rgba(70, 101, 238, 0.1);
        }
        
        &:disabled {
          color: #ccc;
          cursor: not-allowed;
        }
        
        svg {
          stroke: currentColor;
        }
      }
    }
  }
}

/* Toast 样式 */
.toast-container {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(44, 62, 80, 0.9);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  
  &.toast-show {
    opacity: 1;
  }
  
  .toast-message {
    font-size: 1rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@keyframes typing-dot {
  0%, 80%, 100% { transform: scale(0.7); }
  40% { transform: scale(1); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .chat-container {
    flex-direction: column;
  }
  
  .sidebar-toggle {
    top: 10px;
    left: 10px;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    max-height: 300px;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    
    &.sidebar-collapsed {
      max-height: 0;
      padding: 0;
      margin: 0;
      border-bottom: none;
    }
  }
  
  .chat-input-wrapper {
    bottom: 20px;
    padding: 0 16px;
    
    &.with-messages {
      padding: 10px 16px;
    }
  }
}

@media (max-width: 992px) {
  .sidebar:not(.sidebar-collapsed) {
    width: 240px;
  }
}
</style> 