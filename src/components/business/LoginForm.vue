<template>
  <el-form
    ref="formRef"
    :model="loginForm"
    :rules="rules"
    class="login-form"
    size="large"
  >
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        placeholder="用户名或邮箱"
        :prefix-icon="User"
      />
    </el-form-item>
    
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        placeholder="密码"
        :prefix-icon="Lock"
        show-password
      />
    </el-form-item>
    
    <el-form-item>
      <el-button
        type="primary"
        class="login-button"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ loading ? '登录中...' : '登录' }}
      </el-button>
    </el-form-item>
    
    <div class="form-footer">
      <el-link type="primary">忘记密码？</el-link>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';

interface LoginFormData {
  username: string;
  password: string;
}

interface Emits {
  success: [];
}

const emit = defineEmits<Emits>();

const formRef = ref<FormInstance>();
const loading = ref(false);

const loginForm = reactive<LoginFormData>({
  username: '',
  password: ''
});

const rules: FormRules<LoginFormData> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    loading.value = true;
    
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    emit('success');
  } catch (error) {
    console.error('登录失败:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-form {
  width: 100%;
}

.login-button {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-weight: 500;
}

.form-footer {
  text-align: center;
  margin-top: 16px;
}
</style> 