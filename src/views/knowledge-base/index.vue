<template>
  <div class="knowledge-base-container" @click.self="clearAllFocus">
    <!-- 返回按钮 -->
    <div class="exit-button" @click="goBack">
      <el-icon><Back /></el-icon>
      <span>返回</span>
    </div>
    
    <!-- 操作指引按钮 -->
    <div class="guide-button" @click="showGuide = true">
      <el-icon><QuestionFilled /></el-icon>
      <span>操作指引</span>
    </div>
    
    <div class="knowledge-base-content" @click.self="clearAllFocus">
      <div class="knowledge-layout">
        <!-- 左侧知识列表 -->
        <div 
          class="knowledge-list" 
          :class="{ active: activeArea === 'list' }"
          @click.self="handleAreaClick('list')"
        >
          <div class="list-header">
            <h2>知识</h2>
          </div>
          <div class="list-container">
            <div class="list-content">
              <div 
                v-for="(item, index) in knowledgeItems" 
                :key="item.id || index"
                class="knowledge-item"
                :class="{ 
                  active: selectedItemIndex === index, 
                  'item-dragging': dragItem === index,
                  'item-drag-over': dragOverItem === index
                }"
                @click="selectItem(index)"
                draggable="true"
                @dragstart="dragStart(index)"
                @dragend="dragEnd"
                @dragover="dragOver($event, index)"
              >
                <div class="drag-handle">
                  <el-icon><el-icon-menu /></el-icon>
                </div>
                <div 
                  v-if="editingItemIndex === index" 
                  class="item-edit-wrapper"
                  @click.stop
                >
                  <div
                    class="editable-content"
                    contenteditable="true"
                    @keydown.enter="handleEditKeyDown($event, index)"
                    @keyup.esc="cancelEditing"
                    @blur="checkSaveContent(index)"
                    @click.stop
                    :ref="el => { if(editingItemIndex === index) editableContentRef = el }"
                  >{{ item.title || '新知识' }}</div>
                  <el-button 
                    type="primary" 
                    size="small" 
                    circle
                    @click.stop="saveEditableContent(index)"
                    title="保存"
                  >
                    <el-icon><Check /></el-icon>
                  </el-button>
                </div>
                <span 
                  v-else 
                  class="item-title"
                  @dblclick="startEditingTitle(index)"
                  @keydown.enter.prevent="startEditingTitle(index)"
                  tabindex="0"
                >
                  {{ item.title || '新知识' }}
                </span>
                <div v-if="editingItemIndex !== index" class="item-actions">
                  <el-button 
                    type="danger" 
                    size="small" 
                    circle 
                    @click.stop="deleteItem(index)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
            <div class="add-item-container">
              <el-button 
                type="primary" 
                plain
                size="small" 
                @click="addItem"
              >
                <el-icon><Plus /></el-icon> 添加知识
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 中间知识点列表 -->
        <div 
          class="knowledge-points" 
          :class="{ active: activeArea === 'summary' }"
          @click.self="handleAreaClick('summary')"
        >
          <div class="points-header">
            <h2>知识点</h2>
          </div>
          <div class="points-container">
            <template v-if="selectedItemIndex !== null">
              <div class="points-content">
                <div 
                  v-for="(point, pIndex) in knowledgeItems[selectedItemIndex].points || []" 
                  :key="point.id || pIndex"
                  class="point-item"
                  :class="{ 
                    active: selectedPointIndex === pIndex,
                    'item-dragging': dragPoint === pIndex,
                    'item-drag-over': dragOverPoint === pIndex
                  }"
                  @click="selectPoint(pIndex)"
                  draggable="true"
                  @dragstart="dragStartPoint(pIndex)"
                  @dragend="dragEndPoint"
                  @dragover="dragOverPoint($event, pIndex)"
                >
                  <div class="drag-handle">
                    <el-icon><el-icon-menu /></el-icon>
                  </div>
                  <div 
                    v-if="editingPointIndex === pIndex" 
                    class="point-edit-wrapper"
                    @click.stop
                  >
                    <div
                      class="editable-content"
                      contenteditable="true"
                      @keydown.enter="handlePointEditKeyDown($event, pIndex)"
                      @keyup.esc="cancelPointEditing"
                      @blur="checkSavePointContent(pIndex)"
                      @click.stop
                      :ref="el => { if(editingPointIndex === pIndex) pointEditableContentRef = el }"
                    >{{ point.title || '新知识点' }}</div>
                    <el-button 
                      type="primary" 
                      size="small" 
                      circle
                      @click.stop="savePointEditableContent(pIndex)"
                      title="保存"
                    >
                      <el-icon><Check /></el-icon>
                    </el-button>
                  </div>
                  <span 
                    v-else 
                    class="point-title"
                    @dblclick="startEditingPointTitle(pIndex)"
                    @keydown.enter.prevent="startEditingPointTitle(pIndex)"
                    tabindex="0"
                  >
                    {{ point.title || '新知识点' }}
                  </span>
                  <div v-if="editingPointIndex !== pIndex" class="point-actions">
                    <el-button 
                      type="danger" 
                      size="small" 
                      circle 
                      @click.stop="deletePoint(pIndex)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
              <div class="add-point-container">
                <el-button 
                  type="primary" 
                  plain
                  size="small" 
                  @click="addPoint"
                >
                  <el-icon><Plus /></el-icon> 添加知识点
                </el-button>
              </div>
            </template>
            <div v-else class="no-selection">
              请选择左侧知识
            </div>
          </div>
        </div>
        
        <!-- 右侧知识点详述 -->
        <div 
          class="knowledge-details" 
          :class="{ active: activeArea === 'details' }"
          @click.self="handleAreaClick('details')"
        >
          <div class="details-header">
            <h2>知识点详述</h2>
          </div>
          <div class="details-content">
            <el-input
              v-if="selectedItemIndex !== null && selectedPointIndex !== null"
              v-model="knowledgeItems[selectedItemIndex].points[selectedPointIndex].details"
              type="textarea"
              placeholder="请输入详细内容"
              :rows="18"
              class="details-input"
              @input="saveKnowledgeItems"
              @focus="setActiveArea('details')"
              @click.stop="activeArea = 'details'"
              ref="detailsInputRef"
            />
            <div v-else class="no-selection">
              请选择知识点
            </div>
          </div>
        </div>
      </div>
      
      <!-- 历史记录区域 -->
      <div class="history-area">
        <div class="history-header">
          <h2>历史记录</h2>
          <span v-if="historyVersions.length > 0" class="record-count">{{ historyVersions.length }}条记录</span>
        </div>
        <div class="history-list-container">
          <div v-if="historyVersions.length === 0" class="no-history">
            使用 Cmd+S(macOS) 或 Ctrl+S(Windows/Linux) 保存当前状态
          </div>
          <div v-else class="history-actions">
            <el-button 
              type="primary" 
              size="small" 
              plain
              class="view-history-btn"
              @click="showHistoryDialog = true"
            >
              <el-icon><Document /></el-icon> 查看历史版本
            </el-button>
            <el-button 
              type="primary" 
              size="small" 
              @click="saveHistoryVersion"
            >
              <el-icon><Document /></el-icon> 保存新版本
            </el-button>
          </div>
          <div v-if="historyVersions.length === 0" class="history-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click="saveHistoryVersion"
            >
              <el-icon><Document /></el-icon> 保存当前状态
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 操作指引弹窗 -->
    <el-dialog
      v-model="showGuide"
      title="操作指引"
      width="500px"
    >
      <div class="guide-content">
        <h3>快捷键操作</h3>
        <ul>
          <li><strong>Tab键</strong>：添加新知识/知识点（根据当前选中区域）</li>
          <li><strong>Enter键</strong>：进入/完成标题编辑</li>
          <li><strong>上下方向键</strong>：在当前区域内切换选中的条目</li>
          <li><strong>左右方向键</strong>：在三个区域之间切换焦点</li>
          <li><strong>删除</strong>：
            <ul>
              <li>Windows/Linux：<strong>Alt+Backspace</strong></li>
              <li>macOS：<strong>Command+Backspace</strong></li>
            </ul>
          </li>
          <li><strong>Esc键</strong>：取消当前编辑操作</li>
        </ul>
        
        <h3>常用操作</h3>
        <ul>
          <li>双击标题可直接编辑</li>
          <li>点击任意区域空白处选中该区域</li>
          <li>在编辑状态下，点击其他区域将自动保存</li>
          <li>知识点包含内容时，删除前会有确认提示</li>
          <li>所有编辑内容都会自动保存到本地存储</li>
          <li><strong>拖放功能</strong>：通过拖动条目前的图标可调整顺序</li>
        </ul>
      </div>
    </el-dialog>
    
    <!-- 历史记录查看弹窗 -->
    <el-dialog
      v-model="showHistoryDialog"
      title="历史记录"
      width="800px"
      class="history-dialog"
    >
      <table class="history-table" v-if="historyVersions.length > 0">
        <thead>
          <tr>
            <th class="date-column">日期</th>
            <th class="time-column">时间</th>
            <th class="info-column">内容统计</th>
            <th class="action-column">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(item, index) in historyVersions" 
            :key="index"
            class="history-item"
          >
            <td class="date-column">{{ formatDate(item.timestamp) }}</td>
            <td class="time-column">{{ formatTime(item.timestamp) }}</td>
            <td class="info-column">共 {{ item.itemCount }} 个知识，{{ item.pointCount }} 个知识点</td>
            <td class="action-column">
              <el-button 
                type="warning" 
                size="small" 
                @click.stop="restoreVersion(item)"
              >
                还原
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                @click.stop="deleteVersion(index)"
              >
                删除
              </el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </el-dialog>
    
    <!-- 错误弹窗组件 -->
    <el-dialog
      v-model="errorDialogVisible"
      title="应用程序错误"
      width="500px"
      :close-on-click-modal="true"
      :show-close="true"
    >
      <div class="error-dialog-content">
        <p>应用程序遇到了错误:</p>
        <div class="error-message">
          {{ errorMessage }}
        </div>
        <p>您可以尝试重新加载页面或返回首页。</p>
      </div>
      <template #footer>
        <div class="error-dialog-footer">
          <el-button @click="copyErrorMessage" type="primary">
            <el-icon><Document /></el-icon> 复制错误信息
          </el-button>
          <el-button @click="errorDialogVisible = false">关闭</el-button>
          <el-button @click="reloadPage" type="primary">刷新页面</el-button>
          <el-button @click="goBack" type="warning">返回首页</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 历史记录还原确认弹窗 -->
    <el-dialog
      v-model="restoreDialogVisible"
      title="还原确认"
      width="400px"
    >
      <div class="restore-dialog-content">
        <p>确定要还原到 {{ selectedDate }} 保存的版本吗？</p>
        <p class="warning">此操作将覆盖当前的所有内容，且不可撤销！</p>
      </div>
      <template #footer>
        <div class="restore-dialog-footer">
          <el-button @click="restoreDialogVisible = false">取消</el-button>
          <el-button type="warning" @click="confirmRestore">确认还原</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Back, Delete, Document, Check, QuestionFilled, Plus, Menu } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ComponentPublicInstance } from 'vue'

