<template>
  <div>
    <!-- 蓝色背景区域 -->
    <div class="knowledge-container">
      <!-- 返回按钮 -->
      <div class="exit-button" @click="goBack">
        <el-icon><Back /></el-icon>
        <span>返回</span>
      </div>
      
      <!-- 操作提示 -->
      <div class="operation-tips">
        <h3>操作指南</h3>
        <ul>
          <li><kbd>←</kbd> <kbd>→</kbd> 键切换区域</li>
          <li><kbd>W</kbd>+<kbd>Enter</kbd> 在上方添加知识点</li>
          <li><kbd>S</kbd>+<kbd>Enter</kbd> 在下方添加知识点</li>
          <li>点击区域空白处选中该区域</li>
        </ul>
      </div>
      
      <!-- 知识库管理区域（蓝色区域） -->
      <div class="knowledge-content">
        <div class="knowledge-layout">
          <!-- 左侧知识点列表 -->
          <div 
            class="knowledge-topics" 
            @click.stop="focusOnTopics"
            :class="{ 'focused': currentFocus === 'topics' }"
            @keydown="handleTopicKeyDown"
            tabindex="0"
          >
            <div class="section-header">
              <h2>知识点</h2>
              <el-button type="primary" size="small" @click="addTopic">
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>
            
            <ul class="topic-list">
              <li 
                v-for="(topic, index) in topics" 
                :key="index"
                :class="{ active: currentTopicIndex === index }"
                @click="selectTopic(index)"
              >
                <div class="item-name">{{ topic.name }}</div>
                <div class="item-actions">
                  <el-icon @click.stop="editTopic(index)"><Edit /></el-icon>
                  <el-icon @click.stop="removeTopic(index)"><Delete /></el-icon>
                </div>
              </li>
            </ul>
          </div>
          
          <!-- 中间知识点简述 -->
          <div 
            class="knowledge-summary" 
            @click.stop="focusOnSummary"
            :class="{ 'focused': currentFocus === 'summary' }"
          >
            <div class="section-header">
              <h2>简述</h2>
              <el-button 
                type="primary" 
                size="small" 
                @click="saveSummary"
                :disabled="currentTopicIndex === -1 || !summaryChanged"
              >
                <el-icon><Check /></el-icon>
              </el-button>
            </div>
            
            <div v-if="currentTopicIndex !== -1" class="editor-container">
              <el-input
                type="textarea"
                v-model="currentSummary"
                placeholder="请输入知识点简述"
                :rows="15"
                @input="handleSummaryChange"
              />
            </div>
            <el-empty v-else description="请先选择或创建知识点"></el-empty>
          </div>
          
          <!-- 右侧知识点详述 -->
          <div 
            class="knowledge-details" 
            @click.stop="focusOnDetails"
            :class="{ 'focused': currentFocus === 'details' }"
          >
            <div class="section-header">
              <h2>详述</h2>
              <el-button 
                type="primary" 
                size="small" 
                @click="saveDetails"
                :disabled="currentTopicIndex === -1 || !detailsChanged"
              >
                <el-icon><Check /></el-icon>
              </el-button>
            </div>
            
            <div v-if="currentTopicIndex !== -1" class="editor-container">
              <el-input
                type="textarea"
                v-model="currentDetails"
                placeholder="请输入知识点详述"
                :rows="15"
                @input="handleDetailsChange"
              />
            </div>
            <el-empty v-else description="请先选择或创建知识点"></el-empty>
          </div>
        </div>
      </div>
      
      <!-- 添加一个按钮，用于清除选择状态 -->
      <div class="clear-selection-button" @click="clearSelectionManually">
        <el-icon><Close /></el-icon>
      </div>
    </div>
    
    <!-- 对话框 - 添加/编辑知识点 -->
    <el-dialog
      v-model="topicDialogVisible"
      :title="isEditing ? '编辑知识点' : '添加知识点'"
      width="30%"
      @opened="focusInput('topic-input')"
    >
      <el-form 
        :model="topicForm" 
        label-width="80px"
        @submit.prevent="submitTopicForm"
      >
        <el-form-item label="名称">
          <el-input 
            ref="topicInput"
            id="topic-input"
            v-model="topicForm.name" 
            placeholder="例如：Vue组件通信" 
            @keyup.enter.prevent="submitTopicForm" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="topicDialogVisible = false">取消</el-button>
          <el-button type="primary" @click.prevent="submitTopicForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch, h } from 'vue'
