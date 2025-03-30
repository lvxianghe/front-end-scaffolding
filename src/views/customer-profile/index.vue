<template>
  <div class="customer-profile-container">
    <div class="exit-button" @click="goBack">
      <el-icon><Back /></el-icon>
      <span>返回</span>
    </div>
    
    <div class="page-header">
      <h1>客户画像分析系统</h1>
    </div>

    <div class="search-panel">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>客户查询</span>
            <el-button type="primary" size="small" @click="searchCustomers">搜索</el-button>
          </div>
        </template>
        
        <el-form :model="searchForm" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="客户名称">
                <el-input 
                  v-model="searchForm.name" 
                  placeholder="支持名称/拼音/模糊查询"
                  clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户标签">
                <el-select 
                  v-model="searchForm.tags" 
                  multiple 
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="选择客户标签">
                  <el-option
                    v-for="item in tagOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否VIP">
                <el-select v-model="searchForm.is_vip" placeholder="选择VIP状态">
                  <el-option :value="null" label="全部"></el-option>
                  <el-option :value="true" label="是"></el-option>
                  <el-option :value="false" label="否"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="活跃时间">
                <el-date-picker
                  v-model="activeTimeRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="handleTimeRangeChange">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="风险等级">
                <el-slider
                  v-model="riskRange"
                  range
                  :min="1"
                  :max="5"
                  :marks="riskMarks"
                  @change="handleRiskRangeChange">
                </el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地区">
                <el-cascader
                  v-model="searchForm.location"
                  :options="locationOptions"
                  clearable
                  placeholder="选择地区">
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider>排序配置</el-divider>

          <el-row :gutter="20">
            <el-col :span="24">
              <div class="sort-container">
                <div class="sort-title">排序规则：</div>
                <el-space wrap>
                  <div v-for="(rule, index) in sortRules" :key="index" class="sort-item">
                    <span>{{ getSortFieldLabel(rule.field) }}</span>
                    <el-button 
                      type="primary" 
                      size="small" 
                      circle
                      :icon="rule.order === 'desc' ? 'Sort-Down' : 'Sort-Up'"
                      @click="toggleSortOrder(rule)"
                      plain>
                    </el-button>
                  </div>
                </el-space>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>

    <div class="result-panel">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>查询结果 ({{ totalResults }})</span>
            <el-space>
              <el-button type="success" size="small" @click="exportResults">导出</el-button>
              <el-button type="primary" size="small" @click="refreshResults">刷新</el-button>
            </el-space>
          </div>
        </template>
        
        <el-table
          v-loading="loading"
          :data="customerList"
          style="width: 100%"
          border>
          <el-table-column type="index" width="50" />
          <el-table-column prop="name" label="客户名称" width="120">
            <template #default="{ row }">
              <el-space>
                <span>{{ row.name }}</span>
                <el-tag v-if="row.is_vip" type="danger" size="small">VIP</el-tag>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column prop="tags" label="标签" width="180">
            <template #default="{ row }">
              <el-space wrap>
                <el-tag 
                  v-for="(tag, index) in row.tags" 
                  :key="index"
                  type="info"
                  size="small">
                  {{ tag }}
                </el-tag>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="综合评分" width="100">
            <template #default="{ row }">
              <el-rate 
                v-model="row.score" 
                disabled 
                :max="5" 
                :allow-half="true" 
                text-color="#ff9900">
              </el-rate>
            </template>
          </el-table-column>
          <el-table-column prop="risk_level" label="风险等级" width="100">
            <template #default="{ row }">
              <el-tag :type="getRiskLevelType(row.risk_level)">
                {{ getRiskLevelText(row.risk_level) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="last_active_time" label="最近活跃时间" width="180" />
          <el-table-column prop="location" label="地区" width="150" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="viewDetail(row)">查看</el-button>
              <el-button type="warning" size="small" @click="editCustomer(row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="totalResults"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange">
          </el-pagination>
        </div>
      </el-card>
    </div>

    <!-- 客户详情对话框 -->
    <el-dialog
      v-model="customerDetailVisible"
      title="客户详情"
      width="70%">
      <div v-if="currentCustomer" class="customer-detail">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="客户名称">
            {{ currentCustomer.name }}
            <el-tag v-if="currentCustomer.is_vip" type="danger" size="small">VIP</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="客户ID">{{ currentCustomer.id }}</el-descriptions-item>
          <el-descriptions-item label="综合评分">
            <el-rate 
              v-model="currentCustomer.score" 
              disabled 
              :max="5" 
              :allow-half="true" 
              text-color="#ff9900">
            </el-rate>
          </el-descriptions-item>
          <el-descriptions-item label="标签">
            <el-space wrap>
              <el-tag 
                v-for="(tag, index) in currentCustomer.tags" 
                :key="index"
                type="info"
                size="small">
                {{ tag }}
              </el-tag>
            </el-space>
          </el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskLevelType(currentCustomer.risk_level)">
              {{ getRiskLevelText(currentCustomer.risk_level) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最近活跃时间">{{ currentCustomer.last_active_time }}</el-descriptions-item>
          <el-descriptions-item label="地区">{{ currentCustomer.location }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ currentCustomer.register_time }}</el-descriptions-item>
          <el-descriptions-item label="消费能力">
            <el-progress :percentage="currentCustomer.consumption_ability * 20" :format="formatConsumption" />
          </el-descriptions-item>
        </el-descriptions>

        <div class="detail-charts" style="margin-top: 20px;">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card header="消费趋势">
                <div class="chart-placeholder" style="height: 300px;">
                  <!-- 这里将来放消费趋势图表 -->
                  <div class="chart-coming-soon">图表开发中...</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card header="活跃分析">
                <div class="chart-placeholder" style="height: 300px;">
                  <!-- 这里将来放活跃度分析图表 -->
                  <div class="chart-coming-soon">图表开发中...</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
      <template #footer>
        <el-button @click="customerDetailVisible = false">关闭</el-button>
        <el-button type="primary" @click="editCustomer(currentCustomer)">编辑</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Rank, SortDown, SortUp, ArrowLeft, Back } from '@element-plus/icons-vue'

const router = useRouter()

// 设置用户已登录状态
localStorage.setItem('userRole', 'user')

// 搜索表单
const searchForm = reactive({
  name: '',
  tags: [],
  is_vip: null,
  start_time: null,
  end_time: null,
  risk_level_min: 1,
  risk_level_max: 5,
  location: null
})

// 日期范围选择器
const activeTimeRange = ref([])

// 风险等级范围选择器
const riskRange = ref([1, 5])

// 排序规则
const sortRules = ref([
  { field: 'is_vip', order: 'desc' },
  { field: 'score', order: 'desc' },
  { field: 'last_active_time', order: 'desc' }
])

// 标签选项
const tagOptions = ref([
  { value: '高价值', label: '高价值' },
  { value: '活跃', label: '活跃' },
  { value: 'VIP', label: 'VIP' },
  { value: '潜力', label: '潜力' },
  { value: '流失风险', label: '流失风险' },
  { value: '新客户', label: '新客户' },
  { value: '老客户', label: '老客户' },
  { value: '高频', label: '高频' },
  { value: '低频', label: '低频' }
])

// 风险等级标记
const riskMarks = {
  1: '低',
  2: '',
  3: '中',
  4: '',
  5: '高'
}

// 地区选项（简化版）
const locationOptions = ref([
  {
    value: '北京',
    label: '北京',
    children: [
      { value: '朝阳区', label: '朝阳区' },
      { value: '海淀区', label: '海淀区' },
      { value: '西城区', label: '西城区' }
    ]
  },
  {
    value: '上海',
    label: '上海',
    children: [
      { value: '浦东新区', label: '浦东新区' },
      { value: '黄浦区', label: '黄浦区' },
      { value: '徐汇区', label: '徐汇区' }
    ]
  },
  {
    value: '广州',
    label: '广州',
    children: [
      { value: '天河区', label: '天河区' },
      { value: '海珠区', label: '海珠区' },
      { value: '越秀区', label: '越秀区' }
    ]
  }
])

// 客户列表状态
const loading = ref(false)
const customerList = ref([])
const totalResults = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const lastValues = ref(null)

// 客户详情相关
const customerDetailVisible = ref(false)
const currentCustomer = ref(null)

// 处理页面事件
const goBack = () => {
  router.push('/home')
}

// 处理时间范围变化
const handleTimeRangeChange = (val) => {
  if (val && val.length === 2) {
    searchForm.start_time = val[0]
    searchForm.end_time = val[1]
  } else {
    searchForm.start_time = null
    searchForm.end_time = null
  }
}

// 处理风险等级范围变化
const handleRiskRangeChange = (val) => {
  searchForm.risk_level_min = val[0]
  searchForm.risk_level_max = val[1]
}

// 切换排序顺序
const toggleSortOrder = (sortRule) => {
  sortRule.order = sortRule.order === 'desc' ? 'asc' : 'desc'
}

// 获取排序字段显示名称
const getSortFieldLabel = (field) => {
  const fieldMap = {
    'is_vip': 'VIP状态',
    'score': '综合评分',
    'last_active_time': '最近活跃时间'
  }
  return fieldMap[field] || field
}

// 获取风险等级显示文本
const getRiskLevelText = (level) => {
  const levelMap = {
    1: '极低',
    2: '低',
    3: '中等',
    4: '高',
    5: '极高'
  }
  return levelMap[level] || '未知'
}

// 获取风险等级标签类型
const getRiskLevelType = (level) => {
  const typeMap = {
    1: 'success',
    2: 'info',
    3: 'warning',
    4: 'danger',
    5: 'danger'
  }
  return typeMap[level] || 'info'
}

// 格式化消费能力
const formatConsumption = (percentage) => {
  const level = Math.ceil(percentage / 20)
  return ['极低', '低', '中等', '高', '极高'][level - 1]
}

// 搜索客户
const searchCustomers = () => {
  loading.value = true
  
  setTimeout(() => {
    // 模拟数据
    customerList.value = [
      {
        id: '1001',
        name: '张三',
        is_vip: true,
        tags: ['高价值', 'VIP', '活跃'],
        score: 4.5,
        risk_level: 1,
        last_active_time: '2023-10-15 14:30:22',
        location: '北京 朝阳区',
        register_time: '2022-01-15',
        consumption_ability: 4
      },
      {
        id: '1002',
        name: '李四',
        is_vip: false,
        tags: ['新客户', '潜力'],
        score: 3.5,
        risk_level: 2,
        last_active_time: '2023-10-12 09:15:43',
        location: '上海 浦东新区',
        register_time: '2023-05-20',
        consumption_ability: 3
      },
      {
        id: '1003',
        name: '王五',
        is_vip: false,
        tags: ['老客户', '流失风险'],
        score: 2.5,
        risk_level: 4,
        last_active_time: '2023-09-25 16:40:11',
        location: '广州 天河区',
        register_time: '2021-11-05',
        consumption_ability: 2
      }
    ]
    totalResults.value = 3
    loading.value = false
  }, 500)
}

// 刷新结果
const refreshResults = () => {
  searchCustomers()
}

// 导出结果
const exportResults = () => {
  ElMessageBox.confirm('确定要导出当前查询结果吗?', '导出确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage({
      type: 'success',
      message: '导出任务已提交，请稍后查看下载区'
    })
  }).catch(() => {})
}

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  // 实际应用中，这里需要设置 lastValues 进行查询
  searchCustomers()
}

