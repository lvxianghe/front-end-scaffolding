<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 登录表单区域 -->
      <div class="login-form">
        <h2 class="welcome-text">吕相赫的前端世界</h2>
        <div class="login-type-switch">
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

        <!-- 密码登录 -->
        <div v-if="currentType === 'password'" class="login-form-content">
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
        <div v-else-if="currentType === 'qrcode'" class="qrcode-content">
          <div class="qrcode-box">
            <div class="qrcode-placeholder"></div>
          </div>
          <p class="qrcode-tip">请使用手机扫码登录</p>
        </div>

        <!-- 验证码登录 -->
        <div v-else-if="currentType === 'captcha'" class="login-form-content">
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
        <div v-else class="oauth-content">
          <div class="oauth-list">
            <div class="oauth-item" v-for="oauth in oauthList" :key="oauth.key">
              <el-icon>
                <component :is="oauth.icon" />
              </el-icon>
              <span>{{ oauth.label }}</span>
            </div>
          </div>
        </div>

        <!-- 登录按钮 -->
        <el-button 
          type="primary" 
          class="login-btn"
          @click="handleLogin"
        >
          登录
        </el-button>

        <!-- 其他操作 -->
        <div class="other-operations">
          <span class="forget-pwd" @click="handleForgetPwd">忘记密码？</span>
          <el-button class="guest-btn" @click="handleGuestLogin">游客登录</el-button>
          <span class="register" @click="handleRegister">注册账号</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { login } from '@/api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 修改登录方式的图标配置，直接使用字符串形式的图标名
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

// 修改验证码表单
const captchaForm = reactive({
  phone: '',
  code: '',
  codeArray: ['', '', '', '', '', ''] // 用于存储6个数字
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

// 恢复原始登录处理函数
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

// 修改游客登录处理函数
const handleGuestLogin = () => {
  // 设置游客身份标识
  localStorage.setItem('userRole', 'guest')
  
  // 直接跳转到首页，而不是根路径
  router.push('/home')
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
    min-height: 600px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 40px 50px;
    position: relative;
    z-index: 1;

    .login-form {
      min-height: 520px;
      display: flex;
      flex-direction: column;

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
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding: 0 10px;

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

        span {
          font-size: 14px;
          color: rgba(108, 123, 255, 0.8);
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            color: #6C7BFF;
            text-shadow: 0 0 8px rgba(108, 123, 255, 0.3);
          }
        }
      }
    }
  }
}
</style>