<template>
  <div class="goal-planner-container">
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
      
    <div class="goal-planner-content">
      <div class="goals-layout">
        <!-- 左侧目标列表 -->
        <div 
          class="goals-list" 
          :class="{ active: activeArea === 'goals' }"
          @click.self="handleAreaClick('goals')"
        >
          <div class="list-header">
            <h2>目标</h2>
          </div>
          <div class="list-container">
            <div class="list-content">
              <!-- 空目标提示样式 -->
              <div v-if="goalItems.length === 0" class="no-goals-tips">
                <el-icon><Star /></el-icon>
                <p>当前还没有目标</p>
                <p>点击下方"添加目标"按钮或按 Tab 键创建一个新的目标</p>
            </div>
            
            <div 
                v-for="(item, index) in goalItems" 
                :key="item.id || index"
                class="goal-item"
                :class="{
                  active: selectedGoalIndex === index, 
                  'goal-completed': item.status === 'completed',
                  'goal-overdue': item.status === 'overdue',
                  'goal-abandoned': item.status === 'abandoned',
                  'item-dragging': dragItem === index,
                  'item-drag-over': dragOverItem === index
                }"
                @click="selectGoal(index)"
                draggable="true"
                @dragstart="dragStart(index)"
                @dragend="dragEnd"
                @dragover="dragOver($event, index)"
              >
                <div class="drag-handle">
                  <el-icon><el-icon-menu /></el-icon>
                </div>
                <div class="item-content">
                  <div class="item-main">
                    <span 
                      class="item-title"
                      @dblclick="startEditingTitle(index)"
                      @keydown.enter.prevent="startEditingTitle(index)"
                      tabindex="0"
                    >
                      {{ item.title || '新目标' }}
                    </span>
                    <div class="item-meta">
                      <span v-if="item.expectedCompletionDate" class="meta-item">
                        <el-icon><Calendar /></el-icon>
                        {{ formatDate(item.expectedCompletionDate) }}
                      </span>
                      <span v-else class="meta-item">
                        <el-icon><Calendar /></el-icon>
                        未设置完成时间
                      </span>
                      <span v-if="item.duration" class="meta-item">
                        <el-icon><Clock /></el-icon>
                        {{ item.duration }}
                      </span>
                      <span class="meta-item status-item" :class="{
                        'status-completed': item.status === 'completed',
                        'status-overdue': item.status === 'overdue',
                        'status-abandoned': item.status === 'abandoned',
                        'status-in-progress': item.status === 'in-progress'
                      }">
                        <el-icon v-if="item.status === 'completed'"><CircleCheck /></el-icon>
                        <el-icon v-else-if="item.status === 'overdue'"><Timer /></el-icon>
                        <el-icon v-else-if="item.status === 'abandoned'"><CircleClose /></el-icon>
                        <el-icon v-else><Loading /></el-icon>
                        {{ getStatusText(item.status) }}
                      </span>
                  </div>
                    <div v-if="item.description" class="item-description">
                      {{ item.description }}
                </div>
              </div>
            </div>
                <div class="item-actions">
                  <el-dropdown trigger="click" @click.stop>
                    <el-button type="info" size="small" circle>
                      <el-icon><More /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click.stop="markGoalStatus(index, 'completed')">
                          <el-icon><CircleCheck /></el-icon>标记为已完成
                        </el-dropdown-item>
                        <el-dropdown-item @click.stop="markGoalStatus(index, 'overdue')">
                          <el-icon><Timer /></el-icon>标记为已超时
                        </el-dropdown-item>
                        <el-dropdown-item @click.stop="markGoalStatus(index, 'abandoned')">
                          <el-icon><CircleClose /></el-icon>标记为已放弃
                        </el-dropdown-item>
                        <el-dropdown-item @click.stop="markGoalStatus(index, 'in-progress')">
                          <el-icon><Refresh /></el-icon>标记为进行中
                        </el-dropdown-item>
                        <el-dropdown-item divided @click.stop="deleteGoal(index)">
                          <el-icon><Delete /></el-icon>删除目标
                        </el-dropdown-item>
                        <el-dropdown-item divided @click.stop="startEditingTitle(index)">
                          <el-icon><Edit /></el-icon>编辑目标详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
          </div>
        </div>
            </div>
            <div class="add-item-container">
              <el-button 
                type="primary" 
                plain
                size="small" 
                @click="addGoal"
              >
                <el-icon><Plus /></el-icon> 添加目标
              </el-button>
            </div>
                </div>
          </div>
          
        <!-- 右侧打卡列表 -->
        <div 
          class="checkins-list" 
          :class="{ active: activeArea === 'checkins' }"
          @click.self="handleAreaClick('checkins')"
        >
          <div class="checkins-header">
            <h2>打卡区域</h2>
          </div>
          <div class="checkins-container">
            <template v-if="selectedGoalIndex !== null">
              <div class="checkins-grid">
                <div 
                  v-for="(checkin, cIndex) in goalItems[selectedGoalIndex].checkins"
                  :key="checkin.id || cIndex"
                  class="checkin-item"
                  :class="{ 
                    'checkin-item-dragging': dragCheckin === cIndex,
                    'checkin-item-drag-over': dragOverCheckin === cIndex
                  }"
                  :style="getCheckinCardStyle(checkin)"
                  draggable="true"
                  @dragstart="dragStartCheckin(cIndex)"
                  @dragend="dragEndCheckin"
                  @dragover="dragOverCheckinHandler($event, cIndex)"
                >
                  <div class="drag-handle checkin-drag-handle">
                    <el-icon><el-icon-menu /></el-icon>
                  </div>
                  <div class="checkin-info" @click.stop="toggleCheckinCompletion(cIndex)">
                    <div class="checkin-header">
                      <h4>{{ checkin.title }}</h4>
                      <div class="checkin-count" :style="getCheckinCountStyle(checkin)">{{ checkin.count }}天</div>
                    </div>
                    <div class="checkin-progress-container">
                      <div 
                        class="checkin-progress-bar"
                        :style="{
                          width: getProgressWidth(checkin.count),
                          backgroundColor: getProgressColor(checkin)
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="checkin-actions">
                    <el-button 
                      type="primary" 
                      size="small" 
                      circle
                      @click.stop="editCheckin(cIndex)"
                    >
                      <el-icon><Edit /></el-icon>
                    </el-button>
                    <el-button 
                      type="danger" 
                      size="small" 
                      circle 
                      @click.stop="deleteCheckin(cIndex)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </div>
                
                <!-- 没有打卡点时的提示 -->
                <div v-if="goalItems[selectedGoalIndex].checkins.length === 0" class="no-checkins-tips">
                  <el-icon><Bell /></el-icon>
                  <p>当前目标还没有打卡点</p>
                  <p>点击下方"添加打卡点"按钮创建一个新的打卡点</p>
                </div>
          </div>
          
              <!-- 将添加打卡点按钮移至底部 -->
              <div class="add-checkin-container">
              <el-button 
                type="primary" 
                  plain
                size="small" 
                  @click="addCheckin"
              >
                  <el-icon><Plus /></el-icon> 添加打卡点
              </el-button>
            </div>
            </template>
            <div v-else class="no-selection">
              <el-icon><ArrowLeft /></el-icon>
              <p>请先选择左侧目标</p>
              <p>或创建一个新的目标开始规划</p>
                </div>
          </div>
        </div>
      </div>
      
      <!-- 打卡热力图区域 -->
      <div class="heatmap-section">
        <div class="heatmap-header">
          <h2>打卡热力图</h2>
          <div class="heatmap-legend">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #ebedf0;"></div>
              <span>0次</span>
      </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #c6e48b;"></div>
              <span>1-2次</span>
    </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #7bc96f;"></div>
              <span>3-4次</span>
        </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #239a3b;"></div>
              <span>≥5次</span>
            </div>
              </div>
              </div>
        <div class="heatmap-container">
          <div class="month-labels">
            <div v-for="month in months" :key="month" class="month-label">{{ month }}</div>
            </div>
          <div class="day-labels">
            <div class="day-label">一</div>
            <div class="day-label">三</div>
            <div class="day-label">五</div>
            <div class="day-label">日</div>
          </div>
          <div class="heatmap-grid">
            <div 
              v-for="(day, index) in heatmapData" 
                :key="index" 
              class="heatmap-cell"
              :class="getCellClass(day.count)"
              @mouseover="showTooltip($event, day)"
              @mouseleave="hideTooltip"
            ></div>
              </div>
          <div class="heatmap-tooltip" ref="tooltip" :style="tooltipStyle">
            <div v-if="tooltipData">
              <div class="tooltip-date">{{ tooltipData.date }}</div>
              <div class="tooltip-count">{{ tooltipData.count }} 次打卡</div>
              <div class="tooltip-total">总目标: {{ getTotalTarget(tooltipData.date) }} 次打卡</div>
            </div>
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
          <li><strong>Tab键</strong>：添加新目标/打卡点（根据当前选中区域）</li>
          <li><strong>Enter键</strong>：
            <ul>
              <li>在目标/打卡点列表中：打开编辑弹窗</li>
              <li>在编辑弹窗中：直接保存表单并关闭弹窗</li>
              <li>按Shift+Enter或Ctrl+Enter可在文本域中插入换行</li>
            </ul>
          </li>
          <li><strong>上下方向键</strong>：在当前区域内切换选中的条目</li>
          <li><strong>左右方向键</strong>：在两个区域之间切换焦点</li>
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
          <li>双击目标标题可打开编辑弹窗</li>
          <li>点击任意区域空白处选中该区域</li>
          <li>点击打卡卡片可完成当日打卡</li>
          <li>所有编辑内容都会自动保存到本地存储</li>
          <li><strong>拖放功能</strong>：通过拖动条目前的图标可调整顺序</li>
        </ul>
      </div>
    </el-dialog>
    
    <!-- 目标详情编辑弹窗 -->
    <el-dialog
      v-model="goalDetailsDialogVisible"
      title="编辑目标详情"
      width="500px"
      :close-on-press-escape="true"
      :close-on-click-modal="true"
      @opened="focusGoalTitleInput"
      @close="handleGoalDialogClose"
    >
      <div class="goal-details-form">
        <el-form :model="goalDetailsForm" label-width="100px">
          <el-form-item label="目标标题">
          <el-input 
              v-model="goalDetailsForm.title" 
              placeholder="请输入目标标题"
              ref="goalTitleInputRef"
              @keydown.enter.prevent="saveGoalDetails"
              @keydown.tab.prevent="focusDateInput"
              autofocus
            ></el-input>
        </el-form-item>
          <el-form-item label="期望完成时间">
            <el-date-picker
              v-model="goalDetailsForm.expectedCompletionDate"
              type="date"
              placeholder="选择期望完成日期"
              style="width: 100%"
              ref="goalDateInputRef"
              @keydown.enter.prevent="handleEnterInDate"
              @keydown.tab.prevent="focusDescTextarea"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="目标描述">
          <el-input 
              type="textarea"
              v-model="goalDetailsForm.description"
              :rows="4"
              placeholder="请输入目标详细描述"
              ref="goalDescTextareaRef"
              @keydown.enter="handleEnterInTextarea"
              @keydown.tab.prevent="focusGoalSaveButton"
            ></el-input>
        </el-form-item>
      </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="goalDetailsDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveGoalDetails"
            ref="goalSaveButtonRef"
            @keydown.enter.stop.prevent="saveGoalDetails"
            @keydown.tab.prevent="focusGoalTitleInput"
          >保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 打卡点编辑弹窗 -->
    <el-dialog
      v-model="checkinDialogVisible"
      :title="isEditingCheckin ? '编辑打卡点' : '添加打卡点'"
      width="500px"
      :close-on-press-escape="true"
      :close-on-click-modal="true"
      @opened="focusTitleInput"
      @close="handleCheckinDialogClose"
    >
      <div class="checkin-form">
        <el-form :model="checkinForm" label-width="100px">
          <el-form-item label="打卡点名称">
          <el-input 
              v-model="checkinForm.title" 
              placeholder="请输入打卡点名称"
              ref="titleInputRef"
              @keydown.enter.prevent="saveCheckin"
              @keydown.tab.prevent="focusCountInput"
              autofocus
            ></el-input>
          </el-form-item>
          <el-form-item label="打卡天数">
            <el-input-number 
              v-model="checkinForm.count" 
              :min="0" 
              placeholder="打卡天数"
              ref="countInputRef"
              @keydown.enter.prevent="saveCheckin"
              @keydown.tab.prevent="focusColorSelector"
            ></el-input-number>
        </el-form-item>
        <el-form-item label="颜色">
            <div 
              class="color-selector" 
              ref="colorSelectorRef" 
              tabindex="0" 
              @keydown.enter.prevent="saveCheckin" 
              @keydown.tab.prevent="focusDescInput"
              @keydown.left="navigateColorOptions(-1)"
              @keydown.right="navigateColorOptions(1)"
            >
            <div 
              v-for="(color, index) in colorOptions" 
              :key="index"
              class="color-option"
                :class="{ 'selected': checkinForm.colorIndex === index }"
                :style="{ backgroundColor: color.primary }"
                @click="checkinForm.colorIndex = index"
            ></div>
          </div>
        </el-form-item>
          <el-form-item label="描述">
            <el-input
              type="textarea"
              v-model="checkinForm.description"
              :rows="3"
              placeholder="请输入打卡点描述"
              ref="descInputRef"
              @keydown.enter="handleCheckinEnterInDesc"
              @keydown.tab.prevent="focusSaveButton"
            ></el-input>
          </el-form-item>
      </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="checkinDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveCheckin"
            ref="saveButtonRef"
            @keydown.enter.stop.prevent="saveCheckin"
            @keydown.tab.prevent="focusTitleInput"
          >保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Back, Plus, Edit, Delete, Check, Close, QuestionFilled, 
  CircleCheck, Timer, CircleClose, More, Refresh, 
  Calendar, Clock, Loading, Star, ArrowLeft, Bell
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePlannerStore } from '@/stores/planner'
import { format } from 'date-fns'