const router = useRouter()

// 知识点数据结构
interface KnowledgePoint {
  title: string;
  details: string;
  id?: string; // 新增id属性，方便拖放操作
}

// 知识数据结构
interface KnowledgeItem {
  title: string;
  points: KnowledgePoint[];
  id?: string; // 新增id属性，方便拖放操作
}

// 历史版本数据结构
interface HistoryVersion {
  timestamp: number; // 保存的时间戳
  data: KnowledgeItem[]; // 保存的知识库数据
  itemCount: number; // 知识数量
  pointCount: number; // 知识点总数量
}

// 状态管理
const knowledgeItems = ref<KnowledgeItem[]>([])
const selectedItemIndex = ref<number | null>(null)
const selectedPointIndex = ref<number | null>(null)
const activeArea = ref<'list' | 'summary' | 'details'>('list')
const editingItemIndex = ref<number | null>(null)
const editingPointIndex = ref<number | null>(null)
const editableContentRef = ref<HTMLElement | null>(null)
const pointEditableContentRef = ref<HTMLElement | null>(null)
const detailsInputRef = shallowRef<ComponentPublicInstance | null>(null)
const isClickInside = ref(false)
const showGuide = ref(false)
const dragItem = ref<number | null>(null) // 新增：当前拖拽的知识索引
const dragPoint = ref<number | null>(null) // 新增：当前拖拽的知识点索引
const dragOverItem = ref<number | null>(null) // 新增：拖拽悬停的知识索引
const dragOverPoint = ref<number | null>(null) // 新增：拖拽悬停的知识点索引

// 错误处理相关
const errorDialogVisible = ref(false)
const errorMessage = ref('')

// 历史记录相关状态
const historyVersions = ref<HistoryVersion[]>([])
const restoreDialogVisible = ref(false)
const versionToRestore = ref<HistoryVersion | null>(null)
const selectedDate = ref('')
const showHistoryDialog = ref(false)

// 全局错误处理
const handleGlobalError = (error: Error) => {
  console.error('应用错误:', error)
  errorMessage.value = error.message || '未知错误'
  errorDialogVisible.value = true
}

// 复制错误信息
const copyErrorMessage = () => {
  try {
    const errorText = `应用程序错误: ${errorMessage.value}\n时间: ${new Date().toLocaleString()}`
    navigator.clipboard.writeText(errorText).then(() => {
      ElMessage.success('错误信息已复制到剪贴板')
    }).catch(() => {
      // 如果Clipboard API失败，使用传统方法
      fallbackCopyToClipboard(errorText)
    })
  } catch (err) {
    console.error('复制错误信息失败', err)
    ElMessage.error('复制失败，请手动复制错误信息')
  }
}

