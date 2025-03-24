<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 登录/注册表单区域 -->
      <div class="login-form">
        <h2 class="welcome-text">{{ isLogin ? '吕相赫的前端世界' : '用户注册' }}</h2>
        
        <!-- 登录类型切换 - 仅在登录模式显示 -->
        <div v-if="isLogin" class="login-type-switch">
          <div 
            v-for="type in loginTypes" 
            :key="type.key"
            :class="['type-item', { active: currentType === type.key }]"
            @click="currentType = type.key"
          >
            <el-icon>
              <component :is="type.icon" />
            </el-icon>
            {{ type.label }}
          </div>
        </div>
        
        <!-- 登录表单内容区域 -->
        <div class="form-content-wrapper">
          <!-- 登录表单 - 密码登录 -->
          <div v-if="isLogin && currentType === 'password'" class="login-form-content">
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef">
              <el-form-item prop="username">
                <el-input 
                  v-model="passwordForm.username"
                  placeholder="请输入用户名"
                  :prefix-icon="User"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input 
                  v-model="passwordForm.password"
                  type="password"
                  placeholder="请输入密码"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 扫码登录 -->
          <div v-else-if="isLogin && currentType === 'qrcode'" class="qrcode-content">
            <div class="qrcode-box">
              <div class="qrcode-placeholder"></div>
            </div>
            <p class="qrcode-tip">请使用手机扫码登录</p>
          </div>
          
          <!-- 验证码登录 -->
          <div v-else-if="isLogin && currentType === 'captcha'" class="login-form-content">
            <el-form :model="captchaForm" :rules="captchaRules" ref="captchaFormRef">
              <el-form-item prop="phone">
                <el-input 
                  v-model="captchaForm.phone"
                  placeholder="手机/邮箱"
                  :prefix-icon="Iphone"
                />
              </el-form-item>
              <el-form-item prop="code" class="verification-code">
                <div class="code-input-group">
                  <input
                    v-for="(digit, index) in 6"
                    :key="index"
                    type="text"
                    maxlength="1"
                    v-model="captchaForm.codeArray[index]"
                    @input="handleCodeInput($event, index)"
                    @keydown.delete="handleBackspace($event, index)"
                    @keydown="handleKeydown($event)"
                    ref="codeInputs"
                  >
                </div>
                <el-button 
                  class="send-btn"
                  :disabled="counting > 0"
                  @click="sendCaptcha"
                >
                  {{ counting > 0 ? `${counting}s` : '获取验证码' }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 第三方登录 -->
          <div v-else-if="isLogin && currentType === 'oauth'" class="oauth-content">
            <div class="oauth-list">
              <div class="oauth-item" v-for="oauth in oauthList" :key="oauth.key">
                <el-icon>
                  <component :is="oauth.icon" />
                </el-icon>
                <span>{{ oauth.label }}</span>
              </div>
            </div>
          </div>
          
          <!-- 注册表单 -->
          <el-form 
            v-else
            :model="registerForm" 
            :rules="registerRules" 
            ref="registerFormRef"
            label-position="top"
            class="register-form-content"
          >
            <!-- 账号和姓名一行 -->
            <div class="form-row">
              <el-form-item prop="username" label="账号" class="form-col">
                <el-input 
                  v-model="registerForm.username"
                  placeholder="请输入账号"
                  :prefix-icon="User"
                />
              </el-form-item>
              
              <el-form-item prop="name" label="姓名" class="form-col">
                <el-input 
                  v-model="registerForm.name"
                  placeholder="请输入姓名"
                  :prefix-icon="UserFilled"
                />
              </el-form-item>
            </div>
            
            <!-- 密码和确认密码一行 -->
            <div class="form-row">
              <el-form-item prop="password" label="密码" class="form-col">
                <el-input 
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入密码"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
              
              <el-form-item prop="confirmPassword" label="确认密码" class="form-col">
                <el-input 
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
            </div>
            
            <!-- 性别和手机号码一行 -->
            <div class="form-row">
              <el-form-item prop="gender" label="性别" class="form-col">
                <div class="gender-selector">
                  <div 
                    class="gender-option" 
                    :class="{ active: registerForm.gender === 1 }"
                    @click="registerForm.gender = 1"
                  >
                    <el-icon><Male /></el-icon>
                    <span>男</span>
                  </div>
                  <div 
                    class="gender-option" 
                    :class="{ active: registerForm.gender === 2 }"
                    @click="registerForm.gender = 2"
                  >
                    <el-icon><Female /></el-icon>
                    <span>女</span>
                  </div>
                </div>
              </el-form-item>
              
              <el-form-item prop="phone" label="手机号码" class="form-col">
                <el-input 
                  v-model="registerForm.phone"
                  placeholder="请输入手机号码"
                  :prefix-icon="Iphone"
                />
              </el-form-item>
            </div>
          </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button 
            type="primary" 
            class="login-btn"
            @click="isLogin ? handleLogin() : handleRegister()"
          >
            {{ isLogin ? '登录' : '注册' }}
          </el-button>
        </div>
        
        <!-- 其他操作 - 仅在登录模式显示 -->
        <div v-if="isLogin" class="other-operations">
          <el-button class="side-btn forget-btn" @click="handleForgetPwd">
            <el-icon><Warning /></el-icon>
            忘记密码？
          </el-button>
          <el-button class="guest-btn" @click="handleGuestLogin">游客登录</el-button>
          <el-button class="side-btn register-btn" @click="switchMode">
            <span>注册账号</span>
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        
        <!-- 返回登录 - 仅在注册模式显示 -->
        <div v-else class="other-operations" style="justify-content: center;">
          <el-button class="back-login-btn" @click="switchMode">
            <el-icon><ArrowLeft /></el-icon>
            已有账号？返回登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { login, register } from '@/api/user'
import { ElMessage } from 'element-plus'
import { 
  User, Lock, UserFilled, Iphone, Male, Female, 
  ArrowLeft, ArrowRight, Check, Warning 
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const passwordFormRef = ref(null)
const captchaFormRef = ref(null)
const registerFormRef = ref(null)

// 根据路由参数设置初始显示模式
const isLogin = ref(!(route.name === 'Register' || route.query.register === 'true'))

// 登录方式的图标配置
const loginTypes = [
  { key: 'password', label: '密码登录', icon: 'Lock' },
  { key: 'qrcode', label: '扫码登录', icon: 'Crop' },
  { key: 'captcha', label: '验证码登录', icon: 'Message' },
  { key: 'oauth', label: '第三方登录', icon: 'Connection' }
]
const currentType = ref('password')

// 密码登录表单
const passwordForm = reactive({
  username: '',
  password: ''
})

// 验证码表单
const captchaForm = reactive({
  phone: '',
  code: '',
  codeArray: ['', '', '', '', '', ''] // 用于存储6个数字
})

// 注册表单数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  gender: 1,
  phone: ''
})