import { useRouter } from 'vue-router'
import { Back, Plus, Edit, Delete, Check, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 返回首页
const goBack = () => {
  router.push('/home')
}

// 当前焦点区域
const currentFocus = ref('none'); // 'topics', 'summary', 'details'

// 焦点设置函数
const focusOnTopics = () => {
  currentFocus.value = 'topics';
};

const focusOnSummary = () => {
  currentFocus.value = 'summary';
};

const focusOnDetails = () => {
  currentFocus.value = 'details';
};

// 知识库数据
interface Topic {
  name: string;
  summary: string;
  details: string;
}

const topics = ref<Topic[]>([]);
const currentTopicIndex = ref(-1);
const currentSummary = ref('');
const currentDetails = ref('');
const summaryChanged = ref(false);
const detailsChanged = ref(false);

// 对话框状态
const topicDialogVisible = ref(false);
const isEditing = ref(false);
const editingIndex = ref(-1);
const insertPosition = ref(-1); // -1: 末尾, >=0: 在指定索引之前插入

// 表单数据
const topicForm = ref({ name: '' });

// 添加输入框引用
const topicInput = ref(null);

// 自动聚焦输入框
const focusInput = (inputId: string) => {
  nextTick(() => {
    const input = document.getElementById(inputId);
    if (input) {
      input.focus();
    }
  });
};

// 选中知识点
const selectTopic = (index: number) => {
  if (currentTopicIndex.value !== -1) {
    // 先保存当前编辑的内容
    saveCurrentContent();
  }
  
  currentTopicIndex.value = index;
  currentFocus.value = 'topics';
  
  if (index !== -1) {
    // 加载选中知识点的内容
    currentSummary.value = topics.value[index].summary;
    currentDetails.value = topics.value[index].details;
    summaryChanged.value = false;
    detailsChanged.value = false;
  }
};

// 添加知识点
const addTopic = () => {
  isEditing.value = false;
  topicForm.value = { name: '' };
  insertPosition.value = -1; // 默认在末尾添加
  topicDialogVisible.value = true;
};

// 在当前知识点上方添加新知识点
const addTopicAbove = () => {
  if (currentTopicIndex.value !== -1) {
    isEditing.value = false;
    topicForm.value = { name: '' };
    insertPosition.value = currentTopicIndex.value;
    topicDialogVisible.value = true;
  } else {
    addTopic(); // 如果没有选中，就在末尾添加
  }
};

// 在当前知识点下方添加新知识点
const addTopicBelow = () => {
  if (currentTopicIndex.value !== -1) {
    isEditing.value = false;
    topicForm.value = { name: '' };
    insertPosition.value = currentTopicIndex.value + 1;
    topicDialogVisible.value = true;
  } else {
    addTopic(); // 如果没有选中，就在末尾添加
  }
};

// 处理知识点区域的键盘事件
const handleTopicKeyDown = (event) => {
  // 监听 W+Enter 组合键：在上方添加知识点
  if (event.key === 'w' && event.ctrlKey) {
    event.preventDefault();
    addTopicAbove();
    return;
  }
  
  // 监听 S+Enter 组合键：在下方添加知识点
  if (event.key === 's' && event.ctrlKey) {
    event.preventDefault();
    addTopicBelow();
    return;
  }
};

// 编辑知识点
const editTopic = (index: number) => {
  isEditing.value = true;
  editingIndex.value = index;
  topicForm.value = { name: topics.value[index].name };
  topicDialogVisible.value = true;
};

// 删除知识点
const removeTopic = (index: number) => {
  if (index >= 0 && index < topics.value.length) {
    topics.value.splice(index, 1);
    
    if (currentTopicIndex.value === index) {
      // 如果删除的是当前选中的知识点，清除选中状态
      currentTopicIndex.value = -1;
      currentSummary.value = '';
      currentDetails.value = '';
      summaryChanged.value = false;
      detailsChanged.value = false;
    } else if (currentTopicIndex.value > index) {
      // 如果删除的知识点在当前选中的知识点前面，调整选中索引
      currentTopicIndex.value--;
    }
    
    saveTopicsToLocalStorage();
    ElMessage.success('知识点已删除');
  }
};

// 添加错误处理函数
const handleError = (error, operation = '操作') => {
  console.error(`${operation}失败:`, error);
  
  // 准备错误信息
  const errorMessage = error?.message || String(error) || '未知错误';
  
  // 显示带有复制按钮的错误消息
  ElMessage({
    message: h('div', { class: 'error-message-with-copy' }, [
      h('span', null, `${operation}失败: ${errorMessage}`),
      h('el-button', {
        size: 'small',
        type: 'primary',
        onClick: () => copyErrorToClipboard(errorMessage)
      }, '复制错误')
    ]),
    type: 'error',
    duration: 5000, // 延长显示时间
    showClose: true
  });
};

// 复制错误信息到剪贴板
const copyErrorToClipboard = (errorText) => {
  try {
    // 创建一个包含完整错误信息的文本
    const fullErrorText = `错误信息: ${errorText}\n时间: ${new Date().toLocaleString()}`;
    
    // 使用 Clipboard API 复制文本
    navigator.clipboard.writeText(fullErrorText)
      .then(() => {
        ElMessage.success('错误信息已复制到剪贴板');
      })
      .catch((err) => {
        console.error('复制失败:', err);
        fallbackCopyToClipboard(fullErrorText);
      });
  } catch (e) {
    console.error('复制过程出错:', e);
    fallbackCopyToClipboard(errorText);
  }
};

// 复制到剪贴板的后备方案
const fallbackCopyToClipboard = (text) => {
  // 创建临时文本区域
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    // 尝试使用document.execCommand('copy')复制
    const successful = document.execCommand('copy');
    if (successful) {
      ElMessage.success('错误信息已复制到剪贴板');
    } else {
      ElMessage.warning('无法复制错误信息');
    }
  } catch (err) {
    ElMessage.error('复制失败');
    console.error('复制失败:', err);
  }
  
  // 移除临时元素
  document.body.removeChild(textArea);
};

