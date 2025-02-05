<template>
  <div class="admin-container">
    <GridNav />
    <div class="content">
      <!-- 数据概览卡片 -->
      <div class="stat-cards">
        <el-card v-for="stat in stats" :key="stat.title" class="stat-card" :style="{ background: stat.background }">
          <div class="card-content">
            <div class="icon">
              <el-icon><component :is="stat.icon" /></el-icon>
            </div>
            <div class="info">
              <div class="title">{{ stat.title }}</div>
              <div class="number">{{ stat.number }}</div>
              <div class="trend" :class="stat.trend">
                {{ stat.trend === 'up' ? '+' : '-' }}{{ stat.change }}%
                <el-icon><component :is="stat.trend === 'up' ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
                <span>较上周</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <!-- 访问趋势图 -->
        <el-card class="chart-card visits-trend">
          <template #header>
            <div class="card-header">
              <span>访问趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="visitChartRef"></div>
        </el-card>

        <!-- 用户分布图 -->
        <el-card class="chart-card user-distribution">
          <template #header>
            <div class="card-header">
              <span>用户地区分布</span>
              <el-button-group size="small">
                <el-button type="primary" plain>地图</el-button>
                <el-button>图表</el-button>
              </el-button-group>
            </div>
          </template>
          <div class="chart-container" ref="mapChartRef"></div>
        </el-card>
      </div>

      <!-- 数据明细 -->
      <div class="data-details">
        <!-- 热门内容排行 -->
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <span>热门内容排行</span>
              <el-tabs v-model="contentType" class="demo-tabs">
                <el-tab-pane label="视频" name="video" />
                <el-tab-pane label="图文" name="article" />
              </el-tabs>
            </div>
          </template>
          <div class="ranking-list">
            <div v-for="(item, index) in rankingList" :key="item.id" class="ranking-item">
              <div class="rank" :class="{ top3: index < 3 }">{{ index + 1 }}</div>
              <el-image :src="item.cover" class="cover" />
              <div class="info">
                <div class="title">{{ item.title }}</div>
                <div class="stats">
                  <span><el-icon><View /></el-icon> {{ item.views }}</span>
                  <span><el-icon><Star /></el-icon> {{ item.likes }}</span>
                  <span><el-icon><ChatDotRound /></el-icon> {{ item.comments }}</span>
                </div>
              </div>
              <div class="trend" :class="item.trend">
                {{ item.trend === 'up' ? '+' : '-' }}{{ item.change }}
              </div>
            </div>
          </div>
        </el-card>

        <!-- 实时动态 -->
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <span>实时动态</span>
              <el-button type="primary" text>
                <el-icon><RefreshRight /></el-icon>
                刷新
              </el-button>
            </div>
          </template>
          <div class="activity-list">
            <div v-for="activity in activities" :key="activity.id" class="activity-item">
              <div class="time">{{ activity.time }}</div>
              <div class="content">
                <el-avatar :size="32" :src="activity.avatar" />
                <div class="detail">
                  <span class="user">{{ activity.user }}</span>
                  {{ activity.action }}
                  <span class="target">{{ activity.target }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import GridNav from '@/components/GridNav.vue'
import * as echarts from 'echarts'

const timeRange = ref('week')
const contentType = ref('video')
const visitChartRef = ref<HTMLElement | null>(null)
const mapChartRef = ref<HTMLElement | null>(null)

// 数据概览
const stats = [
  {
    title: '总访问量',
    number: '234.5w',
    change: '12.5',
    trend: 'up',
    icon: 'View',
    background: 'linear-gradient(135deg, #1890ff, #36cfc9)'
  },
  {
    title: '活跃用户',
    number: '45.2w',
    change: '8.2',
    trend: 'up',
    icon: 'User',
    background: 'linear-gradient(135deg, #722ed1, #eb2f96)'
  },
  {
    title: '内容发布量',
    number: '1,234',
    change: '3.1',
    trend: 'down',
    icon: 'Document',
    background: 'linear-gradient(135deg, #52c41a, #fadb14)'
  },
  {
    title: '互动总量',
    number: '89.3w',
    change: '15.4',
    trend: 'up',
    icon: 'ChatDotRound',
    background: 'linear-gradient(135deg, #fa541c, #f5222d)'
  }
]

// 排行榜数据
const rankingList = [
  {
    id: 1,
    title: '2024年最值得期待的科技产品',
    cover: 'https://picsum.photos/60/60?random=1',
    views: '12.5w',
    likes: '2.3w',
    comments: '1.1k',
    trend: 'up',
    change: '5%'
  },
  {
    id: 2,
    title: '人工智能发展趋势分析',
    cover: 'https://picsum.photos/60/60?random=2',
    views: '10.2w',
    likes: '1.8w',
    comments: '956',
    trend: 'up',
    change: '3%'
  },
  {
    id: 3,
    title: '最新移动端设计规范',
    cover: 'https://picsum.photos/60/60?random=3',
    views: '8.9w',
    likes: '1.5w',
    comments: '784',
    trend: 'down',
    change: '2%'
  },
  {
    id: 4,
    title: '前端开发技术栈指南',
    cover: 'https://picsum.photos/60/60?random=4',
    views: '7.6w',
    likes: '1.2w',
    comments: '632',
    trend: 'up',
    change: '4%'
  }
]

// 实时动态
const activities = [
  {
    id: 1,
    user: '张三',
    avatar: 'https://picsum.photos/32/32?random=1',
    action: '发布了新视频',
    target: '《2024年最值得期待的科技产品》',
    time: '2分钟前'
  },
  {
    id: 2,
    user: '李四',
    avatar: 'https://picsum.photos/32/32?random=2',
    action: '评论了文章',
    target: '《人工智能发展趋势分析》',
    time: '5分钟前'
  },
  {
    id: 3,
    user: '王五',
    avatar: 'https://picsum.photos/32/32?random=3',
    action: '点赞了视频',
    target: '《最新移动端设计规范》',
    time: '8分钟前'
  },
  {
    id: 4,
    user: '赵六',
    avatar: 'https://picsum.photos/32/32?random=4',
    action: '分享了文章',
    target: '《前端开发技术栈指南》',
    time: '12分钟前'
  }
]

onMounted(() => {
  // 初始化访问趋势图表
  if (visitChartRef.value) {
    const visitChart = echarts.init(visitChartRef.value)
    visitChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['访问量', '用户量']
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
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '访问量',
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          itemStyle: {
            color: '#1890ff'
          }
        },
        {
          name: '用户量',
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: [620, 732, 701, 834, 1090, 1130, 1120],
          itemStyle: {
            color: '#722ed1'
          }
        }
      ]
    })

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      visitChart.resize()
    })
  }

  // 初始化地区分布图表
  if (mapChartRef.value) {
    const mapChart = echarts.init(mapChartRef.value)
    mapChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '用户分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          data: [
            { value: 1048, name: '华东', itemStyle: { color: '#1890ff' } },
            { value: 735, name: '华南', itemStyle: { color: '#722ed1' } },
            { value: 580, name: '华北', itemStyle: { color: '#52c41a' } },
            { value: 484, name: '西南', itemStyle: { color: '#faad14' } },
            { value: 300, name: '其他', itemStyle: { color: '#f5222d' } }
          ]
        }
      ]
    })

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      mapChart.resize()
    })
  }
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>