// 查看客户详情
const viewDetail = (customer) => {
  currentCustomer.value = customer
  customerDetailVisible.value = true
}

// 编辑客户
const editCustomer = (customer) => {
  ElMessage.info('客户编辑功能开发中...')
  // 后续添加编辑功能
}

// 页面初始化
onMounted(() => {
  // 初始化查询
  searchCustomers()
})
</script>

<style lang="less" scoped>
.customer-profile-container {
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
    color: #409EFF;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    z-index: 10;
    border: 1px solid rgba(64, 158, 255, 0.2);
    transition: all 0.3s;
    
    &:hover {
      background: #ffffff;
      border-color: rgba(64, 158, 255, 0.4);
      box-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
    }
    
    .el-icon {
      font-size: 18px;
    }
    
    span {
      font-size: 16px;
    }
  }
  
  .page-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    padding-top: 30px;
    
    h1 {
      margin: 0;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #303133;
    }
  }
  
  .search-panel {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .sort-container {
      display: flex;
      align-items: center;
      
      .sort-title {
        margin-right: 10px;
        font-weight: bold;
      }
      
      .sort-item {
        display: flex;
        align-items: center;
        background-color: #f5f7fa;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        padding: 5px 10px;
        margin-right: 10px;
        
        span {
          margin: 0 8px;
        }
      }
    }
  }
  
  .result-panel {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
  
  .customer-detail {
    .chart-placeholder {
      background-color: #f9f9f9;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .chart-coming-soon {
        color: #909399;
        font-style: italic;
      }
    }
  }
}
</style> 