// 提交知识点表单
const submitTopicForm = async () => {
  if (!topicForm.value.name.trim()) {
    ElMessage.warning('请输入知识点名称');
    return;
  }
  
  try {
    if (isEditing.value) {
      // 编辑现有知识点
      topics.value[editingIndex.value].name = topicForm.value.name;
      ElMessage.success('知识点已更新');
    } else {
      // 添加新知识点
      const newTopic: Topic = {
        name: topicForm.value.name,
        summary: '',
        details: ''
      };
      
      if (insertPosition.value >= 0 && insertPosition.value <= topics.value.length) {
        // 在指定位置插入
        topics.value.splice(insertPosition.value, 0, newTopic);
        
        // 如果当前有选中的知识点，且新知识点在其前面或就是它，需要调整选中索引
        if (currentTopicIndex.value !== -1 && insertPosition.value <= currentTopicIndex.value) {
          currentTopicIndex.value++;
        }
      } else {
        // 在末尾添加
        topics.value.push(newTopic);
      }
      
      ElMessage.success('知识点已添加');
    }
    
    saveTopicsToLocalStorage();
    topicDialogVisible.value = false;
    currentFocus.value = 'topics';
  } catch (error) {
    handleError(error, '保存知识点');
  }
};

// 处理简述变化
const handleSummaryChange = () => {
  summaryChanged.value = true;
};

// 处理详述变化
const handleDetailsChange = () => {
  detailsChanged.value = true;
};

// 保存简述
const saveSummary = () => {
  if (currentTopicIndex.value !== -1) {
    try {
      topics.value[currentTopicIndex.value].summary = currentSummary.value;
      saveTopicsToLocalStorage();
      summaryChanged.value = false;
      ElMessage.success('简述已保存');
    } catch (error) {
      handleError(error, '保存简述');
    }
  }
};

// 保存详述
const saveDetails = () => {
  if (currentTopicIndex.value !== -1) {
    try {
      topics.value[currentTopicIndex.value].details = currentDetails.value;
      saveTopicsToLocalStorage();
      detailsChanged.value = false;
      ElMessage.success('详述已保存');
    } catch (error) {
      handleError(error, '保存详述');
    }
  }
};

