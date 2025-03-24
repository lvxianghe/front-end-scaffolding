<template>
  <!-- 页面内容容器 -->
  <div class="admin-container">
    <!-- 管理后台标题 -->
    <div class="admin-header">
      <h1>管理中心</h1>
      <div class="admin-subtitle">欢迎回来，<span class="username">管理员</span></div>
    </div>
    
    <!-- 数据概览区 -->
    <div class="stats-overview">
      <div class="stat-card users">
        <div class="stat-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">1,358</div>
          <div class="stat-label">用户总数</div>
        </div>
        <div class="stat-trend up">
          <el-icon><ArrowUp /></el-icon>
          <span>12.5%</span>
        </div>
      </div>
      
      <div class="stat-card roles">
        <div class="stat-icon">
          <el-icon><UserFilled /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">5</div>
          <div class="stat-label">角色类型</div>
        </div>
        <div class="stat-trend up">
          <el-icon><ArrowUp /></el-icon>
          <span>2.3%</span>
        </div>
      </div>
      
      <div class="stat-card permissions">
        <div class="stat-icon">
          <el-icon><Key /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">42</div>
          <div class="stat-label">权限总数</div>
        </div>
        <div class="stat-trend stable">
          <el-icon><Minus /></el-icon>
          <span>0%</span>
        </div>
      </div>
      
      <div class="stat-card visits">
        <div class="stat-icon">
          <el-icon><View /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">9,876</div>
          <div class="stat-label">本月访问</div>
        </div>
        <div class="stat-trend up">
          <el-icon><ArrowUp /></el-icon>
          <span>18.2%</span>
        </div>
      </div>
    </div>
    
    <!-- 管理功能网格 -->
    <div class="admin-grid">
      <!-- 用户管理卡片 -->
      <div class="grid-card user-management" @click="navigateTo('userManagement')">
        <div class="card-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-title">用户管理</div>
          <div class="card-desc">管理系统用户，分配角色</div>
        </div>
      </div>
      
      <!-- 角色管理卡片 -->
      <div class="grid-card role-management" @click="navigateTo('roleManagement')">
        <div class="card-icon">
          <el-icon><UserFilled /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-title">角色管理</div>
          <div class="card-desc">创建和管理用户角色</div>
        </div>
      </div>
      
      <!-- 权限管理卡片 -->
      <div class="grid-card permission-management" @click="navigateTo('permissionManagement')">
        <div class="card-icon">
          <el-icon><Key /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-title">权限管理</div>
          <div class="card-desc">配置系统权限和资源</div>
        </div>
      </div>
      
      <!-- 系统设置卡片 -->
      <div class="grid-card system-settings" @click="navigateTo('systemSettings')">
        <div class="card-icon">
          <el-icon><Setting /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-title">系统设置</div>
          <div class="card-desc">配置系统参数和选项</div>
        </div>
      </div>
      
      <!-- 数据分析卡片 -->
      <div class="grid-card data-analytics" @click="navigateTo('dataAnalytics')">
        <div class="card-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-title">数据分析</div>
          <div class="card-desc">查看系统使用统计和趋势</div>
        </div>
      </div>
      
      <!-- 操作日志卡片 -->
      <div class="grid-card operation-logs" @click="navigateTo('operationLogs')">
        <div class="card-icon">
          <el-icon><Document /></el-icon>
        </div>
        <div class="card-content">
          <div class="card-title">操作日志</div>
          <div class="card-desc">审计用户操作记录</div>
        </div>
      </div>
    </div>
    
    <!-- 活跃用户图表 -->
    <div class="chart-section">
      <div class="section-header">
        <h2>最近系统活跃度</h2>
        <el-radio-group v-model="timeRange" size="small">
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
          <el-radio-button label="year">全年</el-radio-button>
        </el-radio-group>
      </div>
      <div class="chart-container" ref="activityChartRef"></div>
    </div>
    
    <!-- 底部信息面板 -->
    <div class="info-panels">
      <!-- 最新用户 -->
      <div class="info-panel">
        <div class="panel-header">
          <h3>最新用户</h3>
          <el-button text>查看全部</el-button>
        </div>
        <div class="panel-content">
          <div v-for="user in latestUsers" :key="user.id" class="user-item">
            <el-avatar :size="40" :src="user.avatar">{{ user.name.charAt(0) }}</el-avatar>
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-time">{{ user.registerTime }}</div>
            </div>
            <el-tag size="small" :type="user.status === 1 ? 'success' : 'info'">
              {{ user.status === 1 ? '已激活' : '未激活' }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <!-- 系统公告 -->
      <div class="info-panel">
        <div class="panel-header">
          <h3>系统公告</h3>
          <el-button text>发布公告</el-button>
        </div>
        <div class="panel-content">
          <div v-for="notice in systemNotices" :key="notice.id" class="notice-item">
            <div class="notice-title">{{ notice.title }}</div>
            <div class="notice-time">{{ notice.time }}</div>
            <div class="notice-content">{{ notice.content }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 功能详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="80%"
      class="function-dialog"
      destroy-on-close
      @closed="handleDialogClose"
      append-to-body
    >
      <div v-if="currentFunction === 'userManagement'">
        <h3>用户管理</h3>
        <p>这里是用户管理功能的内容，您可以在这里管理系统用户。</p>
        <!-- 用户管理的具体内容 -->
      </div>
      
      <div v-else-if="currentFunction === 'roleManagement'">
        <h3>角色管理</h3>
        <p>这里是角色管理功能的内容，您可以在这里管理用户角色。</p>
        <!-- 角色管理的具体内容 -->
      </div>
      
      <div v-else-if="currentFunction === 'permissionManagement'">
        <h3>权限管理</h3>
        <p>这里是权限管理功能的内容，您可以在这里管理系统权限。</p>
        <!-- 权限管理的具体内容 -->
      </div>
      
      <div v-else-if="currentFunction === 'systemSettings'">
        <h3>系统设置</h3>
        <p>这里是系统设置功能的内容，您可以在这里配置系统参数。</p>
        <!-- 系统设置的具体内容 -->
      </div>
      
      <div v-else-if="currentFunction === 'dataAnalytics'">
        <h3>数据分析</h3>
        <p>这里是数据分析功能的内容，您可以在这里查看系统数据统计。</p>
        <!-- 数据分析的具体内容 -->
      </div>
      
      <div v-else-if="currentFunction === 'operationLogs'">
        <h3>操作日志</h3>
        <p>这里是操作日志功能的内容，您可以在这里查看系统操作记录。</p>
        <!-- 操作日志的具体内容 -->
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { 
  User, UserFilled, Key, Setting, Document, 
  DataAnalysis, View, ArrowUp, Minus, 
  Plus, Search
} from '@element-plus/icons-vue'

const router = useRouter()

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentFunction = ref('')

// 图表相关
let activityChart = null
const activityChartRef = ref(null)
const timeRange = ref('week')

// 导航到功能页面
const navigateTo = (functionName) => {
  // 添加防抖动处理
  document.body.style.overflow = 'hidden'; // 防止背景滚动
  
  // 设置当前功能和对话框标题
  currentFunction.value = functionName
  
  // 根据功能名称设置对话框标题
  switch(functionName) {
    case 'userManagement':
      dialogTitle.value = '用户管理'
      break
    case 'roleManagement':
      dialogTitle.value = '角色管理'
      break
    case 'permissionManagement':
      dialogTitle.value = '权限管理'
      break
    case 'systemSettings':
      dialogTitle.value = '系统设置'
      break
    case 'dataAnalytics':
      dialogTitle.value = '数据分析'
      break
    case 'operationLogs':
      dialogTitle.value = '操作日志'
      break
    default:
      dialogTitle.value = '功能详情'
  }
  
  // 显示对话框
  dialogVisible.value = true
}

// 监听对话框关闭事件
const handleDialogClose = () => {
  document.body.style.overflow = ''; // 恢复背景滚动
}

// 模拟数据 - 最新用户
const latestUsers = reactive([
  { id: 1, name: '张三', avatar: '', registerTime: '2023-05-15 10:23', status: 1 },
  { id: 2, name: '李四', avatar: '', registerTime: '2023-05-14 16:45', status: 1 },
  { id: 3, name: '王五', avatar: '', registerTime: '2023-05-13 09:12', status: 0 },
  { id: 4, name: '赵六', avatar: '', registerTime: '2023-05-12 14:30', status: 1 },
])

// 模拟数据 - 系统公告
const systemNotices = reactive([
  { id: 1, title: '系统升级通知', time: '2023-05-15', content: '系统将于本周六凌晨2点进行升级维护，预计耗时2小时。' },
  { id: 2, title: '新功能上线', time: '2023-05-10', content: '数据分析模块新增了用户行为分析功能，欢迎体验。' },
  { id: 3, title: '安全更新提醒', time: '2023-05-05', content: '请所有用户及时修改密码，确保账号安全。' },
])

// 在组件挂载时添加全局样式
onMounted(() => {
  // 添加防止滚动条抖动的样式
  const style = document.createElement('style');
  style.id = 'anti-jitter-style';
  style.innerHTML = `
    /* 强制固定网格导航 */
    .grid-nav {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 2001 !important;
      width: 100% !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
    }
    
    /* 交换管理中心和搜索引擎的位置 */
    .grid-nav .grid-item.admin {
      order: 7 !important;
    }
    
    .grid-nav .grid-item.google {
      order: 6 !important;
    }
  `;
  document.head.appendChild(style);
  
  // 初始化图表
  initChart()
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
  
  // 监听时间范围变化
  watchTimeRange()
  
  // 获取所有导航栏
  const navs = document.querySelectorAll('.grid-nav')
  
  if (navs.length > 1) {
    console.warn(`admin页面发现${navs.length}个导航栏，正在清理...`)
    
    // 保留第一个，移除其他的
    for (let i = 1; i < navs.length; i++) {
      console.log(`admin页面移除第${i+1}个导航栏`)
      navs[i].parentNode.removeChild(navs[i])
    }
  }
});

// 在组件卸载时移除全局样式和事件监听
onUnmounted(() => {
  const style = document.getElementById('anti-jitter-style');
  if (style) {
    document.head.removeChild(style);
  }
  
  // 移除窗口大小变化监听
  window.removeEventListener('resize', handleResize)
  
  // 销毁图表实例
  if (activityChart) {
    activityChart.dispose()
  }
})

// 初始化图表
const initChart = () => {
  if (activityChartRef.value) {
    activityChart = echarts.init(activityChartRef.value)
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['活跃用户', '新增用户', '页面访问量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '活跃用户',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210],
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#6C7BFF'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(108, 123, 255, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(108, 123, 255, 0.1)'
                }
              ]
            }
          }
        },
        {
          name: '新增用户',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310],
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#FF9800'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(255, 152, 0, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 152, 0, 0.1)'
                }
              ]
            }
          }
        },
        {
          name: '页面访问量',
          type: 'line',
          stack: 'Total',
          data: [150, 232, 201, 154, 190, 330, 410],
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#13C2C2'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(19, 194, 194, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(19, 194, 194, 0.1)'
                }
              ]
            }
          }
        }
      ]
    }
    
    activityChart.setOption(option)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (activityChart) {
    activityChart.resize()
  }
}

