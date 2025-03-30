<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="header-bg"></div>
      <div class="profile-top">
        <div class="go-back">
          <el-button @click="goBack" icon="ArrowLeft" plain>返回排行榜</el-button>
        </div>
        <div class="profile-avatar">
          <el-avatar :size="120" :src="userData.avatar">
            {{ userData.name ? userData.name.slice(0, 1) : 'U' }}
          </el-avatar>
          <div class="user-rank" v-if="userData.rank <= 10">
            TOP {{ userData.rank }}
          </div>
        </div>
        <div class="profile-basic-info">
          <h1 class="user-name">{{ userData.name }}</h1>
          <p class="user-department">{{ userData.department }}</p>
          <div class="user-tags">
            <el-tag v-if="userData.growth > 15" type="danger">高速增长</el-tag>
            <el-tag v-if="userData.score > 90" type="success">优秀员工</el-tag>
            <el-tag v-if="userData.rank <= 5" type="warning">分行明星</el-tag>
          </div>
        </div>
      </div>
    </div>
    
    <div class="profile-content">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <span>基本信息</span>
                <el-button type="primary" link icon="Edit">编辑</el-button>
              </div>
            </template>
            <el-descriptions direction="vertical" :column="1" border>
              <el-descriptions-item label="工号">{{ userData.empId || '100' + userData.rank }}</el-descriptions-item>
              <el-descriptions-item label="职位">{{ userData.position || randomPosition() }}</el-descriptions-item>
              <el-descriptions-item label="所在支行">{{ userData.branch || userData.department }}</el-descriptions-item>
              <el-descriptions-item label="入职时间">{{ userData.joinDate || randomDate() }}</el-descriptions-item>
              <el-descriptions-item label="联系方式">{{ userData.phone || randomPhone() }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ userData.email || (userData.name + '@example.com') }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
          
          <el-card class="awards-card">
            <template #header>
              <div class="card-header">
                <span>获得的奖项</span>
              </div>
            </template>
            <div class="award-list">
              <div v-for="(award, index) in awards" :key="index" class="award-item">
                <el-icon><Trophy /></el-icon>
                <div class="award-info">
                  <div class="award-name">{{ award.name }}</div>
                  <div class="award-date">{{ award.date }}</div>
                </div>
              </div>
              <el-empty v-if="awards.length === 0" description="暂无奖项" />
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="16">
          <el-card class="performance-card">
            <template #header>
              <div class="card-header">
                <span>绩效总览</span>
                <div class="time-selector">
                  <el-select v-model="timeRange" placeholder="时间段" size="small">
                    <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
              </div>
            </template>
            <div class="score-overview">
              <div class="score-card">
                <div class="score-value">{{ userData.score }}</div>
                <div class="score-label">总得分</div>
              </div>
              <div class="score-card">
                <div class="score-value">{{ userData.rank }}</div>
                <div class="score-label">总排名</div>
              </div>
              <div class="score-card">
                <div class="score-value" :class="{'positive': userData.growth > 0, 'negative': userData.growth < 0}">
                  {{ userData.growth > 0 ? '+' : '' }}{{ userData.growth }}%
                </div>
                <div class="score-label">同比增长</div>
              </div>
            </div>
            
            <div class="chart-container">
              <div id="performanceTrendChart" style="width: 100%; height: 300px;"></div>
            </div>
          </el-card>
          
          <el-row :gutter="20" class="detail-stats">
            <el-col :span="12">
              <el-card class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>客户满意度</span>
                  </div>
                </template>
                <div id="satisfactionChart" style="width: 100%; height: 300px;"></div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>业务完成情况</span>
                  </div>
                </template>
                <div id="completionChart" style="width: 100%; height: 300px;"></div>
              </el-card>
            </el-col>
          </el-row>
          
          <el-card class="activity-card">
            <template #header>
              <div class="card-header">
                <span>最近活动</span>
              </div>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :type="activity.type"
                :color="activity.color"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import * as echarts from 'echarts';