<style lang="less" scoped>
.admin-container {
  min-height: 100vh;
  background: #f0f2f5;
  padding-top: 120px;

  .content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;

    .stat-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 24px;

      .stat-card {
        :deep(.el-card__body) {
          padding: 20px;
        }

        .card-content {
          display: flex;
          align-items: center;
          gap: 20px;
          color: white;

          .icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;

            .el-icon {
              font-size: 24px;
            }
          }

          .info {
            flex: 1;

            .title {
              font-size: 14px;
              opacity: 0.8;
              margin-bottom: 8px;
            }

            .number {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 8px;
            }

            .trend {
              font-size: 12px;
              display: flex;
              align-items: center;
              gap: 4px;

              &.up {
                color: #52c41a;
              }

              &.down {
                color: #ff4d4f;
              }

              span {
                opacity: 0.8;
                margin-left: 4px;
              }
            }
          }
        }
      }
    }

    .charts-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-bottom: 24px;

      .chart-card {
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chart-container {
          height: 300px;
        }
      }
    }

    .data-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;

      .detail-card {
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ranking-list {
          .ranking-item {
            display: flex;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;

            .rank {
              width: 24px;
              height: 24px;
              border-radius: 4px;
              background: #fafafa;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 12px;
              font-weight: bold;
              color: #999;

              &.top3 {
                color: white;
                
                &:nth-child(1) {
                  background: #f5222d;
                }
                
                &:nth-child(2) {
                  background: #fa8c16;
                }
                
                &:nth-child(3) {
                  background: #faad14;
                }
              }
            }

            .cover {
              width: 60px;
              height: 60px;
              border-radius: 4px;
              margin-right: 12px;
            }

            .info {
              flex: 1;

              .title {
                font-size: 14px;
                margin-bottom: 8px;
              }

              .stats {
                display: flex;
                gap: 16px;
                color: #999;
                font-size: 12px;

                span {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
              }
            }

            .trend {
              font-size: 12px;

              &.up {
                color: #52c41a;
              }

              &.down {
                color: #ff4d4f;
              }
            }
          }
        }

        .activity-list {
          .activity-item {
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;

            .time {
              font-size: 12px;
              color: #999;
              margin-bottom: 8px;
            }

            .content {
              display: flex;
              align-items: center;
              gap: 12px;

              .detail {
                flex: 1;
                font-size: 14px;

                .user {
                  color: #1890ff;
                  font-weight: 500;
                }

                .target {
                  color: #333;
                  font-weight: 500;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style> 