const router = useRouter()
const plannerStore = usePlannerStore()

// 打卡点数据结构
interface Checkin {
  id?: string;
  title: string;
  count: number;
  completedToday: boolean;
  colorIndex: number;
  description?: string;
}

// 目标数据结构
interface GoalItem {
  id?: string;
  title: string;
  description?: string;
  expectedCompletionDate?: string;
  duration?: string;
  status: 'in-progress' | 'completed' | 'overdue' | 'abandoned';
  checkins: Checkin[];
}

// 状态管理
const goalItems = ref<GoalItem[]>([])
const selectedGoalIndex = ref<number | null>(null)
const activeArea = ref<'goals' | 'checkins'>('goals')
const isClickInside = ref(false)
const showGuide = ref(false)
const dragItem = ref<number | null>(null)
const dragOverItem = ref<number | null>(null)
const dragCheckin = ref<number | null>(null)
const dragOverCheckin = ref<number | null>(null)
// 记录最后添加的项目，用于Esc键撤销
const lastAddedItemIndex = ref<number | null>(null)
const lastAddedItemType = ref<'goal' | 'checkin' | null>(null)
// 标记是否通过保存按钮关闭对话框
const isSavingGoal = ref(false)
const isSavingCheckin = ref(false)
// 防止保存后立即重新编辑
const editLock = ref(false)

// 弹窗状态
const goalDetailsDialogVisible = ref(false)
const goalDetailsForm = ref({
  title: '',
  expectedCompletionDate: '',
  description: ''
})

