<template>
  <div class="components-monitoring-container">
    <div class="section-header">
      <h3>组件监控</h3>
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
    
    <div class="components-grid">
      <!-- OSS对象存储监控 -->
      <div class="component-panel">
        <div class="panel-header">
          <div class="panel-title">
            <el-icon class="component-icon"><FolderOpened /></el-icon>
            <span>OSS对象存储</span>
          </div>
          <div class="status-badge success">正常</div>
        </div>
        <div class="panel-content">
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-value">98.7<span class="unit">%</span></div>
              <div class="metric-label">可用性</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">12.8<span class="unit">TB</span></div>
              <div class="metric-label">存储容量</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">1.2<span class="unit">K/s</span></div>
              <div class="metric-label">请求速率</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">45<span class="unit">ms</span></div>
              <div class="metric-label">平均延迟</div>
            </div>
          </div>
          <div class="usage-chart">
            <div class="chart-header">
              <span>存储使用趋势</span>
              <el-select v-model="ossTimeRange" placeholder="时间范围" size="small">
                <el-option label="今日" value="today" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
            </div>
            <div class="chart-placeholder">
              <div class="line-chart">
                <!-- 这里可以替换为实际的图表组件 -->
                <div class="mock-line-chart">
                  <div class="chart-line"></div>
                  <div class="chart-point" style="left: 10%; bottom: 30%"></div>
                  <div class="chart-point" style="left: 25%; bottom: 45%"></div>
                  <div class="chart-point" style="left: 40%; bottom: 35%"></div>
                  <div class="chart-point" style="left: 55%; bottom: 60%"></div>
                  <div class="chart-point" style="left: 70%; bottom: 50%"></div>
                  <div class="chart-point" style="left: 85%; bottom: 70%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Flink流计算监控 -->
      <div class="component-panel">
        <div class="panel-header">
          <div class="panel-title">
            <el-icon class="component-icon"><Connection /></el-icon>
            <span>Flink流计算</span>
          </div>
          <div class="status-badge warning">警告</div>
        </div>
        <div class="panel-content">
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-value">8<span class="unit">/10</span></div>
              <div class="metric-label">运行任务</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">85<span class="unit">%</span></div>
              <div class="metric-label">CPU使用率</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">75<span class="unit">%</span></div>
              <div class="metric-label">内存使用率</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">2.5<span class="unit">K/s</span></div>
              <div class="metric-label">事件处理率</div>
            </div>
          </div>
          <div class="jobs-list">
            <div class="list-header">
              <span>任务状态</span>
              <el-button link size="small">查看详情</el-button>
            </div>
            <div class="job-item">
              <div class="job-info">
                <div class="job-name">实时数据处理</div>
                <div class="job-metrics">
                  <span>延迟: 235ms</span>
                  <span>吞吐: 1.2K/s</span>
                </div>
              </div>
              <div class="job-status success">运行中</div>
            </div>
            <div class="job-item">
              <div class="job-info">
                <div class="job-name">用户行为分析</div>
                <div class="job-metrics">
                  <span>延迟: 450ms</span>
                  <span>吞吐: 850/s</span>
                </div>
              </div>
              <div class="job-status warning">背压高</div>
            </div>
            <div class="job-item">
              <div class="job-info">
                <div class="job-name">风险评估</div>
                <div class="job-metrics">
                  <span>延迟: 180ms</span>
                  <span>吞吐: 450/s</span>
                </div>
              </div>
              <div class="job-status success">运行中</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- RDS关系型数据库监控 -->
      <div class="component-panel">
        <div class="panel-header">
          <div class="panel-title">
            <el-icon class="component-icon"><Files /></el-icon>
            <span>RDS关系型数据库</span>
          </div>
          <div class="status-badge success">正常</div>
        </div>
        <div class="panel-content">
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-value">99.9<span class="unit">%</span></div>
              <div class="metric-label">可用性</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">65<span class="unit">%</span></div>
              <div class="metric-label">存储使用率</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">1250<span class="unit">/s</span></div>
              <div class="metric-label">QPS</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">8<span class="unit">ms</span></div>
              <div class="metric-label">响应时间</div>
            </div>
          </div>
          <div class="performance-chart">
            <div class="chart-header">
              <span>性能监控</span>
              <el-select v-model="rdsMetricType" placeholder="指标类型" size="small">
                <el-option label="CPU使用率" value="cpu" />
                <el-option label="内存使用率" value="memory" />
                <el-option label="IOPS" value="iops" />
                <el-option label="连接数" value="connections" />
              </el-select>
            </div>
            <div class="chart-placeholder">
              <div class="area-chart">
                <!-- 这里可以替换为实际的图表组件 -->
                <div class="mock-area-chart">
                  <div class="area-fill"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- ADB分析型数据库监控 -->
      <div class="component-panel">
        <div class="panel-header">
          <div class="panel-title">
            <el-icon class="component-icon"><DataLine /></el-icon>
            <span>ADB分析型数据库</span>
          </div>
          <div class="status-badge error">异常</div>
        </div>
        <div class="panel-content">
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-value">95.2<span class="unit">%</span></div>
              <div class="metric-label">可用性</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">92<span class="unit">%</span></div>
              <div class="metric-label">CPU使用率</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">85<span class="unit">%</span></div>
              <div class="metric-label">内存使用率</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">2.5<span class="unit">s</span></div>
              <div class="metric-label">查询延迟</div>
            </div>
          </div>
          <div class="alerts-list">
            <div class="list-header">
              <span>告警信息</span>
              <el-button link size="small">查看全部</el-button>
            </div>
            <div class="alert-item error">
              <el-icon><WarningFilled /></el-icon>
              <div class="alert-content">
                <div class="alert-title">CPU使用率超过90%</div>
                <div class="alert-time">10分钟前</div>
              </div>
            </div>
            <div class="alert-item error">
              <el-icon><WarningFilled /></el-icon>
              <div class="alert-content">
                <div class="alert-title">查询超时率增加</div>
                <div class="alert-time">25分钟前</div>
              </div>
            </div>
            <div class="alert-item warning">
              <el-icon><InfoFilled /></el-icon>
              <div class="alert-content">
                <div class="alert-title">存储空间使用率超过80%</div>
                <div class="alert-time">1小时前</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- DataHub数据总线监控 -->
      <div class="component-panel">
        <div class="panel-header">
          <div class="panel-title">
            <el-icon class="component-icon"><Share /></el-icon>
            <span>DataHub数据总线</span>
          </div>
          <div class="status-badge success">正常</div>
        </div>
        <div class="panel-content">
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-value">99.8<span class="unit">%</span></div>
              <div class="metric-label">可用性</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">3.8<span class="unit">M/s</span></div>
              <div class="metric-label">消息吞吐量</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">15<span class="unit">ms</span></div>
              <div class="metric-label">平均延迟</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">28<span class="unit">/30</span></div>
              <div class="metric-label">活跃Topic</div>
            </div>
          </div>
          <div class="topics-chart">
            <div class="chart-header">
              <span>Topic流量分布</span>
              <el-select v-model="datahubTimeRange" placeholder="时间范围" size="small">
                <el-option label="最近1小时" value="1h" />
                <el-option label="最近6小时" value="6h" />
                <el-option label="最近24小时" value="24h" />
              </el-select>
            </div>
            <div class="chart-placeholder">
              <div class="pie-chart">
                <!-- 这里可以替换为实际的图表组件 -->
                <div class="mock-pie-chart">
                  <div class="pie-slice slice1"></div>
                  <div class="pie-slice slice2"></div>
                  <div class="pie-slice slice3"></div>
                  <div class="pie-slice slice4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Refresh, 
  WarningFilled, 
  InfoFilled, 
  FolderOpened, 
  Connection, 
  Files, 
  DataLine, 
  Share 
} from '@element-plus/icons-vue'