// 保存当前编辑的内容
const saveCurrentContent = () => {
  if (currentTopicIndex.value !== -1) {
    try {
      if (summaryChanged.value) {
        topics.value[currentTopicIndex.value].summary = currentSummary.value;
        summaryChanged.value = false;
      }
      
      if (detailsChanged.value) {
        topics.value[currentTopicIndex.value].details = currentDetails.value;
        detailsChanged.value = false;
      }
      
      saveTopicsToLocalStorage();
    } catch (error) {
      handleError(error, '保存内容');
    }
  }
};

// 保存知识点数据到本地存储
const saveTopicsToLocalStorage = () => {
  try {
    localStorage.setItem('knowledge-topics', JSON.stringify(topics.value));
  } catch (error) {
    handleError(error, '保存知识点数据');
  }
};

// 从本地存储加载知识点数据
const loadTopicsFromLocalStorage = () => {
  try {
    const data = localStorage.getItem('knowledge-topics');
    if (data) {
      topics.value = JSON.parse(data);
    }
  } catch (error) {
    handleError(error, '加载知识点数据');
  }
};

// 添加一个标志变量，防止重复触发
let isChangingFocus = false;

// 修改键盘事件处理函数，添加延迟和防抖
const handleKeyDown = (event) => {
  // 如果正在切换焦点，则忽略此次事件
  if (isChangingFocus) {
    return;
  }
  
  // 左右键切换区域
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    
    // 设置标志变量，防止重复触发
    isChangingFocus = true;
    
    // 保存当前焦点状态
    const prevFocus = currentFocus.value;
    
    if (event.key === 'ArrowLeft') {
      // 从右向左切换焦点
      if (currentFocus.value === 'summary') {
        currentFocus.value = 'topics';
      } else if (currentFocus.value === 'details') {
        currentFocus.value = 'summary';
      } else if (currentFocus.value === 'none') {
        currentFocus.value = 'topics';
      }
    } else {
      // 从左向右切换焦点
      if (currentFocus.value === 'topics') {
        currentFocus.value = 'summary';
      } else if (currentFocus.value === 'summary') {
        currentFocus.value = 'details';
      } else if (currentFocus.value === 'none') {
        currentFocus.value = 'topics';
      }
    }
    
    // 只有当焦点真正改变时才执行额外操作
    if (prevFocus !== currentFocus.value) {
      // 减少延迟时间，提高响应速度
      setTimeout(() => {
        isChangingFocus = false;
      }, 100); // 减少到100毫秒
    } else {
      // 如果焦点没有改变，立即重置标志
      isChangingFocus = false;
    }
  }
};

// 使用防抖函数包装键盘事件处理函数
const debounce = (fn, delay) => {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

const debouncedHandleKeyDown = debounce(handleKeyDown, 100);

// 修复全局点击事件处理函数，确保正确清除焦点
const handleGlobalClick = (event) => {
  // 防止短时间内重复处理
  if (window._isHandlingGlobalClick) {
    return;
  }
  
  window._isHandlingGlobalClick = true;
  
  // 获取点击的元素
  const target = event.target;
  
  // 检查点击是否在不需要清除焦点的区域内
  // 只有这些区域点击时不清除焦点，其他区域点击都会清除
  const isExcludedAreaClick = 
    target.closest('.knowledge-topics') || 
    target.closest('.knowledge-summary') || 
    target.closest('.knowledge-details');
  
  // 如果点击不在排除区域内，并且当前有焦点，则清除焦点
  if (!isExcludedAreaClick && currentFocus.value !== 'none') {
    clearSelectionManually();
  }
  
  // 使用更短的延迟重置标志变量
  setTimeout(() => {
    window._isHandlingGlobalClick = false;
  }, 30); // 减少到30毫秒
};

// 优化清除选择状态的函数，提高性能
const clearSelectionManually = () => {
  // 只有当当前有焦点时，才执行清除操作
  if (currentFocus.value !== 'none') {
    // 保存当前编辑的内容
    saveCurrentContent();
    
    // 更新焦点状态
    currentFocus.value = 'none';
  }
};

// 在组件挂载时添加事件监听器和加载数据
onMounted(() => {
  // 添加键盘事件监听器
  window.addEventListener('keydown', debouncedHandleKeyDown);
  
  // 添加全局点击事件监听器
  document.addEventListener('click', handleGlobalClick);
  
  // 初始化标志变量
  window._isHandlingGlobalClick = false;
  isChangingFocus = false;
  
  // 加载知识点数据
  loadTopicsFromLocalStorage();
});

// 在组件卸载时移除事件监听器
onUnmounted(() => {
  // 保存当前编辑的内容
  saveCurrentContent();
  
  // 移除键盘事件监听器
  window.removeEventListener('keydown', debouncedHandleKeyDown);
  
  // 移除全局点击事件监听器
  document.removeEventListener('click', handleGlobalClick);
  
  // 清理标志变量
  delete window._isHandlingGlobalClick;
});
</script>

<style lang="less" scoped>
/* 修改整个知识库容器的背景色 */
.knowledge-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f0f5ff; /* 淡蓝色背景 */
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  position: relative; /* 保留原有的相对定位 */
}

