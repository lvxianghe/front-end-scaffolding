<template>
  <div class="sp500-monitor">
    <div class="monitor-header">
      <h3 class="monitor-title">
        <el-icon><TrendCharts /></el-icon>
        {{ quoteData.symbol || '标普500指数 (SPY)' }}
      </h3>
      <div class="time-controls">
        <el-radio-group v-model="selectedPeriod" @change="handlePeriodChange" size="small">
          <el-radio-button label="5D">5日</el-radio-button>
          <el-radio-button label="1M">月</el-radio-button>
          <el-radio-button label="6M">半年</el-radio-button>
          <el-radio-button label="1Y">年</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="monitor-stats">
      <div class="stat-item">
        <span class="stat-label">当前价格</span>
        <span class="stat-value" :class="priceChangeClass">
          ${{ quoteData.price?.toFixed(2) || '0.00' }}
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">涨跌额</span>
        <span class="stat-value" :class="priceChangeClass">
          {{ quoteData.change > 0 ? '+' : '' }}${{ quoteData.change?.toFixed(2) || '0.00' }}
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">涨跌幅</span>
        <span class="stat-value" :class="priceChangeClass">
          {{ quoteData.changePercent > 0 ? '+' : '' }}{{ quoteData.changePercent?.toFixed(2) || '0.00' }}%
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">数据点数</span>
        <span class="stat-value neutral">{{ dataPointsCount }}个</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">更新时间</span>
        <span class="stat-value update-time">{{ lastUpdateTime }}</span>
      </div>
    </div>

    <div ref="chartRef" class="chart-container" v-loading="loading"></div>

    <div class="data-source">
      <el-text size="small" type="info">
        数据来源: Alpha Vantage (收盘价) |
        <el-button @click="handleRefresh" size="small" text :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, reactive } from 'vue';
import * as echarts from 'echarts';
import { TrendCharts, Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import marketDataService from '@/api/marketData';

const chartRef = ref<HTMLElement>();
const loading = ref(true);
const selectedPeriod = ref('5D');
const lastUpdateTime = ref('--:--:--');
const dataPointsCount = ref(0);

// 响应式报价数据
const quoteData = reactive({
  symbol: 'S&P 500 (SPY)',
  price: 0,
  change: 0,
  changePercent: 0
});

let chartInstance: echarts.ECharts | null = null;

const priceChangeClass = computed(() => ({
  'price-up': quoteData.changePercent > 0,
  'price-down': quoteData.changePercent < 0,
  'price-neutral': quoteData.changePercent === 0
}));

const initChart = () => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = async () => {
  if (!chartInstance) return;

  loading.value = true;

  try {
    console.log('开始获取收盘价数据...');

    // 获取真实数据
    const { quote, historicalData } = await marketDataService.getSP500Data(selectedPeriod.value);

    console.log('获取到的数据:', { quote, dataPoints: historicalData.length });

    // 更新报价信息
    Object.assign(quoteData, quote);
    lastUpdateTime.value = new Date(quote.lastUpdate).toLocaleTimeString('zh-CN', { hour12: false });
    dataPointsCount.value = historicalData.length;

    // 准备图表数据
    const chartData = historicalData.map(point => [
      point.timestamp,
      point.price
    ]);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          const data = params[0];
          const date = new Date(data.axisValue);
          return `
            <div style="text-align: left;">
              <div style="margin-bottom: 5px; font-weight: bold;">
                ${date.toLocaleDateString('zh-CN')} (收盘)
              </div>
              <div style="color: #409EFF;">
                ${quote.symbol}: $${data.value[1].toFixed(2)}
              </div>
            </div>
          `;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#E4E7ED' } },
        axisLabel: {
          color: '#909399',
          formatter: (value: number) => {
            const date = new Date(value);
            switch (selectedPeriod.value) {
              case '5D':
                return (date.getMonth() + 1) + '/' + date.getDate();
              case '1M':
                return (date.getMonth() + 1) + '/' + date.getDate();
              case '6M':
                return date.getFullYear() + '/' + (date.getMonth() + 1);
              case '1Y':
                return date.getFullYear() + '/' + (date.getMonth() + 1);
              default:
                return (date.getMonth() + 1) + '/' + date.getDate();
            }
          }
        }
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLine: { lineStyle: { color: '#E4E7ED' } },
        axisLabel: {
          color: '#909399',
          formatter: (value: number) => '$' + value.toFixed(0)
        },
        splitLine: { lineStyle: { color: '#F2F6FC' } }
      },
      series: [{
        name: quote.symbol,
        type: 'line',
        data: chartData,
        smooth: selectedPeriod.value === '5D' ? false : true, // 5日数据不平滑，长期数据平滑
        showSymbol: selectedPeriod.value === '5D', // 5日数据显示数据点
        symbolSize: 6,
        lineStyle: {
          width: selectedPeriod.value === '5D' ? 3 : 2,
          color: quoteData.changePercent >= 0 ? '#67C23A' : '#F56C6C'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: quoteData.changePercent >= 0 ? 'rgba(103, 194, 58, 0.3)' : 'rgba(245, 108, 108, 0.3)'
            },
            {
              offset: 1,
              color: quoteData.changePercent >= 0 ? 'rgba(103, 194, 58, 0.05)' : 'rgba(245, 108, 108, 0.05)'
            }
          ])
        }
      }]
    };

    chartInstance?.setOption(option, true);

    ElMessage.success(`${selectedPeriod.value}收盘价数据刷新成功`);
  } catch (error) {
    console.error('获取数据失败:', error);
    ElMessage.error('数据获取失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const handlePeriodChange = () => {
  updateChart();
};

const handleRefresh = () => {
  updateChart();
};

const handleResize = () => {
  chartInstance?.resize();
};

onMounted(async () => {
  await nextTick();
  initChart();
  window.addEventListener('resize', handleResize);

  // 每5分钟自动刷新一次
  setInterval(() => {
    updateChart();
  }, 300000);
});

onUnmounted(() => {
  chartInstance?.dispose();
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.sp500-monitor {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
}

.monitor-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #F2F6FC;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.monitor-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.monitor-stats {
  padding: 16px 24px;
  display: flex;
  gap: 24px;
  background: #FAFCFF;
  border-bottom: 1px solid #F2F6FC;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 90px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.stat-value {
  font-size: 15px;
  font-weight: 600;
}

.price-up {
  color: #67C23A;
}

.price-down {
  color: #F56C6C;
}

.price-neutral, .neutral {
  color: #909399;
}

.update-time {
  color: #909399;
  font-size: 13px;
  font-weight: 400;
}

.chart-container {
  height: 280px;
  padding: 16px;
}

.data-source {
  padding: 8px 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #F2F6FC;
}

.time-controls :deep(.el-radio-button__inner) {
  padding: 6px 12px;
  font-size: 13px;
}

@media (max-width: 768px) {
  .monitor-stats {
    gap: 16px;
  }

  .stat-item {
    min-width: 80px;
  }

  .monitor-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>