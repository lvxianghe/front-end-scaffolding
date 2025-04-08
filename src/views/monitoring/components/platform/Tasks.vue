<template>
  <div class="platform-tasks">
    <div class="section-header">
      <h3>跑批任务监控</h3>
      <div class="header-actions">
        <div class="view-toggle-buttons">
          <el-tooltip content="列表视图" placement="top">
            <div 
              class="toggle-button" 
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <el-icon><List /></el-icon>
            </div>
          </el-tooltip>
          <el-tooltip content="卡片视图" placement="top">
            <div 
              class="toggle-button" 
              :class="{ active: viewMode === 'card' }"
              @click="viewMode = 'card'"
            >
              <el-icon><Grid /></el-icon>
            </div>
          </el-tooltip>
        </div>
        
        <el-select v-model="taskFilter" placeholder="任务状态" size="small">
          <el-option label="全部" value="all" />
          <el-option label="运行中" value="running" />
          <el-option label="已完成" value="success" />
          <el-option label="警告" value="warning" />
          <el-option label="错误" value="error" />
        </el-select>
      </div>
    </div>
    
    <div>
      <p>当前视图模式: {{ viewMode }}</p>
    </div>
    
    <!-- 列表视图 -->
    <div v-if="viewMode === 'list'" class="task-progress-list">
      <div 
        v-for="task in filteredTasks" 
        :key="task.id" 
        class="task-progress-item" 
        :class="task.status"
        @click="showTaskDetails(task)"
      >
        <div class="task-info">
          <div class="task-name">{{ task.name }}</div>
          <div class="task-status" :class="task.status">{{ getStatusText(task.status) }}</div>
        </div>
        <el-progress 
          :percentage="task.progress" 
          :status="task.status === 'error' ? 'exception' : task.status === 'warning' ? 'warning' : ''"
          :stroke-width="10"
        />
        <div class="task-details">
          <span>开始: {{ task.startTime }}</span>
          <span>预计完成: {{ task.endTime }}</span>
          <span>耗时: {{ task.duration }}</span>
        </div>
      </div>
    </div>
    
    <!-- 卡片视图 -->
    <div v-else class="task-card-grid">
      <div 
        v-for="task in filteredTasks" 
        :key="task.id" 
        class="task-card" 
        :class="task.status"
        @click="showTaskDetails(task)"
      >
        <div class="task-card-header">
          <div class="task-name">{{ task.name }}</div>
          <div class="task-status">{{ getStatusText(task.status) }}</div>
        </div>
        <div class="task-card-progress">
          <div class="progress-value">{{ task.progress }}%</div>
          <el-progress 
            :percentage="task.progress" 
            :status="task.status === 'error' ? 'exception' : task.status === 'warning' ? 'warning' : ''"
            :stroke-width="8"
            :show-text="false"
          />
        </div>
        <div class="task-card-details">
          <div class="detail-item">
            <div class="label">开始时间</div>
            <div class="value">{{ task.startTime }}</div>
          </div>
          <div class="detail-item">
            <div class="label">预计完成</div>
            <div class="value">{{ task.endTime }}</div>
          </div>
          <div class="detail-item">
            <div class="label">耗时</div>
            <div class="value">{{ task.duration }}</div>
          </div>
        </div>
        <div class="task-card-actions">
          <el-button 
            size="small" 
            type="text" 
            :disabled="task.status === 'success'"
            @click.stop="toggleTaskStatus(task)"
          >
            {{ task.status === 'running' ? '暂停' : '开始' }}
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 详情对话框 -->
    <el-dialog
      v-model="showTaskDetail"
      :title="''"
      width="1200px"
      destroy-on-close
      class="task-detail-dialog"
      top="5vh"
      :fullscreen="false"
      :modal="true"
      :close-on-click-modal="true"
      :show-close="true"
    >
      <template v-if="currentTask">
        <!-- 顶部基本信息区域 - 优化排版 -->
        <div class="task-detail-section task-basic-info">
          <div class="task-detail-header">
            <div class="task-title-group">
              <h2>{{ currentTask.name }}夜间跑批</h2>
              <div class="task-detail-status" :class="currentTask.status">
                {{ getStatusText(currentTask.status) }}
              </div>
            </div>
            
            <div class="task-meta-info">
              <div class="meta-item">
                <el-icon><Clock /></el-icon>
                <span>{{ currentTask.startTime }} - {{ currentTask.endTime }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Timer /></el-icon>
                <span>{{ currentTask.duration }}</span>
              </div>
            </div>
          </div>
          
          <div class="task-progress-bar">
            <el-progress 
              :percentage="currentTask.progress" 
              :status="currentTask.status === 'error' ? 'exception' : currentTask.status === 'warning' ? 'warning' : ''"
              :stroke-width="12"
              :format="() => `${currentTask.progress}%`"
            />
          </div>
        </div>
        
        <!-- 中部任务详情区域 -->
        <div class="task-detail-section task-detail-content-section">
          <h3 class="section-title">任务详情</h3>
          <div class="task-detail-content">
            <!-- 左侧任务列表 -->
            <div class="task-list-panel">
              <h3>任务列表</h3>
              <el-table :data="getSubtasksList()" style="width: 100%" size="small" @row-click="handleRowClick">
                <el-table-column prop="name" label="任务名称" min-width="150" />
                <el-table-column prop="progress" label="进度" width="150">
                  <template #default="scope">
                    <el-progress 
                      :percentage="scope.row.percentage" 
                      :status="scope.row.status === 'error' ? 'exception' : scope.row.status === 'warning' ? 'warning' : ''"
                      :stroke-width="5"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-tag 
                      :type="scope.row.status === 'success' ? 'success' : 
                             scope.row.status === 'running' ? 'primary' : 
                             scope.row.status === 'warning' ? 'warning' : 
                             scope.row.status === 'error' ? 'danger' : 'info'"
                      size="small"
                    >
                      {{ getStatusText(scope.row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="owner" label="负责人" width="100" />
              </el-table>
            </div>
            
            <!-- 右侧报错/风险信息 -->
            <div class="task-info-panel">
              <div class="panel-header">
                <h3>{{ getCurrentSubtaskName() }}</h3>
                <div class="action-buttons">
                  <el-button type="warning" size="small">
                    <el-icon><Bell /></el-icon>
                    告警
                  </el-button>
                  <el-button type="primary" size="small">
                    <el-icon><DataAnalysis /></el-icon>
                    分析
                  </el-button>
                </div>
              </div>
              
              <div class="panel-content">
                <template v-if="hasErrors()">
                  <div class="error-list">
                    <div class="error-item" v-for="(error, index) in getCurrentErrors()" :key="index">
                      <div class="error-time">{{ error.time }}</div>
                      <div class="error-message" :class="error.level">{{ error.message }}</div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="progress-info">
                    <div class="progress-item">
                      <div class="label">当前进度:</div>
                      <div class="value">{{ getCurrentProgress() }}</div>
                    </div>
                    <div class="progress-bar">
                      <el-progress 
                        :percentage="getCurrentPercentage()" 
                        :status="getCurrentStatus()"
                      />
                    </div>
                    <div class="progress-detail">
                      <div class="detail-item">
                        <div class="label">负责人:</div>
                        <div class="value">{{ getCurrentOwner() }}</div>
                      </div>
                      <div class="detail-item">
                        <div class="label">预计完成时间:</div>
                        <div class="value">{{ getCurrentEndTime() }}</div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 底部任务依赖关系区域 -->
        <div class="task-detail-section task-dependency-section">
          <h3 class="section-title">任务依赖关系</h3>
          <div class="section-header">
            <div class="view-toggle">
              <el-radio-group v-model="dependencyViewMode" size="small">
                <el-radio-button label="table">表格视图</el-radio-button>
                <el-radio-button label="flow">链路视图</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          
          <!-- 表格视图 -->
          <div v-show="dependencyViewMode === 'table'" class="dependency-table">
            <el-table :data="getDependencyData()" style="width: 100%" size="small" border>
              <el-table-column prop="name" label="任务项" min-width="150" />
              <el-table-column prop="level" label="节点层级" width="100" />
              <el-table-column prop="parent" label="父节点" min-width="150" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag 
                    :type="scope.row.status === 'success' ? 'success' : 
                           scope.row.status === 'running' ? 'primary' : 
                           scope.row.status === 'warning' ? 'warning' : 
                           scope.row.status === 'error' ? 'danger' : 'info'"
                    size="small"
                  >
                    {{ getStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="startTime" label="开始时间" width="120" />
              <el-table-column prop="endTime" label="结束时间" width="120" />
            </el-table>
          </div>
          
          <!-- 链路视图 -->
          <div v-show="dependencyViewMode === 'flow'" class="dependency-flow-container">
            <div class="dependency-flow">
              <!-- 第一层：开始节点 -->
              <div class="flow-level">
                <div class="flow-node start">
                  <div class="node-content">
                    <div class="node-icon"><el-icon><Timer /></el-icon></div>
                    <div class="node-name">开始</div>
                  </div>
                </div>
              </div>
              
              <!-- 第二层：数据准备 -->
              <div class="flow-level">
                <div class="flow-node" :class="getNodeStatus('数据准备')">
                  <div class="node-content">
                    <div class="node-icon"><el-icon><Document /></el-icon></div>
                    <div class="node-name">数据准备</div>
                  </div>
                </div>
              </div>
              
              <!-- 第三层：并行节点 -->
              <div class="flow-level multi">
                <div class="flow-node" :class="getNodeStatus('数据清洗')">
                  <div class="node-content">
                    <div class="node-icon"><el-icon><Brush /></el-icon></div>
                    <div class="node-name">数据清洗</div>
                  </div>
                </div>
                <div class="flow-node" :class="getNodeStatus('数据转换')">
                  <div class="node-content">
                    <div class="node-icon"><el-icon><RefreshRight /></el-icon></div>
                    <div class="node-name">数据转换</div>
                  </div>
                </div>
                <div class="flow-node" :class="getNodeStatus('数据校验')">
                  <div class="node-content">
                    <div class="node-icon"><el-icon><Check /></el-icon></div>
                    <div class="node-name">数据校验</div>
                  </div>
                </div>
              </div>
              
              <!-- 第四层：复杂并行节点 -->
              <div class="flow-level multi complex">
                <div class="flow-node-group">
                  <div class="flow-node small" :class="getNodeStatus('指标计算')">
                    <div class="node-content">
                      <div class="node-icon"><el-icon><DataAnalysis /></el-icon></div>
                      <div class="node-name">指标计算</div>
                    </div>
                  </div>
                  <div class="flow-node small" :class="getNodeStatus('风险评估')">
                    <div class="node-content">
                      <div class="node-icon"><el-icon><Warning /></el-icon></div>
                      <div class="node-name">风险评估</div>
                    </div>
                  </div>
                </div>
                
                <div class="flow-node-group">
                  <div class="flow-node small" :class="getNodeStatus('数据聚合')">
                    <div class="node-content">
                      <div class="node-icon"><el-icon><Histogram /></el-icon></div>
                      <div class="node-name">数据聚合</div>
                    </div>
                  </div>
                  <div class="flow-node small" :class="getNodeStatus('数据分区')">
                    <div class="node-content">
                      <div class="node-icon"><el-icon><Menu /></el-icon></div>
                      <div class="node-name">数据分区</div>
                    </div>
                  </div>
                </div>
                
                <div class="flow-node-group">
                  <div class="flow-node small" :class="getNodeStatus('质量检查')">
                    <div class="node-content">
                      <div class="node-icon"><el-icon><CircleCheck /></el-icon></div>
                      <div class="node-name">质量检查</div>
                    </div>
                  </div>
                  <div class="flow-node small" :class="getNodeStatus('异常处理')">
                    <div class="node-content">
                      <div class="node-icon"><el-icon><Remove /></el-icon></div>
                      <div class="node-name">异常处理</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 第五层：数据加载 -->
              <div class="flow-level">
                <div class="flow-node" :class="getNodeStatus('数据加载')">
                  <div class="node-content">
                    <div class="node-icon"><el-icon><Upload /></el-icon></div>
                    <div class="node-name">数据加载</div>
                  </div>
                </div>
              </div>
              
              <!-- 第六层：结束节点 -->
              <div class="flow-level">
                <div class="flow-node end">
                  <div class="node-content">
                    <div class="node-icon"><el-icon><SuccessFilled /></el-icon></div>
                    <div class="node-name">完成</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { 
  List, Grid, Check, Loading, Warning, Close, 
  Bell, DataAnalysis, Timer, Document, Brush, 
  RefreshRight, Upload, SuccessFilled, Histogram, 
  Menu, CircleCheck, Remove, Clock
} from '@element-plus/icons-vue'

// 修改默认视图为卡片视图
const viewMode = ref('card')
const taskFilter = ref('all')
const showTaskDetail = ref(false)
const currentTask = ref(null)
const showErrors = ref(false)
const selectedSubtask = ref(null)
const dependencyViewMode = ref('table') // 默认为表格视图

const toggleView = async () => {
  viewMode.value = viewMode.value === 'list' ? 'card' : 'list'
  console.log('视图已切换为:', viewMode.value)
  
  // 使用 nextTick 确保 DOM 更新
  await nextTick()
  // 强制重新计算布局
  window.dispatchEvent(new Event('resize'))
}

const tasks = ref([
  { 
    id: 1, 
    name: '数仓跑批', 
    status: 'success', 
    progress: 100, 
    startTime: '08:00', 
    endTime: '09:30', 
    duration: '1小时30分钟' 
  },
  { 
    id: 2, 
    name: '大数据跑批', 
    status: 'running', 
    progress: 45, 
    startTime: '09:30', 
    endTime: '10:30', 
    duration: '1小时' 
  },
  { 
    id: 3, 
    name: '监管集市跑批', 
    status: 'warning', 
    progress: 80, 
    startTime: '10:00', 
    endTime: '11:30', 
    duration: '1小时30分钟' 
  },
  { 
    id: 4, 
    name: '数字化运营跑批', 
    status: 'error', 
    progress: 30, 
    startTime: '11:00', 
    endTime: '12:00', 
    duration: '1小时' 
  },
  { 
    id: 5, 
    name: '泰隆数据跑批监测', 
    status: 'running', 
    progress: 60, 
    startTime: '12:30', 
    endTime: '13:30', 
    duration: '1小时' 
  }
])

const filteredTasks = computed(() => {
  if (taskFilter.value === 'all') {
    return tasks.value
  }
  return tasks.value.filter(task => task.status === taskFilter.value)
})

const getStatusText = (status) => {
  switch (status) {
    case 'success': return '已完成'
    case 'running': return '运行中'
    case 'warning': return '警告'
    case 'error': return '错误'
    default: return '未知'
  }
}

// 获取子任务列表
const getSubtasksList = () => {
  return [
    { 
      id: 1, 
      name: '风险集市', 
      status: 'success', 
      percentage: 100, 
      owner: '张三',
      current: 1250,
      total: 1250,
      endTime: '09:30'
    },
    { 
      id: 2, 
      name: '公共集市', 
      status: 'success', 
      percentage: 100,
      owner: '李四',
      current: 980,
      total: 980,
      endTime: '09:45'
    },
    { 
      id: 3, 
      name: '数据仓库', 
      status: 'running', 
      percentage: 75,
      owner: '王五',
      current: 750,
      total: 1000,
      endTime: '10:15'
    },
    { 
      id: 4, 
      name: '应用接口', 
      status: 'warning', 
      percentage: 60,
      owner: '赵六',
      current: 300,
      total: 500,
      endTime: '10:30'
    },
    { 
      id: 5, 
      name: '报表和应用接口', 
      status: 'success', 
      percentage: 100,
      owner: '钱七',
      current: 200,
      total: 200,
      endTime: '09:15'
    },
    { 
      id: 6, 
      name: '数字化运营', 
      status: 'error', 
      percentage: 30,
      owner: '孙八',
      current: 150,
      total: 500,
      endTime: '11:00'
    },
    { 
      id: 7, 
      name: '指标集市', 
      status: 'running', 
      percentage: 45,
      owner: '周九',
      current: 225,
      total: 500,
      endTime: '10:45'
    },
    { 
      id: 8, 
      name: '非夜间项目跑批情况', 
      status: 'success', 
      percentage: 100,
      owner: '吴十',
      current: 300,
      total: 300,
      endTime: '09:00'
    }
  ]
}

// 处理表格行点击
const handleRowClick = (row) => {
  selectSubtask(row.id)
}

// 选择子任务
const selectSubtask = (id) => {
  selectedSubtask.value = id
}

// 获取当前选中子任务的名称
const getCurrentSubtaskName = () => {
  if (!selectedSubtask.value) {
    return '请选择任务项'
  }
  
  const subtask = getSubtasksList().find(item => item.id === selectedSubtask.value)
  return subtask ? subtask.name : '未知任务'
}

// 检查当前子任务是否有错误
const hasErrors = () => {
  if (!selectedSubtask.value) return false
  
  // 示例：只有数字化运营和应用接口有错误
  return [4, 6].includes(selectedSubtask.value)
}

// 获取当前子任务的错误列表
const getCurrentErrors = () => {
  if (!selectedSubtask.value) return []
  
  if (selectedSubtask.value === 6) { // 数字化运营
    return [
      { time: '2023-05-15 03:15:22', message: '数据处理超时', level: 'error' },
      { time: '2023-05-15 03:16:45', message: '关键数据缺失', level: 'error' },
      { time: '2023-05-15 03:18:12', message: '数据库连接失败', level: 'error' }
    ]
  } else if (selectedSubtask.value === 4) { // 应用接口
    return [
      { time: '2023-05-15 02:45:10', message: 'API响应超时', level: 'warning' },
      { time: '2023-05-15 02:47:30', message: '部分数据未同步', level: 'warning' }
    ]
  }
  
  return []
}

// 获取当前子任务的进度
const getCurrentProgress = () => {
  if (!selectedSubtask.value) return '0/0'
  
  const progressMap = {
    1: '1000/1000',
    2: '850/850',
    3: '620/800',
    5: '450/450',
    7: '300/500',
    8: '200/200'
  }
  
  return progressMap[selectedSubtask.value] || '0/0'
}

// 获取当前子任务的进度百分比
const getCurrentPercentage = () => {
  if (!selectedSubtask.value) return 0
  
  const percentageMap = {
    1: 100,
    2: 100,
    3: 78,
    5: 100,
    7: 60,
    8: 100
  }
  
  return percentageMap[selectedSubtask.value] || 0
}

// 获取当前子任务的状态
const getCurrentStatus = () => {
  if (!selectedSubtask.value) return ''
  
  const subtask = getSubtasksList().find(item => item.id === selectedSubtask.value)
  if (subtask) {
    if (subtask.status === 'error') return 'exception'
    if (subtask.status === 'warning') return 'warning'
  }
  
  return ''
}

// 获取当前子任务的负责人
const getCurrentOwner = () => {
  if (!selectedSubtask.value) return '未分配'
  
  const ownerMap = {
    1: '张三',
    2: '李四',
    3: '王五',
    4: '赵六',
    5: '钱七',
    6: '孙八',
    7: '周九',
    8: '吴十'
  }
  
  return ownerMap[selectedSubtask.value] || '未分配'
}

// 获取当前子任务的预计完成时间
const getCurrentEndTime = () => {
  if (!selectedSubtask.value) return '--'
  
  const timeMap = {
    1: '已完成',
    2: '已完成',
    3: '10:30',
    4: '11:00',
    5: '已完成',
    6: '12:00',
    7: '12:30',
    8: '已完成'
  }
  
  return timeMap[selectedSubtask.value] || '--'
}

// 获取依赖数据
const getDependencyData = () => {
  return [
    { name: '数据准备', level: 1, parent: '开始', status: 'success', startTime: '08:00', endTime: '08:15' },
    { name: '数据清洗', level: 2, parent: '数据准备', status: 'success', startTime: '08:15', endTime: '08:30' },
    { name: '数据转换', level: 2, parent: '数据准备', status: 'success', startTime: '08:15', endTime: '08:35' },
    { name: '数据校验', level: 2, parent: '数据准备', status: 'success', startTime: '08:15', endTime: '08:25' },
    { name: '指标计算', level: 3, parent: '数据清洗', status: 'running', startTime: '08:30', endTime: '09:00' },
    { name: '风险评估', level: 3, parent: '数据清洗', status: 'pending', startTime: '08:30', endTime: '09:15' },
    { name: '数据聚合', level: 3, parent: '数据转换', status: 'running', startTime: '08:35', endTime: '09:05' },
    { name: '数据分区', level: 3, parent: '数据转换', status: 'pending', startTime: '08:35', endTime: '09:10' },
    { name: '质量检查', level: 3, parent: '数据校验', status: 'warning', startTime: '08:25', endTime: '08:45' },
    { name: '异常处理', level: 3, parent: '数据校验', status: 'error', startTime: '08:25', endTime: '08:50' },
    { name: '数据加载', level: 4, parent: '多个父节点', status: 'pending', startTime: '09:15', endTime: '09:45' }
  ]
}

// 获取节点状态
const getNodeStatus = (nodeName) => {
  const node = getDependencyData().find(item => item.name === nodeName)
  return node ? node.status : 'pending'
}

// 显示任务详情
const showTaskDetails = (task) => {
  currentTask.value = task
  showTaskDetail.value = true
  showErrors.value = false
  selectedSubtask.value = 1 // 默认选中第一个子任务
}

// 切换任务状态
const toggleTaskStatus = (task) => {
  if (task.status === 'running') {
    task.status = 'warning'
  } else if (task.status !== 'success') {
    task.status = 'running'
  }
}
</script>

<style lang="less" scoped>
.platform-tasks {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      color: #1a3a5f;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 15px;
      
      .view-toggle-buttons {
        display: flex;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        
        .toggle-button {
          width: 52px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
          
          &:not(:last-child) {
            border-right: 1px solid #f0f0f0;
          }
          
          .el-icon {
            font-size: 22px;
            color: #909399;
          }
          
          &:hover {
            background: #f5f7fa;
            
            .el-icon {
              color: #606266;
            }
          }
          
          &.active {
            background: #ecf5ff;
            
            .el-icon {
              color: #409eff;
            }
          }
        }
      }
    }
  }
  
  // 列表视图样式
  .task-progress-list {
    .task-progress-item {
      background: white;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      .task-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        
        .task-name {
          font-weight: 500;
          font-size: 16px;
        }
        
        .task-status {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          
          &.success {
            background: rgba(82, 196, 26, 0.1);
            color: #52c41a;
          }
          
          &.running {
            background: rgba(24, 144, 255, 0.1);
            color: #1890ff;
          }
          
          &.warning {
            background: rgba(250, 173, 20, 0.1);
            color: #faad14;
          }
          
          &.error {
            background: rgba(245, 34, 45, 0.1);
            color: #f5222d;
          }
        }
      }
      
      .task-details {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 12px;
        color: #666;
      }
    }
  }
  
  // 卡片视图样式
  .task-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    
    .task-card {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-top: 3px solid transparent;
      transition: all 0.3s;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      &.success { border-top-color: #52c41a; }
      &.running { border-top-color: #1890ff; }
      &.warning { border-top-color: #faad14; }
      &.error { border-top-color: #f5222d; }
      
      .task-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        
        .task-name {
          font-weight: 500;
          font-size: 16px;
        }
        
        .task-status {
          font-size: 12px;
          
          .success & { color: #52c41a; }
          .running & { color: #1890ff; }
          .warning & { color: #faad14; }
          .error & { color: #f5222d; }
        }
      }
      
      .task-card-progress {
        margin-bottom: 15px;
        
        .progress-value {
          text-align: right;
          font-size: 12px;
          margin-bottom: 5px;
          
          .success & { color: #52c41a; }
          .running & { color: #1890ff; }
          .warning & { color: #faad14; }
          .error & { color: #f5222d; }
        }
      }
      
      .task-card-details {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 15px;
        
        .detail-item {
          .label {
            font-size: 12px;
            color: #999;
            margin-bottom: 5px;
          }
          
          .value {
            font-size: 14px;
            color: #333;
          }
        }
      }
      
      .task-card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        border-top: 1px solid #f0f0f0;
        padding-top: 10px;
      }
    }
  }
}

// 详情对话框样式
.task-detail-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
    background: #f5f7fa;
  }
  
  :deep(.el-dialog__header) {
    padding: 10px;
    margin-right: 0;
    border-bottom: 1px solid #e4e7ed;
    background: #fff;
    height: 20px; // 减小高度
  }
  
  :deep(.el-dialog__headerbtn) {
    top: 10px;
  }
  
  :deep(.el-dialog__title) {
    display: none; // 隐藏标题文本
  }
}

// 区域分隔样式
.task-detail-section {
  padding: 20px;
  margin-bottom: 1px;
  background: #fff;
  position: relative;
  
  &:not(:last-child) {
    border-bottom: 1px solid #e4e7ed;
  }
  
  .section-title {
    margin: 0 0 15px 0;
    color: #1a3a5f;
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
  }
}

// 基本信息区域样式 - 优化排版
.task-basic-info {
  background: linear-gradient(to right, #f0f7ff, #fff);
  padding: 15px 20px;
  
  .task-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .task-title-group {
      display: flex;
      align-items: center;
      gap: 15px;
      
      h2 {
        font-size: 18px;
        color: #1a3a5f;
        margin: 0;
        font-weight: 600;
      }
      
      .task-detail-status {
        padding: 3px 10px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        
        &.success {
          background: rgba(82, 196, 26, 0.1);
          color: #52c41a;
        }
        
        &.running {
          background: rgba(24, 144, 255, 0.1);
          color: #1890ff;
        }
        
        &.warning {
          background: rgba(250, 173, 20, 0.1);
          color: #faad14;
        }
        
        &.error {
          background: rgba(245, 34, 45, 0.1);
          color: #f5222d;
        }
      }
    }
    
    .task-meta-info {
      display: flex;
      gap: 20px;
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #666;
        font-size: 13px;
        
        .el-icon {
          font-size: 14px;
          color: #1890ff;
        }
      }
    }
  }
  
  .task-progress-bar {
    :deep(.el-progress-bar__outer) {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.04);
    }
    
    :deep(.el-progress-bar__inner) {
      border-radius: 4px;
    }
    
    :deep(.el-progress__text) {
      font-size: 14px !important;
      font-weight: 600;
      color: #1a3a5f;
    }
  }
}

// 任务详情内容区域样式
.task-detail-content-section {
  .task-detail-content {
    display: flex;
    gap: 20px;
    
    .task-list-panel {
      width: 55%;
      background: #fff;
      border-radius: 6px;
      padding: 15px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      
      h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #1a3a5f;
        font-size: 16px;
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 10px;
      }
    }
    
    .task-info-panel {
      width: 45%;
      background: #fff;
      border-radius: 6px;
      padding: 15px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      
      .panel-header {
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 10px;
        margin-bottom: 15px;
      }
    }
  }
}

// 任务依赖区域样式
.task-dependency-section {
  background: #fff;
  
  .section-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;
  }
  
  .dependency-table {
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    overflow: hidden;
  }
  
  .dependency-flow-container {
    background: #f9f9f9;
    border-radius: 6px;
    padding: 20px;
    margin-bottom: 20px;
    overflow-x: auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  }
  
  .dependency-flow {
    min-width: 800px;
    
    .flow-level {
      display: flex;
      justify-content: center;
      margin-bottom: 25px;
      position: relative;
      
      &:not(:last-child):after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        width: 2px;
        height: 15px;
        background: #ddd;
        transform: translateX(-50%);
      }
      
      &.multi {
        justify-content: space-around;
        
        &:before {
          content: '';
          position: absolute;
          top: -15px;
          left: 50%;
          width: 2px;
          height: 15px;
          background: #ddd;
          transform: translateX(-50%);
        }
        
        &:after {
          left: 50%;
        }
        
        .flow-node, .flow-node-group {
          position: relative;
          
          &:not(:last-child):after {
            content: '';
            position: absolute;
            top: 50%;
            left: 100%;
            width: 20px;
            height: 2px;
            background: #ddd;
          }
          
          &:before {
            content: '';
            position: absolute;
            top: -15px;
            left: 50%;
            width: 2px;
            height: 15px;
            background: #ddd;
            transform: translateX(-50%);
          }
        }
        
        &.complex {
          .flow-node-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            
            &:before {
              top: -15px;
            }
            
            .flow-node {
              &:before {
                display: none;
              }
              
              &:after {
                display: none;
              }
            }
          }
        }
      }
      
      .flow-node {
        width: 100px;
        height: 50px;
        border-radius: 6px;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        border-left: 3px solid #ddd;
        
        &.small {
          width: 90px;
          height: 40px;
        }
        
        &.success { border-left-color: #52c41a; }
        &.running { border-left-color: #1890ff; }
        &.warning { border-left-color: #faad14; }
        &.error { border-left-color: #f5222d; }
        &.pending { border-left-color: #d9d9d9; }
        
        &.start, &.end {
          background: #f0f7ff;
          border-left-color: #1890ff;
        }
        
        .node-content {
          text-align: center;
          
          .node-icon {
            font-size: 16px;
            margin-bottom: 3px;
            
            .success & { color: #52c41a; }
            .running & { color: #1890ff; }
            .warning & { color: #faad14; }
            .error & { color: #f5222d; }
            .pending & { color: #d9d9d9; }
            .start &, .end & { color: #1890ff; }
          }
          
          .node-name {
            font-size: 12px;
            color: #333;
          }
        }
      }
    }
  }
}
</style> 