// 第三方登录选项
const oauthList = [
  { key: 'google', label: 'Google', icon: 'Connection' },
  { key: 'github', label: 'GitHub', icon: 'Connection' },
  { key: 'wechat', label: '微信', icon: 'Message' }
]

// 验证码倒计时
const counting = ref(0)
const sendCaptcha = () => {
  counting.value = 60
  const timer = setInterval(() => {
    counting.value--
    if (counting.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 处理验证码输入
const codeInputs = ref([]) // 用于存储输入框引用

const handleCodeInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // 只允许输入数字
  if (!/^\d*$/.test(value)) {
    captchaForm.codeArray[index] = ''
    return
  }

  // 自动跳转到下一个输入框
  if (value && index < 5) {
    (codeInputs.value[index + 1] as HTMLInputElement)?.focus()
  }

  // 更新完整的验证码
  captchaForm.code = captchaForm.codeArray.join('')
}

const handleBackspace = (event: KeyboardEvent, index: number) => {
  if (!captchaForm.codeArray[index] && index > 0) {
    captchaForm.codeArray[index - 1] = ''
    ;(codeInputs.value[index - 1] as HTMLInputElement)?.focus()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // 阻止非数字输入
  if (!/^\d$/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault()
  }
}

// 切换登录/注册模式
const switchMode = () => {
  isLogin.value = !isLogin.value
}

// 登录处理
const handleLogin = async () => {
  try {
    if (currentType.value === 'password') {
      // 直接调用 login 接口
      const res = await login({
        loginId: passwordForm.username,
        password: passwordForm.password,
        loginType: 1
      })
      
      // 根据实际响应格式判断是否登录成功
      if (res && (res.code === "请求成功" || res.message === "登录成功")) {
        // 登录成功，保存token（如果有的话）
        if (res.data) {
          localStorage.setItem('token', res.data)
        }
        
        // 从 document.cookie 中提取 satoken
        const cookies = document.cookie.split(';')
        const satoken = cookies.find(cookie => cookie.trim().startsWith('satoken='))
        if (satoken) {
          const tokenValue = satoken.trim().substring('satoken='.length)
          localStorage.setItem('satoken', tokenValue)
          console.log('Saved satoken to localStorage:', tokenValue)
        } else {
          console.warn('satoken not found in cookies')
        }
        
        // 跳转到首页
        router.push('/home')
        ElMessage.success('登录成功')
      } else {
        // 登录失败
        ElMessage.error((res && res.message) || '登录失败')
      }
    } else if (currentType.value === 'captcha') {
      // 处理验证码登录
      // ...
    } else if (currentType.value === 'oauth') {
      // 处理第三方登录
      // ...
    }
  } catch (error: any) {
    console.error(error)
    ElMessage.error(error.message || '登录失败，请稍后重试')
  }
}

// 游客登录处理函数
const handleGuestLogin = () => {
  // 设置游客身份标识
  localStorage.setItem('userRole', 'guest')
  
  // 直接跳转到首页，而不是根路径
  router.push('/home')
}

// 注册处理
const handleRegister = async () => {
  try {
    // 表单验证
    await registerFormRef.value.validate()
    
    // 调用注册接口
    const res = await register({
      username: registerForm.username,
      password: registerForm.password,
      name: registerForm.name,
      gender: registerForm.gender,
      phone: registerForm.phone
    })
    
    // 根据实际响应格式判断是否注册成功
    if (res && (res.code === "请求成功" || res.message === "注册成功")) {
      ElMessage.success('注册成功，请登录')
      // 注册成功后切换到登录
      isLogin.value = true
    } else {
      // 注册失败
      ElMessage.error((res && res.message) || '注册失败')
    }
  } catch (error: any) {
    console.error(error)
    ElMessage.error(error.message || '注册失败，请稍后重试')
  }
}

// 处理忘记密码
const handleForgetPwd = () => {
  ElMessage.info('忘记密码功能开发中')
}

// 在组件挂载时检查路由
onMounted(() => {
  // 如果是从register路由进入，显示注册表单
  if (route.name === 'Register' || route.query.register === 'true') {
    isLogin.value = false
  }
})

// 注册表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 4, max: 20, message: '账号长度应为4-20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '账号只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度应为2-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/, 
      message: '密码必须包含大小写字母和数字', 
      trigger: 'blur' 
    }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6C7BFF 0%, #2CD9FF 100%);
  position: relative;
  overflow: hidden;
  
  // 背景装饰
  &::before, &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
  }

  &::before {
    background: #FF7C9C;
    top: -100px;
    left: -100px;
  }

  &::after {
    background: #6C7BFF;
    bottom: -100px;
    right: -100px;
  }
  
  .login-box {
    width: 520px;
    height: 600px; /* 使用固定高度而不是min-height */
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 40px 50px;
    position: relative;
    z-index: 1;
    overflow: hidden; /* 防止内容溢出 */

    .login-form {
      height: 520px; /* 使用固定高度 */
      display: flex;
      flex-direction: column;
      
      /* 添加过渡效果 */
      .form-content-wrapper {
        flex: 1;
        position: relative;
        overflow: hidden;
        
        /* 所有表单内容的共同样式 */
        .login-form-content,
        .qrcode-content,
        .oauth-content,
        .register-form-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: all 0.3s ease;
          overflow-y: auto; /* 允许内容滚动 */
          
          /* 隐藏滚动条但保留功能 */
          &::-webkit-scrollbar {
            width: 0;
            background: transparent;
          }
        }
      }

      .welcome-text {
        font-size: 32px;
        background: linear-gradient(135deg, #6C7BFF 0%, #2CD9FF 100%);
        -webkit-background-clip: text;
        color: transparent;
        margin-bottom: 40px;
        font-weight: 700;
        text-align: center;
      }

      .login-type-switch {
        display: flex;
        gap: 8px;
        margin-bottom: 30px;
        padding: 6px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 16px;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(108, 123, 255, 0.1);

        .type-item {
          flex: 1;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #666;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          font-size: 13px;
          
          // 添加回激活状态样式
          &.active {
            color: #fff;
            box-shadow: 0 2px 8px rgba(108, 123, 255, 0.15);

            &:nth-child(1) {
              background: linear-gradient(135deg, #6C7BFF 0%, #2CD9FF 100%);
            }
            &:nth-child(2) {
              background: linear-gradient(135deg, #FF7C9C 0%, #FFA07A 100%);
            }
            &:nth-child(3) {
              background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
            }
            &:nth-child(4) {
              background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
            }
          }

          // 添加回悬浮状态样式
          &:hover:not(.active) {
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }

          .el-icon {
            margin: 0;
            font-size: 14px;
          }
        }
      }

      .login-form-content,
      .qrcode-content,
      .oauth-content {
        flex: none;
        height: 280px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin-bottom: 30px;
      }

      .login-form-content {
        .el-input {
          :deep(.el-input__wrapper) {
            height: 46px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(108, 123, 255, 0.2);
            transition: all 0.3s;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            
            &:hover, &.is-focus {
              border-color: #6C7BFF;
              box-shadow: 0 4px 12px rgba(108, 123, 255, 0.15);
            }

            .el-input__inner {
              font-size: 15px;
              color: #333;
              
              &::placeholder {
                color: #999;
              }
            }
          }
        }
      }

      .verification-code {
        :deep(.el-form-item__content) {
          display: flex;
          gap: 12px;
        }

        .code-input-group {
          flex: 1;
          display: flex;
          gap: 8px;

          input {
            flex: 1;
            width: 0; // 让所有输入框等宽
            height: 46px;
            text-align: center;
            font-size: 20px;
            font-weight: 600;
            color: #333;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(108, 123, 255, 0.2);
            border-radius: 8px;
            transition: all 0.3s;
            outline: none;
            
            &:focus {
              border-color: #6C7BFF;
              box-shadow: 0 4px 12px rgba(108, 123, 255, 0.15);
            }

            // 禁用上下箭头
            &::-webkit-inner-spin-button,
            &::-webkit-outer-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
          }
        }

        .send-btn {
          width: 120px;
          height: 46px;
          background: linear-gradient(135deg, #6C7BFF 0%, #2CD9FF 100%);
          border: none;
          color: white;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.3s;
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(108, 123, 255, 0.3);
          }
          
          &:disabled {
            background: rgba(108, 123, 255, 0.5);
            cursor: not-allowed;
          }
        }
      }

      .qrcode-content {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;

        .qrcode-box {
          width: 200px;
          height: 200px;
          margin: 0;
          margin-bottom: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          border: 1px solid rgba(108, 123, 255, 0.2);
          transition: all 0.3s;

          .qrcode-placeholder {
            width: 100%;
            height: 100%;
            background: rgba(108, 123, 255, 0.1);
            border-radius: 12px;
          }

          &:hover {
            border-color: #6C7BFF;
            box-shadow: 0 4px 12px rgba(108, 123, 255, 0.15);
          }
        }

        .qrcode-tip {
          color: #666;
          font-size: 14px;
          text-align: center;
        }
      }

      .oauth-content {
        .oauth-list {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 20px;
          flex-wrap: wrap;

          .oauth-item {
            flex: 0 0 auto;
            width: 100px;
            padding: 20px 10px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
            border: 1px solid rgba(108, 123, 255, 0.1);

            .el-icon {
              font-size: 24px;
              color: #6C7BFF;
              margin-bottom: 8px;
            }

            span {
              display: block;
              color: #666;
              font-size: 13px;
              white-space: nowrap;
            }

            &:hover {
              background: rgba(255, 255, 255, 0.95);
              transform: translateY(-2px);
              border-color: rgba(108, 123, 255, 0.3);
            }
          }
        }
      }

      .login-btn {
        width: 100%;
        height: 48px;
        margin-top: auto;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #6C7BFF 0%, #2CD9FF 100%);
        border: none;
        border-radius: 12px;
        color: white;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(108, 123, 255, 0.3);
        }
      }

      .other-operations {
        display: flex;
        justify-content: space-between; /* 两侧对齐 */
        align-items: center;
        margin-top: 20px;
        padding: 0 10px;
        height: 36px; /* 固定高度 */
        
        /* 侧边按钮通用样式 - 用于忘记密码和注册账号 */
        .side-btn {
          height: 32px;
          padding: 0 12px;
          background: white;
          border: 1px solid rgba(108, 123, 255, 0.3);
          color: #6C7BFF;
          font-weight: 500;
          border-radius: 16px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          
          .el-icon {
            font-size: 14px;
          }
          
          &:hover {
            background: rgba(108, 123, 255, 0.05);
            border-color: #6C7BFF;
          }
        }
        
        /* 忘记密码按钮 */
        .forget-btn {
          .el-icon {
            color: #FF9800;
          }
        }
        
        /* 注册按钮 */
        .register-btn {
          .el-icon {
            color: #4CAF50;
          }
        }
        
        /* 游客登录按钮 - 恢复原样 */
        .guest-btn {
          height: 36px;
          padding: 0 24px;
          background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
          border: none;
          color: white;
          font-weight: 500;
          border-radius: 18px;
          transition: all 0.3s;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
          }
          
          &:active {
            transform: translateY(0);
          }
        }
      }
    }
  }
}

/* 返回登录按钮 - 单独样式，居中显示 */
.back-login-btn {
  height: 40px;
  padding: 0 25px;
  background: linear-gradient(135deg, #FF9800 0%, #FFC107 100%);
  border: none;
  color: white;
  font-weight: 500;
  border-radius: 20px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto; /* 居中显示 */
  
  .el-icon {
    font-size: 16px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
}

/* 调整性别和手机号码一行的比例 */
.register-form-content {
  .form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 12px; /* 减少底部间距，使表单更紧凑 */
    
    .form-col {
      flex: 1;
      
      /* 优化表单项标签样式 */
      :deep(.el-form-item__label) {
        font-weight: 500;
        color: #333;
        padding-bottom: 4px; /* 减少标签与输入框的间距 */
        line-height: 1.2; /* 减少行高 */
        font-size: 14px; /* 稍微减小字体 */
      }
      
      /* 优化输入框样式 */
      :deep(.el-input__wrapper) {
        height: 42px; /* 稍微减小高度 */
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(108, 123, 255, 0.2);
        transition: all 0.3s;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        
        &:hover, &.is-focus {
          border-color: #6C7BFF;
          box-shadow: 0 4px 12px rgba(108, 123, 255, 0.15);
        }
      }
      
      /* 减少表单项底部边距 */
      :deep(.el-form-item) {
        margin-bottom: 10px;
      }
    }
    
    /* 性别和手机号码一行的特殊处理 */
    &:last-child {
      .form-col {
        &:first-child {
          flex: 0.6; /* 进一步减小性别列宽度 */
        }
        
        &:last-child {
          flex: 1.4; /* 进一步增加手机号码列宽度 */
        }
      }
    }
  }
}

/* 增加性别选择器按钮宽度 */
.gender-selector {
  display: flex;
  gap: 8px;
  width: 100%;
  
  .gender-option {
    flex: 1;
    height: 42px;
    min-width: 100px; /* 进一步增加最小宽度 */
    max-width: 130px; /* 进一步增加最大宽度 */
    border: 1px solid rgba(108, 123, 255, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    padding: 0 15px; /* 增加内边距 */
    
    .el-icon {
      margin-right: 10px; /* 增加图标与文字的间距 */
      font-size: 18px;
    }
    
    span {
      font-size: 15px;
      font-weight: 500; /* 加粗文字 */
    }
    
    &:hover {
      border-color: #6C7BFF;
      background: rgba(108, 123, 255, 0.05);
    }
    
    &.active {
      background: rgba(108, 123, 255, 0.15);
      border-color: #6C7BFF;
      box-shadow: 0 2px 8px rgba(108, 123, 255, 0.2);
      
      &:first-child { /* 男性选项 */
        background: rgba(0, 122, 255, 0.15);
        border-color: #007AFF;
        
        .el-icon, span {
          color: #007AFF;
        }
      }
      
      &:last-child { /* 女性选项 */
        background: rgba(255, 45, 85, 0.15);
        border-color: #FF2D55;
        
        .el-icon, span {
          color: #FF2D55;
        }
      }
    }
  }
}
</style>