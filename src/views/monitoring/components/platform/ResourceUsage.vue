<template>
  <div class="resource-usage">
    <div class="section-header">
      <h3>资源占用分析</h3>
      <div class="header-actions">
        <el-select v-model="resourceTimeRange" placeholder="时间范围" size="small">
          <el-option label="最近1小时" value="1h" />
          <el-option label="最近6小时" value="6h" />
          <el-option label="最近24小时" value="24h" />
          <el-option label="最近7天" value="7d" />
        </el-select>
        <el-button size="small" type="primary">详情</el-button>
      </div>
    </div>
    
    <div class="resource-charts">
      <div class="resource-chart">
        <h4>CPU使用率</h4>
        <div ref="cpuChart" class="chart-container"></div>
      </div>
      <div class="resource-chart">
        <h4>内存使用率</h4>
        <div ref="memoryChart" class="chart-container"></div>
      </div>
      <div class="resource-chart">
        <h4>磁盘I/O</h4>
        <div ref="diskChart" class="chart-container"></div>
      </div>
      <div class="resource-chart">
        <h4>网络流量</h4>
        <div ref="networkChart" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 资源使用时间范围
const resourceTimeRange = ref('1h')

// 图表引用
const cpuChart = ref(null)
const memoryChart = ref(null)
const diskChart = ref(null)
const networkChart = ref(null)

// 图表实例
let cpuChartInstance = null
let memoryChartInstance = null
let diskChartInstance = null
let networkChartInstance = null

onMounted(() => {
  initCharts()
  
  window.addEventListener('resize', () => {
    cpuChartInstance?.resize()
    memoryChartInstance?.resize()
    diskChartInstance?.resize()
    networkChartInstance?.resize()
  })
})

const initCharts = () => {
  // 初始化CPU使用率图表
  if (cpuChart.value) {
    cpuChartInstance = echarts.init(cpuChart.value)
    const cpuOption = {
      tooltip: {
        trigger: 'axis'
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
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00']
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: 'CPU使用率',
          type: 'line',
          smooth: true,
          data: [30, 40, 35, 50, 70, 65, 40, 45, 55],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.5)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
            ])
          },
          lineStyle: {
            width: 2,
            color: '#1890ff'
          },
          itemStyle: {
            color: '#1890ff'
          }
        }
      ]
    }
    cpuChartInstance.setOption(cpuOption)
  }
  
  // 初始化内存使用率图表
  if (memoryChart.value) {
    memoryChartInstance = echarts.init(memoryChart.value)
    const memoryOption = {
      tooltip: {
        trigger: 'axis'
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
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00']
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '内存使用率',
          type: 'line',
          smooth: true,
          data: [60, 65, 70, 75, 80, 85, 75, 70, 65],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(114, 46, 209, 0.5)' },
              { offset: 1, color: 'rgba(114, 46, 209, 0.1)' }
            ])
          },
          lineStyle: {
            width: 2,
            color: '#722ed1'
          },
          itemStyle: {
            color: '#722ed1'
          }
        }
      ]
    }
    memoryChartInstance.setOption(memoryOption)
  }
  
  // 初始化磁盘I/O图表
  if (diskChart.value) {
    diskChartInstance = echarts.init(diskChart.value)
    const diskOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['读取', '写入']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} MB/s'
        }
      },
      series: [
        {
          name: '读取',
          type: 'bar',
          stack: 'total',
          data: [20, 25, 30, 35, 40, 35, 30, 25, 20],
          itemStyle: {
            color: '#13c2c2'
          }
        },
        {
          name: '写入',
          type: 'bar',
          stack: 'total',
          data: [15, 20, 25, 30, 35, 30, 25, 20, 15],
          itemStyle: {
            color: '#52c41a'
          }
        }
      ]
    }
    diskChartInstance.setOption(diskOption)
  }
  
  // 初始化网络流量图表
  if (networkChart.value) {
    networkChartInstance = echarts.init(networkChart.value)
    const networkOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['入站流量', '出站流量']
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
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} MB/s'
        }
      },
      series: [
        {
          name: '入站流量',
          type: 'line',
          stack: 'total',
          data: [120, 132, 101, 134, 90, 230, 210, 182, 191],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(250, 173, 20, 0.5)' },
              { offset: 1, color: 'rgba(250, 173, 20, 0.1)' }
            ])
          },
          lineStyle: {
            width: 2,
            color: '#faad14'
          },
          itemStyle: {
            color: '#faad14'
          }
        },
        {
          name: '出站流量',
          type: 'line',
          stack: 'total',
          data: [220, 182, 191, 234, 290, 330, 310, 123, 442],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(82, 196, 26, 0.5)' },
              { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
            ])
          },
          lineStyle: {
            width: 2,
            color: '#52c41a'
          },
          itemStyle: {
            color: '#52c41a'
          }
        }
      ]
    }
    networkChartInstance.setOption(networkOption)
  }
}
</script>

<style lang="less" scoped>
.resource-usage {
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
      gap: 10px;
    }
  }
  
  .resource-charts {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    
    .resource-chart {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      h4 {
        margin: 0 0 15px 0;
        font-size: 16px;
        color: #1a3a5f;
      }
      
      .chart-container {
        height: 200px;
        width: 100%;
      }
    }
  }
}
</style> 