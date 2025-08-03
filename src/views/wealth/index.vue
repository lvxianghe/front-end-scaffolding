<template>
  <div class="wealth-page">
    <AppHeader />
    <main class="main-content">
      <div class="page-header">
        <el-button @click="goBack" :icon="ArrowLeft">返回首页</el-button>
        <h1 class="page-title">财富管理</h1>
      </div>

      <div class="content-area">
        <div class="monitoring-grid">
          <!-- 标普500监控区块 -->
          <div class="grid-item sp500-section">
            <SP500Monitor />
          </div>

          <!-- A股指数监控区块 -->
          <div class="grid-item china-section">
            <ChinaIndexMonitor />
          </div>

          <!-- 预留其他监控区块 -->
          <div class="grid-item placeholder-section">
            <div class="placeholder-content">
              <el-icon size="48"><Money /></el-icon>
              <h3>加密货币监控</h3>
              <p>比特币、以太坊等数字货币实时行情</p>
            </div>
          </div>

          <div class="grid-item placeholder-section">
            <div class="placeholder-content">
              <el-icon size="48"><PieChart /></el-icon>
              <h3>投资组合分析</h3>
              <p>资产配置分析和风险评估</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeft, Money, PieChart } from "@element-plus/icons-vue";
import AppHeader from "@/components/layout/Header/index.vue";
import SP500Monitor from "./components/SP500Monitor.vue";
import ChinaIndexMonitor from "./components/ChinaIndexMonitor.vue";

const router = useRouter();

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.wealth-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: bold;
}

.content-area {
  width: 100%;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}

.grid-item {
  min-height: 400px;
}

.placeholder-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: #666;
}

.placeholder-content h3 {
  margin: 16px 0 8px 0;
  color: #333;
}

.placeholder-content p {
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .monitoring-grid {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 16px;
  }
}
</style>