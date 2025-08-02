<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Logo区域 -->
      <div class="logo-section">
        <router-link to="/" class="logo">
          <span class="logo-text">吕相赫</span>
        </router-link>
      </div>
      
      <!-- 右侧操作区 -->
      <div class="action-section">
        <el-button 
          type="primary" 
          @click="goToLogin"
          class="login-btn"
        >
          登录
        </el-button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section .logo {
  text-decoration: none;
  color: #1a1a1a;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.login-btn {
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 500;
}
</style> 