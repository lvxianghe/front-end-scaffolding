<template>
  <div class="calendar-container" @keydown="handleKeyDown" tabindex="-1" ref="calendarContainer">
    <!-- 返回按钮 -->
    <div class="exit-button" @click="goBack">
      <el-icon><Back /></el-icon>
      <span>返回</span>
    </div>
    
    <!-- 顶部日历网格区域 -->
    <div class="calendar-grid">
      <div class="calendar-header">
        <div class="calendar-title">
          <h2>{{ currentYearMonth }}</h2>
        </div>
        <div class="calendar-nav">
          <el-button type="primary" plain @click="prevMonth">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button type="primary" @click="goToday">今天</el-button>
          <el-button type="primary" plain @click="nextMonth">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
      
      <!-- 星期标题 -->
      <div class="week-days">
        <div class="week-day" v-for="day in weekDays" :key="day">{{ day }}</div>
      </div>
      
      <!-- 日历单元格 -->
      <div class="calendar-days">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index" 
          class="calendar-day" 
          :class="{ 
            'other-month': !day.isCurrentMonth,
            'today': day.isToday,
            'selected': isSelectedDay(day),
            'has-calculated-events': hasCalculatedEvents(day)
          }"
          @click="selectDay(day)"
        >
          <span class="day-number">{{ day.date }}</span>
          <div v-if="day.events && day.events.length > 0" class="day-events-indicator">
            <span class="events-count">{{ day.events.length }}</span>
            <!-- 事件提示 -->
            <div class="events-tooltip">
              <div class="tooltip-title">{{ formatEventDate(day.fullDate) }}的事件</div>
              <div v-for="(event, idx) in day.events" :key="idx" 
                   class="tooltip-event" 
                   :class="{ 'event-calculated': event.isCalculated }">
                <div class="event-dot" :style="{ backgroundColor: event.color }"></div>
                <div class="event-info">
                  <div class="event-title">
                    <span v-if="event.isCalculated" class="calculated-icon">
                      <el-icon><Calendar /></el-icon>
                    </span>
                    {{ event.title }}
                  </div>
                  <div v-if="event.time" class="event-time">{{ event.time }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="hasCalculatedEvents(day)" class="calculated-events-marker">
            <div class="marker-dot"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 下方内容区域 -->
    <div class="calendar-content">
      <!-- 左侧区域：事件管理 -->
      <div 
        class="calendar-left-panel" 
        :class="{ 'panel-focus': activePanelIndex === 0 }"
        @click="setActivePanel(0)"
        tabindex="0"
        ref="leftPanel"
      >
        <div class="panel-header-sticky">
          <h3>事件管理</h3>
          <div class="action-buttons">
            <el-button type="primary" @click="showAddEventDialog">
              <el-icon><Plus /></el-icon>添加事件
            </el-button>
            <el-button @click="showFilterDialog">
              <el-icon><Filter /></el-icon>筛选
            </el-button>
          </div>
        </div>
        
        <!-- 事件列表 -->
        <div class="event-list-container">
          <div class="event-list">
            <div 
              v-for="(event, index) in filteredEvents" 
              :key="index" 
              class="event-item"
              :class="[
                event.type, 
                { 'item-focus': activePanelIndex === 0 && activeItemIndex === index }
              ]"
              @click.stop="selectEvent(index)"
              @dblclick.stop="showEditEventDialog(event, index)"
              @mouseenter="showEventTooltip(event)"
              @mouseleave="hideEventTooltip"
              @keydown.stop="handleEventItemKeyDown($event, index, event)"
              tabindex="0"
              ref="eventItems"
            >
              <div class="event-icon" :style="{ backgroundColor: event.color }">
                <el-icon v-if="event.type === 'birthday'"><Present /></el-icon>
                <el-icon v-else-if="event.type === 'anniversary'"><Calendar /></el-icon>
                <el-icon v-else-if="event.type === 'plan'"><List /></el-icon>
              </div>
              <div class="event-details">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-date">{{ formatEventDate(event.date) }}</div>
              </div>
            </div>
            
            <div v-if="filteredEvents.length === 0" class="no-events">
              暂无事件
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧区域 -->
      <div 
        class="calendar-right-panel" 
        :class="{ 'panel-focus': activePanelIndex === 1 }"
        @click="setActivePanel(1)"
        tabindex="0"
        ref="rightPanel"
      >
        <div class="panel-header-sticky">
          <h3>日期计算</h3>
        </div>
        
        <div class="reminder-content-container">
          <div class="reminder-content">
            <div v-if="selectedEvent" class="event-reminder">
              <div class="selected-event-info">
                <div class="event-icon" :style="{ backgroundColor: selectedEvent.color }">
                  <el-icon v-if="selectedEvent.type === 'birthday'"><Present /></el-icon>
                  <el-icon v-else-if="selectedEvent.type === 'anniversary'"><Calendar /></el-icon>
                  <el-icon v-else-if="selectedEvent.type === 'plan'"><List /></el-icon>
                </div>
                <div class="event-title">{{ selectedEvent.title }}</div>
              </div>
              
              <!-- 生日类型提醒 -->
              <div v-if="selectedEvent.type === 'birthday'" class="reminder-list">
                <div class="reminder-grid">
                  <div class="reminder-item">
                    <div class="reminder-label">阳历生日：</div>
                    <div class="reminder-value">{{ formatEventDate(selectedEvent.date) }}</div>
                  </div>
                  <div class="reminder-item">
                    <div class="reminder-label">阴历生日：</div>
                    <div class="reminder-value">{{ getSolarToLunar(selectedEvent.date) }}</div>
                  </div>
                  <div class="reminder-item">
                    <div class="reminder-label">100天：</div>
                    <div class="reminder-value">{{ calculateDaysAfter(selectedEvent.date, 100) }}</div>
                  </div>
                  <div class="reminder-item">
                    <div class="reminder-label">1000天：</div>
                    <div class="reminder-value">{{ calculateDaysAfter(selectedEvent.date, 1000) }}</div>
                  </div>
                  <div class="reminder-item">
                    <div class="reminder-label">10000天：</div>
                    <div class="reminder-value">{{ calculateDaysAfter(selectedEvent.date, 10000) }}</div>
                  </div>
                  <div class="reminder-item">
                    <div class="reminder-label">今年阳历生日：</div>
                    <div class="reminder-value">{{ calculateBirthdayThisYear(selectedEvent.date) }}</div>
                  </div>
                  <div class="reminder-item">
                    <div class="reminder-label">今年阴历生日：</div>
                    <div class="reminder-value">{{ calculateLunarBirthdayThisYear(selectedEvent.date) }}</div>
                  </div>
                </div>
                
                <div class="reminder-item custom-days">
                  <div class="reminder-label">自定义天数：</div>
                  <div class="custom-days-input" @click.stop>
                    <el-input-number 
                      v-model="customDays" 
                      :min="1" 
                      :max="99999" 
                      size="small" 
                      @change="updateCustomDaysResult"
                      @focus="onCustomDaysInputFocus"
                      @blur="onCustomDaysInputBlur"
                      @keydown.stop
                      tabindex="0"
                      class="custom-days-input-field"
                    />
                    <span class="custom-days-result">{{ customDaysResult }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 纪念日类型提醒 -->
              <div v-else-if="selectedEvent.type === 'anniversary'" class="reminder-list">
                <div class="reminder-grid">
                  <div class="reminder-item">
                    <div class="reminder-label">纪念日：</div>
                    <div class="reminder-value">{{ formatEventDate(selectedEvent.date) }}</div>
                  </div>
                  <div class="reminder-item">
                    <div class="reminder-label">100天：</div>
                    <div class="reminder-value">{{ calculateDaysAfter(selectedEvent.date, 100) }}</div>
                  </div>
                  <div class="reminder-item">
                    <div class="reminder-label">1000天：</div>
                    <div class="reminder-value">{{ calculateDaysAfter(selectedEvent.date, 1000) }}</div>
                  </div>
                  <div class="reminder-item">
                    <div class="reminder-label">10000天：</div>
                    <div class="reminder-value">{{ calculateDaysAfter(selectedEvent.date, 10000) }}</div>
                  </div>
                  <div class="reminder-item">
                    <div class="reminder-label">今年纪念日：</div>
                    <div class="reminder-value">{{ calculateBirthdayThisYear(selectedEvent.date) }}</div>
                  </div>
                </div>
                
                <div class="reminder-item custom-days">
                  <div class="reminder-label">自定义天数：</div>
                  <div class="custom-days-input" @click.stop>
                    <el-input-number 
                      v-model="customDays" 
                      :min="1" 
                      :max="99999" 
                      size="small" 
                      @change="updateCustomDaysResult"
                      @focus="onCustomDaysInputFocus"
                      @blur="onCustomDaysInputBlur"
                      @keydown.stop
                      tabindex="0"
                      class="custom-days-input-field"
                    />
                    <span class="custom-days-result">{{ customDaysResult }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 计划类型提醒 -->
              <div v-else-if="selectedEvent.type === 'plan'" class="reminder-list">
                <div class="reminder-grid">
                  <div class="reminder-item">
                    <div class="reminder-label">计划日期：</div>
                    <div class="reminder-value">{{ formatEventDate(selectedEvent.date) }}</div>
                  </div>
                  <div class="reminder-item">
                    <div class="reminder-label">倒计时：</div>
                    <div class="reminder-value" :class="{'countdown-urgent': getDaysLeft(selectedEvent.date) <= 7}">
                      {{ getDaysLeft(selectedEvent.date) }} 天
                    </div>
                  </div>
                </div>
                
                <div class="reminder-item custom-days">
                  <div class="reminder-label">自定义天数：</div>
                  <div class="custom-days-input" @click.stop>
                    <el-input-number 
                      v-model="customDays" 
                      :min="1" 
                      :max="99999" 
                      size="small" 
                      @change="updateCustomDaysResult"
                      @focus="onCustomDaysInputFocus"
                      @blur="onCustomDaysInputBlur"
                      @keydown.stop
                      tabindex="0"
                      class="custom-days-input-field"
                    />
                    <span class="custom-days-result">{{ customDaysResult }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="no-event-selected">
              <el-empty description="请选择左侧事件查看日期计算" :image-size="100">
                <template #image>
                  <el-icon class="empty-icon"><Calendar /></el-icon>
                </template>
              </el-empty>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 添加事件对话框 -->
      <el-dialog
        v-model="addEventDialogVisible"
        title="添加新事件"
        width="30%"
        @keydown.stop="handleAddDialogKeyDown"
        class="add-event-dialog"
        append-to-body
      >
        <el-form :model="newEvent" label-width="100px">
          <el-form-item label="事件类型">
            <el-select v-model="newEvent.type" placeholder="请选择事件类型">
              <el-option label="生日" value="birthday"></el-option>
              <el-option label="纪念日" value="anniversary"></el-option>
              <el-option label="计划" value="plan"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="事件名称">
            <el-input 
              v-model="newEvent.title" 
              placeholder="请输入事件名称" 
              ref="addTitleInput" 
              autofocus>
            </el-input>
          </el-form-item>
          <el-form-item label="日期类型">
            <el-radio-group v-model="newEvent.dateType">
              <el-radio label="solar">阳历</el-radio>
              <el-radio label="lunar">阴历</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="事件日期">
            <el-date-picker 
              v-if="newEvent.dateType === 'solar'"
              v-model="newEvent.date"
              type="date"
              placeholder="选择阳历日期">
            </el-date-picker>
            <div v-else class="lunar-date-input">
              <el-select v-model="newEvent.lunarYear" placeholder="年" style="width: 100px">
                <el-option v-for="year in availableYears" :key="year" :label="year + '年'" :value="year"></el-option>
              </el-select>
              <el-select v-model="newEvent.lunarMonth" placeholder="月" style="width: 80px">
                <el-option v-for="month in 12" :key="month" :label="month + '月'" :value="month"></el-option>
              </el-select>
              <el-select v-model="newEvent.lunarDay" placeholder="日" style="width: 80px">
                <el-option v-for="day in 30" :key="day" :label="day + '日'" :value="day"></el-option>
              </el-select>
              <el-button @click="convertLunarToSolar" type="primary" size="small">转换</el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="newEvent.dateType === 'lunar'" label="阳历日期">
            <div class="converted-date">{{ formatEventDate(newEvent.date) }}</div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input 
              v-model="newEvent.description" 
              type="textarea" 
              rows="3"
              placeholder="请输入备注信息">
            </el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addEventDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addNewEvent">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 筛选对话框 -->
      <el-dialog
        v-model="filterDialogVisible"
        title="筛选事件"
        width="30%"
      >
        <div class="filter-content">
          <h4>事件类型</h4>
          <el-radio-group v-model="activeEventTab" size="large">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="birthday">生日</el-radio-button>
            <el-radio-button label="anniversary">纪念日</el-radio-button>
            <el-radio-button label="plan">计划</el-radio-button>
          </el-radio-group>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="filterDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="applyFilter">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 添加事件编辑对话框 -->
      <el-dialog
        v-model="editEventDialogVisible"
        title="编辑事件"
        width="30%"
        @keydown.stop="handleEditDialogKeyDown"
        class="edit-event-dialog"
        append-to-body
      >
        <el-form :model="editingEvent" label-width="100px" ref="editForm">
          <el-form-item label="事件类型" ref="typeFormItem">
            <el-select v-model="editingEvent.type" placeholder="请选择事件类型" ref="typeSelect">
              <el-option label="生日" value="birthday"></el-option>
              <el-option label="纪念日" value="anniversary"></el-option>
              <el-option label="计划" value="plan"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="事件名称" ref="titleFormItem">
            <el-input v-model="editingEvent.title" placeholder="请输入事件名称" ref="titleInput" autofocus></el-input>
          </el-form-item>
          <el-form-item label="日期类型">
            <el-radio-group v-model="editingEvent.dateType">
              <el-radio label="solar">阳历</el-radio>
              <el-radio label="lunar">阴历</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="事件日期" ref="dateFormItem">
            <el-date-picker 
              v-if="editingEvent.dateType === 'solar'"
              v-model="editingEvent.date"
              type="date"
              placeholder="选择阳历日期"
              ref="datePicker">
            </el-date-picker>
            <div v-else class="lunar-date-input">
              <el-select v-model="editingEvent.lunarYear" placeholder="年" style="width: 100px">
                <el-option v-for="year in availableYears" :key="year" :label="year + '年'" :value="year"></el-option>
              </el-select>
              <el-select v-model="editingEvent.lunarMonth" placeholder="月" style="width: 80px">
                <el-option v-for="month in 12" :key="month" :label="month + '月'" :value="month"></el-option>
              </el-select>
              <el-select v-model="editingEvent.lunarDay" placeholder="日" style="width: 80px">
                <el-option v-for="day in 30" :key="day" :label="day + '日'" :value="day"></el-option>
              </el-select>
              <el-button @click="convertEditLunarToSolar" type="primary" size="small">转换</el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="editingEvent.dateType === 'lunar'" label="阳历日期">
            <div class="converted-date">{{ formatEventDate(editingEvent.date) }}</div>
          </el-form-item>
          <el-form-item label="备注" ref="descriptionFormItem">
            <el-input 
              v-model="editingEvent.description" 
              type="textarea" 
              rows="3"
              placeholder="请输入备注信息"
              ref="descriptionInput">
            </el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editEventDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveEditEvent">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { ArrowLeft, ArrowRight, Calendar, Back, Present, List, Plus, Filter } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import LunarLib from 'lunar-javascript';

// 确保正确解析lunar-javascript对象
const LunarCalendar = LunarLib.Lunar;
const SolarCalendar = LunarLib.Solar;

const router = useRouter();

// 返回首页
const goBack = () => {
  router.push('/home');
};

// 星期几标题
const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

// 当前显示的年月
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

// 当前选中的日期
const selectedDate = ref(new Date());

// 事件类型标签页
const activeEventTab = ref('all');

// 添加事件对话框
const addEventDialogVisible = ref(false);

// 筛选对话框
const filterDialogVisible = ref(false);

// 编辑事件对话框
const editEventDialogVisible = ref(false);
const editingEvent = ref({
  type: 'plan',
  title: '',
  date: new Date(),
  time: '',
  description: '',
  index: -1, // 用于追踪正在编辑的事件索引
  dateType: 'solar', // 默认使用阳历
  lunarYear: new Date().getFullYear(),
  lunarMonth: 1,
  lunarDay: 1
});

// 编辑表单相关引用
const editForm = ref(null);
const typeSelect = ref(null);
const titleInput = ref(null);
const datePicker = ref(null);
const descriptionInput = ref(null);
const addTitleInput = ref(null);

// 当前编辑表单项索引
const currentEditFormItemIndex = ref(0);
// 表单项引用数组，用于Tab键切换
const formItemRefs = [
  'typeSelect',
  'titleInput',
  'datePicker',
  'descriptionInput'
];

// 当前焦点面板（0为左侧，1为右侧）
const activePanelIndex = ref(0);
// 当前选中的条目索引
const activeItemIndex = ref(-1);
// DOM引用
const calendarContainer = ref(null);
const leftPanel = ref(null);
const rightPanel = ref(null);

// 当前选中的事件
const selectedEvent = ref(null);

// 自定义天数计算
const customDays = ref(777); // 默认值为777天
const customDaysResult = ref('');
// 是否正在编辑自定义天数
const isEditingCustomDays = ref(false);

// 事件类型对应的颜色映射
const eventTypeColors = {
  plan: '#409eff', // 蓝色
  birthday: '#67c23a', // 绿色
  anniversary: '#9254de' // 紫色
};

// 计算当前年月的显示文本
const currentYearMonth = computed(() => {
  return `${currentYear.value}年${currentMonth.value + 1}月`;
});

// 计算选中日期的格式化文本
const selectedDateFormatted = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth() + 1;
  const date = selectedDate.value.getDate();
  const day = weekDays[selectedDate.value.getDay()];
  return `${year}年${month}月${date}日 星期${day}`;
});

// 创建一个新的事件
const newEvent = ref({
  type: 'plan',
  title: '',
  date: new Date(),
  time: '',
  description: '',
  dateType: 'solar', // 默认使用阳历
  lunarYear: new Date().getFullYear(),
  lunarMonth: 1,
  lunarDay: 1
});

// 可选年份范围（前后100年）
const availableYears = computed(() => {
  const years = [];
  for (let i = currentYear.value - 100; i <= currentYear.value + 100; i++) {
    years.push(i);
  }
  return years;
});

// 从 localStorage 加载事件数据
function loadEventsFromLocalStorage() {
  try {
    const storedEvents = localStorage.getItem('calendar-events');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      // 确保日期对象正确恢复并添加正确的颜色
      return parsedEvents.map(event => ({
        ...event,
        date: new Date(event.date),
        color: eventTypeColors[event.type] // 确保颜色与类型匹配
      }));
    }
  } catch (error) {
    console.error('从 localStorage 加载事件失败:', error);
  }
  // 如果出错或没有数据，返回默认示例数据
  return [
    {
      type: 'birthday',
      title: '李明生日',
      date: new Date(2023, 4, 15),
      color: eventTypeColors.birthday,
      description: '记得买蛋糕'
    },
    {
      type: 'anniversary',
      title: '结婚纪念日',
      date: new Date(2023, 4, 20),
      color: eventTypeColors.anniversary,
      description: '预订餐厅'
    },
    {
      type: 'plan',
      title: '项目会议',
      date: new Date(2023, 4, 25),
      time: '14:00',
      color: eventTypeColors.plan,
      description: '讨论项目进度'
    }
  ];
}

