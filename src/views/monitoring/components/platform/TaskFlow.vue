<template>
  <div class="operation-analysis-container">
    <div class="section-header">
      <h3>运营分析</h3>
      <div class="time-filter">
        <el-radio-group v-model="timeRange" size="small">
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
          <el-radio-button label="quarter">季度</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    
    <div class="analysis-grid">
      <!-- 任务重复报错率 -->
      <div class="analysis-panel">
        <div class="panel-header">
          <div class="panel-title">
            <el-icon><WarningFilled /></el-icon>
            <span>任务重复报错率</span>
          </div>
          <el-tooltip content="查看详情">
            <el-button link size="small">
              详情 <el-icon><ArrowRight /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        <div class="panel-content">
          <div class="error-rate-chart">
            <div class="chart-placeholder">
              <div class="bar-chart">
                <div class="bar-item">
                  <div class="bar-label">数仓跑批</div>
                  <div class="bar-container">
                    <div class="bar-value" style="width: 35%"></div>
                  </div>
                  <div class="bar-percentage">35%</div>
                </div>
                <div class="bar-item">
                  <div class="bar-label">大数据跑批</div>
                  <div class="bar-container">
                    <div class="bar-value" style="width: 28%"></div>
                  </div>
                  <div class="bar-percentage">28%</div>
                </div>
                <div class="bar-item">
                  <div class="bar-label">监管集市跑批</div>
                  <div class="bar-container">
                    <div class="bar-value" style="width: 42%"></div>
                  </div>
                  <div class="bar-percentage">42%</div>
                </div>
                <div class="bar-item">
                  <div class="bar-label">数字化运营跑批</div>
                  <div class="bar-container">
                    <div class="bar-value" style="width: 15%"></div>
                  </div>
                  <div class="bar-percentage">15%</div>
                </div>
                <div class="bar-item">
                  <div class="bar-label">泰隆数据跑批监测</div>
                  <div class="bar-container">
                    <div class="bar-value" style="width: 22%"></div>
                  </div>
                  <div class="bar-percentage">22%</div>
                </div>
              </div>
            </div>
          </div>
          <div class="error-rate-summary">
            <div class="summary-item">
              <div class="summary-value error">28.4%</div>
              <div class="summary-label">平均报错率</div>
            </div>
            <div class="summary-item">
              <div class="summary-value warning">+5.2%</div>
              <div class="summary-label">环比增长</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">42%</div>
              <div class="summary-label">最高报错率</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 关键路径变化分析 -->
      <div class="analysis-panel">
        <div class="panel-header">
          <div class="panel-title">
            <el-icon><DataLine /></el-icon>
            <span>关键路径变化分析</span>
          </div>
          <el-tooltip content="查看详情">
            <el-button link size="small">
              详情 <el-icon><ArrowRight /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        <div class="panel-content">
          <div class="path-analysis-chart">
            <div class="path-item">
              <div class="path-name">数据准备 → 数据清洗</div>
              <div class="path-trend success">
                <span>-12%</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
            </div>
            <div class="path-item">
              <div class="path-name">数据清洗 → 指标计算</div>
              <div class="path-trend error">
                <span>+23%</span>
                <el-icon><ArrowUp /></el-icon>
              </div>
            </div>
            <div class="path-item">
              <div class="path-name">数据转换 → 数据聚合</div>
              <div class="path-trend warning">
                <span>+8%</span>
                <el-icon><ArrowUp /></el-icon>
              </div>
            </div>
            <div class="path-item">
              <div class="path-name">数据校验 → 质量检查</div>
              <div class="path-trend success">
                <span>-5%</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
            </div>
            <div class="path-item">
              <div class="path-name">指标计算 → 数据加载</div>
              <div class="path-trend error">
                <span>+18%</span>
                <el-icon><ArrowUp /></el-icon>
              </div>
            </div>
          </div>
          <div class="path-analysis-summary">
            <div class="summary-text">
              关键路径平均耗时较上周<span class="warning">增加7.5%</span>，建议优化<span class="error">数据清洗 → 指标计算</span>路径
            </div>
          </div>
        </div>
      </div>
      
      <!-- 任务超时统计 -->
      <div class="analysis-panel">
        <div class="panel-header">
          <div class="panel-title">
            <el-icon><Timer /></el-icon>
            <span>任务超时统计</span>
          </div>
          <el-tooltip content="查看详情">
            <el-button link size="small">
              详情 <el-icon><ArrowRight /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
        <div class="panel-content">
          <div class="timeout-chart">
            <div class="donut-chart-container">
              <div class="donut-chart">
                <div class="donut-hole">
                  <div class="donut-label">
                    <div class="donut-percent">24%</div>
                    <div class="donut-text">超时率</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="timeout-details">
              <div class="timeout-item">
                <div class="timeout-label">数仓跑批</div>
                <div class="timeout-value error">8次</div>
              </div>
              <div class="timeout-item">
                <div class="timeout-label">大数据跑批</div>
                <div class="timeout-value warning">5次</div>
              </div>
              <div class="timeout-item">
                <div class="timeout-label">监管集市跑批</div>
                <div class="timeout-value error">12次</div>
              </div>
              <div class="timeout-item">
                <div class="timeout-label">数字化运营跑批</div>
                <div class="timeout-value success">2次</div>
              </div>
              <div class="timeout-item">
                <div class="timeout-label">泰隆数据跑批监测</div>
                <div class="timeout-value warning">6次</div>
              </div>
            </div>
          </div>
          <div class="timeout-summary">
            <div class="summary-item">
              <div class="summary-value error">33</div>
              <div class="summary-label">总超时次数</div>
            </div>
            <div class="summary-item">
              <div class="summary-value warning">+15%</div>
              <div class="summary-label">环比增长</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { WarningFilled, DataLine, Timer, ArrowUp, ArrowDown, ArrowRight } from '@element-plus/icons-vue'

