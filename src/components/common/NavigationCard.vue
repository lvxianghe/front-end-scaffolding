<template>
  <div 
    class="navigation-card"
    :class="{ 
      'card-active': status === 'active',
      'card-developing': status === 'developing'
    }"
    @click="handleClick"
  >
    <div class="card-icon">{{ icon }}</div>
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-description">{{ description }}</p>
    
    <div class="card-status" v-if="status === 'developing'">
      <el-tag type="info" size="small">开发中</el-tag>
    </div>
    
    <div class="card-arrow" v-if="status === 'active'">
      <el-icon><DArrowRight /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DArrowRight } from '@element-plus/icons-vue';

interface Props {
  title: string;
  description: string;
  icon: string;
  route: string;
  status: 'active' | 'developing';
}

interface Emits {
  click: [route: string, status: string];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleClick = () => {
  emit('click', props.route, props.status);
};
</script>

<style scoped>
.navigation-card {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.card-active:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

.card-developing {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-developing:hover {
  transform: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.card-status {
  margin-top: 16px;
}

.card-arrow {
  position: absolute;
  top: 24px;
  right: 24px;
  color: #c0c4cc;
  transition: all 0.3s ease;
}

.card-active:hover .card-arrow {
  color: #409eff;
  transform: translateX(4px);
}
</style> 