const checkinDialogVisible = ref(false)
const isEditingCheckin = ref(false)
const editingCheckinIndex = ref(-1)
const checkinForm = ref({
  title: '',
  description: '',
  colorIndex: 0,
  count: 0
})

// 添加表单引用
const titleInputRef = ref(null)
const countInputRef = ref(null)
const colorSelectorRef = ref(null)
const descInputRef = ref(null)
const saveButtonRef = ref(null)

// 目标详情表单引用
const goalTitleInputRef = ref(null)
const goalDateInputRef = ref(null)
const goalDescTextareaRef = ref(null)
const goalSaveButtonRef = ref(null)

// 表单焦点切换函数
const focusTitleInput = () => {
  nextTick(() => {
    if (titleInputRef.value) {
      try {
        titleInputRef.value.focus()
      } catch (error) {
        try {
          const inputEl = titleInputRef.value.$el.querySelector('input')
          if (inputEl) {
            inputEl.focus()
            inputEl.select()
          }
        } catch (err) {
          console.error('无法聚焦到标题输入框', err)
        }
      }
    }
  })
}

const focusCountInput = () => {
  nextTick(() => {
    try {
      if (countInputRef.value) {
        const inputEl = countInputRef.value.$el.querySelector('input')
        if (inputEl) {
          inputEl.focus()
          inputEl.select()
        } else {
          countInputRef.value.focus()
        }
      }
    } catch (error) {
      console.error('无法聚焦到天数输入框', error)
    }
  })
}

const focusDescInput = () => {
  nextTick(() => {
    try {
      if (descInputRef.value) {
        const textareaEl = descInputRef.value.$el.querySelector('textarea')
        if (textareaEl) {
          textareaEl.focus()
        } else {
          descInputRef.value.focus()
        }
      }
    } catch (error) {
      console.error('无法聚焦到描述输入框', error)
    }
  })
}

const focusSaveButton = () => {
  nextTick(() => {
    try {
      if (saveButtonRef.value) {
        const buttonEl = saveButtonRef.value.$el
        if (buttonEl) {
          buttonEl.focus()
        }
      }
    } catch (error) {
      console.error('无法聚焦到保存按钮', error)
    }
  })
}

// 表单焦点切换函数 - 目标详情编辑
const focusGoalTitleInput = () => {
  nextTick(() => {
    if (goalTitleInputRef.value) {
      try {
        goalTitleInputRef.value.focus()
      } catch (error) {
        try {
          const inputEl = goalTitleInputRef.value.$el.querySelector('input')
          if (inputEl) {
            inputEl.focus()
            inputEl.select()
          }
        } catch (err) {
          console.error('无法聚焦到目标标题输入框', err)
        }
      }
    }
  })
}

const focusDateInput = () => {
  nextTick(() => {
    try {
      // 全新的方法：直接在文档中查找日期选择器的输入元素
      // 日期选择器通常会创建一个具有特殊类名的输入元素
      const dateInputs = document.querySelectorAll('.el-date-editor input');
      
      // 由于可能有多个日期选择器，我们找到当前弹窗内的那一个
      const modal = document.querySelector('.el-dialog--center');
      if (modal) {
        const dateInput = modal.querySelector('.el-date-editor input');
        if (dateInput) {
          dateInput.focus();
          return;
        }
      }
      
      // 备用方案1：尝试找到对话框中的日期输入框
      const dialogInputs = document.querySelectorAll('.goal-details-form .el-date-editor input');
      if (dialogInputs && dialogInputs.length > 0) {
        dialogInputs[0].focus();
        return;
      }
      
      // 备用方案2：尝试通过表单项查找
      const dateFormItem = document.querySelector('.el-form-item:nth-child(2) .el-date-editor input');
      if (dateFormItem) {
        dateFormItem.focus();
    return;
  }
  
      // 备用方案3：如果找不到日期选择器的输入元素，直接跳到下一个字段
      console.log('无法找到日期选择器输入框，跳转到下一个字段');
      focusDescTextarea();
    } catch (error) {
      console.error('聚焦日期选择器出错', error);
      // 出错时跳到下一个字段
      focusDescTextarea();
    }
  });
}

const focusDescTextarea = () => {
  nextTick(() => {
    try {
      if (goalDescTextareaRef.value) {
        const textareaEl = goalDescTextareaRef.value.$el.querySelector('textarea')
        if (textareaEl) {
          textareaEl.focus()
    } else {
          goalDescTextareaRef.value.focus()
        }
      }
    } catch (error) {
      console.error('无法聚焦到描述文本区域', error)
    }
  })
}

const focusGoalSaveButton = () => {
  nextTick(() => {
    try {
      if (goalSaveButtonRef.value) {
        const buttonEl = goalSaveButtonRef.value.$el
        if (buttonEl) {
          buttonEl.focus()
        }
      }
  } catch (error) {
      console.error('无法聚焦到保存按钮', error)
    }
  })
}

// 表单焦点切换函数 - 颜色选择器
const focusColorSelector = () => {
  nextTick(() => {
    try {
      if (colorSelectorRef.value) {
        colorSelectorRef.value.focus()
      }
    } catch (error) {
      console.error('无法聚焦到颜色选择器', error)
    }
  })
}

// 颜色选项
const colorOptions = [
  { primary: '#409EFF', lighter: '#ECF5FF' }, // 蓝色
  { primary: '#67C23A', lighter: '#F0F9EB' }, // 绿色  
  { primary: '#E6A23C', lighter: '#FDF6EC' }, // 黄色
  { primary: '#F56C6C', lighter: '#FEF0F0' }, // 红色
  { primary: '#909399', lighter: '#F4F4F5' }, // 灰色
  { primary: '#9254DE', lighter: '#F5F0FA' }, // 紫色
  { primary: '#36CFC9', lighter: '#E6FFFB' }, // 青色
  { primary: '#FF9900', lighter: '#FFF7E6' }  // 橙色
]

// 加载本地存储的目标数据
const loadGoalItems = () => {
  try {
    const savedItems = localStorage.getItem('goalItems')
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems)
      
      // 确保所有项和子项都有ID
      goalItems.value = parsedItems.map((item: any) => ({
        ...item,
        id: item.id || generateUniqueId(),
        checkins: (item.checkins || []).map((checkin: any) => ({
          ...checkin,
          id: checkin.id || generateUniqueId()
        }))
      }))
    } else {
      // 初始化一个空的目标
      goalItems.value = [{
        id: generateUniqueId(),
        title: '新目标',
        status: 'in-progress',
        checkins: [{
          id: generateUniqueId(),
          title: '新打卡点',
          count: 0,
          completedToday: false,
          colorIndex: 0
        }]
      }]
    }
  } catch (error) {
    console.error('加载目标数据失败', error)
    ElMessage.error('加载目标数据失败')
    // 初始化一个空的目标
    goalItems.value = [{
      id: generateUniqueId(),
      title: '新目标',
      status: 'in-progress',
      checkins: [{
        id: generateUniqueId(),
        title: '新打卡点',
        count: 0,
        completedToday: false,
        colorIndex: 0
      }]
    }]
  }
}

// 生成唯一ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 保存目标数据到本地存储
const saveGoalItems = () => {
  try {
    localStorage.setItem('goalItems', JSON.stringify(goalItems.value))
  } catch (error) {
    console.error('保存目标数据失败', error)
    ElMessage.error('保存目标数据失败')
  }
}

// 选择目标
const selectGoal = (index: number) => {
  try {
    selectedGoalIndex.value = index
    
    // 确保打卡点数组存在
    if (!goalItems.value[index].checkins) {
      goalItems.value[index].checkins = []
    }
    
    // 设置当前活动区域为目标列表
    activeArea.value = 'goals'
    
    // 聚焦到选中的目标条目
    nextTick(() => {
      try {
        const titleElements = document.querySelectorAll('.item-title')
        if (titleElements[index]) {
          (titleElements[index] as HTMLElement).focus()
        }
      } catch (error) {
        console.error('聚焦元素失败', error)
      }
    })
  } catch (error) {
    console.error('选择目标出错:', error)
  }
}