// 保存事件数据到 localStorage
function saveEventsToLocalStorage() {
  try {
    localStorage.setItem('calendar-events', JSON.stringify(events.value));
  } catch (error) {
    console.error('保存事件到 localStorage 失败:', error);
  }
}

// 所有事件数据
const events = ref(loadEventsFromLocalStorage());

// 当事件数据变化时，保存到 localStorage
watch(events, () => {
  saveEventsToLocalStorage();
}, { deep: true });

// 根据选择的标签页过滤事件
const filteredEvents = computed(() => {
  if (activeEventTab.value === 'all') {
    return events.value;
  } else {
    return events.value.filter(event => event.type === activeEventTab.value);
  }
});

// 计算日历网格中的日期
const calendarDays = computed(() => {
  const days = [];
  
  // 获取当前月的第一天
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
  // 获取当前月的最后一天
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0);
  
  // 获取当前月第一天是星期几 (0-6)
  const firstDayWeekday = firstDayOfMonth.getDay();
  
  // 添加上个月的日期
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate();
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = prevMonthLastDay - i;
    const fullDate = new Date(currentYear.value, currentMonth.value - 1, date);
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      isToday: isSameDate(fullDate, new Date()),
      events: getEventsForDate(fullDate)
    });
  }
  
  // 添加当前月的日期
  for (let date = 1; date <= lastDayOfMonth.getDate(); date++) {
    const fullDate = new Date(currentYear.value, currentMonth.value, date);
    days.push({
      date,
      fullDate,
      isCurrentMonth: true,
      isToday: isSameDate(fullDate, new Date()),
      events: getEventsForDate(fullDate)
    });
  }
  
  // 添加下个月的日期，填充到42个格子（6行7列）
  const remainingDays = 42 - days.length;
  for (let date = 1; date <= remainingDays; date++) {
    const fullDate = new Date(currentYear.value, currentMonth.value + 1, date);
    days.push({
      date,
      fullDate,
      isCurrentMonth: false,
      isToday: isSameDate(fullDate, new Date()),
      events: getEventsForDate(fullDate)
    });
  }
  
  return days;
});

