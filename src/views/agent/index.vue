<template>
  <div class="agent-page">
    <AppHeader />
    <main class="main-content">
      <div class="page-header">
        <el-button @click="goBack" :icon="ArrowLeft">返回首页</el-button>
        <h1 class="page-title">AI助手</h1>
      </div>
      <div class="content-area">
        <p class="coming-soon">功能开发中，敬请期待...</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';
import AppHeader from '@/components/layout/Header/index.vue';

const router = useRouter();

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.agent-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.main-content {
  padding-top: 64px;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

.page-header {
  padding: 32px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 16px 0 0 0;
}

.content-area {
  padding: 40px 0;
  text-align: center;
}

.coming-soon {
  font-size: 18px;
  color: #666;
  margin: 0;
}
</style>