// 备用复制方法
const fallbackCopyToClipboard = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    const success = document.execCommand('copy')
    if (success) {
      ElMessage.success('错误信息已复制到剪贴板')
    } else {
      ElMessage.error('复制失败，请手动复制错误信息')
    }
  } catch (err) {
    ElMessage.error('复制失败，请手动复制错误信息')
  }
  
  document.body.removeChild(textArea)
}

// 刷新页面
const reloadPage = () => {
  window.location.reload()
}

// 加载本地存储的知识库数据
const loadKnowledgeItems = () => {
  try {
    const savedItems = localStorage.getItem('knowledgeItems')
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      
      // 兼容旧数据结构
      if (parsedItems.length > 0 && !Array.isArray(parsedItems[0].points)) {
        // 旧数据格式转换为新格式
        knowledgeItems.value = parsedItems.map((item: any) => ({
          title: item.title,
          id: generateUniqueId(), // 为旧项目生成ID
          points: [
            {
              title: item.title,
              details: item.details || '',
              id: generateUniqueId() // 为旧知识点生成ID
            }
          ]
        }));
      } else {
        // 确保所有项和子项都有ID
        knowledgeItems.value = parsedItems.map((item: any) => ({
          ...item,
          id: item.id || generateUniqueId(),
          points: (item.points || []).map((point: any) => ({
            ...point,
            id: point.id || generateUniqueId()
          }))
        }));
      }
    } else {
      // 初始化一个空的知识
      knowledgeItems.value = [{
        title: '新知识',
        id: generateUniqueId(),
        points: [{
          title: '新知识点',
          details: '',
          id: generateUniqueId()
        }]
      }]
    }
  } catch (error) {
    console.error('加载知识库数据失败', error)
    ElMessage.error('加载知识库数据失败')
    // 初始化一个空的知识
    knowledgeItems.value = [{
      title: '新知识',
      id: generateUniqueId(),
      points: [{
        title: '新知识点',
        details: '',
        id: generateUniqueId()
      }]
    }]
  }
}

// 生成唯一ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 保存知识库数据到本地存储
const saveKnowledgeItems = () => {
  try {
    localStorage.setItem('knowledgeItems', JSON.stringify(knowledgeItems.value))
  } catch (error) {
    console.error('保存知识库数据失败', error)
    ElMessage.error('保存知识库数据失败')
  }
}

// 选择知识
const selectItem = (index: number) => {
  // 如果正在编辑，先保存当前编辑内容
  if (editingItemIndex.value !== null && editingItemIndex.value !== index) {
    saveEditableContent(editingItemIndex.value)
  }
  
  // 当选择新的知识时，清空当前选中的知识点
  if (selectedItemIndex.value !== index) {
    selectedPointIndex.value = null
  }
  
  // 设置选中项
  selectedItemIndex.value = index
  
  // 确保知识点数组存在
  if (!knowledgeItems.value[index].points) {
    knowledgeItems.value[index].points = []
  }
  
  // 如果有知识点，默认选中第一个
  if (knowledgeItems.value[index].points.length > 0 && selectedPointIndex.value === null) {
    selectedPointIndex.value = 0
  }
  
  // 设置当前活动区域为知识列表
  activeArea.value = 'list'
  
  // 聚焦到选中的知识条目
  nextTick(() => {
    try {
      const titleElements = document.querySelectorAll('.item-title');
      if (titleElements[index]) {
        (titleElements[index] as HTMLElement).focus();
      }
    } catch (error) {
      console.error('聚焦元素失败', error)
    }
  })
}

// 选择知识点
const selectPoint = (index: number) => {
  // 如果正在编辑，先保存当前编辑内容
  if (editingPointIndex.value !== null && editingPointIndex.value !== index) {
    savePointEditableContent(editingPointIndex.value)
  }
  
  // 设置选中项
  selectedPointIndex.value = index
  
  // 设置当前活动区域为知识点列表
  activeArea.value = 'summary'
  
  // 聚焦到选中的知识点条目
  nextTick(() => {
    try {
      const titleElements = document.querySelectorAll('.point-title');
      if (titleElements[index]) {
        (titleElements[index] as HTMLElement).focus();
      }
    } catch (error) {
      console.error('聚焦元素失败', error)
    }
  })
}