import { ArrowLeft, Edit, Trophy } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const userId = ref(route.query.id);

// 模拟用户数据
const userData = ref({
  id: userId.value,
  name: '张伟',
  department: '北京分行',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  rank: Number(userId.value) || 1,
  score: 95,
  growth: 18,
  position: '客户经理',
  empId: '10023546',
  branch: '北京朝阳支行',
  joinDate: '2018-06-15',
  phone: '138****6789',
  email: 'zhangwei@example.com'
});

// 随机生成职位
const randomPosition = () => {
  const positions = ['客户经理', '理财顾问', '大堂经理', '信贷专员', '风控主管'];
  return positions[Math.floor(Math.random() * positions.length)];
};

// 随机生成日期 (5-10年内)
const randomDate = () => {
  const year = new Date().getFullYear() - Math.floor(Math.random() * 5 + 5);
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

// 随机生成电话号码
const randomPhone = () => {
  const prefix = ['138', '139', '187', '156', '135'];
  const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
  const randomNum = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${randomPrefix}****${randomNum.slice(-4)}`;
};

// 时间选择器
const timeRange = ref('year');
const timeOptions = [
  { value: 'month', label: '本月' },
  { value: 'quarter', label: '本季度' },
  { value: 'half', label: '半年' },
  { value: 'year', label: '全年' },
];

// 奖项数据
const awards = ref([
  { name: '季度销售之星', date: '2023年第2季度' },
  { name: '最佳客户满意度', date: '2023年3月' },
  { name: '优秀员工', date: '2022年度' },
]);

// 活动数据
const activities = ref([
  {
    content: '完成特大额贷款审批',
    timestamp: '2023-06-15',
    type: 'primary',
    color: '#0bbd87'
  },
  {
    content: '举办"理财小课堂"活动',
    timestamp: '2023-06-08',
    type: 'primary',
    color: '#409EFF'
  },
  {
    content: '参加分行业务培训',
    timestamp: '2023-06-03',
    type: 'primary',
    color: '#909399'
  },
  {
    content: '新增高净值客户3名',
    timestamp: '2023-05-22',
    type: 'primary',
    color: '#0bbd87'
  },
  {
    content: '客户满意度调查结果发布',
    timestamp: '2023-05-15',
    type: 'primary',
    color: '#E6A23C'
  }
]);

// 返回排行榜
const goBack = () => {
  router.push('/leaderboard');
};

// 初始化图表
onMounted(() => {
  nextTick(() => {
    initPerformanceTrendChart();
    initSatisfactionChart();
    initCompletionChart();
  });
});

// 绩效趋势图
const initPerformanceTrendChart = () => {
  const chartDom = document.getElementById('performanceTrendChart');
  if (!chartDom) return;
  
  const myChart = echarts.init(chartDom);
  
  // 生成近12个月的随机数据
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const scoreData = months.map(() => Math.floor(Math.random() * 30) + 70);
  const avgData = months.map(() => Math.floor(Math.random() * 20) + 70);
  
  // 确保最后一个月的数据与当前分数一致
  scoreData[scoreData.length - 1] = userData.value.score;
  
  const option = {
    title: {
      text: '年度绩效趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['个人得分', '部门平均'],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months
    },
    yAxis: {
      type: 'value',
      min: 60,
      max: 100
    },
    series: [
      {
        name: '个人得分',
        type: 'line',
        data: scoreData,
        smooth: true,
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowBlur: 10,
          shadowOffsetY: 8
        },
        itemStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(64, 158, 255, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(64, 158, 255, 0.05)'
            }
          ])
        },
        emphasis: {
          scale: true
        }
      },
      {
        name: '部门平均',
        type: 'line',
        data: avgData,
        smooth: true,
        lineStyle: {
          width: 2,
          type: 'dashed'
        },
        itemStyle: {
          color: '#909399'
        }
      }
    ]
  };
  
  myChart.setOption(option);
  
  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    myChart.resize();
  });
};

// 客户满意度图
const initSatisfactionChart = () => {
  const chartDom = document.getElementById('satisfactionChart');
  if (!chartDom) return;
  
  const myChart = echarts.init(chartDom);
  
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '90%',
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.3, '#FF6E76'],
              [0.7, '#FDDD60'],
              [1, '#7CFFB2']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 20,
          distance: -60,
          formatter: function (value) {
            if (value === 0 || value === 100) {
              return value + '%';
            } else {
              return '';
            }
          }
        },
        title: {
          offsetCenter: [0, '-20%'],
          fontSize: 30
        },
        detail: {
          fontSize: 50,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: function (value) {
            return Math.round(value) + '%';
          },
          color: 'auto'
        },
        data: [
          {
            value: 92,
            name: '满意度'
          }
        ]
      }
    ]
  };
  
  myChart.setOption(option);
  
  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    myChart.resize();
  });
};

// 业务完成情况图
const initCompletionChart = () => {
  const chartDom = document.getElementById('completionChart');
  if (!chartDom) return;
  
  const myChart = echarts.init(chartDom);
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['目标', '完成'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['存款', '贷款', '理财', '保险', '中间业务']
    },
    series: [
      {
        name: '目标',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: [100, 100, 100, 100, 100]
      },
      {
        name: '完成',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%'
        },
        emphasis: {
          focus: 'series'
        },
        data: [120, 105, 96, 88, 132]
      }
    ]
  };
  
  myChart.setOption(option);
  
  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    myChart.resize();
  });
};
</script>

<style lang="less" scoped>
.profile-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  
  .profile-header {
    position: relative;
    height: 240px;
    margin-bottom: 70px;
    
    .header-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 240px;
      background: linear-gradient(135deg, #1890ff, #722ed1);
      z-index: 1;
    }
    
    .profile-top {
      position: relative;
      z-index: 2;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .go-back {
        position: absolute;
        top: 20px;
        left: 20px;
      }
      
      .profile-avatar {
        position: relative;
        margin-top: 30px;
        
        .el-avatar {
          border: 4px solid white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          background-color: #fff;
        }
        
        .user-rank {
          position: absolute;
          bottom: 0;
          right: 0;
          background-color: #f56c6c;
          color: white;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      }
      
      .profile-basic-info {
        margin-top: 20px;
        text-align: center;
        color: white;
        
        .user-name {
          font-size: 24px;
          margin: 0;
        }
        
        .user-department {
          font-size: 14px;
          margin: 5px 0 10px 0;
        }
        
        .user-tags {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
      }
    }
  }
  
  .profile-content {
    padding: 0 20px 40px 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #303133;
      font-weight: bold;
      
      .time-selector {
        margin-right: 0;
      }
    }
    
    .info-card, .awards-card, .performance-card, .stats-card, .activity-card {
      margin-bottom: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .awards-card {
      .award-list {
        padding: 10px 0;
        
        .award-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #ebeef5;
          
          &:last-child {
            border-bottom: none;
          }
          
          .el-icon {
            color: #e6a23c;
            font-size: 24px;
            margin-right: 15px;
          }
          
          .award-info {
            flex: 1;
            
            .award-name {
              font-weight: bold;
              margin-bottom: 5px;
            }
            
            .award-date {
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
    }
    
    .performance-card {
      .score-overview {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
        
        .score-card {
          text-align: center;
          padding: 20px;
          
          .score-value {
            font-size: 36px;
            font-weight: bold;
            color: #303133;
            margin-bottom: 10px;
            
            &.positive {
              color: #67c23a;
            }
            
            &.negative {
              color: #f56c6c;
            }
          }
          
          .score-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
    
    .detail-stats {
      margin-bottom: 20px;
    }
  }
}
</style> 