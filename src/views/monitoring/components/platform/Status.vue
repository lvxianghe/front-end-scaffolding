<template>
  <div class="platform-status">
    <div class="section-header">
      <h3>平台监控</h3>
      <div class="header-actions">
        <el-button size="small" type="primary">详情</el-button>
      </div>
    </div>
    
    <div class="platform-status-grid">
      <div v-for="service in platformServices" :key="service.id" class="service-status-card" :class="service.status">
        <div class="service-icon">
          <el-icon v-if="service.status === 'normal'"><SuccessFilled /></el-icon>
          <el-icon v-else-if="service.status === 'warning'"><WarningFilled /></el-icon>
          <el-icon v-else-if="service.status === 'error'"><CircleCloseFilled /></el-icon>
        </div>
        <div class="service-name">{{ service.name }}</div>
        <div class="service-metrics">
          <div class="metric">
            <span class="label">响应时间</span>
            <span class="value">{{ service.responseTime }}ms</span>
          </div>
          <div class="metric">
            <span class="label">可用性</span>
            <span class="value">{{ service.availability }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SuccessFilled, WarningFilled, CircleCloseFilled } from '@element-plus/icons-vue'

// 平台服务状态
const platformServices = ref([
  { 
    id: 1, 
    name: '数据采集服务', 
    status: 'normal', 
    responseTime: 120, 
    availability: 99.9 
  },
  { 
    id: 2, 
    name: '数据处理服务', 
    status: 'normal', 
    responseTime: 150, 
    availability: 99.8 
  },
  { 
    id: 3, 
    name: '数据存储服务', 
    status: 'warning', 
    responseTime: 210, 
    availability: 98.5 
  },
  { 
    id: 4, 
    name: '数据分析服务', 
    status: 'normal', 
    responseTime: 180, 
    availability: 99.7 
  },
  { 
    id: 5, 
    name: '数据展示服务', 
    status: 'error', 
    responseTime: 350, 
    availability: 95.2 
  },
  { 
    id: 6, 
    name: '用户认证服务', 
    status: 'normal', 
    responseTime: 90, 
    availability: 99.9 
  }
])
</script>

<style lang="less" scoped>
.platform-status {
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
  }
  
  .platform-status-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    
    .service-status-card {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-top: 3px solid transparent;
      
      &.normal {
        border-top-color: #52c41a;
        .service-icon { color: #52c41a; }
      }
      
      &.warning {
        border-top-color: #faad14;
        .service-icon { color: #faad14; }
      }
      
      &.error {
        border-top-color: #f5222d;
        .service-icon { color: #f5222d; }
      }
      
      .service-icon {
        font-size: 24px;
        margin-bottom: 10px;
      }
      
      .service-name {
        font-weight: 500;
        font-size: 16px;
        margin-bottom: 15px;
      }
      
      .service-metrics {
        display: flex;
        justify-content: space-between;
        
        .metric {
          display: flex;
          flex-direction: column;
          
          .label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          
          .value {
            font-size: 16px;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style> 