// 开始编辑知识标题
const startEditingTitle = (index: number) => {
  editingItemIndex.value = index
  selectedItemIndex.value = index
  activeArea.value = 'list'
  
  // 聚焦到可编辑div并全选内容
  nextTick(() => {
    try {
      if (editableContentRef.value && typeof editableContentRef.value.focus === 'function') {
        editableContentRef.value.focus()
        
        // 全选内容
        const range = document.createRange()
        const sel = window.getSelection()
        if (sel) {
          range.selectNodeContents(editableContentRef.value)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      } else {
        console.warn('无法聚焦到编辑区域，DOM元素未就绪')
      }
    } catch (error) {
      console.error('聚焦输入框失败', error)
    }
  })
}

// 开始编辑知识点标题
const startEditingPointTitle = (index: number) => {
  editingPointIndex.value = index
  selectedPointIndex.value = index
  activeArea.value = 'summary'
  
  // 聚焦到可编辑div并全选内容
  nextTick(() => {
    try {
      if (pointEditableContentRef.value && typeof pointEditableContentRef.value.focus === 'function') {
        pointEditableContentRef.value.focus()
        
        // 全选内容
        const range = document.createRange()
        const sel = window.getSelection()
        if (sel) {
          range.selectNodeContents(pointEditableContentRef.value)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      } else {
        console.warn('无法聚焦到编辑区域，DOM元素未就绪')
      }
    } catch (error) {
      console.error('聚焦输入框失败', error)
    }
  })
}

// 处理编辑状态下的按键事件
const handleEditKeyDown = (e: KeyboardEvent, index: number) => {
  // 获取当前选区范围
  const selection = window.getSelection();
  
  // 检查是否是全选状态
  let isAllSelected = false;
  if (selection && selection.rangeCount > 0 && editableContentRef.value) {
    const range = selection.getRangeAt(0);
    const clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(editableContentRef.value);
    
    // 比较当前选区是否和全选区域相同
    isAllSelected = range.startOffset === clonedRange.startOffset && 
                     range.endOffset === clonedRange.endOffset;
  }
  
  // 按Enter键保存当前编辑内容，但仅在非全选状态下
  if (e.key === 'Enter' && !isAllSelected) {
    e.preventDefault();
    saveEditableContent(index);
  }
}

// 处理知识点编辑状态下的按键事件
const handlePointEditKeyDown = (e: KeyboardEvent, index: number) => {
  // 获取当前选区范围
  const selection = window.getSelection();
  
  // 检查是否是全选状态
  let isAllSelected = false;
  if (selection && selection.rangeCount > 0 && pointEditableContentRef.value) {
    const range = selection.getRangeAt(0);
    const clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(pointEditableContentRef.value);
    
    // 比较当前选区是否和全选区域相同
    isAllSelected = range.startOffset === clonedRange.startOffset && 
                     range.endOffset === clonedRange.endOffset;
  }
  
  // 按Enter键保存当前编辑内容，但仅在非全选状态下
  if (e.key === 'Enter' && !isAllSelected) {
    e.preventDefault();
    savePointEditableContent(index);
  }
}

// 保存编辑的知识内容
const saveEditableContent = (index: number) => {
  if (editableContentRef.value) {
    let content = editableContentRef.value.innerText.trim()
    if (!content) {
      content = '新知识'
    }
    knowledgeItems.value[index].title = content
    editingItemIndex.value = null
    saveKnowledgeItems()
    
    // 保存后，重新聚焦到选中的项目
    nextTick(() => {
      const titleElements = document.querySelectorAll('.item-title');
      if (titleElements[index]) {
        (titleElements[index] as HTMLElement).focus();
      }
    });
  }
}

// 保存编辑的知识点内容
const savePointEditableContent = (index: number) => {
  if (pointEditableContentRef.value && selectedItemIndex.value !== null) {
    let content = pointEditableContentRef.value.innerText.trim()
    if (!content) {
      content = '新知识点'
    }
    knowledgeItems.value[selectedItemIndex.value].points[index].title = content
    editingPointIndex.value = null
    saveKnowledgeItems()
    
    // 保存后，重新聚焦到选中的项目
    nextTick(() => {
      const titleElements = document.querySelectorAll('.point-title');
      if (titleElements[index]) {
        (titleElements[index] as HTMLElement).focus();
      }
    });
  }
}

// 检查并保存知识内容
const checkSaveContent = (index: number) => {
  // 延迟执行，避免与click事件冲突
  setTimeout(() => {
    if (editingItemIndex.value === index) {
      saveEditableContent(index)
    }
  }, 200)
}

// 检查并保存知识点内容
const checkSavePointContent = (index: number) => {
  // 延迟执行，避免与click事件冲突
  setTimeout(() => {
    if (editingPointIndex.value === index) {
      savePointEditableContent(index)
    }
  }, 200)
}

// 取消编辑
const cancelEditing = () => {
  editingItemIndex.value = null
}

// 取消知识点编辑
const cancelPointEditing = () => {
  editingPointIndex.value = null
}

// 添加知识
const addItem = () => {
  const newIndex = selectedItemIndex.value !== null ? selectedItemIndex.value + 1 : 0
  knowledgeItems.value.splice(newIndex, 0, {
    title: '新知识',
    id: generateUniqueId(),
    points: [{
      title: '新知识点',
      details: '',
      id: generateUniqueId()
    }]
  })
  selectedItemIndex.value = newIndex
  selectedPointIndex.value = 0
  saveKnowledgeItems()
  // 新增后立即进入编辑模式
  startEditingTitle(selectedItemIndex.value)
}

// 添加知识点
const addPoint = () => {
  if (selectedItemIndex.value !== null) {
    const newIndex = selectedPointIndex.value !== null ? selectedPointIndex.value + 1 : 0
    knowledgeItems.value[selectedItemIndex.value].points.splice(newIndex, 0, {
      title: '新知识点',
      details: '',
      id: generateUniqueId()
    })
    selectedPointIndex.value = newIndex
    saveKnowledgeItems()
    // 新增后立即进入编辑模式
    startEditingPointTitle(selectedPointIndex.value)
  }
}

// 删除知识
const deleteItem = async (index: number) => {
  const item = knowledgeItems.value[index]
  
  // 判断是否有内容，决定是否需要确认
  const hasContent = item.points.some(point => point.details.trim());
  
  if (hasContent) {
    try {
      await ElMessageBox.confirm(
        '此知识包含内容，确定要删除吗？',
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      // 用户确认删除
      performDelete(index)
    } catch {
      // 用户取消删除，不执行任何操作
    }
  } else {
    // 没有内容，直接删除
    performDelete(index)
  }
}

// 删除知识点
const deletePoint = async (index: number) => {
  if (selectedItemIndex.value === null) return;
  
  const point = knowledgeItems.value[selectedItemIndex.value].points[index]
  
  // 判断是否有内容，决定是否需要确认
  if (point.details.trim()) {
    try {
      await ElMessageBox.confirm(
        '此知识点包含内容，确定要删除吗？',
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      // 用户确认删除
      performPointDelete(index)
    } catch {
      // 用户取消删除，不执行任何操作
    }
  } else {
    // 没有内容，直接删除
    performPointDelete(index)
  }
}

// 执行删除知识操作
const performDelete = (index: number) => {
  knowledgeItems.value.splice(index, 1)
  
  if (knowledgeItems.value.length === 0) {
    selectedItemIndex.value = null
    selectedPointIndex.value = null
  } else if (selectedItemIndex.value === index) {
    // 如果删除的是当前选中项
    if (index >= knowledgeItems.value.length) {
      selectedItemIndex.value = knowledgeItems.value.length - 1
    }
    // 设置默认选中的知识点
    selectedPointIndex.value = knowledgeItems.value[selectedItemIndex.value].points.length > 0 ? 0 : null
  } else if (selectedItemIndex.value !== null && selectedItemIndex.value > index) {
    // 如果删除的是选中项之前的项，需要调整索引
    selectedItemIndex.value--
  }
  
  saveKnowledgeItems()
}

// 执行删除知识点操作
const performPointDelete = (index: number) => {
  if (selectedItemIndex.value === null) return;
  
  knowledgeItems.value[selectedItemIndex.value].points.splice(index, 1)
  
  if (knowledgeItems.value[selectedItemIndex.value].points.length === 0) {
    selectedPointIndex.value = null
  } else if (selectedPointIndex.value === index) {
    // 如果删除的是当前选中项
    if (index >= knowledgeItems.value[selectedItemIndex.value].points.length) {
      selectedPointIndex.value = knowledgeItems.value[selectedItemIndex.value].points.length - 1
    }
    // 否则保持当前索引不变（因为后面的项会自动上移）
  } else if (selectedPointIndex.value !== null && selectedPointIndex.value > index) {
    // 如果删除的是选中项之前的项，需要调整索引
    selectedPointIndex.value--
  }
  
  saveKnowledgeItems()
}

// 设置活动区域
const setActiveArea = (area: 'list' | 'summary' | 'details') => {
  // 如果活动区域没有变化，则不需要执行焦点切换
  if (activeArea.value === area) return;
  
  // 旧区域
  const oldArea = activeArea.value;
  
  // 设置新区域
  activeArea.value = area;
  
  // 确保知识选择和知识点选择的合理性
  if (area === 'summary' && selectedItemIndex.value !== null) {
    // 如果切换到知识点区域，但没有选择知识点，且当前知识有知识点
    if (selectedPointIndex.value === null && 
        knowledgeItems.value[selectedItemIndex.value].points && 
        knowledgeItems.value[selectedItemIndex.value].points.length > 0) {
      selectedPointIndex.value = 0; // 选择第一个知识点
    }
  }
  
  // 延迟执行，确保DOM已更新
  nextTick(() => {
    try {
      if (area === 'list' && selectedItemIndex.value !== null) {
        // 聚焦到选中的知识条目
        const titleElements = document.querySelectorAll('.item-title');
        if (titleElements.length > 0 && titleElements[selectedItemIndex.value]) {
          (titleElements[selectedItemIndex.value] as HTMLElement).focus();
        }
      } else if (area === 'summary' && selectedPointIndex.value !== null) {
        // 聚焦到选中的知识点条目
        const titleElements = document.querySelectorAll('.point-title');
        if (titleElements.length > 0 && titleElements[selectedPointIndex.value]) {
          (titleElements[selectedPointIndex.value] as HTMLElement).focus();
        }
      } else if (area === 'details' && selectedItemIndex.value !== null && selectedPointIndex.value !== null) {
        // 聚焦到详情输入框
        if (detailsInputRef.value) {
          const inputEl = detailsInputRef.value.$el.querySelector('textarea');
          if (inputEl) {
            inputEl.focus();
            console.log('已聚焦到详情输入框');
          } else {
            console.warn('无法找到详情输入框元素');
          }
        } else {
          console.warn('detailsInputRef未设置');
        }
      }
    } catch (error) {
      console.error('聚焦元素失败', error);
    }
  });
}

// 处理区域点击事件
const handleAreaClick = (area: 'list' | 'summary' | 'details') => {
  console.log('点击了空白区域:', area);
  
  // 设置活动区域
  activeArea.value = area;
  
  // 主动清除所有焦点 - 更彻底的方法
  document.activeElement instanceof HTMLElement && document.activeElement.blur();
  
  // 清除所有可能被选中的文本
  if (window.getSelection) {
    window.getSelection()?.removeAllRanges();
  }
  
  // 根据区域执行相应的焦点逻辑
  if (area === 'list') {
    if (selectedItemIndex.value === null && knowledgeItems.value.length > 0) {
      selectedItemIndex.value = 0;
    }
    // 如果有选中的知识条目，聚焦到它
    if (selectedItemIndex.value !== null) {
      nextTick(() => {
        const titleElements = document.querySelectorAll('.item-title');
        if (titleElements[selectedItemIndex.value]) {
          (titleElements[selectedItemIndex.value] as HTMLElement).focus();
        }
      });
    }
  } else if (area === 'summary') {
    // 确保已经选择了知识
    if (selectedItemIndex.value !== null) {
      // 如果没有选中知识点但有知识点，则选中第一个
      if (selectedPointIndex.value === null && knowledgeItems.value[selectedItemIndex.value].points.length > 0) {
        selectedPointIndex.value = 0;
      }
      
      // 如果有选中的知识点，聚焦到它
      if (selectedPointIndex.value !== null) {
        nextTick(() => {
          const titleElements = document.querySelectorAll('.point-title');
          if (titleElements[selectedPointIndex.value]) {
            (titleElements[selectedPointIndex.value] as HTMLElement).focus();
          }
        });
      }
    }
  } else if (area === 'details') {
    // 确保已经选择了知识和知识点
    if (selectedItemIndex.value !== null && selectedPointIndex.value !== null) {
      // 聚焦到详情输入框
      nextTick(() => {
        if (detailsInputRef.value) {
          const inputEl = detailsInputRef.value.$el.querySelector('textarea');
          if (inputEl) {
            inputEl.focus();
          }
        }
      });
    }
  }
}

// 在document上添加点击事件以清除焦点
const handleDocumentClick = (e: MouseEvent) => {
  // 检查点击是否在内容区域外
  const knowledgeBaseContent = document.querySelector('.knowledge-base-content');
  if (knowledgeBaseContent && !knowledgeBaseContent.contains(e.target as Node)) {
    // 点击在内容区域外，清除所有焦点
    document.activeElement instanceof HTMLElement && document.activeElement.blur();
    
    // 可选：清除选中状态
    // selectedItemIndex.value = null;
    // selectedPointIndex.value = null;
  }
}

// 键盘快捷键处理
const handleKeyDown = (e: KeyboardEvent) => {
  // 如果在编辑状态，仅处理Esc键
  if (editingItemIndex.value !== null || editingPointIndex.value !== null) {
    if (e.key === 'Escape') {
      cancelEditing()
      cancelPointEditing()
      e.preventDefault()
    }
    return
  }
  
  // 删除快捷键:
  // Windows/Linux: Alt+Backspace 或 Alt+Delete
  // macOS: Command+Backspace 或 Command+Delete
  if ((e.key === 'Backspace' || e.key === 'Delete') && 
      ((e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) || // Windows/Linux
       (e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey))   // macOS
     ) {
    e.preventDefault()
    if (activeArea.value === 'list' && selectedItemIndex.value !== null) {
      deleteItem(selectedItemIndex.value)
    } else if (activeArea.value === 'summary' && selectedPointIndex.value !== null) {
      deletePoint(selectedPointIndex.value)
    }
    return
  }
  
  // Tab键: 添加新知识/知识点
  if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
    e.preventDefault()
    if (activeArea.value === 'list') {
      addItem()
    } else if (activeArea.value === 'summary' && selectedItemIndex.value !== null) {
      addPoint()
    }
    return
  }
  
  // Enter键：根据当前区域执行不同操作
  if (e.key === 'Enter' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
    e.preventDefault()
    
    // 根据当前选中区域进入编辑模式
    if (activeArea.value === 'list' && selectedItemIndex.value !== null) {
      // 确保在知识区域选择了一个知识
      startEditingTitle(selectedItemIndex.value)
    } else if (activeArea.value === 'summary' && selectedItemIndex.value !== null && selectedPointIndex.value !== null) {
      // 确保在知识点区域选择了一个知识点
      startEditingPointTitle(selectedPointIndex.value)
    }
    return
  }
  
  // 上下箭头切换当前区域内的条目
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (activeArea.value === 'list') {
      // 在知识列表中向上选择
      if (selectedItemIndex.value !== null && selectedItemIndex.value > 0) {
        selectItem(selectedItemIndex.value - 1)
        // 确保元素可见
        nextTick(() => {
          const element = document.querySelectorAll('.knowledge-item')[selectedItemIndex.value]
          element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        })
      }
    } else if (activeArea.value === 'summary' && selectedItemIndex.value !== null) {
      // 在知识点列表中向上选择
      if (selectedPointIndex.value !== null && selectedPointIndex.value > 0) {
        selectPoint(selectedPointIndex.value - 1)
        // 确保元素可见
        nextTick(() => {
          const element = document.querySelectorAll('.point-item')[selectedPointIndex.value]
          element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        })
      }
    }
  }
  
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (activeArea.value === 'list') {
      // 在知识列表中向下选择
      if (selectedItemIndex.value !== null && selectedItemIndex.value < knowledgeItems.value.length - 1) {
        selectItem(selectedItemIndex.value + 1)
        // 确保元素可见
        nextTick(() => {
          const element = document.querySelectorAll('.knowledge-item')[selectedItemIndex.value]
          element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        })
      }
    } else if (activeArea.value === 'summary' && selectedItemIndex.value !== null) {
      // 在知识点列表中向下选择
      const points = knowledgeItems.value[selectedItemIndex.value].points
      if (selectedPointIndex.value !== null && selectedPointIndex.value < points.length - 1) {
        selectPoint(selectedPointIndex.value + 1)
        // 确保元素可见
        nextTick(() => {
          const element = document.querySelectorAll('.point-item')[selectedPointIndex.value]
          element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        })
      }
    }
  }
  
  // 左右箭头切换区域
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    if (activeArea.value === 'details') {
      setActiveArea('summary')
    } else if (activeArea.value === 'summary') {
      setActiveArea('list')
    }
  }
  
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    if (activeArea.value === 'list') {
      setActiveArea('summary')
    } else if (activeArea.value === 'summary') {
      setActiveArea('details')
    }
  }
  
  // Command/Ctrl + S : 保存历史版本
  if (e.key === 's' && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
    e.preventDefault() // 阻止浏览器默认的保存行为
    saveHistoryVersion()
    return
  }
}