// 开始编辑目标标题
const startEditingTitle = (index: number) => {
  // 如果当前处于编辑锁定状态，忽略此次编辑请求
  if (editLock.value) {
    return
  }
  
  // 如果是双击或回车编辑，直接显示目标详情弹窗而不是内联编辑
  const goal = goalItems.value[index]
  goalDetailsForm.value = {
    title: goal.title,
    expectedCompletionDate: goal.expectedCompletionDate || '',
    description: goal.description || ''
  }
  
  selectedGoalIndex.value = index
  activeArea.value = 'goals'
  goalDetailsDialogVisible.value = true
}

// 取消编辑
const cancelEditing = () => {
  // 此函数保留但内容清空，以防其他地方调用
}

// 添加目标
const addGoal = () => {
  const newIndex = selectedGoalIndex.value !== null ? selectedGoalIndex.value + 1 : 0
  const newGoal = {
    id: generateUniqueId(),
    title: '新目标',
    status: 'in-progress',
    checkins: [] // 默认没有打卡点
  };
  
  goalItems.value.splice(newIndex, 0, newGoal);
  selectedGoalIndex.value = newIndex;
  saveGoalItems();
  
  // 记录新添加的项目，以便Esc键撤销
  lastAddedItemIndex.value = newIndex;
  lastAddedItemType.value = 'goal';
  
  // 返回新添加项的索引
  return newIndex;
}

