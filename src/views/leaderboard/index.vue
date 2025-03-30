<template>
  <div class="leaderboard-page">
    <div class="exit-button" @click="goBack">
      <el-icon><Back /></el-icon>
      <span>返回</span>
    </div>
    
    <div class="header-section">
      <h1 class="page-title">营销绩效排行榜</h1>
      <div class="time-filter">
        <el-select v-model="timeRange" placeholder="选择时间范围">
          <el-option
            v-for="item in timeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    
    <div class="leaderboard-overview">
      <div class="overview-card">
        <div class="overview-title">总参与人数</div>
        <div class="overview-number">3,862</div>
        <div class="overview-trend">
          <el-icon color="#67c23a"><ArrowUp /></el-icon>
          <span>12.5%</span>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="overview-title">总行均分</div>
        <div class="overview-number">85.7</div>
        <div class="overview-trend">
          <el-icon color="#67c23a"><ArrowUp /></el-icon>
          <span>3.2%</span>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="overview-title">分行均分</div>
        <div class="overview-number">82.3</div>
        <div class="overview-trend">
          <el-icon color="#67c23a"><ArrowUp /></el-icon>
          <span>5.1%</span>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="overview-title">支行均分</div>
        <div class="overview-number">78.9</div>
        <div class="overview-trend">
          <el-icon color="#67c23a"><ArrowUp /></el-icon>
          <span>7.6%</span>
        </div>
      </div>
    </div>
    
    <div class="rank-list-wrapper">
      <RankList 
        :title="'业绩排行榜'" 
        :total-data="totalRankData" 
        :branch-data="branchRankData" 
        :sub-data="subRankData"
        @view-profile="handleViewProfile"
      />
    </div>
    
    <el-dialog
      v-model="profileDialogVisible"
      title="个人主页"
      width="70%"
      :before-close="handleCloseDialog"
    >
      <div v-if="selectedUser" class="profile-preview">
        <div class="profile-header">
          <el-avatar :size="80" :src="selectedUser.avatar">
            {{ selectedUser.name.slice(0, 1) }}
          </el-avatar>
          <div class="profile-info">
            <h2>{{ selectedUser.name }}</h2>
            <p>{{ selectedUser.department }}</p>
            <div class="profile-tags">
              <el-tag v-if="selectedUser.rank <= 10" type="danger">TOP{{ selectedUser.rank }}</el-tag>
              <el-tag type="success">总得分: {{ selectedUser.score }}</el-tag>
              <el-tag type="primary">增长率: {{ selectedUser.growth > 0 ? '+' : '' }}{{ selectedUser.growth }}%</el-tag>
            </div>
          </div>
        </div>
        
        <div class="profile-data">
          <el-descriptions title="业绩数据" :column="3" border>
            <el-descriptions-item label="客户数量">{{ Math.floor(Math.random() * 100) + 50 }}</el-descriptions-item>
            <el-descriptions-item label="成交量">{{ Math.floor(Math.random() * 1000) + 500 }}</el-descriptions-item>
            <el-descriptions-item label="满意度">{{ (Math.random() * 2 + 3).toFixed(1) }}</el-descriptions-item>
            <el-descriptions-item label="转化率">{{ (Math.random() * 30 + 60).toFixed(1) }}%</el-descriptions-item>
            <el-descriptions-item label="响应时间">{{ Math.floor(Math.random() * 10) + 2 }}小时</el-descriptions-item>
            <el-descriptions-item label="平均成交额">{{ Math.floor(Math.random() * 50000) + 10000 }}元</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="performance-chart">
          <div id="performanceChart" style="width: 100%; height: 300px;"></div>
        </div>
        
        <div class="profile-footer">
          <el-button type="primary" @click="handleCloseDialog">关闭</el-button>
          <el-button type="success" @click="navigateToFullProfile">查看完整档案</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import RankList from '@/components/leaderboard/RankList.vue';
import { ArrowUp, ArrowDown, Back } from '@element-plus/icons-vue';
import * as echarts from 'echarts';

const router = useRouter();
const timeRange = ref('month');
const timeOptions = [
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'quarter', label: '本季度' },
  { value: 'year', label: '本年度' }
];

const goBack = () => {
  router.push('/home');
};

