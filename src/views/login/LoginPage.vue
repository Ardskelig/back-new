<template>
    <div class="login-container">
      <el-card class="login-card">
        <h2 class="login-title">登录</h2>
        <el-form 
          :model="loginForm" 
          :rules="loginRules" 
          ref="loginFormRef"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="did" label="did">
            <el-input
              v-model="loginForm.did"
              placeholder="请输入您的DID"
              clearable
              class="input-field"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
  
          <el-button 
            type="primary" 
            native-type="submit"
            class="login-btn"
            :loading="loading"
          >
            登录
          </el-button>
  
          <div class="register-link">
            <span>没有账号？</span>
            <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import {useUserStore} from '@/stores/counter.js'

const userStore =useUserStore()

  const router = useRouter()
  const loginFormRef = ref(null)
  const loading = ref(false)
  
  const loginForm = ref({
    did: ''
  })
  
  const loginRules = {
    did: [
      { required: true, message: '请输入DID', trigger: 'blur' },
      { min: 10, max: 100, message: '长度在10到50个字符', trigger: 'blur' }
    ]
  }
  
  const handleLogin = async () => {
    try {
      await loginFormRef.value.validate()
      loading.value = true
      // 调用登录接口
      // const res = await api.login(loginForm.value)
      console.log("输入的did",loginForm.value.did)
      ElMessage.success('登录成功')
      userStore.setUserDid(loginForm.value.did)
      console.log('打印pinia中的did',userStore.userDid)
      router.push('/')
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  /* Login container styling */
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #6b7aff, #4c56d1); /* Gradient background */
  }
  
  /* Card styling */
  .login-card {
    width: 380px;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background: #ffffff;
  }
  
  /* Title styling */
  .login-title {
    font-size: 24px;
    color: #333;
    text-align: center;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  /* Input field styling */
  .input-field {
    border-radius: 8px;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  /* Button styling */
  .login-btn {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    background: #4c56d1;
    color: white;
    font-weight: bold;
    transition: background-color 0.3s;
  }
  
  .login-btn:hover {
    background: #3a47a0;
  }
  
  /* Register link container styling */
.register-link {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-link span {
  color: #555;
  margin-right: 5px; /* Slight spacing between the text and the link */
}

.register-link el-link {
  font-size: 14px;
  font-weight: bold;
}
</style>
  