const timeRange = ref('week')
</script>

<style lang="less" scoped>
.operation-analysis-container {
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
  }
  
  .analysis-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    
    .analysis-panel {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      
      &:nth-child(3) {
        grid-column: span 2;
      }
      
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid #f0f0f0;
        
        .panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 500;
          color: #333;
          
          .el-icon {
            font-size: 18px;
            color: #1890ff;
          }
        }
      }
      
      .panel-content {
        padding: 20px;
      }
    }
  }
  
  /* 任务重复报错率样式 */
  .error-rate-chart {
    margin-bottom: 20px;
    
    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 15px;
      
      .bar-item {
        display: flex;
        align-items: center;
        
        .bar-label {
          width: 140px;
          font-size: 14px;
          color: #666;
        }
        
        .bar-container {
          flex-grow: 1;
          height: 10px;
          background: #f0f0f0;
          border-radius: 5px;
          margin: 0 15px;
          overflow: hidden;
          
          .bar-value {
            height: 100%;
            background: #ff4d4f;
            border-radius: 5px;
          }
        }
        
        .bar-percentage {
          width: 40px;
          font-size: 14px;
          color: #ff4d4f;
          text-align: right;
        }
      }
    }
  }
  
  .error-rate-summary {
    display: flex;
    justify-content: space-around;
    
    .summary-item {
      text-align: center;
      
      .summary-value {
        font-size: 22px;
        font-weight: 500;
        margin-bottom: 5px;
        
        &.error { color: #ff4d4f; }
        &.warning { color: #faad14; }
        &.success { color: #52c41a; }
      }
      
      .summary-label {
        font-size: 14px;
        color: #999;
      }
    }
  }
  
  /* 关键路径变化分析样式 */
  .path-analysis-chart {
    margin-bottom: 20px;
    
    .path-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .path-name {
        font-size: 14px;
        color: #333;
      }
      
      .path-trend {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        font-weight: 500;
        
        &.success { color: #52c41a; }
        &.warning { color: #faad14; }
        &.error { color: #ff4d4f; }
      }
    }
  }
  
  .path-analysis-summary {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
    
    .summary-text {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      
      .warning { color: #faad14; }
      .error { color: #ff4d4f; }
    }
  }
  
  /* 任务超时统计样式 */
  .timeout-chart {
    display: flex;
    margin-bottom: 20px;
    
    .donut-chart-container {
      width: 120px;
      height: 120px;
      position: relative;
      margin-right: 30px;
      
      .donut-chart {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: conic-gradient(
          #ff4d4f 0% 24%,
          #f5f5f5 24% 100%
        );
        position: relative;
        
        .donut-hole {
          position: absolute;
          width: 60%;
          height: 60%;
          background: white;
          border-radius: 50%;
          top: 20%;
          left: 20%;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .donut-label {
            text-align: center;
            
            .donut-percent {
              font-size: 20px;
              font-weight: 500;
              color: #ff4d4f;
            }
            
            .donut-text {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
    
    .timeout-details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .timeout-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        
        .timeout-label {
          font-size: 14px;
          color: #666;
        }
        
        .timeout-value {
          font-size: 14px;
          font-weight: 500;
          
          &.error { color: #ff4d4f; }
          &.warning { color: #faad14; }
          &.success { color: #52c41a; }
        }
      }
    }
  }
  
  .timeout-summary {
    display: flex;
    justify-content: center;
    gap: 60px;
    
    .summary-item {
      text-align: center;
      
      .summary-value {
        font-size: 22px;
        font-weight: 500;
        margin-bottom: 5px;
        
        &.error { color: #ff4d4f; }
        &.warning { color: #faad14; }
        &.success { color: #52c41a; }
      }
      
      .summary-label {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style> 