// 计算选中日期的事件
const selectedDayEvents = computed(() => {
  return events.value.filter(event => 
    isSameDate(event.date, selectedDate.value)
  ).sort((a, b) => a.time.localeCompare(b.time));
});

// 检查两个日期是否为同一天
function isSameDate(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

// 获取特定日期的事件
function getEventsForDate(date) {
  // 基本事件：用户添加的事件
  const basicEvents = events.value.filter(event => isSameDate(event.date, date));
  
  // 计算事件：根据用户添加的事件计算出的日期
  const calculatedEvents = [];
  
  // 遍历所有事件
  events.value.forEach(event => {
    // 生日和纪念日类型需要计算今年的日期
    if (event.type === 'birthday' || event.type === 'anniversary') {
      // 计算阳历今年的日期
      try {
        const thisYear = new Date().getFullYear();
        const eventMonth = event.date.getMonth();
        const eventDate = event.date.getDate();
        const thisYearDate = new Date(thisYear, eventMonth, eventDate);
        
        // 如果今年的日期已过，计算明年的
        const nextYearDate = new Date(thisYear + 1, eventMonth, eventDate);
        
        // 检查当前查询的日期是否匹配
        if (isSameDate(date, thisYearDate)) {
          calculatedEvents.push({
            ...event,
            title: `${event.title}(今年${event.type === 'birthday' ? '生日' : '纪念日'})`,
            isCalculated: true
          });
        } else if (isSameDate(date, nextYearDate) && thisYearDate < new Date()) {
          calculatedEvents.push({
            ...event,
            title: `${event.title}(明年${event.type === 'birthday' ? '生日' : '纪念日'})`,
            isCalculated: true
          });
        }
      } catch (e) {
        console.error('计算阳历日期出错:', e);
      }
      
      // 计算阴历今年的日期
      try {
        // 获取原始阴历日期
        const originalSolar = SolarCalendar.fromDate(event.date);
        const originalLunar = originalSolar.getLunar();
        
        const thisYear = new Date().getFullYear();
        
        try {
          // 尝试使用阴历同月同日，在当年
          const lunarThisYear = LunarCalendar.fromYmd(thisYear, originalLunar.getMonth(), originalLunar.getDay());
          const solarObj = lunarThisYear.getSolar();
          const solarDate = new Date(solarObj.getYear(), solarObj.getMonth() - 1, solarObj.getDay());
          
          // 检查是否匹配
          if (isSameDate(date, solarDate)) {
            calculatedEvents.push({
              ...event,
              title: `${event.title}(今年农历${event.type === 'birthday' ? '生日' : '纪念日'})`,
              isCalculated: true
            });
          }
          
          // 如果今年的日期已过，计算明年的
          if (solarDate < new Date()) {
            try {
              const lunarNextYear = LunarCalendar.fromYmd(thisYear + 1, originalLunar.getMonth(), originalLunar.getDay());
              const nextYearSolarObj = lunarNextYear.getSolar();
              const nextYearSolarDate = new Date(nextYearSolarObj.getYear(), nextYearSolarObj.getMonth() - 1, nextYearSolarObj.getDay());
              
              if (isSameDate(date, nextYearSolarDate)) {
                calculatedEvents.push({
                  ...event,
                  title: `${event.title}(明年农历${event.type === 'birthday' ? '生日' : '纪念日'})`,
                  isCalculated: true
                });
              }
            } catch (e) {
              // 忽略农历日期计算错误
            }
          }
        } catch (e) {
          // 忽略农历日期计算错误
        }
      } catch (e) {
        console.error('计算农历日期出错:', e);
      }
    }
  });
  
  // 合并基本事件和计算事件
  return [...basicEvents, ...calculatedEvents];
}

// 检查是否为选中的日期
function isSelectedDay(day) {
  return isSameDate(day.fullDate, selectedDate.value);
}

// 选择某一天
function selectDay(day) {
  selectedDate.value = new Date(day.fullDate);
}

// 上个月
function prevMonth() {
  if (currentMonth.value === 0) {
    currentYear.value--;
    currentMonth.value = 11;
  } else {
    currentMonth.value--;
  }
}

// 下个月
function nextMonth() {
  if (currentMonth.value === 11) {
    currentYear.value++;
    currentMonth.value = 0;
  } else {
    currentMonth.value++;
  }
}

// 返回今天
function goToday() {
  const today = new Date();
  currentYear.value = today.getFullYear();
  currentMonth.value = today.getMonth();
  selectedDate.value = today;
}

// 格式化事件日期
function formatEventDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

// 显示添加事件对话框
function showAddEventDialog() {
  newEvent.value = {
    type: 'plan',
    title: '',
    date: new Date(selectedDate.value),
    time: '',
    description: '',
    dateType: 'solar',
    lunarYear: new Date().getFullYear(),
    lunarMonth: 1,
    lunarDay: 1
  };
  addEventDialogVisible.value = true;
  
  // 在下一个DOM更新周期后聚焦到标题输入框
  nextTick(() => {
    // 直接通过DOM元素选择器获取标题输入框并聚焦
    setTimeout(() => {
      const titleInput = document.querySelector('.add-event-dialog .el-form-item:nth-child(2) .el-input__inner');
      if (titleInput) {
        titleInput.focus();
      }
    }, 100);
  });
}

// 添加新事件
function addNewEvent() {
  if (!newEvent.value.title || !newEvent.value.date) {
    ElMessage.warning('请填写事件名称和日期');
    return;
  }
  
  events.value.push({
    type: newEvent.value.type,
    title: newEvent.value.title,
    date: new Date(newEvent.value.date),
    time: newEvent.value.time,
    color: eventTypeColors[newEvent.value.type], // 根据事件类型设置颜色
    description: newEvent.value.description
  });
  
  // 保存到 localStorage
  saveEventsToLocalStorage();
  
  ElMessage.success('添加事件成功');
  addEventDialogVisible.value = false;
}

// 鼠标悬停显示事件提示
function showEventTooltip(event) {
  // 将在后续实现
}

// 隐藏事件提示
function hideEventTooltip() {
  // 将在后续实现
}

// 显示筛选对话框
function showFilterDialog() {
  filterDialogVisible.value = true;
}

// 应用筛选
function applyFilter() {
  // 实现筛选逻辑
  filterDialogVisible.value = false;
}

// 设置激活的面板
function setActivePanel(index) {
  // 记录当前滚动位置
  const scrollPosition = {
    left: document.documentElement.scrollLeft || document.body.scrollLeft,
    top: document.documentElement.scrollTop || document.body.scrollTop
  };
  
  activePanelIndex.value = index;
  
  // 更新面板焦点
  nextTick(() => {
    // 聚焦到相应的面板
    if (index === 0) {
      leftPanel.value?.focus({ preventScroll: true });
      
      if (filteredEvents.value.length > 0) {
        // 如果没有已选中项，则选中第一项
        if (activeItemIndex.value === -1) {
          activeItemIndex.value = 0;
          // 设置选中的事件
          selectedEvent.value = filteredEvents.value[0];
          // 更新自定义天数计算结果  
          updateCustomDaysResult();
        }
        // 滚动到选中的项目，但不滚动页面
        scrollToActiveItem();
      }
    } else if (index === 1) {
      rightPanel.value?.focus({ preventScroll: true });
      // 右侧面板不需要重置选中项
    }
    
    // 确保主容器也有焦点，以便接收键盘事件
    calendarContainer.value?.focus({ preventScroll: true });
    
    // 恢复页面滚动位置
    window.scrollTo(scrollPosition.left, scrollPosition.top);
  });
}

// 选择事件条目
function selectEvent(index) {
  // 记录当前滚动位置
  const scrollPosition = {
    left: document.documentElement.scrollLeft || document.body.scrollLeft,
    top: document.documentElement.scrollTop || document.body.scrollTop
  };

  // 确保左侧面板被激活
  activePanelIndex.value = 0;
  
  activeItemIndex.value = index;
  // 设置选中的事件
  selectedEvent.value = filteredEvents.value[index];
  // 更新自定义天数计算结果
  updateCustomDaysResult();
  
  // 确保左侧面板获得焦点
  nextTick(() => {
    if (leftPanel.value) {
      leftPanel.value.focus({ preventScroll: true });
    }
    
    // 恢复页面滚动位置
    window.scrollTo(scrollPosition.left, scrollPosition.top);
  });
}

// 显示事件编辑对话框
function showEditEventDialog(event, index) {
  // 将日期对象转换为阴历，以便在编辑时可以使用
  let lunarYear, lunarMonth, lunarDay;
  try {
    const solar = SolarCalendar.fromDate(event.date);
    const lunar = solar.getLunar();
    lunarYear = lunar.getYear();
    lunarMonth = lunar.getMonth();
    lunarDay = lunar.getDay();
  } catch (e) {
    console.error('转换阴历日期出错:', e);
    lunarYear = new Date().getFullYear();
    lunarMonth = 1;
    lunarDay = 1;
  }

  editingEvent.value = {
    type: event.type,
    title: event.title,
    date: new Date(event.date),
    time: event.time || '',
    description: event.description || '',
    index: index,
    dateType: 'solar', // 默认显示阳历
    lunarYear,
    lunarMonth,
    lunarDay
  };
  
  editEventDialogVisible.value = true;
  
  // 重置编辑表单项索引
  currentEditFormItemIndex.value = 0;
  
  // 聚焦到标题输入框
  nextTick(() => {
    // 使用setTimeout确保DOM已完全渲染
    setTimeout(() => {
      const titleInput = document.querySelector('.edit-event-dialog .el-form-item:nth-child(2) .el-input__inner');
      if (titleInput) {
        titleInput.focus();
      }
    }, 100);
  });
}

// 保存编辑的事件
function saveEditEvent() {
  if (!editingEvent.value.title || !editingEvent.value.date) {
    ElMessage.warning('请填写事件名称和日期');
    return;
  }
  
  const index = editingEvent.value.index;
  if (index >= 0 && index < events.value.length) {
    // 更新事件
    events.value[index] = {
      type: editingEvent.value.type,
      title: editingEvent.value.title,
      date: new Date(editingEvent.value.date),
      time: editingEvent.value.time,
      color: eventTypeColors[editingEvent.value.type], // 根据事件类型设置颜色
      description: editingEvent.value.description
    };
    
    // 保存到 localStorage
    saveEventsToLocalStorage();
    
    // 如果当前选中的是被编辑的事件，更新右侧显示
    if (selectedEvent.value && activeItemIndex.value === index) {
      // 更新选中的事件
      selectedEvent.value = events.value[index];
      // 更新自定义天数计算结果
      updateCustomDaysResult();
    }
    
    ElMessage.success('事件更新成功');
  }
  
  editEventDialogVisible.value = false;
}

// 编辑对话框中的键盘事件处理
function handleEditDialogKeyDown(event) {
  // 防止事件冒泡到主容器
  event.stopPropagation();
  
  if (event.key === 'Enter' && !event.shiftKey && event.target.tagName !== 'TEXTAREA') {
    // Enter键保存编辑，但排除多行文本框
    saveEditEvent();
    event.preventDefault();
  } else if (event.key === 'Escape') {
    // Escape键取消编辑
    editEventDialogVisible.value = false;
    event.preventDefault();
  } else if (event.key === 'Tab') {
    // Tab键在对话框内部的处理，不需要特殊处理，由浏览器默认行为管理
    // 防止与上层容器的Tab键处理冲突
    event.stopPropagation();
  }
}

// 切换到下一个编辑表单项
function moveToNextFormItem() {
  currentEditFormItemIndex.value = (currentEditFormItemIndex.value + 1) % formItemRefs.length;
  focusCurrentFormItem();
}

// 聚焦当前表单项
function focusCurrentFormItem() {
  const refName = formItemRefs[currentEditFormItemIndex.value];
  nextTick(() => {
    if (refName && ref(refName).value) {
      ref(refName).value.focus();
    }
  });
}

// 处理键盘导航
function handleKeyDown(event) {
  // 检查是否是输入框或数字控件
  const isInputElement = 
    document.activeElement && (
      document.activeElement.tagName === 'INPUT' ||
      document.activeElement.classList.contains('el-input__inner') || 
      document.activeElement.classList.contains('el-input-number__decrease') ||
      document.activeElement.classList.contains('el-input-number__increase') ||
      document.activeElement.closest('.el-input-number') ||
      document.activeElement.closest('.custom-days-input')
    );
  
  // 如果是数字输入框相关的元素，直接返回不处理
  if (isInputElement) {
    // 允许所有键盘输入行为
    return;
  }
  
  // 记录当前滚动位置
  const scrollPosition = {
    left: document.documentElement.scrollLeft || document.body.scrollLeft,
    top: document.documentElement.scrollTop || document.body.scrollTop
  };
  
  // 如果对话框打开或者正在编辑自定义天数，不处理主容器的键盘事件
  if (addEventDialogVisible.value || editEventDialogVisible.value || filterDialogVisible.value || isEditingCustomDays.value) {
    return;
  }
  
  // 左右键切换面板
  if (event.key === 'ArrowLeft' && activePanelIndex.value === 1) {
    setActivePanel(0);
    event.preventDefault();
  } else if (event.key === 'ArrowRight' && activePanelIndex.value === 0) {
    setActivePanel(1);
    event.preventDefault();
  }
  
  // 上下键在左侧面板中导航事件条目
  if (activePanelIndex.value === 0 && filteredEvents.value.length > 0) {
    if (event.key === 'ArrowUp' && activeItemIndex.value > 0) {
      activeItemIndex.value--;
      selectEvent(activeItemIndex.value);
      // scrollToActiveItem函数已优化，不需要单独处理
      event.preventDefault();
    } else if (event.key === 'ArrowDown' && activeItemIndex.value < filteredEvents.value.length - 1) {
      activeItemIndex.value++;
      selectEvent(activeItemIndex.value);
      // scrollToActiveItem函数已优化，不需要单独处理
      event.preventDefault();
    } else if (event.key === 'Tab' && !event.shiftKey) {
      // Tab键添加新事件
      showAddEventDialog();
      event.preventDefault();
    } else if ((event.key === 'Backspace' && (event.metaKey || event.altKey || event.ctrlKey)) && activeItemIndex.value !== -1) {
      // Command+Backspace、Alt+Backspace 或 Ctrl+Backspace 删除选中的事件
      // 增加 event.ctrlKey 以支持 Windows 系统
      deleteEvent(activeItemIndex.value);
      event.preventDefault();
    }
  }
  
  // Enter键处理选中的事件
  if (event.key === 'Enter') {
    if (activePanelIndex.value === 0 && activeItemIndex.value !== -1) {
      // 打开编辑对话框
      const selectedEvent = filteredEvents.value[activeItemIndex.value];
      showEditEventDialog(selectedEvent, activeItemIndex.value);
      event.preventDefault();
    }
  }
  
  // 恢复页面滚动位置
  nextTick(() => {
    window.scrollTo(scrollPosition.left, scrollPosition.top);
  });
}

// 滚动到当前选中的条目
function scrollToActiveItem() {
  // 使用nextTick确保DOM已更新
  nextTick(() => {
    if (!leftPanel.value) return;
    
    // 找到事件列表容器（而不是整个左侧面板）
    const eventListContainer = leftPanel.value.querySelector('.event-list-container');
    if (!eventListContainer) return;
    
    const eventItems = eventListContainer.querySelectorAll('.event-item');
    if (eventItems.length > activeItemIndex.value && activeItemIndex.value >= 0) {
      const selectedItem = eventItems[activeItemIndex.value];
      if (selectedItem) {
        // 计算元素的位置和容器的可视区域
        const containerRect = eventListContainer.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();
        
        // 检查元素是否在可视区域内
        const isInView = (
          itemRect.top >= containerRect.top && 
          itemRect.bottom <= containerRect.bottom
        );
        
        // 如果不在可视区域内，则滚动到该元素（只滚动事件列表，不影响页面）
        if (!isInView) {
          const currentScrollTop = eventListContainer.scrollTop;
          const itemOffsetTop = selectedItem.offsetTop;
          const containerHeight = containerRect.height;
          const itemHeight = itemRect.height;
          
          // 计算需要滚动到的位置，使选中项在容器中间
          let newScrollTop;
          if (itemRect.top < containerRect.top) {
            // 如果项目在容器上方，向上滚动
            newScrollTop = itemOffsetTop - containerHeight/4;
          } else {
            // 如果项目在容器下方，向下滚动
            newScrollTop = itemOffsetTop - containerHeight/2 + itemHeight;
          }
          
          // 使用平滑滚动效果
          eventListContainer.scrollTo({
            top: newScrollTop,
            behavior: 'smooth'
          });
        }
      }
    }
  });
}

// 显示事件详情
function showEventDetails(event) {
  // 这里可以添加显示事件详情的逻辑
  ElMessage.info(`查看事件: ${event.title}`);
}

// 添加事件对话框中的键盘事件处理
function handleAddDialogKeyDown(event) {
  // 防止事件冒泡到主容器
  event.stopPropagation();
  
  if (event.key === 'Enter' && !event.shiftKey && event.target.tagName !== 'TEXTAREA') {
    // Enter键保存添加，但排除多行文本框
    addNewEvent();
    event.preventDefault();
  } else if (event.key === 'Escape') {
    // Escape键取消添加
    addEventDialogVisible.value = false;
    event.preventDefault();
  }
}

// 计算指定天数后的日期
function calculateDaysAfter(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatEventDate(result);
}

// 计算今年的生日/纪念日
function calculateBirthdayThisYear(date) {
  const thisYear = new Date().getFullYear();
  const birthdayMonth = date.getMonth();
  const birthdayDate = date.getDate();
  const birthdayThisYear = new Date(thisYear, birthdayMonth, birthdayDate);
  
  // 如果今年的生日/纪念日已经过了，显示明年的
  if (birthdayThisYear < new Date()) {
    birthdayThisYear.setFullYear(thisYear + 1);
  }
  
  return formatEventDate(birthdayThisYear);
}

// 获取距离指定日期还有多少天
function getDaysLeft(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  // 如果目标日期已经过去，返回0
  if (targetDate < today) {
    return 0;
  }
  
  // 计算相差的天数
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// 更新自定义天数计算结果
function updateCustomDaysResult() {
  if (selectedEvent.value && customDays.value) {
    customDaysResult.value = calculateDaysAfter(selectedEvent.value.date, customDays.value);
  }
}

// 阴历计算函数
function getSolarToLunar(date) {
  try {
    const solar = SolarCalendar.fromDate(date);
    const lunar = solar.getLunar();
    return `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
  } catch (error) {
    console.error('阴历转换出错:', error);
    return '计算失败';
  }
}

// 计算今年的阴历生日/纪念日
function calculateLunarBirthdayThisYear(date) {
  try {
    const originalSolar = SolarCalendar.fromDate(date);
    const originalLunar = originalSolar.getLunar();
    
    const thisYear = new Date().getFullYear();
    let lunarThisYear;
    
    try {
      // 尝试使用阴历同月同日，在当年
      lunarThisYear = LunarCalendar.fromYmd(thisYear, originalLunar.getMonth(), originalLunar.getDay());
    } catch (e) {
      // 如果日期无效（例如闰月问题），尝试不同处理方法
      try {
        // 尝试使用小月的最后一天
        const lastDay = originalLunar.getMonth() === 12 ? 29 : 30;
        lunarThisYear = LunarCalendar.fromYmd(thisYear, originalLunar.getMonth(), lastDay);
      } catch (e2) {
        // 如果还失败，使用当年正月初一
        lunarThisYear = LunarCalendar.fromYmd(thisYear, 1, 1);
      }
    }
    
    // 获取农历转公历的日期对象
    const solarObj = lunarThisYear.getSolar();
    const solarDate = new Date(solarObj.getYear(), solarObj.getMonth() - 1, solarObj.getDay());
    
    // 如果今年的生日/纪念日已经过了，显示明年的
    if (solarDate < new Date()) {
      try {
        lunarThisYear = LunarCalendar.fromYmd(thisYear + 1, originalLunar.getMonth(), originalLunar.getDay());
      } catch (e) {
        try {
          // 尝试使用小月的最后一天
          const lastDay = originalLunar.getMonth() === 12 ? 29 : 30;
          lunarThisYear = LunarCalendar.fromYmd(thisYear + 1, originalLunar.getMonth(), lastDay);
        } catch (e2) {
          // 如果还失败，使用明年正月初一
          lunarThisYear = LunarCalendar.fromYmd(thisYear + 1, 1, 1);
        }
      }
      const nextYearSolar = lunarThisYear.getSolar();
      const nextYearSolarDate = new Date(nextYearSolar.getYear(), nextYearSolar.getMonth() - 1, nextYearSolar.getDay());
      return formatEventDate(nextYearSolarDate);
    }
    
    return formatEventDate(solarDate);
  } catch (error) {
    console.error('阴历生日计算出错:', error);
    // 出错时返回原日期，而不是计算失败
    return formatEventDate(date) + '(阴历转换失败)';
  }
}

// 删除事件
function deleteEvent(index) {
  if (index < 0 || index >= filteredEvents.value.length) return;
  
  // 获取当前事件
  const eventToDelete = filteredEvents.value[index];
  
  // 如果当前是筛选状态，需要找到在原始事件列表中的位置
  const originalIndex = events.value.findIndex(event => 
    event.title === eventToDelete.title && 
    event.date.getTime() === eventToDelete.date.getTime() &&
    event.type === eventToDelete.type
  );
  
  if (originalIndex !== -1) {
    // 显示确认对话框
    ElMessageBox.confirm(
      `确定要删除事件"${eventToDelete.title}"吗？`, 
      '删除确认', 
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 用户确认后删除事件
      events.value.splice(originalIndex, 1);
      
      // 更新选中的事件
      if (filteredEvents.value.length > 0) {
        // 如果删除的是最后一个事件，选中前一个
        if (index >= filteredEvents.value.length - 1) {
          selectEvent(filteredEvents.value.length - 2 >= 0 ? filteredEvents.value.length - 2 : 0);
        } else {
          // 否则选中同一位置
          selectEvent(index);
        }
      } else {
        // 如果没有事件了，清空选中
        selectedEvent.value = null;
        activeItemIndex.value = -1;
      }
      
      // 保存到 localStorage
      saveEventsToLocalStorage();
      
      ElMessage.success('事件已删除');
    }).catch(() => {
      // 用户取消
    });
  }
}

// 处理事件项的键盘事件
function handleEventItemKeyDown(event, index, item) {
  // 记录当前滚动位置
  const scrollPosition = {
    left: document.documentElement.scrollLeft || document.body.scrollLeft,
    top: document.documentElement.scrollTop || document.body.scrollTop
  };
  
  if (event.key === 'Enter') {
    // Enter键编辑事件
    showEditEventDialog(item, index);
    event.preventDefault();
  } else if (event.key === 'Backspace' && (event.metaKey || event.altKey || event.ctrlKey)) {
    // Command+Backspace、Alt+Backspace 或 Ctrl+Backspace 删除事件
    // 增加 event.ctrlKey 以支持 Windows 系统
    deleteEvent(index);
    event.preventDefault();
  } else if (event.key === 'ArrowUp') {
    // 向上键选择上一个事件
    if (index > 0) {
      selectEvent(index - 1);
      // scrollToActiveItem函数有了更新，不需要手动恢复滚动位置
      event.preventDefault();
    }
  } else if (event.key === 'ArrowDown') {
    // 向下键选择下一个事件
    if (index < filteredEvents.value.length - 1) {
      selectEvent(index + 1);
      // scrollToActiveItem函数有了更新，不需要手动恢复滚动位置
      event.preventDefault();
    }
  }
  
  // 恢复页面滚动位置
  nextTick(() => {
    window.scrollTo(scrollPosition.left, scrollPosition.top);
  });
}

// 自定义天数输入框获得焦点
function onCustomDaysInputFocus(event) {
  isEditingCustomDays.value = true;
  // 防止输入框获得焦点后立即触发键盘导航
  if (event) {
    event.stopPropagation();
  }
}

// 自定义天数输入框失去焦点
function onCustomDaysInputBlur() {
  // 延迟一点设置标志，以避免立即处理键盘事件
  setTimeout(() => {
    isEditingCustomDays.value = false;
  }, 100);
}

// 阴历日期转阳历日期
function convertLunarToSolar() {
  try {
    // 检查阴历日期是否有效
    if (!newEvent.value.lunarYear || !newEvent.value.lunarMonth || !newEvent.value.lunarDay) {
      ElMessage.warning('请输入完整的阴历日期');
      return;
    }
    
    // 使用lunar-javascript库将阴历转换为阳历
    const lunar = LunarCalendar.fromYmd(
      newEvent.value.lunarYear,
      newEvent.value.lunarMonth,
      newEvent.value.lunarDay
    );
    const solar = lunar.getSolar();
    
    // 更新阳历日期
    newEvent.value.date = new Date(
      solar.getYear(),
      solar.getMonth() - 1, // JavaScript月份从0开始
      solar.getDay()
    );
    
    ElMessage.success('阴历转换成功');
  } catch (error) {
    console.error('阴历转阳历出错:', error);
    ElMessage.error('阴历日期无效，请检查输入');
  }
}

// 编辑时阴历日期转阳历日期
function convertEditLunarToSolar() {
  try {
    // 检查阴历日期是否有效
    if (!editingEvent.value.lunarYear || !editingEvent.value.lunarMonth || !editingEvent.value.lunarDay) {
      ElMessage.warning('请输入完整的阴历日期');
      return;
    }
    
    // 使用lunar-javascript库将阴历转换为阳历
    const lunar = LunarCalendar.fromYmd(
      editingEvent.value.lunarYear,
      editingEvent.value.lunarMonth,
      editingEvent.value.lunarDay
    );
    const solar = lunar.getSolar();
    
    // 更新阳历日期
    editingEvent.value.date = new Date(
      solar.getYear(),
      solar.getMonth() - 1, // JavaScript月份从0开始
      solar.getDay()
    );
    
    ElMessage.success('阴历转换成功');
  } catch (error) {
    console.error('阴历转阳历出错:', error);
    ElMessage.error('阴历日期无效，请检查输入');
  }
}

// 初始化
onMounted(() => {
  goToday();
  
  // 设置初始焦点在左侧面板
  setActivePanel(0);
  
  // 如果有事件，默认选中第一个
  if (filteredEvents.value.length > 0) {
    selectEvent(0);
    // 初始化自定义天数计算结果
    updateCustomDaysResult();
  }
  
  // 捕获键盘事件
  calendarContainer.value.focus();
});

// 检查日期是否包含计算出的事件
function hasCalculatedEvents(day) {
  return day.events && day.events.some(event => event.isCalculated);
}
</script>

<style scoped>
.calendar-container {
  max-width: 1200px; /* 原来可能更宽，现在限制最大宽度 */
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
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
}

.exit-button:hover {
  background: #ffffff;
  border-color: rgba(64, 158, 255, 0.4);
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
}

.exit-button .el-icon {
  font-size: 18px;
}

.exit-button span {
  font-size: 16px;
}

.calendar-grid {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
}

.calendar-nav {
  display: flex;
  gap: 10px;
}

.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(80px, auto);
  gap: 5px;
}

.calendar-day {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 5px;
  min-height: 80px;
  cursor: pointer;
  position: relative;
}

.calendar-day:hover {
  background-color: #f5f7fa;
}

.calendar-day.other-month {
  color: #c0c4cc;
  background-color: #f9f9f9;
}

.calendar-day.today {
  border-color: #409eff;
}

.calendar-day.selected {
  background-color: #ecf5ff;
  border-color: #409eff;
}

.day-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-weight: bold;
}

.today .day-number {
  background-color: #409eff;
  color: white;
  border-radius: 50%;
}

.day-events-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.events-count {
  background-color: #f56c6c;
  color: white;
  font-size: 11px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 50%;
}

.events-tooltip {
  display: none;
  position: absolute;
  top: 30px;
  right: 0;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 200px;
}

.day-events-indicator:hover .events-tooltip {
  display: block;
}

.tooltip-title {
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.tooltip-event {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 5px;
  border-radius: 4px;
}

.tooltip-event:hover {
  background-color: #f5f7fa;
}

.tooltip-event.event-calculated {
  background-color: #ecf5ff;
  border-left: 3px solid #409eff;
}

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.calendar-content {
  display: flex;
  gap: 20px;
  width: 100%;
}

.calendar-left-panel,
.calendar-right-panel {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border: 2px solid transparent;
}

/* 调整左右面板宽度比例 */
.calendar-left-panel {
  flex: 0.5; /* 左侧占50% */
  max-width: none;
}

.calendar-right-panel {
  flex: 0.5; /* 右侧占50% */
  max-width: none;
}

.date-grid {
  width: 100%;
  max-width: 300px; /* 限制日历网格的宽度 */
  border-collapse: collapse;
}

.panel-header-sticky {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 18px;
  border-bottom: 1px solid #eee;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.panel-header-sticky h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.event-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 18px 18px;
}

.event-list {
  margin-top: 10px;
  min-height: 400px;
}

.reminder-content-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 18px 18px;
}

.reminder-content {
  padding: 10px 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.event-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 5px solid #409eff;
  background-color: #f8f8f8;
  max-width: 100%; /* 确保事件项不溢出 */
}

.event-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.event-item.birthday {
  border-left: 5px solid #67c23a; /* 绿色 */
}

.event-item.anniversary {
  border-left: 5px solid #9254de; /* 紫色 */
}

.event-item.plan {
  border-left: 5px solid #409eff; /* 蓝色 */
}

.event-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: white;
  font-size: 18px;
}

.event-details {
  flex: 1;
}

.event-title {
  font-weight: bold;
  margin-bottom: 6px;
  font-size: 16px;
  color: #303133;
}

.event-date {
  font-size: 13px;
  color: #909399;
}

.no-events {
  color: #909399;
  text-align: center;
  padding: 40px 0;
  font-size: 14px;
}

.calendar-right-panel h3 {
  text-align: center;
  font-weight: normal;
  color: #606266;
}

.filter-content {
  margin-bottom: 20px;
}

.filter-content h4 {
  margin-bottom: 10px;
  font-weight: bold;
}

/* 添加焦点状态样式 */
.panel-focus {
  outline: none;
  border: 2px solid #409eff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
}

/* 没有焦点时的面板样式 */
.calendar-left-panel,
.calendar-right-panel {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border: 2px solid transparent;
}

/* 添加焦点条目样式 */
.item-focus {
  transform: translateY(0);
  background-color: #ecf5ff;
  position: relative;
}

.item-focus:before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #409eff;
  border-radius: 8px;
  pointer-events: none;
  z-index: 1;
}

/* 确保容器可以接收焦点 */
.calendar-container {
  outline: none;
}

/* 右侧提醒内容样式 */
.reminder-content {
  padding: 10px 0;
}

.selected-event-info {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.selected-event-info .event-title {
  font-size: 18px;
  font-weight: bold;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reminder-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.reminder-item {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.reminder-item:hover {
  background-color: #f5f7fa;
}

.reminder-label {
  color: #909399;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 13px;
}

.reminder-value {
  color: #303133;
  font-weight: 500;
}

.countdown-urgent {
  color: #f56c6c;
  font-weight: bold;
}

.no-event-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.empty-icon {
  font-size: 40px;
  color: #c0c4cc;
}

/* 自定义天数计算样式 - 放在单独一行 */
.custom-days {
  background-color: #f0f7ff;
  grid-column: 1 / span 2;
  margin-top: 10px;
}

.custom-days-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-days-input-field {
  z-index: 5;
}

/* 确保el-input-number内部的输入框能获得焦点 */
.el-input-number:focus-within {
  outline: 2px solid #409eff;
  outline-offset: 1px;
}

.custom-days-result {
  font-weight: bold;
  color: #409eff;
}

.event-info {
  flex: 1;
}

.event-title {
  font-size: 13px;
  color: #303133;
}

.event-time {
  font-size: 10px;
  color: #909399;
}

/* 修复旧的面板头部样式 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.lunar-date-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.converted-date {
  padding: 10px 15px;
  background-color: #f0f7ff;
  border-radius: 4px;
  font-weight: bold;
  color: #409eff;
}

.calculated-events-marker {
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #409eff;
  position: relative;
}

.marker-dot::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #409eff;
  top: -3px;
  left: -3px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.2);
    opacity: 0;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}

.has-calculated-events {
  position: relative;
  background-color: rgba(64, 158, 255, 0.05);
}

.event-calculated {
  background-color: #ecf5ff;
  border-left: 3px solid #409eff;
}

.calculated-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
  color: #409eff;
  font-size: 12px;
}

.tooltip-event.event-calculated .event-title {
  display: flex;
  align-items: center;
  color: #409eff;
  font-weight: 500;
}
</style> 