// 删除目标
const deleteGoal = async (index: number) => {
  // 检查目标是否有打卡点
  const hasCheckins = goalItems.value[index].checkins && 
                     goalItems.value[index].checkins.length > 0;
  
  // 如果没有打卡点，直接删除
  if (!hasCheckins) {
    goalItems.value.splice(index, 1)
    
    if (goalItems.value.length === 0) {
      selectedGoalIndex.value = null
    } else if (selectedGoalIndex.value === index) {
      // 如果删除的是当前选中项
      if (index >= goalItems.value.length) {
        selectedGoalIndex.value = goalItems.value.length - 1
      }
    } else if (selectedGoalIndex.value !== null && selectedGoalIndex.value > index) {
      // 如果删除的是选中项之前的项，需要调整索引
      selectedGoalIndex.value--
    }
    
    saveGoalItems()
    ElMessage.success('目标已删除')
    return
  }
  
  // 有打卡点，显示确认对话框
  try {
    await ElMessageBox.confirm(
      '确定要删除此目标及其所有打卡点吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // 用户确认删除
    goalItems.value.splice(index, 1)
    
    if (goalItems.value.length === 0) {
      selectedGoalIndex.value = null
    } else if (selectedGoalIndex.value === index) {
      // 如果删除的是当前选中项
      if (index >= goalItems.value.length) {
        selectedGoalIndex.value = goalItems.value.length - 1
      }
    } else if (selectedGoalIndex.value !== null && selectedGoalIndex.value > index) {
      // 如果删除的是选中项之前的项，需要调整索引
      selectedGoalIndex.value--
    }
    
    saveGoalItems()
    ElMessage.success('目标已删除')
  } catch (error) {
    // 用户取消删除，不执行任何操作
    console.log('用户取消删除')
  }
}

// 标记目标状态
const markGoalStatus = (index: number, status: 'completed' | 'overdue' | 'abandoned' | 'in-progress') => {
  goalItems.value[index].status = status
  saveGoalItems()
  
  // 显示状态变更提示
  const statusText = getStatusText(status)
  ElMessage.success(`已将目标标记为"${statusText}"`)
}

// 获取状态文本
const getStatusText = (status: string | undefined) => {
  switch (status) {
    case 'completed': return '已完成'
    case 'overdue': return '已超时'
    case 'abandoned': return '已放弃'
    case 'in-progress': 
    default: return '进行中'
  }
}

// 编辑目标详情
const editGoalDetails = () => {
  if (selectedGoalIndex.value === null) return
  
  const goal = goalItems.value[selectedGoalIndex.value]
  goalDetailsForm.value = {
    title: goal.title,
    expectedCompletionDate: goal.expectedCompletionDate || '',
    description: goal.description || ''
  }
  
  goalDetailsDialogVisible.value = true
}

// 保存目标详情
const saveGoalDetails = () => {
  if (selectedGoalIndex.value === null) return
  
  const goal = goalItems.value[selectedGoalIndex.value]
  goal.title = goalDetailsForm.value.title.trim() || '新目标'
  goal.expectedCompletionDate = goalDetailsForm.value.expectedCompletionDate
  goal.description = goalDetailsForm.value.description
  
  saveGoalItems()
  isSavingGoal.value = true // 标记是通过保存按钮关闭
  goalDetailsDialogVisible.value = false
  ElMessage.success('目标详情已保存')
  
  // 设置编辑锁定，防止保存后立即触发编辑
  editLock.value = true
  setTimeout(() => {
    isSavingGoal.value = false
    // 延迟重置编辑锁定
    setTimeout(() => {
      editLock.value = false
    }, 300)
  }, 300)
}

// 添加打卡点
const addCheckin = () => {
  if (selectedGoalIndex.value === null) return -1
  
  isEditingCheckin.value = false
  checkinForm.value = {
    title: '',
    description: '',
    colorIndex: 0,
    count: 0
  }
  
  // 预先创建一个打卡点索引，用于在取消对话框时删除
  const newIndex = goalItems.value[selectedGoalIndex.value].checkins.length;
  lastAddedItemIndex.value = newIndex;
  lastAddedItemType.value = 'checkin';
  
  checkinDialogVisible.value = true
  
  // 返回新打卡点将插入的索引
  return newIndex
}

// 编辑打卡点
const editCheckin = (index: number) => {
  if (selectedGoalIndex.value === null) return
  
  const checkin = goalItems.value[selectedGoalIndex.value].checkins[index]
  checkinForm.value = {
    title: checkin.title,
    description: checkin.description || '',
    colorIndex: checkin.colorIndex,
    count: checkin.count
  }
  
  isEditingCheckin.value = true
  editingCheckinIndex.value = index
  checkinDialogVisible.value = true
}

// 保存打卡点
const saveCheckin = () => {
  if (selectedGoalIndex.value === null) return
  
  const title = checkinForm.value.title.trim() || '新打卡点'
  
  if (isEditingCheckin.value && editingCheckinIndex.value >= 0) {
    // 编辑现有打卡点
    const checkin = goalItems.value[selectedGoalIndex.value].checkins[editingCheckinIndex.value]
    checkin.title = title
    checkin.description = checkinForm.value.description
    checkin.colorIndex = checkinForm.value.colorIndex
    checkin.count = checkinForm.value.count
    ElMessage.success('打卡点已更新')
  } else {
    // 添加新打卡点
    const newIndex = goalItems.value[selectedGoalIndex.value].checkins.length;
    goalItems.value[selectedGoalIndex.value].checkins.push({
      id: generateUniqueId(),
      title,
      count: checkinForm.value.count,
      completedToday: false,
      colorIndex: checkinForm.value.colorIndex,
      description: checkinForm.value.description
    })
    
    // 记录新添加的打卡点索引，用于ESC键撤销
    lastAddedItemIndex.value = newIndex;
    lastAddedItemType.value = 'checkin';
    ElMessage.success('打卡点已添加')
  }
  
  saveGoalItems()
  isSavingCheckin.value = true // 标记是通过保存按钮关闭
  checkinDialogVisible.value = false
  
  // 设置编辑锁定，防止保存后立即触发编辑
  editLock.value = true
  setTimeout(() => {
    isSavingCheckin.value = false
    // 延迟重置编辑锁定
    setTimeout(() => {
      editLock.value = false
    }, 300)
  }, 300)
}

// 删除打卡点
const deleteCheckin = async (index: number) => {
  if (selectedGoalIndex.value === null) return
  
  try {
    await ElMessageBox.confirm(
      '确定要删除此打卡点吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // 用户确认删除
    goalItems.value[selectedGoalIndex.value].checkins.splice(index, 1)
    saveGoalItems()
    ElMessage.success('已删除打卡点')
  } catch (error) {
    // 用户取消删除，不执行任何操作
    console.log('用户取消删除')
  }
}

// 切换打卡完成状态
const toggleCheckinCompletion = (index: number) => {
  if (selectedGoalIndex.value === null) return
  
  const checkin = goalItems.value[selectedGoalIndex.value].checkins[index]
  
  // 反转完成状态
  checkin.completedToday = !checkin.completedToday
  
  // 如果标记为已完成，增加计数
  if (checkin.completedToday) {
    checkin.count++
    ElMessage.success(`已完成"${checkin.title}"的打卡`)
  } else {
    // 如果取消完成，减少计数（确保不小于0）
    checkin.count = Math.max(0, checkin.count - 1)
    ElMessage.info(`已取消"${checkin.title}"的打卡`)
  }
  
  saveGoalItems()
}

// 获取打卡卡片样式
const getCheckinCardStyle = (checkin: Checkin) => {
  const color = colorOptions[checkin.colorIndex % colorOptions.length]
  
  if (checkin.completedToday) {
    return {
      backgroundColor: color.lighter,
      color: '#303133',
      borderLeftWidth: '4px', 
      borderLeftStyle: 'solid',
      borderLeftColor: color.primary,
      boxShadow: `0 2px 12px ${color.primary}30`,
      transform: 'translateX(3px)'
    }
  }
  
  return {
    backgroundColor: color.lighter,
    color: '#303133',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderLeftColor: color.primary
  }
}

// 获取打卡计数标签样式
const getCheckinCountStyle = (checkin: Checkin) => {
  const color = colorOptions[checkin.colorIndex % colorOptions.length]
  return {
    backgroundColor: color.primary
  }
}

// 获取进度条颜色
const getProgressColor = (checkin: Checkin) => {
  const color = colorOptions[checkin.colorIndex % colorOptions.length]
  return checkin.completedToday ? color.primary + 'ee' : color.primary
}

// 计算进度条宽度，相对于当前所有打卡点的最大值
const getProgressWidth = (count: number) => {
  if (selectedGoalIndex.value === null) return '0%'
  
  // 获取当前目标下所有打卡点的最大计数
  const checkins = goalItems.value[selectedGoalIndex.value].checkins
  let maxCount = 0
  
  for (const checkin of checkins) {
    if (checkin.count > maxCount) {
      maxCount = checkin.count
    }
  }
  
  // 如果最大计数为0，返回最小宽度，保证即使没有打卡也能看到进度条
  if (maxCount === 0) return count > 0 ? '100%' : '3%'
  
  // 计算相对比例，最小宽度为3%，确保即使次数很小也能看到进度条
  return Math.max(3, (count / maxCount) * 100) + '%'
}

// 设置活动区域
const handleAreaClick = (area: 'goals' | 'checkins') => {
  activeArea.value = area
  
  // 根据区域执行相应的焦点逻辑
  if (area === 'goals') {
    if (selectedGoalIndex.value === null && goalItems.value.length > 0) {
      selectedGoalIndex.value = 0
    }
    // 如果有选中的目标条目，聚焦到它
    if (selectedGoalIndex.value !== null) {
      nextTick(() => {
        const titleElements = document.querySelectorAll('.item-title')
        if (titleElements[selectedGoalIndex.value]) {
          (titleElements[selectedGoalIndex.value] as HTMLElement).focus()
        }
      })
    }
  } else if (area === 'checkins') {
    // 确保已选择目标
    activeArea.value = 'checkins'
  }
}

// 清除所有元素的焦点
const clearAllFocus = () => {
  // 清除当前文档中所有具有焦点的元素
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
  
  // 清除所有可能的选择
  window.getSelection()?.removeAllRanges()
}

// 返回首页
const goBack = () => {
  router.push('/home')
}

// 拖拽相关函数 - 目标
const dragStart = (index: number) => {
  dragItem.value = index
}

const dragEnd = () => {
  // 如果有有效的拖拽操作
  if (dragItem.value !== null && dragOverItem.value !== null && dragItem.value !== dragOverItem.value) {
    // 创建数组副本
    const itemsCopy = [...goalItems.value]
    const itemToMove = itemsCopy[dragItem.value]
    
    // 从数组中移除
    itemsCopy.splice(dragItem.value, 1)
    // 插入到目标位置
    itemsCopy.splice(dragOverItem.value, 0, itemToMove)
    
    // 更新数组
    goalItems.value = itemsCopy
    
    // 更新选中项
    if (selectedGoalIndex.value === dragItem.value) {
      selectedGoalIndex.value = dragOverItem.value
    } else if (selectedGoalIndex.value === dragOverItem.value) {
      // 如果拖动到当前选中项的位置，则需要调整选中项
      if (dragItem.value < dragOverItem.value) {
        selectedGoalIndex.value--
    } else {
        selectedGoalIndex.value++
      }
    }
    
    // 保存更改
    saveGoalItems()
  }
  
  // 重置拖拽状态
  dragItem.value = null
  dragOverItem.value = null
}

const dragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  dragOverItem.value = index
}

// 拖拽相关函数 - 打卡点
const dragStartCheckin = (index: number) => {
  dragCheckin.value = index
}

const dragEndCheckin = () => {
  if (selectedGoalIndex.value === null) return
  
  // 如果有有效的拖拽操作
  if (dragCheckin.value !== null && dragOverCheckin.value !== null && dragCheckin.value !== dragOverCheckin.value) {
    // 创建数组副本
    const checkinsCopy = [...goalItems.value[selectedGoalIndex.value].checkins]
    const checkinToMove = checkinsCopy[dragCheckin.value]
    
    // 从数组中移除
    checkinsCopy.splice(dragCheckin.value, 1)
    // 插入到目标位置
    checkinsCopy.splice(dragOverCheckin.value, 0, checkinToMove)
    
    // 更新数组
    goalItems.value[selectedGoalIndex.value].checkins = checkinsCopy
    
    // 保存更改
    saveGoalItems()
  }
  
  // 重置拖拽状态
  dragCheckin.value = null
  dragOverCheckin.value = null
}

const dragOverCheckinHandler = (e: DragEvent, index: number) => {
  e.preventDefault()
  dragOverCheckin.value = index
}

// 键盘快捷键处理
const handleKeyDown = (e: KeyboardEvent) => {
  // 处理对话框打开时的情况，让Esc键的处理交给对话框本身
  if (goalDetailsDialogVisible.value || checkinDialogVisible.value || showGuide.value) {
    // 对于打开的对话框中的Enter键处理，让它们自己的事件处理函数处理
    return
  }
  
  // 如果当前处于编辑锁定状态，忽略快捷键
  if (editLock.value) {
    return
  }
  
  // 检查是否在输入状态（如按钮、输入框等）
  const activeElement = document.activeElement;
  const isInputElement = activeElement instanceof HTMLInputElement || 
                         activeElement instanceof HTMLTextAreaElement ||
                         activeElement instanceof HTMLButtonElement ||
                         activeElement instanceof HTMLSelectElement ||
                         (activeElement && activeElement.getAttribute('contenteditable') === 'true');
  
  // 如果在输入元素中，不处理快捷键
  if (isInputElement) {
    return;
  }

  // Esc键处理：取消最后一次的Tab添加操作
  if (e.key === 'Escape' || e.key === 'Esc') {
    e.preventDefault();
    // 检查是否有最近添加的项目需要撤销
    if (lastAddedItemIndex.value !== null) {
      if (lastAddedItemType.value === 'goal') {
        // 撤销最近添加的目标
        goalItems.value.splice(lastAddedItemIndex.value, 1);
        if (selectedGoalIndex.value === lastAddedItemIndex.value) {
          selectedGoalIndex.value = lastAddedItemIndex.value > 0 ? lastAddedItemIndex.value - 1 : null;
        } else if (selectedGoalIndex.value !== null && selectedGoalIndex.value > lastAddedItemIndex.value) {
          // 调整选中项的索引
          selectedGoalIndex.value--;
        }
        ElMessage.info('已取消添加新目标');
      } else if (lastAddedItemType.value === 'checkin' && selectedGoalIndex.value !== null) {
        // 撤销最近添加的打卡点
        goalItems.value[selectedGoalIndex.value].checkins.splice(lastAddedItemIndex.value, 1);
        ElMessage.info('已取消添加新打卡点');
      }
      
      // 重置最后添加项的记录
      lastAddedItemIndex.value = null;
      lastAddedItemType.value = null;
      
      // 保存状态（不包含被撤销的项）
      saveGoalItems();
    }
    return;
  }
  
  // 删除快捷键:
  // Windows/Linux: Alt+Backspace 或 Alt+Delete
  // macOS: Command+Backspace 或 Command+Delete
  if ((e.key === 'Backspace' || e.key === 'Delete') && 
      ((e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) || // Windows/Linux
       (e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey))   // macOS
     ) {
    e.preventDefault()
    if (activeArea.value === 'goals' && selectedGoalIndex.value !== null) {
      deleteGoal(selectedGoalIndex.value)
    } else if (activeArea.value === 'checkins' && selectedGoalIndex.value !== null) {
      const checkinIndex = getSelectedCheckinIndex();
      if (checkinIndex >= 0) {
        deleteCheckin(checkinIndex);
      }
    }
    return
  }
  
  // Tab键: 添加新目标/打卡点
  if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
    e.preventDefault()
    if (activeArea.value === 'goals') {
      // 添加新目标
      const newIndex = addGoal();
      startEditingTitle(newIndex);  // 立即打开编辑
    } else if (activeArea.value === 'checkins' && selectedGoalIndex.value !== null) {
      // 添加新打卡点，并记录索引以便Enter键使用
      addCheckin();
    }
    return
  }
  
  // Enter键：根据当前区域执行不同操作
  if (e.key === 'Enter' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
    e.preventDefault()
    
    // 确保没有正在显示确认删除对话框
    if (document.querySelector('.el-message-box')) {
      return;
    }
    
    // 根据当前选中区域执行操作
    if (activeArea.value === 'goals' && selectedGoalIndex.value !== null) {
      // 打开目标详情编辑弹窗
      startEditingTitle(selectedGoalIndex.value)
    } else if (activeArea.value === 'checkins' && selectedGoalIndex.value !== null) {
      // 在打卡区域，打开编辑对话框
      try {
        addCheckin();
      } catch (error) {
        console.error('添加打卡点出错:', error);
      }
    }
    return
  }
  
  // 上下箭头切换当前区域内的条目
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (activeArea.value === 'goals') {
      // 在目标列表中向上选择
      if (selectedGoalIndex.value !== null && selectedGoalIndex.value > 0) {
        try {
          selectGoal(selectedGoalIndex.value - 1)
          // 确保元素可见
          nextTick(() => {
            try {
              const elements = document.querySelectorAll('.goal-item')
              if (selectedGoalIndex.value !== null && elements[selectedGoalIndex.value]) {
                elements[selectedGoalIndex.value].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
              }
            } catch (scrollError) {
              console.error('滚动到元素失败', scrollError)
            }
          })
        } catch (error) {
          console.error('上移选择出错:', error)
        }
      }
    } else if (activeArea.value === 'checkins' && selectedGoalIndex.value !== null) {
      // 这里可以添加打卡点上下切换的逻辑
      // 待实现
    }
  }
  
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (activeArea.value === 'goals') {
      // 在目标列表中向下选择
      if (selectedGoalIndex.value !== null && selectedGoalIndex.value < goalItems.value.length - 1) {
        try {
          selectGoal(selectedGoalIndex.value + 1)
          // 确保元素可见
          nextTick(() => {
            try {
              const elements = document.querySelectorAll('.goal-item')
              if (selectedGoalIndex.value !== null && elements[selectedGoalIndex.value]) {
                elements[selectedGoalIndex.value].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
              }
            } catch (scrollError) {
              console.error('滚动到元素失败', scrollError)
            }
          })
        } catch (error) {
          console.error('下移选择出错:', error)
        }
      }
    } else if (activeArea.value === 'checkins' && selectedGoalIndex.value !== null) {
      // 这里可以添加打卡点上下切换的逻辑
      // 待实现
    }
  }
  
  // 左右箭头切换区域
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    if (activeArea.value === 'checkins') {
      activeArea.value = 'goals'
      // 确保选择了一个目标
      if (selectedGoalIndex.value !== null) {
        nextTick(() => {
          const titleElements = document.querySelectorAll('.item-title')
          if (titleElements[selectedGoalIndex.value]) {
            (titleElements[selectedGoalIndex.value] as HTMLElement).focus()
          }
        })
      }
    }
  }
  
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    if (activeArea.value === 'goals') {
      activeArea.value = 'checkins'
    }
  }
}