// 返回首页
const goBack = () => {
  router.push('/home')
}

// 生命周期钩子
onMounted(() => {
  loadKnowledgeItems()
  loadHistoryVersions() // 加载历史版本
  window.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleDocumentClick)
  
  // 添加全局错误处理
  window.addEventListener('error', (event) => {
    handleGlobalError(event.error)
    event.preventDefault()
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    handleGlobalError(new Error(event.reason || '未处理的Promise异常'))
    event.preventDefault()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleDocumentClick)
})

// 清除所有元素的焦点
const clearAllFocus = () => {
  console.log('清除所有焦点');
  
  // 清除当前文档中所有具有焦点的元素
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  
  // 清除所有可能的选择
  window.getSelection()?.removeAllRanges();
  
  // 清除特定元素焦点
  try {
    // 知识标题
    document.querySelectorAll('.item-title').forEach(el => {
      if (el instanceof HTMLElement) el.blur();
    });
    
    // 知识点标题
    document.querySelectorAll('.point-title').forEach(el => {
      if (el instanceof HTMLElement) el.blur();
    });
    
    // 详情输入框
    if (detailsInputRef.value) {
      const textarea = detailsInputRef.value.$el.querySelector('textarea');
      if (textarea) textarea.blur();
    }
  } catch (error) {
    console.error('清除焦点失败', error);
  }
}