/* 修改内容区域的样式 */
.knowledge-content {
  padding: 15px; /* 添加内边距 */
  border-radius: 8px;
}

/* 修改知识库区域的样式 */
.knowledge-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  height: 500px; /* 增加高度适应富文本编辑 */
  margin-top: 0;
}

/* 修改三个条目区域的背景色 */
.knowledge-topics, .knowledge-summary, .knowledge-details {
  background-color: #f9fbff; /* 更淡的蓝色背景 */
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e6effd; /* 添加淡蓝色边框 */
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  height: 100%; /* 确保高度填满父容器 */
  overflow-y: auto; /* 添加垂直滚动 */
  position: relative; /* 保留原有的相对定位 */
  
  &.focused {
    box-shadow: 0 4px 20px rgba(64, 158, 255, 0.15);
    border-color: #a0cfff;
    background-color: #ecf5ff;
  }
}

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

.operation-tips {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-width: 250px;
  border-left: 4px solid #409EFF;
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #303133;
    font-size: 16px;
  }
  
  ul {
    padding-left: 20px;
    margin: 0;
    
    li {
      margin-bottom: 8px;
      font-size: 14px;
      color: #606266;
    }
  }
  
  kbd {
    background-color: #f5f7fa;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
    color: #606266;
    display: inline-block;
    font-size: 12px;
    line-height: 1;
    padding: 3px 5px;
    margin: 0 2px;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  text-align: center;
  
  h2 {
    font-size: 18px;
    margin: 0;
    color: #303133;
    flex: 1;
    text-align: center;
  }
}

/* 知识点列表样式 */
.topic-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
  flex: 1;
  overflow-y: auto;
}

.topic-list li {
  padding: 10px 12px;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  
  &:hover {
    background-color: #f5f7fa;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &.active {
    background-color: #ecf5ff;
    border-left: 3px solid #409EFF;
  }
  
  .item-name {
    font-weight: 500;
    color: #303133;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .item-actions {
    display: flex;
    gap: 8px;
    margin-left: auto;
    
    .el-icon {
      font-size: 16px;
      color: #909399;
      cursor: pointer;
      
      &:hover {
        color: #409EFF;
      }
    }
  }
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

/* 富文本编辑器区域样式 */
.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .el-textarea {
    flex: 1;
  }
  
  :deep(.el-textarea__inner) {
    height: 100%;
  }
}

/* 添加清除选择按钮样式 */
.clear-selection-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f56c6c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  
  &:hover {
    background-color: #e64242;
  }
  
  .el-icon {
    font-size: 24px;
  }
}

/* 修改焦点样式，优化动画效果 */
.knowledge-topics.focused,
.knowledge-summary.focused,
.knowledge-details.focused {
  position: relative;
  outline: 2px solid #409eff;
  box-shadow: 0 0 15px rgba(64, 158, 255, 0.3);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* 添加错误消息样式 */
:global(.error-message-with-copy) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  
  span {
    flex: 1;
  }
  
  .el-button {
    flex-shrink: 0;
    margin-left: 8px;
  }
}
</style> 