// 生命周期钩子
onMounted(() => {
  loadGoalItems()
  window.addEventListener('keydown', handleKeyDown)
  updateHeatmapData() // 初始化热力图数据
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return format(date, 'yyyy-MM-dd')
  } catch (error) {
    return dateString
  }
}

// 处理目标详情对话框关闭
const handleGoalDialogClose = () => {
  // 如果是通过保存按钮关闭的，不再显示取消消息
  if (isSavingGoal.value) {
    isSavingGoal.value = false
    return
  }
  
  // 检查这是否是Tab键创建的新目标
  if (lastAddedItemIndex.value !== null && lastAddedItemType.value === 'goal') {
    // 撤销最近添加的目标
    goalItems.value.splice(lastAddedItemIndex.value, 1);
    if (selectedGoalIndex.value === lastAddedItemIndex.value) {
      selectedGoalIndex.value = lastAddedItemIndex.value > 0 ? lastAddedItemIndex.value - 1 : null;
    } else if (selectedGoalIndex.value !== null && selectedGoalIndex.value > lastAddedItemIndex.value) {
      // 调整选中项的索引
      selectedGoalIndex.value--;
    }
    
    // 重置最后添加项的记录
    lastAddedItemIndex.value = null;
    lastAddedItemType.value = null;
    
    // 保存状态（不包含被撤销的项）
    saveGoalItems();
    
    ElMessage.info('已取消添加新目标');
  } else {
    ElMessage.info('已取消编辑目标详情');
  }
}

// 处理打卡点对话框关闭
const handleCheckinDialogClose = () => {
  // 如果是通过保存按钮关闭的，不再显示取消消息
  if (isSavingCheckin.value) {
    isSavingCheckin.value = false
    return
  }
  
  // 如果是Tab键触发的新打卡点创建，需要标记为已取消但不实际添加
  if (!isEditingCheckin.value && lastAddedItemType.value === 'checkin') {
    // 重置最后添加项的记录，不需要删除因为还没有实际添加
    lastAddedItemIndex.value = null;
    lastAddedItemType.value = null;
    
    ElMessage.info('已取消添加打卡点');
  } else if (isEditingCheckin.value) {
    ElMessage.info('已取消编辑打卡点');
  } else {
    ElMessage.info('已取消添加打卡点');
  }
}

// 获取当前选中的打卡点索引（如果有）
const getSelectedCheckinIndex = () => {
  // 如果已选中目标，且该目标有打卡点，默认返回第一个打卡点
  if (selectedGoalIndex.value !== null && 
      goalItems.value[selectedGoalIndex.value].checkins.length > 0) {
    // 这里可以改进为返回当前焦点所在的打卡点
    // 未来可以添加打卡点选中状态的跟踪
    return 0;
  }
  return -1;
}