// 模拟数据生成函数
const generateMockData = (count, type) => {
  const departments = {
    total: ['总行企业金融部', '总行个人金融部', '总行风险管理部', '总行国际业务部', '总行金融市场部'],
    branch: ['北京分行', '上海分行', '广州分行', '深圳分行', '杭州分行', '成都分行', '武汉分行'],
    sub: ['海淀支行', '朝阳支行', '浦东支行', '天河支行', '西湖支行', '锦江支行', '武昌支行']
  };
  
  const avatars = [
    'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    'https://avatars.githubusercontent.com/u/12345678',
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/1.jpg'
  ];
  
  const firstNames = ['张', '李', '王', '赵', '陈', '刘', '杨', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '林', '郭', '何', '高', '罗'];
  const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞'];
  
  const result = [];
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = firstName + lastName;
    
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    const deptIndex = Math.floor(Math.random() * departments[type].length);
    const score = Math.floor(Math.random() * 30) + 70; // 得分在70-100之间
    const growth = Math.floor(Math.random() * 40) - 10; // 增长率在-10% 到 +30% 之间
    
    result.push({
      rank: i,
      name,
      avatar,
      department: departments[type][deptIndex],
      score,
      growth
    });
  }
  
  // 按得分降序排序
  return result.sort((a, b) => b.score - a.score).map((item, index) => ({
    ...item,
    rank: index + 1
  }));
};

const totalRankData = ref(generateMockData(50, 'total'));
const branchRankData = ref(generateMockData(50, 'branch'));
const subRankData = ref(generateMockData(50, 'sub'));

const profileDialogVisible = ref(false);
const selectedUser = ref(null);

const handleViewProfile = (user) => {
  selectedUser.value = user;
  profileDialogVisible.value = true;
  
  // 在对话框打开后初始化图表
  nextTick(() => {
    initPerformanceChart();
  });
};

const handleCloseDialog = () => {
  profileDialogVisible.value = false;
};

const navigateToFullProfile = () => {
  if (selectedUser.value) {
    router.push({
      path: '/profile',
      query: { id: selectedUser.value.rank }
    });
    profileDialogVisible.value = false;
  }
};

// 初始化性能图表
const initPerformanceChart = () => {
  const chartDom = document.getElementById('performanceChart');
  if (!chartDom) return;
  
  const myChart = echarts.init(chartDom);
  
  // 生成近6个月的随机数据
  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  const scoreData = months.map(() => Math.floor(Math.random() * 30) + 70);
  const avgData = months.map(() => Math.floor(Math.random() * 20) + 70);
  
  // 确保最后一个月的数据与当前分数一致
  if (selectedUser.value) {
    scoreData[scoreData.length - 1] = selectedUser.value.score;
  }
  
  const option = {
    title: {
      text: '绩效趋势 (近6个月)',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['个人得分', '平均水平'],
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
        emphasis: {
          scale: true
        }
      },
      {
        name: '平均水平',
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
</script>

<style lang="less" scoped>
.leaderboard-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
  position: relative;
  
  .exit-button {
    position: fixed;
    top: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #67c23a;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    z-index: 10;
    border: 1px solid rgba(103, 194, 58, 0.2);
    transition: all 0.3s;
    
    &:hover {
      background: #ffffff;
      border-color: rgba(103, 194, 58, 0.4);
      box-shadow: 0 0 10px rgba(103, 194, 58, 0.3);
    }
    
    .el-icon {
      font-size: 18px;
    }
    
    span {
      font-size: 16px;
    }
  }
  
  .header-section {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    padding-top: 30px;
    position: relative;
    
    .page-title {
      margin: 0;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #303133;
    }
    
    .time-filter {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  
  .leaderboard-overview {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    
    .overview-card {
      background-color: #fff;
      border-radius: 8px;
      padding: 20px;
      flex: 1;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      
      .overview-title {
        font-size: 14px;
        color: #909399;
        margin-bottom: 10px;
      }
      
      .overview-number {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 10px;
      }
      
      .overview-trend {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        color: #67c23a;
      }
    }
  }
  
  .rank-list-wrapper {
    margin-top: 20px;
  }
  
  .profile-preview {
    .profile-header {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      
      .profile-info {
        h2 {
          margin: 0 0 5px 0;
        }
        
        p {
          margin: 0 0 10px 0;
          color: #606266;
        }
        
        .profile-tags {
          display: flex;
          gap: 10px;
        }
      }
    }
    
    .profile-data {
      margin-bottom: 30px;
    }
    
    .performance-chart {
      margin-bottom: 30px;
    }
    
    .profile-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }
}
</style> 