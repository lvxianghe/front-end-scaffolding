<template>
  <div class="task-card" @click="$emit('click')" :class="getRewardLevelClass(task.reward)">
    <div class="task-badge">
      <span v-if="getRewardLevel(task.reward) === 'SSR'" class="crown">👑</span>
      {{ getRewardLevel(task.reward) }}
    </div>
    <div class="task-header">
      <h3 class="task-title">{{ task.title }}</h3>
      <div class="task-reward">{{ task.reward }} <span>金币</span></div>
    </div>
    <div class="task-info">
      <div class="task-category">
        <el-tag :type="getCategoryType(task.category)">{{ getCategoryName(task.category) }}</el-tag>
      </div>
      <div class="task-status">
        <el-tag :type="getStatusType(task.status)">{{ getStatusName(task.status) }}</el-tag>
      </div>
    </div>
    <div class="task-description">{{ truncateText(task.description, 100) }}</div>
    <div class="task-footer">
      <div class="task-publisher">发布者: {{ task.publisher }}</div>
      <div class="task-deadline">截止日期: {{ formatDate(task.deadline) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

defineEmits(['click']);

// 根据悬赏金额获取等级
const getRewardLevel = (reward: number): string => {
  if (reward < 100) return 'C';
  if (reward < 200) return 'B';
  if (reward < 300) return 'A';
  if (reward < 500) return 'S';
  if (reward < 2000) return 'SS';
  return 'SSR';
};

// 根据悬赏金额获取等级类名
const getRewardLevelClass = (reward: number): string => {
  if (reward < 100) return 'level-c';
  if (reward < 200) return 'level-b';
  if (reward < 300) return 'level-a';
  if (reward < 500) return 'level-s';
  if (reward < 2000) return 'level-ss';
  return 'level-ssr';
};

const getCategoryName = (category: string): string => {
  const categories = {
    'development': '技术开发',
    'content': '内容创作',
    'design': '设计',
    'marketing': '市场',
    'other': '其他'
  };
  return categories[category] || '未知分类';
};

const getCategoryType = (category: string): string => {
  const types = {
    'development': 'primary',
    'content': 'success',
    'design': 'warning',
    'marketing': 'danger',
    'other': 'info'
  };
  return types[category] || 'info';
};

const getStatusName = (status: string): string => {
  const statuses = {
    'pending': '待认领',
    'in-progress': '进行中',
    'completed': '已完成'
  };
  return statuses[status] || '未知状态';
};

const getStatusType = (status: string): string => {
  const types = {
    'pending': 'warning',
    'in-progress': 'primary',
    'completed': 'success'
  };
  return types[status] || 'info';
};

const truncateText = (text: string, length: number): string => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '...' : text;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '无截止日期';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script>

<style lang="less" scoped>
.task-card {
  background-color: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 12px rgba(161, 124, 12, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid rgba(212, 175, 55, 0.3);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  min-height: 220px;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(161, 124, 12, 0.2);
    border-color: rgba(212, 175, 55, 0.5);
  }
  
  .task-badge {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(212, 175, 55, 0.9);
    color: white;
    font-weight: bold;
    padding: 2px 8px;
    font-size: 12px;
    border-bottom-left-radius: 6px;
    z-index: 1;
    
    .crown {
      margin-right: 2px;
    }
  }
  
  &.level-ssr {
    border: 3px solid #d4af37;
    background: linear-gradient(135deg, #fff 85%, rgba(212, 175, 55, 0.2));
    
    .task-badge {
      background-color: #d4af37;
    }
  }
  
  &.level-ss {
    border: 2px solid #d4af37;
    background: linear-gradient(135deg, #fff 90%, rgba(212, 175, 55, 0.1));
    
    .task-badge {
      background-color: rgba(212, 175, 55, 0.85);
    }
  }
  
  &.level-s {
    border: 2px solid rgba(212, 175, 55, 0.8);
    
    .task-badge {
      background-color: rgba(212, 175, 55, 0.8);
    }
  }
  
  &.level-a {
    border: 2px solid #9370DB;
    
    .task-badge {
      background-color: #9370DB;
    }
  }
  
  &.level-b {
    border: 2px solid #4169E1;
    
    .task-badge {
      background-color: #4169E1;
    }
  }
  
  &.level-c {
    border: 2px solid #E0E0E0;
    
    .task-badge {
      background-color: #E0E0E0;
      color: #666;
    }
  }
  
  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    
    .task-title {
      margin: 0;
      font-size: 16px;
      flex: 1;
      color: #8b6914;
      line-height: 1.3;
      max-height: 40px;
      overflow: hidden;
    }
    
    .task-reward {
      font-weight: bold;
      color: #d4af37;
      font-size: 16px;
      white-space: nowrap;
      
      span {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }
  
  .task-info {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }
  
  .task-description {
    color: #8b6914;
    margin-bottom: 8px;
    line-height: 1.4;
    font-size: 13px;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .task-footer {
    display: flex;
    justify-content: space-between;
    color: #a17c0c;
    font-size: 12px;
    margin-top: auto;
  }
}

/* 修改Element Plus标签样式 */
:deep(.el-tag--warning) {
  --el-tag-bg-color: rgba(212, 175, 55, 0.1);
  --el-tag-border-color: rgba(212, 175, 55, 0.2);
  --el-tag-text-color: #d4af37;
}
</style> 