// 格式化日期 (年月日)
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 格式化时间 (时分)
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 从本地存储加载历史版本
const loadHistoryVersions = () => {
  try {
    const savedHistory = localStorage.getItem('knowledgeHistoryVersions')
    if (savedHistory) {
      historyVersions.value = JSON.parse(savedHistory)
    }
  } catch (error) {
    console.error('加载历史版本失败', error)
    ElMessage.error('加载历史版本失败')
    historyVersions.value = []
  }
}

// 保存历史版本到本地存储
const saveHistoryVersions = () => {
  try {
    localStorage.setItem('knowledgeHistoryVersions', JSON.stringify(historyVersions.value))
  } catch (error) {
    console.error('保存历史版本失败', error)
    ElMessage.error('保存历史版本失败')
  }
}

// 保存当前状态为新的历史版本
const saveHistoryVersion = () => {
  // 计算知识点总数
  let totalPoints = 0
  knowledgeItems.value.forEach(item => {
    totalPoints += item.points.length
  })
  
  // 创建新的历史版本
  const newVersion: HistoryVersion = {
    timestamp: Date.now(), // 当前时间戳
    data: JSON.parse(JSON.stringify(knowledgeItems.value)), // 深拷贝当前数据
    itemCount: knowledgeItems.value.length,
    pointCount: totalPoints
  }
  
  // 检查是否已有同一天的记录
  const today = new Date()
  today.setHours(0, 0, 0, 0) // 设置为今天的开始时间
  const todayTimestamp = today.getTime()
  
  const existingTodayIndex = historyVersions.value.findIndex(v => {
    const vDate = new Date(v.timestamp)
    vDate.setHours(0, 0, 0, 0)
    return vDate.getTime() === todayTimestamp
  })
  
  if (existingTodayIndex !== -1) {
    // 如果今天已有版本，则更新
    historyVersions.value[existingTodayIndex] = newVersion
    ElMessage.success('已更新今日的历史版本')
  } else {
    // 否则添加新版本
    historyVersions.value.unshift(newVersion) // 新版本添加到数组前面
    ElMessage.success('已保存为新的历史版本')
  }
  
  // 保存历史版本到本地存储
  saveHistoryVersions()
}

// 准备还原历史版本
const restoreVersion = (version: HistoryVersion) => {
  versionToRestore.value = version
  selectedDate.value = `${formatDate(version.timestamp)} ${formatTime(version.timestamp)}`
  restoreDialogVisible.value = true
}

// 确认还原历史版本
const confirmRestore = () => {
  if (versionToRestore.value) {
    // 还原为选中的版本
    knowledgeItems.value = JSON.parse(JSON.stringify(versionToRestore.value.data))
    saveKnowledgeItems()
    
    // 重置选中状态
    selectedItemIndex.value = knowledgeItems.value.length > 0 ? 0 : null
    selectedPointIndex.value = selectedItemIndex.value !== null && 
                               knowledgeItems.value[selectedItemIndex.value].points.length > 0 ? 0 : null
    
    ElMessage.success('已还原至历史版本')
    restoreDialogVisible.value = false
  }
}

// 删除历史版本
const deleteVersion = async (index: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个历史版本吗？此操作不可撤销。',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 用户确认删除
    historyVersions.value.splice(index, 1)
    saveHistoryVersions()
    ElMessage.success('已删除历史版本')
  } catch {
    // 用户取消删除，不执行任何操作
  }
}

// 拖拽开始 - 知识项
const dragStart = (index: number) => {
  dragItem.value = index;
}

// 拖拽结束 - 知识项
const dragEnd = () => {
  // 执行顺序交换
  if (dragItem.value !== null && dragOverItem.value !== null && dragItem.value !== dragOverItem.value) {
    // 创建数组副本
    const itemsCopy = [...knowledgeItems.value];
    const itemToMove = itemsCopy[dragItem.value];
    
    // 从数组中移除
    itemsCopy.splice(dragItem.value, 1);
    // 插入到目标位置
    itemsCopy.splice(dragOverItem.value, 0, itemToMove);
    
    // 更新数组
    knowledgeItems.value = itemsCopy;
    
    // 更新选中项
    if (selectedItemIndex.value === dragItem.value) {
      selectedItemIndex.value = dragOverItem.value;
    } else if (selectedItemIndex.value === dragOverItem.value) {
      // 如果拖动到当前选中项的位置，则需要调整选中项
      if (dragItem.value < dragOverItem.value) {
        selectedItemIndex.value--;
      } else {
        selectedItemIndex.value++;
      }
    }
    
    // 保存更改
    saveKnowledgeItems();
  }
  
  // 重置拖拽状态
  dragItem.value = null;
  dragOverItem.value = null;
}

