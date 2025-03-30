<template>
  <div class="rank-list-container">
    <div class="rank-list-header">
      <h3>{{ title }}</h3>
      <div class="rank-list-tabs">
        <el-radio-group v-model="currentTab" size="large">
          <el-radio-button v-for="tab in tabs" :key="tab.value" :label="tab.value">
            {{ tab.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
    
    <div class="rank-list-content">
      <el-table
        :data="currentData"
        :height="tableHeight"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @row-click="handleRowClick"
      >
        <el-table-column label="排名" width="80">
          <template #default="scope">
            <div class="rank-cell">
              <div v-if="scope.row.rank <= 3" class="rank-medal" :class="`medal-${scope.row.rank}`">
                {{ scope.row.rank }}
              </div>
              <span v-else>{{ scope.row.rank }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="头像" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" :size="50">
              {{ scope.row.name.slice(0, 1) }}
            </el-avatar>
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        
        <el-table-column prop="department" label="部门"></el-table-column>
        
        <el-table-column prop="score" label="得分" width="100">
          <template #default="scope">
            <span class="score-value">{{ scope.row.score }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="同比增长" width="120">
          <template #default="scope">
            <div class="trend">
              <el-icon v-if="scope.row.growth > 0" color="#67c23a"><ArrowUp /></el-icon>
              <el-icon v-else-if="scope.row.growth < 0" color="#f56c6c"><ArrowDown /></el-icon>
              <span :style="{ color: scope.row.growth > 0 ? '#67c23a' : scope.row.growth < 0 ? '#f56c6c' : '#909399' }">
                {{ Math.abs(scope.row.growth) }}%
              </span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button 
              type="primary" 
              link 
              @click.stop="viewProfile(scope.row)" 
              class="view-profile-btn"
            >
              查看主页
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  title: {
    type: String,
    default: '排行榜'
  },
  tabs: {
    type: Array,
    default: () => [
      { label: '总榜', value: 'total' },
      { label: '分行榜', value: 'branch' },
      { label: '支行榜', value: 'sub' }
    ]
  },
  totalData: {
    type: Array,
    default: () => []
  },
  branchData: {
    type: Array,
    default: () => []
  },
  subData: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['view-profile'])

const currentTab = ref('total')
const tableHeight = ref('500px')

// 根据当前选中的标签返回相应数据
const currentData = computed(() => {
  switch (currentTab.value) {
    case 'total':
      return props.totalData
    case 'branch':
      return props.branchData
    case 'sub':
      return props.subData
    default:
      return []
  }
})

// 表格行样式
const tableRowClassName = ({row, rowIndex}) => {
  if (row.rank <= 3) {
    return `top-${row.rank}-row`
  }
  return ''
}

// 点击行
const handleRowClick = (row) => {
  viewProfile(row)
}

// 查看个人资料
const viewProfile = (row) => {
  emit('view-profile', row)
}

// 在组件挂载时根据窗口大小设置表格高度
onMounted(() => {
  const setTableHeight = () => {
    const windowHeight = window.innerHeight
    tableHeight.value = `${windowHeight * 0.6}px`
  }
  
  setTableHeight()
  window.addEventListener('resize', setTableHeight)
})
</script>

<style lang="less" scoped>
.rank-list-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  
  .rank-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 20px;
      color: #303133;
    }
    
    .rank-list-tabs {
      .el-radio-button {
        min-width: 80px;
      }
    }
  }
  
  .rank-list-content {
    :deep(.el-table) {
      border-radius: 8px;
      overflow: hidden;
      
      .el-table__header-wrapper {
        th {
          background-color: #f5f7fa;
          color: #606266;
          font-weight: 600;
        }
      }
      
      .top-1-row td {
        background-color: rgba(255, 215, 0, 0.1);
      }
      
      .top-2-row td {
        background-color: rgba(192, 192, 192, 0.1);
      }
      
      .top-3-row td {
        background-color: rgba(205, 127, 50, 0.1);
      }
      
      .el-table__row {
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }
  
  .rank-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    
    .rank-medal {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      
      &.medal-1 {
        background: linear-gradient(135deg, #FFD700, #FFA500);
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
      }
      
      &.medal-2 {
        background: linear-gradient(135deg, #C0C0C0, #A9A9A9);
        box-shadow: 0 0 10px rgba(192, 192, 192, 0.5);
      }
      
      &.medal-3 {
        background: linear-gradient(135deg, #CD7F32, #A0522D);
        box-shadow: 0 0 10px rgba(205, 127, 50, 0.5);
      }
    }
  }
  
  .score-value {
    font-weight: bold;
    color: #409EFF;
  }
  
  .trend {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .view-profile-btn {
    padding: 0;
  }
}
</style> 