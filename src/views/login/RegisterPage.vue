<template>
    <div class="login-container">
      <el-card class="login-card">
        <h2 class="login-title">注册</h2>
        <el-form :model="formData" ref="form" label-width="100px" class="register-form">
          <el-form-item label="组织名称" prop="orgName" :rules="[{ required: true, message: '请输入组织名称', trigger: 'blur' }]">
            <el-input v-model="formData.orgName" placeholder="请输入组织名称" />
          </el-form-item>
  
          <el-form-item label="申请人did" prop="did" :rules="[{ required: true, message: '请输入did', trigger: 'blur' }]">
            <el-input v-model="formData.did" placeholder="请输入组织名称" />
          </el-form-item>
  
          <el-form-item label="组织执照" prop="orgLicence" :rules="[{ required: true, message: '请上传组织执照', trigger: 'change' }]">
            <el-upload
              class="upload-demo"
              action="/api/file/upload"
              :on-success="handleLicenceUploadSuccess"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :http-request="customRequest"
            >
              <el-button>上传组织执照</el-button>
            </el-upload>
            <!-- 显示上传后的组织执照图片 -->
            <el-image v-if="formData.orgLicence" :src="formData.orgLicence" fit="contain" style="max-width: 200px; margin-top: 10px;" />
          </el-form-item>
  
          <el-form-item label="组织logo" prop="logo" :rules="[{ required: true, message: '请上传组织logo', trigger: 'change' }]">
            <el-upload
              class="upload-demo"
              action="/api/file/upload"
              :on-success="handleLogoUploadSuccess"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :http-request="customRequest"
            >
              <el-button>上传组织Logo</el-button>
            </el-upload>
            <!-- 显示上传后的logo图片 -->
            <el-image v-if="formData.logo" :src="formData.logo" fit="contain" style="max-width: 200px; margin-top: 10px;" />
          </el-form-item>
  
          
        </el-form>
        <div style="text-align: center;">
            <el-button type="primary" @click="handleRegister" >注册</el-button>
        </div>
        <el-link type="primary" @click="$router.push('/login')"><-返回登录</el-link>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { ElForm, ElFormItem, ElInput, ElButton, ElUpload, ElImage, ElMessage } from 'element-plus';
  import axios from 'axios';
  import instance from '@/utils/request';
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  
  const formData = ref({
    orgName: '呦西小厨',
    orgLicence: '',
    did: 'did:tdid:w1:0x6f4242b40bb6c98d1396860648dcf01b6a9c8b6a', // 示例 DID
    logo: ''
  });
  
  const form = ref(null);
  
  const handleLicenceUploadSuccess = (response, file) => {
    console.log("response11111111111111111",response)
    console.log(response, file);
    if (response ) {
      formData.value.orgLicence = response; // 保存组织执照的URL
    }
  };
  
  const handleLogoUploadSuccess = (response, file) => {
    if (response ) {
      formData.value.logo = response; // 保存logo的URL
    }
  };
  
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      ElMessage.error('上传文件只能是图片');
    }
    return isImage;
  };
  
  // 自定义上传请求
  const customRequest = async ({ file, onSuccess, onError }) =>  {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const res = await instance.post('/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.code === 1) {
        ElMessage.success('上传成功');
        onSuccess(res.data, file) // 返回上传成功后的URL
      } else {
        onError(res.data, file);
        ElMessage.error('上传失败');
      }
    } catch (error) {
      onError(error);
      ElMessage.error('上传失败');
    }
  };
  
  // 注册提交
  const handleRegister = async () => {
    try {
      await form.value.validate(); // 校验表单
      const response = await instance.post('/api/organization/register', formData.value);
      if (response.code==1) {
        ElMessage.success('注册成功');
        router.push('/login');
      } else {
        ElMessage.error(response.data.message || '注册失败');
      }
    } catch (error) {
      ElMessage.error('注册失败，请重试');
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #6b7aff, #4c56d1);
  }
  
  .login-card {
    width: 380px;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background: #ffffff;
  }
  
  .login-title {
    font-size: 24px;
    color: #333;
    text-align: center;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  .register-btn {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    margin-top: 20px;
  }
  
  .upload-tip {
    margin-top: 8px;
    color: #666;
    font-size: 12px;
  }
  </style>
  