// 导航颜色选项
const navigateColorOptions = (direction: number) => {
  if (selectedGoalIndex.value === null) return
  
  const currentIndex = checkinForm.value.colorIndex
  const newIndex = (currentIndex + direction + colorOptions.length) % colorOptions.length
  checkinForm.value.colorIndex = newIndex
}

// 处理目标标题输入框的Enter键
const handleEnterInTitle = (e: KeyboardEvent) => {
  // 检查是否处于输入法选词状态
  if (e.isComposing || e.keyCode === 229) {
    // 正在使用输入法选词，不做处理，让输入法完成选词
    return;
  }
  
  // 否则，导航到下一个字段
  focusDateInput();
}

// 处理日期输入框的Enter键
const handleEnterInDate = (e: KeyboardEvent) => {
  // 日期选择器中不太可能有输入法选词，直接导航到下一个字段
  focusDescTextarea();
}

// 处理描述文本区域的Enter键
const handleEnterInTextarea = (e: KeyboardEvent) => {
  // 检查是否处于输入法选词状态
  if (e.isComposing || e.keyCode === 229) {
    // 正在使用输入法选词，不做处理
    return;
  }
  
  // 检查是否是Ctrl+Enter或Command+Enter (常用的文本区域换行快捷键)
  if (e.ctrlKey || e.metaKey) {
    // 如果是，允许插入换行符，不阻止默认行为
    return;
  }
  
  // 如果按下了Shift+Enter (另一个常用的文本区域换行快捷键)
  if (e.shiftKey) {
    // 允许插入换行符，不阻止默认行为
    return;
  }
  
  // 如果到这里，说明是单纯的Enter键，执行保存操作
  e.preventDefault(); // 阻止默认的换行行为
  saveGoalDetails();
}

// 处理打卡点名称输入框的Enter键
const handleCheckinEnterInTitle = (e: KeyboardEvent) => {
  // 检查是否处于输入法选词状态
  if (e.isComposing || e.keyCode === 229) {
    // 正在使用输入法选词，不做处理
    return;
  }
  
  // 否则，导航到下一个字段
  focusCountInput();
}

// 处理打卡天数输入框的Enter键
const handleCheckinEnterInCount = (e: KeyboardEvent) => {
  // 数字输入不太可能有输入法选词，直接导航到下一个字段
  focusColorSelector();
}

// 处理打卡点描述输入框的Enter键
const handleCheckinEnterInDesc = (e: KeyboardEvent) => {
  // 检查是否处于输入法选词状态
  if (e.isComposing || e.keyCode === 229) {
    // 正在使用输入法选词，不做处理
    return;
  }
  
  // 检查是否是Ctrl+Enter或Command+Enter (常用的文本区域换行快捷键)
  if (e.ctrlKey || e.metaKey) {
    // 如果是，允许插入换行符，不阻止默认行为
    return;
  }
  
  // 如果按下了Shift+Enter (另一个常用的文本区域换行快捷键)
  if (e.shiftKey) {
    // 允许插入换行符，不阻止默认行为
    return;
  }
  
  // 如果到这里，说明是单纯的Enter键，执行保存操作
  e.preventDefault(); // 阻止默认的换行行为
  saveCheckin();
}

// 处理颜色选择器中的Enter键
const handleCheckinEnterInColor = (e: KeyboardEvent) => {
  // 导航到下一个字段
  focusDescInput();
}

// 打卡热力图相关状态
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const heatmapData = ref<{date: string, count: number}[]>([])
const tooltipData = ref<{date: string, count: number} | null>(null)
const tooltipStyle = ref({
  display: 'none',
  left: '0px',
  top: '0px'
})
const tooltip = ref(null)

// 生成过去一年的日期数据
const generateHeatmapData = () => {
  const data: {date: string, count: number}[] = []
  const today = new Date()
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(today.getFullYear() - 1)
  oneYearAgo.setDate(oneYearAgo.getDate() + 1) // 从去年今天的后一天开始
  
  // 生成日期范围
  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    data.push({
      date: format(d, 'yyyy-MM-dd'),
      count: 0
    })
  }
  
  return data
}

// 根据打卡次数确定单元格的颜色类
const getCellClass = (count: number) => {
  if (count === 0) return 'level-0'
  if (count >= 1 && count <= 2) return 'level-1'
  if (count >= 3 && count <= 4) return 'level-2'
  return 'level-3' // count >= 5
}

// 显示提示框
const showTooltip = (event: MouseEvent, day: {date: string, count: number}) => {
  tooltipData.value = day
  
  if (tooltip.value) {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    tooltipStyle.value = {
      display: 'block',
      left: `${rect.left + window.scrollX}px`,
      top: `${rect.top + window.scrollY - 70}px` // 显示在上方一点
    }
  }
}

// 隐藏提示框
const hideTooltip = () => {
  tooltipStyle.value.display = 'none'
  tooltipData.value = null
}

// 获取某天的总目标打卡次数
const getTotalTarget = (date: string) => {
  // 这里可以根据实际需求计算当天的总打卡目标
  // 例如计算所有目标的打卡点数量
  let totalTarget = 0
  
  // 遍历所有目标和打卡点
  goalItems.value.forEach(goal => {
    if (goal.checkins && goal.checkins.length > 0) {
      // 假设每个打卡点每天都需要打卡一次
      totalTarget += goal.checkins.length
    }
  })
  
  return totalTarget
}

// 更新热力图数据
const updateHeatmapData = () => {
  // 首先生成或重置热力图数据
  heatmapData.value = generateHeatmapData()
  
  // 初始化日期到索引的映射
  const dateMap = new Map<string, number>()
  heatmapData.value.forEach((day, index) => {
    dateMap.set(day.date, index)
  })
  
  // 统计每天的打卡次数
  const dailyCheckins = new Map<string, number>()
  
  // 遍历目标和打卡点，收集打卡数据
  goalItems.value.forEach(goal => {
    if (goal.checkins && goal.checkins.length > 0) {
      goal.checkins.forEach(checkin => {
        // 假设这里有一个字段记录了打卡日期和次数
        // 这里需要根据实际数据结构调整
        // 简单示例：假设每个打卡点有一个 completedToday 字段表示今天完成了
        if (checkin.completedToday) {
          const today = format(new Date(), 'yyyy-MM-dd')
          dailyCheckins.set(today, (dailyCheckins.get(today) || 0) + 1)
        }
        
        // 实际应用中，应该有历史打卡记录，可以遍历这些记录更新热力图
        // 这里仅做示例，仅记录今天的打卡情况
      })
    }
  })
  
  // 更新热力图数据
  dailyCheckins.forEach((count, date) => {
    const index = dateMap.get(date)
    if (index !== undefined) {
      heatmapData.value[index].count = count
    }
  })
}

// 在挂载和数据更新时更新热力图
onMounted(() => {
  loadGoalItems()
  window.addEventListener('keydown', handleKeyDown)
  updateHeatmapData() // 初始化热力图数据
})

// 监听目标数据变化，更新热力图
watch(goalItems, () => {
  updateHeatmapData()
}, { deep: true })
</script>