// 监听时间范围变化
const watchTimeRange = () => {
  // 这里可以根据不同的时间范围加载不同的数据
  console.log('时间范围变更为:', timeRange.value)
}
</script>

<style lang="less" scoped>
.admin-container {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 20px;
  padding-top: 120px; /* 为顶部导航栏留出空间 */
  padding-bottom: 120px; /* 为底部网格导航留出空间 */
  
  .admin-header {
    padding: 24px 32px;
    background: white;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    
    .admin-subtitle {
      font-size: 16px;
      color: #666;
      
      .username {
        color: #6C7BFF;
        font-weight: 500;
      }
    }
  }
  
  .stats-overview {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin: 0 32px 20px;
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        
        .el-icon {
          font-size: 24px;
          color: white;
        }
      }
      
      .stat-content {
        flex: 1;
        
        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #666;
        }
      }
      
      .stat-trend {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        
        .el-icon {
          margin-right: 4px;
        }
        
        &.up {
          color: #4CAF50;
        }
        
        &.down {
          color: #F44336;
        }
        
        &.stable {
          color: #9E9E9E;
        }
      }
      
      &.users {
        .stat-icon {
          background: linear-gradient(135deg, #6C7BFF 0%, #2CD9FF 100%);
        }
      }
      
      &.roles {
        .stat-icon {
          background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
        }
      }
      
      &.permissions {
        .stat-icon {
          background: linear-gradient(135deg, #F44336 0%, #FF5252 100%);
        }
      }
      
      &.visits {
        .stat-icon {
          background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
        }
      }
    }
  }
  
  .admin-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 0 32px 20px;
    
    .grid-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }
      
      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        
        .el-icon {
          font-size: 24px;
          color: white;
        }
      }
      
      .card-content {
        flex: 1;
        
        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }
        
        .card-desc {
          font-size: 14px;
          color: #666;
        }
      }
      
      &.user-management {
        .card-icon {
          background: linear-gradient(135deg, #6C7BFF 0%, #2CD9FF 100%);
        }
      }
      
      &.role-management {
        .card-icon {
          background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
        }
      }
      
      &.permission-management {
        .card-icon {
          background: linear-gradient(135deg, #F44336 0%, #FF5252 100%);
        }
      }
      
      &.system-settings {
        .card-icon {
          background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
        }
      }
      
      &.data-analytics {
        .card-icon {
          background: linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%);
        }
      }
      
      &.operation-logs {
        .card-icon {
          background: linear-gradient(135deg, #607D8B 0%, #90A4AE 100%);
        }
      }
    }
  }
  
  .chart-section {
    background: white;
    border-radius: 12px;
    margin: 0 32px 20px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h2 {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }
    
    .chart-container {
      height: 400px;
    }
  }
  
  .info-panels {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 0 32px 20px;
    
    .info-panel {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        
        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
      }
      
      .panel-content {
        .user-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
          
          &:last-child {
            border-bottom: none;
          }
          
          .user-info {
            flex: 1;
            margin: 0 16px;
            
            .user-name {
              font-size: 14px;
              font-weight: 500;
              color: #333;
              margin-bottom: 4px;
            }
            
            .user-time {
              font-size: 12px;
              color: #999;
            }
          }
        }
        
        .notice-item {
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
          
          &:last-child {
            border-bottom: none;
          }
          
          .notice-title {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
          }
          
          .notice-time {
            font-size: 12px;
            color: #999;
            margin-bottom: 8px;
          }
          
          .notice-content {
            font-size: 13px;
            color: #666;
            line-height: 1.5;
          }
        }
      }
    }
  }
}

.function-dialog {
  :deep(.el-dialog__wrapper) {
    overflow: hidden;
    position: fixed;
  }
  
  :deep(.el-dialog) {
    margin: 5vh auto 0 !important;
    position: relative;
    max-width: 90%;
  }
  
  :deep(.el-dialog__header) {
    padding: 20px;
    background: #f5f7fa;
    border-bottom: 1px solid #EBEEF5;
  }
  
  :deep(.el-dialog__body) {
    padding: 30px;
    max-height: 70vh;
    overflow-y: auto;
  }
  
  :deep(.el-overlay) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style> 