const refreshInterval = ref('60')
const ossTimeRange = ref('week')
const rdsMetricType = ref('cpu')
const datahubTimeRange = ref('today')

const refreshData = () => {
  console.log('刷新数据，间隔：', refreshInterval.value)
}
</script>

<style lang="less" scoped>
.components-monitoring-container {
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
  
  .components-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    
    .component-panel {
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
          display: flex;
          align-items: center;
          gap: 8px;
          
          .component-icon {
            font-size: 20px;
            color: #1890ff;
          }
          
          span {
            font-size: 16px;
            font-weight: 500;
            color: #333;
          }
        }
        
        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          
          &.success {
            background-color: #f6ffed;
            color: #52c41a;
            border: 1px solid #b7eb8f;
          }
          
          &.warning {
            background-color: #fffbe6;
            color: #faad14;
            border: 1px solid #ffe58f;
          }
          
          &.error {
            background-color: #fff2f0;
            color: #ff4d4f;
            border: 1px solid #ffccc7;
          }
        }
      }
      
      .panel-content {
        padding: 20px;
      }
    }
  }
  
  /* 指标网格样式 */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin-bottom: 20px;
    
    .metric-item {
      text-align: center;
      
      .metric-value {
        font-size: 24px;
        font-weight: 500;
        color: #333;
        margin-bottom: 5px;
        
        .unit {
          font-size: 14px;
          color: #999;
          margin-left: 2px;
        }
      }
      
      .metric-label {
        font-size: 13px;
        color: #666;
      }
    }
  }
  
  /* 图表样式 */
  .usage-chart, .performance-chart, .topics-chart {
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      span {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
    }
    
    .chart-placeholder {
      height: 180px;
      background: #fafafa;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      
      .mock-line-chart {
        width: 100%;
        height: 100%;
        position: relative;
        
        .chart-line {
          position: absolute;
          width: 80%;
          height: 2px;
          background: linear-gradient(90deg, #1890ff 0%, #52c41a 100%);
          top: 50%;
          left: 10%;
          transform: translateY(-50%);
          border-radius: 2px;
        }
        
        .chart-point {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #1890ff;
          border-radius: 50%;
          transform: translate(-50%, 50%);
        }
      }
      
      .mock-area-chart {
        width: 100%;
        height: 100%;
        position: relative;
        
        .area-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 70%;
          background: linear-gradient(180deg, rgba(24, 144, 255, 0.2) 0%, rgba(24, 144, 255, 0) 100%);
          border-top: 2px solid #1890ff;
        }
      }
      
      .mock-pie-chart {
        width: 150px;
        height: 150px;
        position: relative;
        border-radius: 50%;
        overflow: hidden;
        
        .pie-slice {
          position: absolute;
          width: 100%;
          height: 100%;
          
          &.slice1 {
            background: #1890ff;
            clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%);
          }
          
          &.slice2 {
            background: #52c41a;
            clip-path: polygon(50% 50%, 100% 100%, 0 100%, 0 70%);
          }
          
          &.slice3 {
            background: #faad14;
            clip-path: polygon(50% 50%, 0 70%, 0 0, 20% 0);
          }
          
          &.slice4 {
            background: #13c2c2;
            clip-path: polygon(50% 50%, 20% 0, 50% 0);
          }
        }
      }
    }
  }
  
  /* 任务列表样式 */
  .jobs-list {
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      
      span {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
    }
    
    .job-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .job-info {
        .job-name {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }
        
        .job-metrics {
          font-size: 12px;
          color: #999;
          
          span {
            margin-right: 10px;
          }
        }
      }
      
      .job-status {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 12px;
        
        &.success {
          background-color: #f6ffed;
          color: #52c41a;
        }
        
        &.warning {
          background-color: #fffbe6;
          color: #faad14;
        }
        
        &.error {
          background-color: #fff2f0;
          color: #ff4d4f;
        }
      }
    }
  }
  
  /* 告警列表样式 */
  .alerts-list {
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      
      span {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
    }
    
    .alert-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .el-icon {
        margin-top: 2px;
      }
      
      &.error .el-icon {
        color: #ff4d4f;
      }
      
      &.warning .el-icon {
        color: #faad14;
      }
      
      .alert-content {
        flex-grow: 1;
        
        .alert-title {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }
        
        .alert-time {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style> 