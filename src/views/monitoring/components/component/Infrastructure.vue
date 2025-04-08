<template>
  <div class="infrastructure-container">
    <div class="section-header">
      <h3>基础设施监控</h3>
      <div class="header-actions">
        <el-select v-model="refreshInterval" placeholder="刷新频率" size="small">
          <el-option label="10秒" value="10" />
          <el-option label="30秒" value="30" />
          <el-option label="1分钟" value="60" />
          <el-option label="5分钟" value="300" />
        </el-select>
        <el-button type="primary" size="small" @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>
    
    <div class="infrastructure-overview">
      <div class="overview-card">
        <div class="card-header">
          <div class="card-title">
            <el-icon><Monitor /></el-icon>
            <span>服务器</span>
          </div>
          <div class="card-status">
            <span class="status-dot success"></span>
            <span class="status-text">正常</span>
          </div>
        </div>
        <div class="card-content">
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-value">42<span class="unit">/45</span></div>
              <div class="metric-label">在线服务器</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">3</div>
              <div class="metric-label">告警</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">98.5<span class="unit">%</span></div>
              <div class="metric-label">可用率</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="card-header">
          <div class="card-title">
            <el-icon><Connection /></el-icon>
            <span>网络设备</span>
          </div>
          <div class="card-status">
            <span class="status-dot warning"></span>
            <span class="status-text">警告</span>
          </div>
        </div>
        <div class="card-content">
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-value">28<span class="unit">/30</span></div>
              <div class="metric-label">在线设备</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">5</div>
              <div class="metric-label">告警</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">95.2<span class="unit">%</span></div>
              <div class="metric-label">可用率</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="card-header">
          <div class="card-title">
            <el-icon><Service /></el-icon>
            <span>云资源</span>
          </div>
          <div class="card-status">
            <span class="status-dot success"></span>
            <span class="status-text">正常</span>
          </div>
        </div>
        <div class="card-content">
          <div class="metrics-row">
            <div class="metric-item">
              <div class="metric-value">18<span class="unit">/18</span></div>
              <div class="metric-label">在线服务</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">0</div>
              <div class="metric-label">告警</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">99.9<span class="unit">%</span></div>
              <div class="metric-label">可用率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="infrastructure-details">
      <div class="detail-panel">
        <div class="panel-header">
          <div class="panel-title">服务器状态</div>
          <div class="panel-actions">
            <el-select v-model="serverFilter" placeholder="筛选" size="small">
              <el-option label="全部" value="all" />
              <el-option label="生产环境" value="prod" />
              <el-option label="测试环境" value="test" />
              <el-option label="开发环境" value="dev" />
            </el-select>
          </div>
        </div>
        <div class="panel-content">
          <el-table :data="filteredServers" style="width: 100%" size="small">
            <el-table-column prop="name" label="服务器名称" min-width="150" />
            <el-table-column prop="ip" label="IP地址" min-width="120" />
            <el-table-column prop="env" label="环境" min-width="100">
              <template #default="scope">
                <el-tag 
                  :type="scope.row.env === 'prod' ? 'danger' : scope.row.env === 'test' ? 'warning' : 'success'" 
                  size="small"
                >
                  {{ scope.row.env === 'prod' ? '生产' : scope.row.env === 'test' ? '测试' : '开发' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="cpu" label="CPU" min-width="100">
              <template #default="scope">
                <div class="usage-bar">
                  <div 
                    class="usage-value" 
                    :style="{ width: scope.row.cpu + '%', backgroundColor: getStatusColor(scope.row.cpu) }"
                  ></div>
                </div>
                <span>{{ scope.row.cpu }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="memory" label="内存" min-width="100">
              <template #default="scope">
                <div class="usage-bar">
                  <div 
                    class="usage-value" 
                    :style="{ width: scope.row.memory + '%', backgroundColor: getStatusColor(scope.row.memory) }"
                  ></div>
                </div>
                <span>{{ scope.row.memory }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="disk" label="磁盘" min-width="100">
              <template #default="scope">
                <div class="usage-bar">
                  <div 
                    class="usage-value" 
                    :style="{ width: scope.row.disk + '%', backgroundColor: getStatusColor(scope.row.disk) }"
                  ></div>
                </div>
                <span>{{ scope.row.disk }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="100">
              <template #default="scope">
                <div class="status-indicator">
                  <span 
                    class="status-dot" 
                    :class="scope.row.status === 'online' ? 'success' : scope.row.status === 'warning' ? 'warning' : 'error'"
                  ></span>
                  <span>{{ scope.row.status === 'online' ? '在线' : scope.row.status === 'warning' ? '警告' : '离线' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button link size="small" @click="viewServerDetails(scope.row)">详情</el-button>
                <el-button link size="small" @click="restartServer(scope.row)">重启</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      
      <div class="detail-panel">
        <div class="panel-header">
          <div class="panel-title">网络拓扑</div>
          <div class="panel-actions">
            <el-button size="small" @click="refreshTopology">
              <el-icon><Refresh /></el-icon>
              刷新拓扑
            </el-button>
          </div>
        </div>
        <div class="panel-content">
          <div class="network-topology">
            <!-- 这里可以替换为实际的网络拓扑图组件 -->
            <div class="mock-topology">
              <div class="topology-node internet">
                <div class="node-icon"><el-icon><Connection /></el-icon></div>
                <div class="node-label">互联网</div>
              </div>
              <div class="topology-link"></div>
              <div class="topology-node firewall">
                <div class="node-icon"><el-icon><Lock /></el-icon></div>
                <div class="node-label">防火墙</div>
              </div>
              <div class="topology-link"></div>
              <div class="topology-node load-balancer">
                <div class="node-icon"><el-icon><Share /></el-icon></div>
                <div class="node-label">负载均衡</div>
              </div>
              <div class="topology-links">
                <div class="topology-link"></div>
                <div class="topology-link"></div>
                <div class="topology-link"></div>
              </div>
              <div class="topology-nodes">
                <div class="topology-node server">
                  <div class="node-icon"><el-icon><Monitor /></el-icon></div>
                  <div class="node-label">Web服务器</div>
                </div>
                <div class="topology-node server">
                  <div class="node-icon"><el-icon><Monitor /></el-icon></div>
                  <div class="node-label">应用服务器</div>
                </div>
                <div class="topology-node server">
                  <div class="node-icon"><el-icon><Monitor /></el-icon></div>
                  <div class="node-label">数据库服务器</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-panel">
        <div class="panel-header">
          <div class="panel-title">告警信息</div>
          <div class="panel-actions">
            <el-button link size="small" @click="clearAllAlerts">清除全部</el-button>
          </div>
        </div>
        <div class="panel-content">
          <div class="alerts-list">
            <div v-if="alerts.length === 0" class="no-alerts">
              <el-icon><CircleCheckFilled /></el-icon>
              <span>暂无告警信息</span>
            </div>
            <div v-else class="alert-item" v-for="alert in alerts" :key="alert.id">
              <div class="alert-icon" :class="alert.level">
                <el-icon v-if="alert.level === 'critical'"><WarningFilled /></el-icon>
                <el-icon v-else-if="alert.level === 'warning'"><Warning /></el-icon>
                <el-icon v-else><InfoFilled /></el-icon>
              </div>
              <div class="alert-content">
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-info">
                  <span class="alert-source">{{ alert.source }}</span>
                  <span class="alert-time">{{ alert.time }}</span>
                </div>
                <div class="alert-message">{{ alert.message }}</div>
              </div>
              <div class="alert-actions">
                <el-button link size="small" @click="acknowledgeAlert(alert)">确认</el-button>
                <el-button link size="small" @click="ignoreAlert(alert)">忽略</el-button>
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
  Monitor, 
  Connection, 
  Lock, 
  Share, 
  WarningFilled, 
  InfoFilled,
  Check,
  SuccessFilled,
  Service
} from '@element-plus/icons-vue'

// 刷新间隔
const refreshInterval = ref('60')

// 服务器筛选
const serverFilter = ref('all')

// 服务器数据
const servers = ref([
  {
    id: 1,
    name: 'app-server-prod-01',
    ip: '192.168.1.101',
    env: 'prod',
    cpu: 78,
    memory: 65,
    disk: 42,
    status: 'online'
  },
  {
    id: 2,
    name: 'app-server-prod-02',
    ip: '192.168.1.102',
    env: 'prod',
    cpu: 85,
    memory: 72,
    disk: 38,
    status: 'online'
  },
  {
    id: 3,
    name: 'db-server-prod-01',
    ip: '192.168.1.103',
    env: 'prod',
    cpu: 92,
    memory: 88,
    disk: 75,
    status: 'warning'
  },
  {
    id: 4,
    name: 'web-server-prod-01',
    ip: '192.168.1.104',
    env: 'prod',
    cpu: 45,
    memory: 52,
    disk: 30,
    status: 'online'
  },
  {
    id: 5,
    name: 'app-server-test-01',
    ip: '192.168.2.101',
    env: 'test',
    cpu: 35,
    memory: 42,
    disk: 28,
    status: 'online'
  },
  {
    id: 6,
    name: 'db-server-test-01',
    ip: '192.168.2.102',
    env: 'test',
    cpu: 48,
    memory: 55,
    disk: 32,
    status: 'online'
  },
  {
    id: 7,
    name: 'app-server-dev-01',
    ip: '192.168.3.101',
    env: 'dev',
    cpu: 25,
    memory: 30,
    disk: 15,
    status: 'online'
  },
  {
    id: 8,
    name: 'cache-server-prod-01',
    ip: '192.168.1.105',
    env: 'prod',
    cpu: 95,
    memory: 82,
    disk: 45,
    status: 'error'
  }
])

// 告警数据
const alerts = ref([
  {
    id: 1,
    level: 'critical',
    title: 'CPU使用率过高',
    source: 'cache-server-prod-01',
    time: '10分钟前',
    message: 'CPU使用率持续超过90%，可能导致服务响应缓慢。'
  },
  {
    id: 2,
    level: 'warning',
    title: '内存使用率增长',
    source: 'db-server-prod-01',
    time: '25分钟前',
    message: '内存使用率在过去1小时内增长了15%，当前已达到88%。'
  },
  {
    id: 3,
    level: 'critical',
    title: '服务器离线',
    source: 'cache-server-prod-01',
    time: '35分钟前',
    message: '服务器意外离线，自动恢复失败，需要手动干预。'
  },
  {
    id: 4,
    level: 'info',
    title: '网络延迟波动',
    source: '负载均衡器',
    time: '1小时前',
    message: '检测到网络延迟出现波动，但尚未超出阈值，建议关注。'
  },
  {
    id: 5,
    level: 'warning',
    title: '磁盘空间不足',
    source: 'db-server-prod-01',
    time: '2小时前',
    message: '数据库服务器磁盘使用率超过75%，建议清理日志或扩容。'
  }
])

// 计算属性：根据筛选条件过滤服务器
const filteredServers = computed(() => {
  if (serverFilter.value === 'all') {
    return servers.value
  } else {
    return servers.value.filter(server => server.env === serverFilter.value)
  }
})

// 获取状态颜色
const getStatusColor = (value) => {
  if (value >= 90) return '#ff4d4f'
  if (value >= 70) return '#faad14'
  return '#52c41a'
}

// 刷新数据
const refreshData = () => {
  console.log('刷新基础设施数据，间隔：', refreshInterval.value)
  // 这里可以添加实际的API调用逻辑
  
  // 模拟数据变化
  servers.value.forEach(server => {
    server.cpu = Math.floor(server.cpu * 0.8 + Math.random() * 20)
    server.memory = Math.floor(server.memory * 0.8 + Math.random() * 20)
    server.disk = Math.floor(server.disk * 0.9 + Math.random() * 10)
  })
}

// 查看服务器详情
const viewServerDetails = (server) => {
  console.log('查看服务器详情:', server)
  // 这里可以添加实际的详情查看逻辑，如打开对话框等
}

// 重启服务器
const restartServer = (server) => {
  console.log('重启服务器:', server)
  // 这里可以添加实际的重启逻辑
}

// 刷新网络拓扑
const refreshTopology = () => {
  console.log('刷新网络拓扑')
  // 这里可以添加实际的拓扑刷新逻辑
}

// 处理告警
const handleAlert = (id, action) => {
  console.log(`处理告警 ${id}，操作：${action}`)
  // 这里可以添加实际的处理逻辑
  
  if (action === 'acknowledge') {
    // 确认告警
    const alert = alerts.value.find(item => item.id === id)
    if (alert) {
      alert.acknowledged = true
    }
  } else if (action === 'resolve') {
    // 解决告警
    alerts.value = alerts.value.filter(item => item.id !== id)
  }
}

// 生命周期钩子：组件挂载时自动刷新数据
onMounted(() => {
  refreshData()
  
  // 设置定时刷新
  const refreshTimer = setInterval(() => {
    if (refreshInterval.value === '10') {
      refreshData()
    }
  }, 10000) // 10秒刷新一次
  
  // 组件卸载时清除定时器
  onBeforeUnmount(() => {
    clearInterval(refreshTimer)
  })
})
</script>

<style lang="less" scoped>
.infrastructure-container {
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
  
  /* 基础设施概览样式 */
  .infrastructure-overview {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
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
            font-size: 16px;
            font-weight: 500;
            color: #333;
          }
        }
        
        .card-status {
          display: flex;
          align-items: center;
          gap: 5px;
          
          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            
            &.success { background-color: #52c41a; }
            &.warning { background-color: #faad14; }
            &.error { background-color: #ff4d4f; }
          }
          
          .status-text {
            font-size: 14px;
            color: #666;
          }
        }
      }
      
      .card-content {
        .metrics-row {
          display: flex;
          justify-content: space-between;
          
          .metric-item {
            text-align: center;
            
            .metric-value {
              font-size: 22px;
              font-weight: 600;
              color: #333;
              margin-bottom: 5px;
              
              .unit {
                font-size: 14px;
                font-weight: normal;
                color: #999;
              }
            }
            
            .metric-label {
              font-size: 13px;
              color: #666;
            }
          }
        }
      }
    }
  }
  
  /* 基础设施详情样式 */
  .infrastructure-details {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    
    .detail-panel {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      
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
        
        .panel-actions {
          display: flex;
          gap: 10px;
        }
      }
      
      .panel-content {
        padding: 20px;
      }
    }
  }
  
  /* 使用率条样式 */
  .usage-bar {
    width: 80px;
    height: 6px;
    background: #f5f5f5;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 4px;
    
    .usage-value {
      height: 100%;
      border-radius: 3px;
    }
  }
  
  /* 状态指示器样式 */
  .status-indicator {
    display: flex;
    align-items: center;
    gap: 5px;
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      
      &.success { background-color: #52c41a; }
      &.warning { background-color: #faad14; }
      &.error { background-color: #ff4d4f; }
    }
  }
  
  /* 网络拓扑图样式 */
  .network-topology {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .mock-topology {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      
      .topology-node {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        z-index: 2;
        
        &.internet {
          background: #e6f7ff;
          border: 1px solid #91d5ff;
        }
        
        &.firewall {
          background: #fff2e8;
          border: 1px solid #ffbb96;
        }
        
        &.load-balancer {
          background: #f9f0ff;
          border: 1px solid #d3adf7;
        }
        
        &.server {
          background: #f6ffed;
          border: 1px solid #b7eb8f;
          width: 70px;
          height: 70px;
        }
        
        .node-icon {
          font-size: 24px;
          color: #1890ff;
          margin-bottom: 5px;
          
          .el-icon {
            font-size: 24px;
          }
        }
        
        .node-label {
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      }
      
      .topology-link {
        width: 2px;
        height: 40px;
        background: #d9d9d9;
        z-index: 1;
      }
      
      .topology-links {
        display: flex;
        justify-content: space-between;
        width: 60%;
        
        .topology-link {
          width: 2px;
          height: 40px;
          background: #d9d9d9;
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 10px;
            background: #d9d9d9;
            transform: rotate(45deg);
            transform-origin: bottom left;
          }
        }
      }
      
      .topology-nodes {
        display: flex;
        justify-content: space-between;
        width: 80%;
      }
    }
  }
  
  /* 告警列表样式 */
  .alerts-list {
    .no-alerts {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 0;
      color: #52c41a;
      
      .el-icon {
        font-size: 48px;
        margin-bottom: 10px;
      }
      
      span {
        font-size: 16px;
      }
    }
    
    .alert-item {
      display: flex;
      gap: 15px;
      padding: 15px 0;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .alert-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.critical {
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
        
        &.info {
          background: #e6f7ff;
          
          .el-icon {
            color: #1890ff;
          }
        }
      }
      
      .alert-content {
        flex-grow: 1;
        
        .alert-title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 5px;
        }
        
        .alert-info {
          font-size: 12px;
          color: #999;
          margin-bottom: 5px;
          
          .alert-source {
            margin-right: 10px;
          }
        }
        
        .alert-message {
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }
      }
      
      .alert-actions {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
      }
    }
  }
}
</style> 