<style lang="less" scoped>
.goal-planner-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh; /* 确保最小高度 */
  
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
  
  .goal-planner-content {
    margin-top: 60px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: visible;
    
    .goals-layout {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      height: 500px; /* 固定高度 */
      
      .goals-list, .checkins-list {
        border-radius: 8px;
        transition: all 0.3s;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        background-color: white; /* 添加背景色 */
        
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
        
        .list-header, .checkins-header {
          padding: 12px 15px;
          
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
      
      /* 目标列表 - 紫色调 */
      .goals-list {
        width: 40%;
        display: flex;
        flex-direction: column;
        background-color: #f9f0ff;
        border: 1px solid #e4d6ff;
        
        &.active {
          &::after {
            border-color: #9254DE;
          }
        }
        
        .list-header {
          background-color: #f0e6ff;
          border-bottom-color: #d1b3ff;
          
          h2 {
            color: #6231c0;
            
            &::after {
              background-color: #9254DE;
            }
          }
        }
        
        .list-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: auto; /* 添加滚动条 */
        }
        
        .list-content {
          flex: 1;
          padding: 10px;
          padding-bottom: 0;
        }
        
        .add-item-container {
          padding: 15px;
          display: flex;
          justify-content: center;
          background-color: #f9f0ff;
          border-top: 1px solid rgba(146, 84, 222, 0.1);
        }
      }
      
      /* 右侧打卡点列表 */
      .checkins-list {
        width: 60%;
        display: flex;
        flex-direction: column;
        background-color: #f5f7fa;
        border: 1px solid #e4e7ed;
        
        &.active {
          &::after {
            border-color: #409EFF;
          }
        }
        
        .checkins-header {
          background-color: #ecf5ff;
          border-bottom-color: #a0cfff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          h2 {
            color: #2c70e0;
            
            &::after {
              background-color: #409EFF;
            }
          }
        }
        
        .checkins-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: #f5f7fa;
          overflow: auto; /* 添加滚动条 */
        }
      }
    }
  }
}

// 热力图样式
.heatmap-section {
  background-color: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 40px;
  height: 300px; /* 固定高度 */
  
  .heatmap-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  
    h2 {
      font-size: 16px;
      margin: 0;
      font-weight: 600;
      color: #303133;
    }
    
    .heatmap-legend {
      display: flex;
      align-items: center;
      gap: 10px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
        
        span {
          font-size: 12px;
          color: #606266;
        }
      }
    }
  }
  
  .heatmap-container {
    position: relative;
    display: flex;
    height: calc(100% - 40px);
    padding-top: 25px;
    
    .month-labels {
      position: absolute;
      top: 0;
      left: 30px;
      right: 0;
      display: flex;
      justify-content: space-between;
      
      .month-label {
        font-size: 12px;
        color: #909399;
      }
    }
    
    .day-labels {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-right: 10px;
      margin-top: 6px;
      
      .day-label {
        font-size: 12px;
        color: #909399;
        height: 15px;
        line-height: 15px;
        text-align: right;
      }
    }
    
    .heatmap-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(53, 1fr);
      grid-template-rows: repeat(7, 1fr);
      grid-gap: 3px;
      align-content: start;
      
      .heatmap-cell {
        width: 14px;
        height: 14px;
        border-radius: 2px;
        transition: all 0.2s;
      
        &:hover {
          transform: scale(1.2);
        }
        
        &.level-0 {
          background-color: #ebedf0;
        }
        
        &.level-1 {
          background-color: #c6e48b;
        }
        
        &.level-2 {
          background-color: #7bc96f;
        }
        
        &.level-3 {
          background-color: #239a3b;
        }
      }
    }
    
    .heatmap-tooltip {
      position: absolute;
      display: none;
      background-color: #fff;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 12px;
      color: #606266;
      z-index: 100;
      transition: all 0.2s;
      white-space: nowrap;
      
      &:after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #fff;
      }
      
      .tooltip-date {
        font-weight: bold;
        margin-bottom: 3px;
      }
      
      .tooltip-count {
        color: #409EFF;
      }
      
      .tooltip-total {
        margin-top: 3px;
        color: #909399;
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

// 颜色选择器样式
.color-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
  outline: none; /* 去除默认轮廓，但保留焦点状态 */
  padding: 5px;
  border-radius: 4px;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
    background-color: rgba(64, 158, 255, 0.05);
  }
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &.selected {
    transform: scale(1.15);
    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #409eff;
  }
}

/* 目标项样式 */
.goal-item {
  position: relative;
  display: flex;
  margin-bottom: 10px;
  padding: 12px 15px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #9254DE;
  transition: all 0.2s ease;
  cursor: pointer;
  overflow: hidden;
  
  &:hover {
    transform: translateX(3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &.active {
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateX(5px);
  }
  
  &.goal-completed {
    border-left-color: #67C23A;
    
    .item-title {
      color: #67C23A;
      text-decoration: line-through;
      opacity: 0.8;
    }
  }
  
  &.goal-overdue {
    border-left-color: #F56C6C;
  }
  
  &.goal-abandoned {
    border-left-color: #909399;
    opacity: 0.7;
    
    .item-title {
      text-decoration: line-through;
    }
  }
  
  &.item-dragging {
    opacity: 0.5;
    transform: rotate(2deg) scale(0.95);
  }
  
  &.item-drag-over {
    background-color: rgba(146, 84, 222, 0.1);
    transform: translateY(5px);
  }
  
  .drag-handle {
    cursor: grab;
    color: #909399;
    opacity: 0.5;
    margin-right: 8px;
    display: flex;
    align-items: center;
    transition: all 0.2s;
    
    &:hover {
      opacity: 1;
      color: #606266;
    }
  }
  
  .item-content {
    flex: 1;
    min-width: 0;
    
    .item-main {
      .item-title {
        font-weight: 600;
        font-size: 15px;
        color: #303133;
        margin-bottom: 6px;
        display: block;
        outline: none;
        
        &:focus {
          color: #9254DE;
        }
      }
      
      .item-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 6px;
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #909399;
          
          .el-icon {
            font-size: 14px;
          }
          
          &.status-item {
            &.status-completed {
              color: #67C23A;
            }
            
            &.status-overdue {
              color: #F56C6C;
            }
            
            &.status-abandoned {
              color: #909399;
            }
            
            &.status-in-progress {
              color: #409EFF;
            }
          }
        }
      }
    }
    
    .item-description {
      font-size: 13px;
      color: #606266;
      margin-top: 5px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.5;
      background-color: rgba(146, 84, 222, 0.05);
      padding: 6px 8px;
      border-radius: 4px;
      border-left: 2px solid rgba(146, 84, 222, 0.3);
    }
  }
  
  .item-actions {
    display: flex;
    align-items: flex-start;
    margin-left: 8px;
  }
}

/* 打卡点样式 */
.checkins-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 10px;
}

.checkin-item {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateX(3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  &.checkin-item-dragging {
    opacity: 0.5;
    transform: rotate(1deg) scale(0.98);
  }
  
  &.checkin-item-drag-over {
    opacity: 0.7;
    transform: translateY(3px);
  }
  
  .checkin-drag-handle {
    margin-right: 6px;
    color: #909399;
    opacity: 0.7;
    
    &:hover {
      opacity: 1;
    }
  }
  
  .checkin-info {
    flex: 1;
    min-width: 0;
    cursor: pointer;
    
    .checkin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      h4 {
        font-size: 15px;
        font-weight: 500;
        margin: 0;
        color: #303133;
      }
      
      .checkin-count {
        font-size: 12px;
        color: white;
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: 600;
      }
    }
    
    .checkin-progress-container {
      height: 8px;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      overflow: hidden;
      
      .checkin-progress-bar {
        height: 100%;
        border-radius: 4px;
        transition: width 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      }
    }
  }
  
  .checkin-actions {
    display: flex;
    gap: 5px;
  }
}

.no-checkins-tips, .no-goals-tips, .no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #909399;
  padding: 20px;
  
  .el-icon {
    font-size: 32px;
    margin-bottom: 15px;
    color: #c0c4cc;
  }
  
  p {
    margin: 5px 0;
    
    &:first-of-type {
      font-weight: 500;
      font-size: 15px;
      margin-bottom: 8px;
    }
    
    &:last-of-type {
      font-size: 13px;
      opacity: 0.8;
    }
  }
}

.add-checkin-container {
  padding: 15px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #EBEEF5;
  margin-top: auto;
}
</style> 