// 拖拽进入 - 知识项
const dragOver = (e: DragEvent, index: number) => {
  e.preventDefault();
  dragOverItem.value = index;
}

// 拖拽开始 - 知识点
const dragStartPoint = (index: number) => {
  dragPoint.value = index;
}

// 拖拽结束 - 知识点
const dragEndPoint = () => {
  if (selectedItemIndex.value !== null && dragPoint.value !== null && dragOverPoint.value !== null && dragPoint.value !== dragOverPoint.value) {
    // 创建数组副本
    const pointsCopy = [...knowledgeItems.value[selectedItemIndex.value].points];
    const pointToMove = pointsCopy[dragPoint.value];
    
    // 从数组中移除
    pointsCopy.splice(dragPoint.value, 1);
    // 插入到目标位置
    pointsCopy.splice(dragOverPoint.value, 0, pointToMove);
    
    // 更新数组
    knowledgeItems.value[selectedItemIndex.value].points = pointsCopy;
    
    // 更新选中项
    if (selectedPointIndex.value === dragPoint.value) {
      selectedPointIndex.value = dragOverPoint.value;
    } else if (selectedPointIndex.value === dragOverPoint.value) {
      // 如果拖动到当前选中项的位置，则需要调整选中项
      if (dragPoint.value < dragOverPoint.value) {
        selectedPointIndex.value--;
      } else {
        selectedPointIndex.value++;
      }
    }
    
    // 保存更改
    saveKnowledgeItems();
  }
  
  // 重置拖拽状态
  dragPoint.value = null;
  dragOverPoint.value = null;
}

// 拖拽进入 - 知识点
const handleDragOverPoint = (e: DragEvent, index: number) => {
  e.preventDefault();
  dragOverPoint.value = index;
}
</script>

