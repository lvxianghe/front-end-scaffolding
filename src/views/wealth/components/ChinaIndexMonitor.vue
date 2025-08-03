<template>
  <div class="china-index-monitor">
    <div class="monitor-header">
      <h3 class="monitor-title">
        <el-icon><TrendCharts /></el-icon>
        上证指数
      </h3>
      <div class="time-controls">
        <el-radio-group v-model="selectedPeriod" @change="handlePeriodChange" size="small">
          <el-radio-button label="5D">5日</el-radio-button>
          <el-radio-button label="1M">月</el-radio-button>
          <el-radio-button label="6M">半年</el-radio-button>
          <el-radio-button label="1Y">年</el-radio-button>
          <el-radio-button label="10Y">十年</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="monitor-stats">
      <div v-if="!loading && quote" class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">当前点位</span>
          <span class="stat-value">{{ quote.price.toFixed(2) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">涨跌</span>
          <span class="stat-value" :class="quote.change >= 0 ? 'positive' : 'negative'">
            {{ quote.change >= 0 ? '+' : '' }}{{ quote.change.toFixed(2) }}
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">涨跌幅</span>
          <span class="stat-value" :class="quote.changePercent >= 0 ? 'positive' : 'negative'">
            {{ quote.changePercent >= 0 ? '+' : '' }}{{ quote.changePercent.toFixed(2) }}%
          </span>
        </div>
      </div>

      <div v-else-if="errorMessage" class="error-display">
        <el-alert
            :title="errorMessage"
            type="warning"
            :closable="false"
            show-icon
        />
      </div>

      <div v-else class="stats-loading">
        <el-skeleton :rows="2" animated />
      </div>
    </div>

    <div class="chart-container">
      <div v-if="errorMessage" class="chart-error">
        <el-empty
            description="暂时无法获取A股数据"
            :image-size="100"
        >
          <template #image>
            <el-icon size="100" color="#ccc"><Warning /></el-icon>
          </template>
        </el-empty>
      </div>
      <div v-else ref="chartContainer" class="chart-content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { TrendCharts, Warning } from '@element-plus/icons-vue';
import { ChinaStockDataService, type ChinaIndexQuote } from '@/api/chinaStockData';
import * as echarts from 'echarts';

// 响应式数据
const selectedPeriod = ref('5D');
const loading = ref(false);
const errorMessage = ref('');
const quote = ref<ChinaIndexQuote | null>(null);
const chartContainer = ref<HTMLElement>();
let chartInstance: echarts.ECharts | null = null;

// 服务实例
const chinaStockService = new ChinaStockDataService();

// 处理周期变更
const handlePeriodChange = (newPeriod: string) => {
  console.log('切换到周期:', newPeriod);
  updateChart();
};

// 初始化图表
const initChart = async () => {
  await nextTick();
  if (!chartContainer.value) return;

  chartInstance = echarts.init(chartContainer.value);

  // 设置空白图表
  chartInstance.setOption({
    title: {
      text: '加载中...',
      left: 'center',
      top: 'center',
      textStyle: {
        color: '#999',
        fontSize: 16
      }
    }
  });

  // 加载数据
  await updateChart();
};

// 更新图表
const updateChart = async () => {
  try {
    console.log('开始获取上证指数数据...');
    loading.value = true;
    errorMessage.value = '';

    const data = await chinaStockService.getShangzhengIndex(selectedPeriod.value);
    console.log('获取到的数据:', data);

    quote.value = data.quote;

    if (chartInstance && data.historicalData.length > 0) {
      // 准备图表数据
      const dates = data.historicalData.map(item => item.timestamp);
      const prices = data.historicalData.map(item => item.price);

      // 更新图表
      chartInstance.setOption({
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params: any) {
            const param = params[0];
            return `日期: ${param.axisValue}<br/>收盘: ${param.value.toFixed(2)}`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          axisLabel: {
            color: '#666',
            formatter: function(value: string) {
              return value.slice(5);
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          axisLabel: {
            color: '#666'
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          }
        },
        series: [{
          data: prices,
          type: 'line',
          smooth: true,
          lineStyle: {
            color: data.quote.change >= 0 ? '#f56c6c' : '#67c23a',
            width: 2
          },
          itemStyle: {
            color: data.quote.change >= 0 ? '#f56c6c' : '#67c23a'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{
                offset: 0,
                color: data.quote.change >= 0 ? 'rgba(245, 108, 108, 0.3)' : 'rgba(103, 194, 58, 0.3)'
              }, {
                offset: 1,
                color: data.quote.change >= 0 ? 'rgba(245, 108, 108, 0.05)' : 'rgba(103, 194, 58, 0.05)'
              }]
            }
          }
        }]
      });
    }

  } catch (error: any) {
    console.error('获取数据失败:', error);
    errorMessage.value = error.message || '获取A股数据失败';

    if (chartInstance) {
      chartInstance.setOption({
        title: {
          text: '数据获取失败',
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#f56c6c',
            fontSize: 16
          }
        }
      });
    }
  } finally {
    loading.value = false;
  }
};

// 组件卸载时清理
const cleanup = () => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
};

// 初始化
onMounted(async () => {
  await initChart();
});

// 清理
onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
.china-index-monitor {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.monitor-title {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.monitor-stats {
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.stat-value.positive {
  color: #f56c6c;
}

.stat-value.negative {
  color: #67c23a;
}

.error-display {
  margin-bottom: 16px;
}

.stats-loading {
  height: 80px;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart-content {
  width: 100%;
  height: 100%;
}

.chart-error {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>