<template>
  <div class="resource-usage-container">
    <div class="section-header">
      <h3>资源占用分析</h3>
      <div class="header-actions">
        <el-select v-model="timeRange" placeholder="时间范围" size="small">
          <el-option label="最近1小时" value="1h" />
          <el-option label="最近6小时" value="6h" />
          <el-option label="最近24小时" value="24h" />
          <el-option label="最近7天" value="7d" />
        </el-select>
        <el-button type="primary" size="small" @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>
    
    <div class="resource-overview">
      <div class="overview-card">
        <div class="card-header">
          <div class="card-title">
            <el-icon><CPU /></el-icon>
            <span>CPU使用率</span>
          </div>
          <div class="card-value">
            <span class="value-number">{{ cpuUsage }}</span>
            <span class="value-unit">%</span>
            <span class="value-trend up">+{{ cpuTrend }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-value" style="width: {{ cpuUsage }}%"></div>
        </div>
        <div class="card-footer">
          <div class="footer-item">
            <div class="item-label">平均</div>
            <div class="item-value">65%</div>
          </div>
          <div class="footer-item">
            <div class="item-label">峰值</div>
            <div class="item-value">92%</div>
          </div>
          <div class="footer-item">
            <div class="item-label">核心数</div>
            <div class="item-value">64</div>
          </div>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="card-header">
          <div class="card-title">
            <el-icon><Memo /></el-icon>
            <span>内存使用率</span>
          </div>
          <div class="card-value">
            <span class="value-number">{{ memoryUsage }}</span>
            <span class="value-unit">%</span>
            <span class="value-trend up">+{{ memoryTrend }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-value" style="width: {{ memoryUsage }}%"></div>
        </div>
        <div class="card-footer">
          <div class="footer-item">
            <div class="item-label">已用</div>
            <div class="item-value">208GB</div>
          </div>
          <div class="footer-item">
            <div class="item-label">总量</div>
            <div class="item-value">320GB</div>
          </div>
          <div class="footer-item">
            <div class="item-label">交换</div>
            <div class="item-value">12GB</div>
          </div>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="card-header">
          <div class="card-title">
            <el-icon><Odometer /></el-icon>
            <span>磁盘I/O</span>
          </div>
          <div class="card-value">
            <span class="value-number">{{ diskIO }}</span>
            <span class="value-unit">MB/s</span>
            <span class="value-trend down">
              {{ diskTrend === 'up' ? '-' : '' }}{{ diskTrend === 'down' ? '+' : '' }}{{ diskTrend === 'down' ? diskIO : diskIO - 245 }}
            </span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-value" style="width: {{ diskIO > 245 ? 100 : (diskIO / 245) * 100 }}%"></div>
        </div>
        <div class="card-footer">
          <div class="footer-item">
            <div class="item-label">读取</div>
            <div class="item-value">85MB/s</div>
          </div>
          <div class="footer-item">
            <div class="item-label">写入</div>
            <div class="item-value">160MB/s</div>
          </div>
          <div class="footer-item">
            <div class="item-label">IOPS</div>
            <div class="item-value">3.2K</div>
          </div>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="card-header">
          <div class="card-title">
            <el-icon><Connection /></el-icon>
            <span>网络流量</span>
          </div>
          <div class="card-value">
            <span class="value-number">{{ networkTraffic }}</span>
            <span class="value-unit">GB/s</span>
            <span class="value-trend up">+{{ networkTrend }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-value" style="width: {{ networkTraffic > 1.8 ? 100 : (networkTraffic / 1.8) * 100 }}%"></div>
        </div>
        <div class="card-footer">
          <div class="footer-item">
            <div class="item-label">入站</div>
            <div class="item-value">750MB/s</div>
          </div>
          <div class="footer-item">
            <div class="item-label">出站</div>
            <div class="item-value">1.05GB/s</div>
          </div>
          <div class="footer-item">
            <div class="item-label">连接数</div>
            <div class="item-value">12.5K</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="resource-details">
      <div class="detail-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>资源使用趋势</span>
          </div>
          <div class="panel-actions">
            <el-radio-group v-model="resourceType" size="small">
              <el-radio-button label="cpu">CPU</el-radio-button>
              <el-radio-button label="memory">内存</el-radio-button>
              <el-radio-button label="disk">磁盘</el-radio-button>
              <el-radio-button label="network">网络</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="panel-content">
          <div class="trend-chart">
            <!-- 这里可以替换为实际的图表组件 -->
            <div class="mock-trend-chart">
              <div class="chart-line primary"></div>
              <div class="chart-line secondary"></div>
              <div class="time-axis">
                <div class="time-point">00:00</div>
                <div class="time-point">06:00</div>
                <div class="time-point">12:00</div>
                <div class="time-point">18:00</div>
                <div class="time-point">现在</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>组件资源占用排行</span>
          </div>
          <div class="panel-actions">
            <el-select v-model="rankingMetric" placeholder="排序指标" size="small">
              <el-option label="CPU使用率" value="cpu" />
              <el-option label="内存使用率" value="memory" />
              <el-option label="磁盘I/O" value="disk" />
              <el-option label="网络流量" value="network" />
            </el-select>
          </div>
        </div>
        <div class="panel-content">
          <div class="ranking-list">
            <div class="ranking-item" v-for="item in sortedComponents" :key="item.id">
              <div class="rank-number">{{ item.id }}</div>
              <div class="component-info">
                <div class="component-name">{{ item.name }}</div>
                <div class="component-detail">实例数: {{ item.instances }} | 状态: {{ item.status }}</div>
              </div>
              <div class="usage-info">
                <div class="usage-bar">
                  <div class="usage-value" style="width: {{ item.usage[resourceType] }}%"></div>
                </div>
                <div class="usage-number">{{ item.usage[resourceType] }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>资源异常检测</span>
          </div>
          <div class="panel-actions">
            <el-button link size="small">查看全部</el-button>
          </div>
        </div>
        <div class="panel-content">
          <div class="anomaly-list">
            <div class="anomaly-item" v-for="item in anomalies" :key="item.id">
              <div class="anomaly-icon" :class="item.type">
                <el-icon><WarningFilled /></el-icon>
              </div>
              <div class="anomaly-content">
                <div class="anomaly-title">{{ item.title }}</div>
                <div class="anomaly-detail">
                  <span class="detail-time">{{ item.time }}</span>
                  <span class="detail-value">{{ item.value }} (阈值: {{ item.threshold }})</span>
                </div>
                <div class="anomaly-description">
                  {{ item.description }}
                </div>
              </div>
              <div class="anomaly-actions">
                <el-button link size="small" @click="handleAnomaly(item.id, 'resolve')">处理</el-button>
                <el-button link size="small" @click="handleAnomaly(item.id, 'ignore')">忽略</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { 
  Refresh, 
  CPU, 
  Memo, 
  Odometer, 
  Connection, 
  WarningFilled, 
  InfoFilled, 
  ArrowUp, 
  ArrowDown 
} from '@element-plus/icons-vue'

// 时间范围选择
const timeRange = ref('24h')

// 资源类型选择（用于趋势图）
const resourceType = ref('cpu')

// 排行榜指标选择
const rankingMetric = ref('cpu')

// 模拟数据
const cpuUsage = ref(78)
const memoryUsage = ref(65)
const diskIO = ref(245)
const networkTraffic = ref(1.8)

// 组件资源占用排行数据
const componentRankings = ref([
  {
    id: 1,
    name: 'Flink流计算引擎',
    instances: 8,
    status: '运行中',
    usage: {
      cpu: 92,
      memory: 85,
      disk: 65,
      network: 78
    }
  },
  {
    id: 2,
    name: 'ADB分析型数据库',
    instances: 4,
    status: '运行中',
    usage: {
      cpu: 85,
      memory: 92,
      disk: 45,
      network: 65
    }
  },
  {
    id: 3,
    name: 'DataHub数据总线',
    instances: 6,
    status: '运行中',
    usage: {
      cpu: 78,
      memory: 65,
      disk: 35,
      network: 92
    }
  },
  {
    id: 4,
    name: 'RDS关系型数据库',
    instances: 12,
    status: '运行中',
    usage: {
      cpu: 65,
      memory: 75,
      disk: 92,
      network: 45
    }
  },
  {
    id: 5,
    name: 'OSS对象存储',
    instances: 3,
    status: '运行中',
    usage: {
      cpu: 45,
      memory: 35,
      disk: 85,
      network: 55
    }
  }
])

// 资源异常检测数据
const anomalies = ref([
  {
    id: 1,
    type: 'error',
    title: 'Flink CPU使用率异常',
    time: '10分钟前',
    value: '92%',
    threshold: '80%',
    description: 'Flink流计算引擎CPU使用率持续超过阈值，可能导致任务处理延迟增加。'
  },
  {
    id: 2,
    type: 'warning',
    title: 'ADB内存使用率增长',
    time: '25分钟前',
    value: '85%',
    threshold: '75%',
    description: 'ADB分析型数据库内存使用率呈上升趋势，建议关注查询性能变化。'
  },
  {
    id: 3,
    type: 'warning',
    title: 'RDS磁盘I/O峰值',
    time: '1小时前',
    value: '92%',
    threshold: '85%',
    description: 'RDS关系型数据库磁盘I/O出现短时峰值，可能影响数据库响应时间。'
  }
])

// 计算属性：根据选择的指标获取排序后的组件列表
const sortedComponents = computed(() => {
  return [...componentRankings.value].sort((a, b) => {
    return b.usage[rankingMetric.value] - a.usage[rankingMetric.value]
  })
})

// 刷新数据
const refreshData = () => {
  console.log('刷新资源占用数据，时间范围：', timeRange.value)
  // 这里可以添加实际的API调用逻辑
  
  // 模拟数据变化
  cpuUsage.value = Math.floor(70 + Math.random() * 20)
  memoryUsage.value = Math.floor(60 + Math.random() * 20)
  diskIO.value = Math.floor(200 + Math.random() * 100)
  networkTraffic.value = (1.5 + Math.random() * 0.8).toFixed(1)
}

// 处理异常
const handleAnomaly = (id, action) => {
  console.log(`处理异常 ${id}，操作：${action}`)
  // 这里可以添加实际的处理逻辑
  
  if (action === 'ignore') {
    // 忽略异常
    anomalies.value = anomalies.value.filter(item => item.id !== id)
  } else if (action === 'resolve') {
    // 标记为已解决
    const anomaly = anomalies.value.find(item => item.id === id)
    if (anomaly) {
      anomaly.resolved = true
    }
  }
}

// 生命周期钩子：组件挂载时自动刷新数据
onMounted(() => {
  refreshData()
  
  // 设置定时刷新（根据选择的时间范围）
  const refreshInterval = setInterval(() => {
    if (timeRange.value === '1h') {
      refreshData()
    }
  }, 60000) // 1分钟刷新一次
  
  // 组件卸载时清除定时器
  onBeforeUnmount(() => {
    clearInterval(refreshInterval)
  })
})
</script>

<style lang="less" scoped>
.resource-usage-container {
  padding: 20px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }
    
    .header-actions {
      display: flex;
      gap: 10px;
    }
  }
  
  /* 资源概览样式 */
  .resource-overview {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;
    
    .overview-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      padding: 15px;
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        
        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .el-icon {
            font-size: 18px;
            color: #1890ff;
          }
          
          span {
            font-size: 15px;
            font-weight: 500;
            color: #333;
          }
        }
        
        .card-value {
          display: flex;
          align-items: baseline;
          
          .value-number {
            font-size: 24px;
            font-weight: 600;
            color: #333;
          }
          
          .value-unit {
            font-size: 14px;
            color: #999;
            margin-left: 2px;
          }
          
          .value-trend {
            font-size: 12px;
            margin-left: 8px;
            
            &.up {
              color: #ff4d4f;
            }
            
            &.down {
              color: #52c41a;
            }
          }
        }
      }
      
      .progress-bar {
        height: 8px;
        background: #f5f5f5;
        border-radius: 4px;
        margin-bottom: 15px;
        overflow: hidden;
        
        .progress-value {
          height: 100%;
          background: #1890ff;
          border-radius: 4px;
        }
      }
      
      .card-footer {
        display: flex;
        justify-content: space-between;
        
        .footer-item {
          text-align: center;
          
          .item-label {
            font-size: 12px;
            color: #999;
            margin-bottom: 4px;
          }
          
          .item-value {
            font-size: 14px;
            font-weight: 500;
            color: #333;
          }
        }
      }
    }
  }
  
  /* 资源详情样式 */
  .resource-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    
    .detail-panel {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      
      &:first-child {
        grid-column: 1 / -1;
      }
      
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid #f0f0f0;
        
        .panel-title {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }
      }
      
      .panel-content {
        padding: 20px;
      }
    }
  }
  
  /* 趋势图表样式 */
  .trend-chart {
    height: 300px;
    position: relative;
    
    .mock-trend-chart {
      width: 100%;
      height: 100%;
      position: relative;
      background: #fafafa;
      border-radius: 4px;
      
      .chart-line {
        position: absolute;
        width: 90%;
        height: 2px;
        left: 5%;
        
        &.primary {
          background: #1890ff;
          top: 40%;
          height: 3px;
          opacity: 0.8;
        }
        
        &.secondary {
          background: #52c41a;
          top: 60%;
          height: 2px;
          opacity: 0.6;
        }
      }
      
      .time-axis {
        position: absolute;
        bottom: 20px;
        left: 5%;
        width: 90%;
        display: flex;
        justify-content: space-between;
        
        .time-point {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  
  /* 排行榜样式 */
  .ranking-list {
    .ranking-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .rank-number {
        width: 24px;
        height: 24px;
        background: #f5f5f5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        color: #666;
        margin-right: 15px;
      }
      
      .component-info {
        flex-grow: 1;
        
        .component-name {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }
        
        .component-detail {
          font-size: 12px;
          color: #999;
        }
      }
      
      .usage-info {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .usage-bar {
          width: 100px;
          height: 8px;
          background: #f5f5f5;
          border-radius: 4px;
          overflow: hidden;
          
          .usage-value {
            height: 100%;
            background: #1890ff;
            border-radius: 4px;
          }
        }
        
        .usage-number {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          width: 40px;
          text-align: right;
        }
      }
    }
  }
  
  /* 异常检测样式 */
  .anomaly-list {
    .anomaly-item {
      display: flex;
      gap: 15px;
      padding: 15px 0;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .anomaly-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.error {
          background: #fff2f0;
          
          .el-icon {
            color: #ff4d4f;
          }
        }
        
        &.warning {
          background: #fffbe6;
          
          .el-icon {
            color: #faad14;
          }
        }
      }
      
      .anomaly-content {
        flex-grow: 1;
        
        .anomaly-title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 5px;
        }
        
        .anomaly-detail {
          font-size: 12px;
          color: #999;
          margin-bottom: 5px;
          
          .detail-time {
            margin-right: 10px;
          }
          
          .detail-value {
            color: #ff4d4f;
          }
        }
        
        .anomaly-description {
          font-size: 12px;
          color: #666;
          line-height: 1.5;
        }
      }
      
      .anomaly-actions {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
      }
    }
  }
}
</style> 