<style lang="less" scoped>
.knowledge-base-container {
  padding: 20px;
  max-width: 1200px;
  height: calc(100vh - 40px); /* 限制高度为视口高度减去内边距 */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  
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
  
  .guide-button {
    position: fixed;
    top: 20px;
    right: 20px;
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
  
  .knowledge-base-content {
    // background-color: white; // 注释掉白色背景
    // box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); // 注释掉阴影
    border-radius: 8px;
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    overflow: hidden; /* 防止内容溢出 */
    
    .knowledge-layout {
      display: flex;
      flex: 1;
      gap: 20px;
      margin-bottom: 10px; // 减少底部间距
      height: calc(100% - 60px); // 调整高度，为历史区域留出更多空间
      overflow: hidden; /* 防止内容溢出 */
      
      .knowledge-list, .knowledge-points, .knowledge-details {
        border-radius: 8px;
        transition: all 0.3s;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden; /* 防止内容溢出 */
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        
        &.active {
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            border: 2px solid transparent;
            border-radius: 8px;
            z-index: 10;
          }
        }
        
        .list-header, .points-header, .details-header {
          padding: 8px 15px !important; // 减少上下内边距
          
          h2 {
            font-size: 16px;
            margin: 0;
            font-weight: 600;
            position: relative;
            padding: 0 10px;
            display: inline-block;
            
            &::after {
              content: '';
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%);
              width: 70%;
              height: 2px;
              border-radius: 1px;
              transition: all 0.3s;
            }
          }
        }
      }
      
      /* 知识列表 - 蓝色调 */
      .knowledge-list {
        width: 25%;
        display: flex;
        flex-direction: column;
        background-color: #f0f5ff;
        border: 1px solid #d6e4ff;
        
        &.active {
          &::after {
            border-color: #409EFF;
          }
        }
        
        .list-header {
          background-color: #e6f0ff;
          border-bottom-color: #a3c6ff;
          
          h2 {
            color: #2c70e0;
            
            &::after {
              background-color: #6698ff;
            }
          }
        }
        
        .list-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .list-content {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          padding-bottom: 0;
          
          .knowledge-item {
            padding: 8px 12px !important; // 减少上下内边距
            margin-bottom: 6px !important; // 减少下边距
            border-radius: 6px;
            background-color: #ffffff;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
            border: 1px solid #d6e4ff;
            position: relative;
            
            // 拖拽状态样式
            &.item-dragging {
              opacity: 0.5;
              background-color: #e6f0ff;
              transform: scale(1.02);
              z-index: 10;
            }
            
            &.item-drag-over {
              border: 1px dashed #409EFF;
              background-color: #f0f5ff;
              
              &::before {
                content: '';
                position: absolute;
                top: -3px;
                left: 0;
                right: 0;
                height: 3px;
                background-color: #409EFF;
                border-radius: 2px;
              }
            }
            
            // 拖动把手
            .drag-handle {
              cursor: move;
              margin-right: 8px;
              color: #a0cfff;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px;
              border-radius: 4px;
              
              &:hover {
                background-color: #ecf5ff;
                transform: scale(1.1);
                transition: all 0.2s ease;
              }
              
              .el-icon {
                font-size: 16px;
              }
            }
            
            &.active {
              background-color: #e6f0ff;
              border-color: #a3c6ff;
            }
            
            &:hover {
              background-color: #e6f0ff;
              transform: translateY(-2px);
              
              .item-actions {
                opacity: 1;
              }
            }
            
            .item-title {
              word-break: break-all;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              flex: 1;
              outline: none;
              color: #333;
              font-size: 14px !important; // 减小字体大小
              
              &:focus {
                color: #409EFF;
              }
            }
            
            .item-edit-wrapper {
              flex: 1;
              display: flex;
              align-items: center;
              gap: 8px;
              
              .editable-content {
                flex: 1;
                min-height: 24px;
                border: 1px solid #DCDFE6;
                border-radius: 4px;
                padding: 5px 10px;
                background-color: #FFF;
                outline: none;
                word-break: break-all;
                white-space: normal; /* 允许换行 */
                user-select: all; /* 支持全选 */
                
                &:focus {
                  border-color: #409EFF;
                  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
                }
              }
            }
            
            .item-actions {
              opacity: 0;
              transition: opacity 0.3s;
            }
          }
        }
        
        .add-item-container {
          padding: 10px !important; // 减少内边距
          display: flex;
          justify-content: center;
          background-color: #f0f5ff;
          border-top: 1px solid rgba(64, 158, 255, 0.1);
        }
      }
      
      /* 知识点列表 - 绿色调 */
      .knowledge-points {
        width: 30%;
        display: flex;
        flex-direction: column;
        background-color: #f0fff5;
        border: 1px solid #d6ffe4;
        
        &.active {
          &::after {
            border-color: #67C23A;
          }
        }
        
        .points-header {
          background-color: #e6ffe6;
          border-bottom-color: #b3e6b3;
          
          h2 {
            color: #2e8b57;
            
            &::after {
              background-color: #67C23A;
            }
          }
        }
        
        .points-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: #f5fff9;
        }
        
        .points-content {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          padding-bottom: 0;
          
          .point-item {
            padding: 8px 12px !important; // 减少上下内边距
            margin-bottom: 6px !important; // 减少下边距
            border-radius: 6px;
            background-color: #ffffff;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
            border: 1px solid #b3e6b3;
            position: relative;
            
            // 拖拽状态样式
            &.item-dragging {
              opacity: 0.5;
              background-color: #e6ffe6;
              transform: scale(1.02);
              z-index: 10;
            }
            
            &.item-drag-over {
              border: 1px dashed #67C23A;
              background-color: #f0fff5;
              
              &::before {
                content: '';
                position: absolute;
                top: -3px;
                left: 0;
                right: 0;
                height: 3px;
                background-color: #67C23A;
                border-radius: 2px;
              }
            }
            
            // 拖动把手
            .drag-handle {
              cursor: move;
              margin-right: 8px;
              color: #95d475;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 4px;
              border-radius: 4px;
              
              &:hover {
                background-color: #f0fff5;
                transform: scale(1.1);
                transition: all 0.2s ease;
              }
              
              .el-icon {
                font-size: 16px;
              }
            }
            
            &.active {
              background-color: #e6ffe6;
              border-color: #67C23A;
            }
            
            &:hover {
              background-color: #e6ffe6;
              transform: translateY(-2px);
              
              .point-actions {
                opacity: 1;
              }
            }
            
            .point-title {
              word-break: break-all;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              flex: 1;
              outline: none;
              color: #333;
              font-size: 14px !important; // 减小字体大小
              
              &:focus {
                color: #67C23A;
              }
            }
            
            .point-edit-wrapper {
              flex: 1;
              display: flex;
              align-items: center;
              gap: 8px;
              
              .editable-content {
                flex: 1;
                min-height: 24px;
                border: 1px solid #DCDFE6;
                border-radius: 4px;
                padding: 5px 10px;
                background-color: #FFF;
                outline: none;
                word-break: break-all;
                white-space: normal; /* 允许换行 */
                user-select: all; /* 支持全选 */
                
                &:focus {
                  border-color: #67C23A;
                  box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.2);
                }
              }
            }
            
            .point-actions {
              opacity: 0;
              transition: opacity 0.3s;
            }
          }
        }
        
        .add-point-container {
          padding: 10px !important; // 减少内边距
          display: flex;
          justify-content: center;
          background-color: #f5fff9;
          border-top: 1px solid rgba(103, 194, 58, 0.1);
        }
        
        .no-selection {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #67C23A;
        }
      }
      
      /* 详述区域 - 紫色调 */
      .knowledge-details {
        width: 45%;
        display: flex;
        flex-direction: column;
        background-color: #f9f0ff;
        border: 1px solid #e4d6ff;
        
        &.active {
          &::after {
            border-color: #906de4;
          }
        }
        
        .details-header {
          background-color: #f0e6ff;
          border-bottom-color: #d1b3ff;
          
          h2 {
            color: #6231c0;
            
            &::after {
              background-color: #906de4;
            }
          }
        }
        
        .details-content {
          flex: 1;
          padding: 15px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          background-color: #fcf5ff;
          
          .details-input {
            flex: 1;
            
            .el-textarea__wrapper {
              background-color: #ffffff;
              border: 1px solid #d1b3ff;
              height: 100%; // 确保文本区域填满容器
              
              &.is-focus {
                box-shadow: 0 0 0 1px #906de4 inset;
              }
            }
            
            :deep(.el-textarea__inner) {
              height: 100%; // 增加文本输入框的高度
              min-height: 300px; // 设置最小高度
            }
          }
          
          .no-selection {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #906de4;
          }
        }
      }
    }
    
    // 历史记录区域样式
    .history-area {
      height: 50px; // 增加历史记录区域的高度使其更加明显
      border-radius: 8px;
      background-color: #f0f7ff; // 更改背景色使其更加明显
      border: 1px solid #c0d8ff;
      margin-top: 10px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: row; // 水平布局
      align-items: center; // 垂直居中
      justify-content: space-between; // 两端对齐
      padding: 0 15px; // 添加左右内边距
      
      .history-header {
        padding: 0; // 移除内边距
        border-bottom: none; // 移除底部边框
        display: flex;
        align-items: center;
        gap: 15px; // 添加间距
        
        h2 {
          font-size: 16px;
          margin: 0;
          color: #409EFF;
          font-weight: bold;
        }
        
        .record-count {
          background-color: #ecf5ff;
          color: #409EFF;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
        }
      }
      
      .history-list-container {
        flex: 1;
        overflow: hidden;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        
        .no-history {
          color: #606266;
          font-style: italic;
          font-size: 13px;
        }
      }
    }
  }
}

// 操作指引样式
.guide-content {
  h3 {
    margin-top: 16px;
    margin-bottom: 8px;
    color: #303133;
    font-size: 16px;
  }
  
  ul {
    padding-left: 20px;
    margin: 8px 0;
    
    li {
      line-height: 1.8;
      color: #606266;
    }
  }
}

// 错误弹窗样式
.error-dialog-content {
  .error-message {
    background-color: #f8f8f8;
    border-left: 4px solid #f56c6c;
    padding: 12px 16px;
    margin: 15px 0;
    font-family: monospace;
    word-break: break-all;
    white-space: pre-wrap;
    max-height: 200px;
    overflow-y: auto;
    color: #f56c6c;
  }
}

.error-dialog-footer {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

// 还原确认弹窗样式
.restore-dialog-content {
  p {
    margin: 10px 0;
  }
  
  .warning {
    color: #E6A23C;
    font-weight: bold;
  }
}

.restore-dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}

// 添加历史记录查看按钮的样式
.view-history-btn {
  margin-right: 10px;
}

// 添加历史记录弹窗样式
.history-dialog {
  .el-dialog__body {
    padding: 10px 20px;
    
    .history-table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 8px 12px;
        text-align: left;
        border-bottom: 1px solid #ebeef5;
      }
      
      th {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 600;
        font-size: 13px;
      }
      
      .history-item {
        &:hover {
          background-color: #f5f7fa;
        }
        
        td {
          font-size: 13px;
        }
        
        .date-column {
          width: 110px;
          color: #303133;
          font-weight: bold;
        }
        
        .time-column {
          width: 70px;
          color: #606266;
        }
        
        .info-column {
          color: #606266;
        }
        
        .action-column {
          width: 140px;
          text-align: right;
          white-space: nowrap;
          
          .el-button {
            padding: 5px 8px;
            margin-left: 5px;
          }
        }
      }
    }
  }
}
</style> 