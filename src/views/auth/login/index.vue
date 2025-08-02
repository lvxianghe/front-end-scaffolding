<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <router-link to="/" class="back-home">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </router-link>
      </div>
      
      <div class="login-form-wrapper">
        <div class="login-form-header">
          <h1 class="login-title">欢迎回来</h1>
          <p class="login-subtitle">登录你的账户</p>
        </div>
        
        <LoginForm @success="handleLoginSuccess" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';
import LoginForm from '@/components/business/LoginForm.vue';

const router = useRouter();

const handleLoginSuccess = () => {
  ElMessage.success('登录成功');
  router.push('/');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-header {
  margin-bottom: 40px;
}

.back-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.back-home:hover {
  color: white;
}

.login-form-wrapper {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.login-form-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}
</style>
