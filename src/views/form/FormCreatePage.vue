<!-- src/views/admin/FormCreatePage.vue -->
<template>
    <div class="form-create">
      <!-- 创建步骤导航 -->
      <el-steps :active="step" finish-status="success" class="steps">
        <el-step title="基本信息" />
        <el-step title="设计表单" />
        <el-step title="发布设置" />
      </el-steps>
  
      <!-- 表单创建主体 -->
      <el-card class="card">
        <!-- 步骤0：相关信息填写 -->
        
        <!-- 步骤1：基本信息 -->
        <div v-show="step === 1">
          <h3>基本信息设置</h3>
          <el-form :model="baseForm" label-width="120px">
            <el-form-item label="标题" prop="title" >
              <el-input v-model="baseForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="凭证名称" prop="title" >
              <el-input v-model="baseForm.vcName" placeholder="请输入凭证名称" />
            </el-form-item>
            <el-form-item label="机构名称" prop="title" >
              <el-input v-model="baseForm.issuerName" placeholder="请输入机构名称" />
            </el-form-item>
            <el-form-item label="机构logo">
              <el-upload
                action="#"
                :auto-upload="false"
                :limit="1"
                :file-list="logoFileList"
                :on-exceed="handleLogoExceed"
                :on-change="handleLogoChange"
                :before-upload="beforeUpload"
                list-type="picture-card"
              >
                <el-button type="primary">点击上传</el-button>
                <template #file="{ file }">
                  <img :src="file.url" class="logo-preview" />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-span">
                      <el-icon><ZoomIn /></el-icon>
                    </span>
                  </span>
                </template>
              </el-upload>
            </el-form-item>
             <el-form-item label="表单类型" prop="type" >
              <el-select v-model="baseForm.type">
                <el-option
                  v-for="type in formTypes"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                />
              </el-select>
            </el-form-item>
  
            <el-form-item label="截止时间">
              <el-date-picker
                v-model="baseForm.deadline"
                type="datetime"
                placeholder="选择截止时间"
              />
            </el-form-item>
            
            <el-form-item label="凭证过期时间">
              <el-date-picker
                v-model="baseForm.expireTime"
                type="datetime"
                placeholder="选择截止时间"
              />
            </el-form-item>
            <el-form-item label="设置凭证额度？">
              <el-switch v-model="showSwitch" />
            </el-form-item>
            <el-form-item label="凭证额度" v-show="showSwitch">
              <el-input-number v-model="baseForm.account" :min="-1" :max="10000" @change="handleChange" />
            </el-form-item>
            <!-- <el-form-item label="机构did" prop="title" >
              <el-input v-model="baseForm.issuerDid" placeholder="请输入机构did" />
            </el-form-item> -->
          </el-form>
        </div>
  
        <!-- 步骤2：字段设计 -->
        <div v-show="step === 2">
          <h3>表单字段设计</h3>
          <div class="field-editor">
            <div class="field-list">
              <draggable 
                v-model="formFields"
                item-key="id"
                handle=".drag-handle"
              >
                <template #item="{ element, index }">
                  <div class="field-item">
                    <el-icon class="drag-handle"><Rank /></el-icon>
                    <el-form-item :label="`字段 ${index + 1}`">
                      <el-input v-model="element.label" placeholder="字段名称" />
                      <el-select v-model="element.type" class="type-select">
                        <el-option
                          v-for="ft in fieldTypes"
                          :key="ft.value"
                          :label="ft.label"
                          :value="ft.value"
                        />
                      </el-select>
                      <!-- 添加选项编辑按钮 -->
                      <el-button
                        v-if="element.type === '下拉选择'"
                        type="primary"
                        circle
                        @click="showOptionDialog(element)"
                      >
                        <el-icon><Edit /></el-icon>
                      </el-button>
                      <el-button
                        type="danger"
                        circle
                        @click="removeField(index)"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </el-form-item>
                  </div>
                </template>
                <!-- 在模板中添加选项编辑对话框 -->
                   
              </draggable>
              
              <el-button @click="addField">+ 添加字段</el-button>
            </div>
  
            <!-- 实时预览 -->
            <div class="preview">
              <h4>实时预览</h4>
              <el-form :model="previewData" label-width="120px">
                <template v-for="(field, index) in formFields" :key="index">
                  <!-- 输入框 -->
                  <el-form-item 
                    v-if="field.type === '单行文本'"
                    :label="field.label"
                  >
                    <el-input v-model="previewData[field.key]" />
                  </el-form-item>
              
                  <!-- 下拉选择 -->
                  <el-form-item
                    v-if="field.type === '下拉选择'"
                    :label="field.label"
                  >
                    <el-select v-model="previewData[field.key]">
                      <el-option
                        v-for="opt in field.options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                      />
                    </el-select>
                  </el-form-item>
              
                  <!-- 多行文本 -->
                  <el-form-item
                    v-if="field.type === '多行文本'"
                    :label="field.label"
                  >
                    <el-input
                      v-model="previewData[field.key]"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入内容"
                    />
                  </el-form-item>
              
                  <!-- 日期选择 -->
                  <el-form-item
                    v-if="field.type === '日期选择'"
                    :label="field.label"
                  >
                    <el-date-picker
                      v-model="previewData[field.key]"
                      type="date"
                      placeholder="选择日期"
                    />
                  </el-form-item>
              
                  <!-- 文件上传 -->
                  <el-form-item
                    v-if="field.type === '文件上传'"
                    :label="field.label"
                  >
                    <el-upload
                      action="#"
                      :auto-upload="false"
                      :limit="3"
                    >
                      <el-button type="primary">点击上传</el-button>
                      <template #tip>
                        <div class="el-upload__tip">
                          最多上传3个文件，单个文件不超过5MB
                        </div>
                      </template>
                    </el-upload>
                  </el-form-item>
                </template>
              </el-form>
            </div>
          </div>
        </div>
  
        <!-- 步骤3：发布设置 -->
        <div v-show="step === 3">
          <h3>发布设置</h3>
          <el-form label-width="120px">
            <el-form-item label="发布方式">
              <el-radio-group v-model="publishSettings.immediate">
                <el-radio :label="true">立即发布</el-radio>
                <el-radio :label="false">定时发布</el-radio>
              </el-radio-group>
            </el-form-item>
  
            <el-form-item label="访问权限">
              <el-checkbox-group v-model="publishSettings.permissions">
                <el-checkbox label="student">学生</el-checkbox>
                <el-checkbox label="teacher">教师</el-checkbox>
                <el-checkbox label="staff">教职工</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            
          </el-form>
          
        </div>
  
        <!-- 操作按钮 -->
        <div class="actions">
          <el-button 
            v-if="step > 1" 
            @click="step--"
          >
            上一步
          </el-button>
          <el-button 
            type="primary" 
            @click="handleNextStep"
          >
            {{ step === 3 ? '立即发布' : '下一步' }}
          </el-button>
        </div>
      </el-card>
    </div>
    <el-dialog
      v-model="optionDialog.visible"
      title="编辑下拉选项"
      width="600px"
    >
      <div class="option-editor">

    
        <!-- 逐个添加 -->
        <div class="single-add">
          <el-input v-model="newOption.label" placeholder="显示文本(默认label=value)" style="width: 200px" />
          <!-- <el-input v-model="newOption.value" placeholder="选项值(value)" style="width: 200px; margin: 0 10px" /> -->
          <el-button type="primary" @click="addSingleOption" style="margin-left: 10px;">添加选项</el-button>
        </div>
    
        <!-- 现有选项列表 -->
        <el-table :data="currentOptions" class="option-table">
          <el-table-column prop="label" label="显示文本" />
          <!-- <el-table-column prop="value" label="选项值" /> -->
          <el-table-column width="80">
            <!-- 获得对应的index -->
            <template #default="{ $index }">
              <el-button
                type="danger"
                circle
                @click="console.log($index),currentOptions.splice($index, 1)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <el-button @click="optionDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="saveOptions">保存选项</el-button>
      </template>
    </el-dialog>
    <el-dialog
              v-model="dialogVisible"
              title="发布信息"
              width="600px"
              v-loading="loading"
            >
            
              <el-form label-width="80px">
                <el-form-item label="标题">
                  <el-input
                  v-model="BlogForm.title"
                    placeholder="请输入内容标题"
                    maxlength="500"
                  />
                </el-form-item>
                <!-- 文字内容输入 -->
                <el-form-item label="内容">
                  <el-input
                    v-model="BlogForm.content"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入发布内容"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>

                <!-- 文字内容输入 -->
                <el-form-item label="添加标签">
                  <el-input
                    v-model="BlogForm.tag"
                    placeholder="请输入标签"
                    maxlength="500"
                  />
                </el-form-item>
              
                <!-- 图片上传 -->
                <el-form-item label="图片">
                  <el-upload
                    v-model:file-list="fileList"
                    multiple
                    :limit="9"
                    list-type="picture-card"
                    :auto-upload="false"
                    :on-change="handleChange"
                    :before-upload="beforeUpload"
                    :on-exceed="handleExceed"  
                  >
                  </el-upload>
                </el-form-item>
              </el-form>
            
              <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleBlogSubmit">提交</el-button>
              </template>
            </el-dialog>
  </template>
  
<script setup>
import { ref, reactive } from 'vue'
import { Rank, Delete } from '@element-plus/icons-vue'
import { Edit } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { valueEquals } from 'element-plus'
import instance from "@/utils/request.js"
import { ElMessage,ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {useUserStore} from "@/stores/counter.js"
const userStore=useUserStore()
const did=userStore.userDid
const router = useRouter()
// import { c } from 'vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P'
  // 步骤控制
const step = ref(1)
const showSwitch=ref(false)
const loading=ref(false)

// step1中填写信息汇总
const baseForm = ref({
  title: '',
  type: '',
  deadline: null,
  expireTime:null,
  issuerDid:did,
  vcName:'',
  issuerName:'',
  logo:'',
  account:-1,
})
// step1中表单类型中字段配置
const formTypes=ref([
  {
    value:"insider",
    label:"insider"
  },
  {
    value:"outsider",
    label:"outsider"
  },
  {
    value:"both",
    label:"both"
  }
])

// 文件列表控制
const logoFileList = ref([])

// 新增：单个文件上传方法
const uploadFile = async (file) => {
  // console.log("11111111111111111111111111")
  // console.log("上传图片：",file)
  const formData = new FormData()
  formData.append('file', file)
  // console.log("上传图片：",formData)
  try {
    const response = await instance.post('/api/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    // console.log("图片上传结果：",response)
    if (response.code === 1) {
      return response.data // 返回图片 URL
    } else {
      throw new Error(response.msg || '图片上传失败')
    }
  } catch (error) {
    throw new Error(`图片上传失败: ${error.message}`)
  }
}

const handleLogoExceed = () => {
  ElMessage.warning('最多只能上传 1 张图片')
}

// 文件选择处理
const handleLogoChange = async (File) => {
  console.log("校验",File)
  try {
    // 自动替换旧文件
    logoFileList.value = [File]
    
    // 上传前校验（复用已有逻辑）
    if (!['image/jpeg', 'image/png'].includes(File.raw?.type)) {
      throw new Error('只能上传 JPG/PNG 格式的图片!')
    }
    if (File.raw?.size / 1024 / 1024 > 2) {
      throw new Error('图片大小不能超过 2MB!')
    }
    console.log("上传图片",File.raw)
    console.log("22222222222222222222")
    // 执行上传
    const url = await uploadFile(File.raw)
    console.log('上传成功:', url)
    // 更新表单数据
    baseForm.value.logo = url
    
    // 更新文件列表显示
    logoFileList.value = [{
      name: File.name,
      url: url,
      status: 'success'
    }]
    
  } catch (error) {
    ElMessage.error('111',error.message)
    logoFileList.value = []
  }
}


const formFields = ref([])
// 修改后（直接使用中文值）
const fieldTypes = [
  { label: '单行文本', value: '单行文本' },
  { label: '多行文本', value: '多行文本' },
  { label: '下拉选择', value: '下拉选择' },
  { label: '日期选择', value: '日期选择' },
  { label: '文件上传', value: '文件上传' }
]

let fieldCounter = 0 // 在组件顶部定义计数器
//增加问题
const addField = () => {
  formFields.value.push({
    id: Date.now(),
    label: '新字段',
    type: '单行文本',
    key: `field_${++fieldCounter}`, // 使用自增计数器
    required: true,
    options: []
  })
}


// 选择型字段编辑页面显示
const optionDialog = ref({
  visible: false,
  fieldIndex: -1
})

const bulkOptions = ref('')
const newOption = reactive(
  { 
    label: '', 
    value: '' }
)
const currentOptions = ref([])

// 显示选项编辑对话框
const showOptionDialog = (field) => {

  const index = formFields.value.findIndex(f => f.id === field.id)
  optionDialog.value.fieldIndex = index
  currentOptions.value = [...(field.options || [])]
  optionDialog.value.fieldIndex=index
  optionDialog.value.visible=true
  // console.log(optionDialog.visible)
}

// 处理批量添加
const handleBulkAdd = () => {
  if (!bulkOptions.value) return
  
  const lines = bulkOptions.value.split('\n')
  const newOptions = lines
    .map(line => {
      const [label, value] = line.split(':')
      return { label: label?.trim(), value: value?.trim() || label?.trim() }
    })
    .filter(opt => opt.label)
  
  currentOptions.value = [...currentOptions.value, ...newOptions]
  bulkOptions.value = ''
}

// 添加select中的单个选项
const addSingleOption = () => {
  if (!newOption.label) {
    ElMessage.warning('请填写显示文本')
    return
  }
  // 默认 value = label（如果未填写）
  newOption.value = newOption.value || newOption.label.trim()
   // 检查重复
   if (currentOptions.value.some(opt => opt.value === newOption.value)) {
    ElMessage.error('选项值已存在，请修改')
    return
  }
  
  currentOptions.value.push({ ...newOption })//创建一个newOption的副本，然后将这个副本增加到currentOptions中
  //重置为空
  newOption.label = ''
  newOption.value = ''
}

// 保存选项
const saveOptions = () => {
  // 验证选项
  const values = currentOptions.value.map(opt => opt.value)//提取currentOptions.value中的所有对应的value值，构成values数组
  if (new Set(values).size !== values.length) {
    ElMessage.error('存在重复的选项值，请核对')
    return
  }
  
  // 更新字段的options
  console.log('--------------',optionDialog.value)
  const field = formFields.value[optionDialog.value.fieldIndex]
  field.options = currentOptions.value
  optionDialog.value.visible = false
}

// 删除字段
const removeField = (index) => {
  formFields.value.splice(index, 1)
}

// 发布设置
const publishSettings = reactive({
  immediate: true,
  publishTime: null,
  permissions: ['student']
})

// 预览数据
const previewData = reactive({})

// 下一步处理
const handleNextStep = () => {
  if (step.value < 3) {
    step.value++
  } else {
    submitForm()
  }
}
const dialogVisible = ref(false)
const queryId = ref(2)

// 提交表单
const submitForm = async () => {

  // 转换时间格式
  const formatTime = (date) => {
    return date ? new Date(date).toISOString() : null
  }

  // 转换字段结构
  const convertedFields = formFields.value.map(field => {
    const converted = {
      title: field.label,
      type: field.type,
      required: field.required || false  // 默认为false
    }

    // 处理下拉选项
    if (field.type === '下拉选择' && field.options) {
      converted.options = field.options.map(opt => {
        // 如果后端需要字符串数组，这里可以改为 opt.label
        return typeof opt === 'string' ? opt : opt.label
      })
    }

    return converted
  })

  const formData = {
    issuerDid: baseForm.value.issuerDid,
    title: baseForm.value.title,
    vcName: baseForm.value.vcName,
    type: baseForm.value.type,
    deadline: formatTime(baseForm.value.deadline),
    expireTime: formatTime(baseForm.value.expireTime),
    logo: baseForm.value.logo,
    fields: convertedFields
  }

  console.log('最终提交数据:', JSON.stringify(formData, null, 2))//不使用替代器,设置缩进空格数2
  
  const requestBody=JSON.stringify(formData,null,2)
  console.log("请求体；",requestBody)
  const response=await instance.post("/api/query/issueQuery",requestBody,{
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if(response.code===1){
    queryId.value=response.data
    ElMessageBox.confirm(
    '成功创建问卷,继续编辑blog以发布？',
    'Warning',
    {
      confirmButtonText: '继续编辑',
      cancelButtonText: '无需编辑',
      type: 'warning',
    }
  )
    .then(() => {
      dialogVisible.value = true
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消编辑博客',
      })
      router.push("/")
    })
  }else{
    ElMessage({
    message: response.msg,
    type: 'warning',
  })
  }
  console.log(response)
}

//博客？部分提交

const BlogForm = ref({
  title:'',
  content: '',
  tag:'',
  queryId:'',
})
const fileList = ref([])

// 处理文件选择
const handleChange = (file, files) => {
  fileList.value = files
}

// 新增文件超出限制处理
const handleExceed = () => {
  ElMessage.warning('最多只能上传 9 张图片')
}

// 文件上传前的校验
const beforeUpload = (file) => {
  const isImage = ['image/jpeg', 'image/png'].includes(file.type)

  if (!isImage) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  return true
}


// 提交表单
const handleBlogSubmit = async () => {
  loading.value=true
  if (!BlogForm.value.content.trim() && fileList.value.length === 0) {
    loading.value=false
    return ElMessage.warning('请填写内容或上传图片')
  }
console.log('文件列表',fileList.value)
  try {
    // 新增：上传所有图片并获取 URL
    const imageUrls = await Promise.all(
      fileList.value.map(file => uploadFile(file.raw))
    )

    const blogData = {
      title: BlogForm.value.title,
      content: BlogForm.value.content,
      tag: BlogForm.value.tag,
      queryId: queryId.value
    }

    // 新增：将图片 URL 添加到表单数据
    imageUrls.forEach((url, index) => {
      if (index < 9) { // 最多支持 9 张图片
        blogData[`image${index + 1}`] = url
      }
    })
    console.log('提交数据:', blogData)
    const response =await instance.post("/api/blog/issueBlog",blogData)
    if(response.code===1){
      loading.value=false
      ElMessage.success('提交成功')
      dialogVisible.value = false
      
      router.push("/")
    }else{
      loading.value=false
      ElMessage.error(response.msg)
      dialogVisible.value = false
      
      router.push("/")
    }
    
    // 重置表单
    BlogForm.value = { title: '', content: '', tag: '', queryId: '' }
    fileList.value = []
  } catch (error) {
    loading.value=false
    ElMessage.error(error.message || '提交失败')
    console.error('提交错误:', error)
    router.push("/")
  }
}
</script>

<style scoped>
.form-create {
  max-width: 1200px;
  margin: 20px auto;
}

.steps {
  margin-bottom: 30px;
}

.field-editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.field-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 4px;

  .drag-handle {
    margin-right: 10px;
    cursor: move;
  }

  .type-select {
    width: 150px;
    margin: 0 10px;
  }
}

.preview {
  border-left: 1px solid #eee;
  padding-left: 30px;
}

.actions {
  margin-top: 30px;
  text-align: center;
}

  .option-editor {
  padding: 10px;
}

.actions {
  margin: 15px 0;
  display: flex;
  align-items: center;
}

.tip {
  color: #666;
  margin-left: 15px;
}

.single-add {
  margin: 15px 0;
  display: flex;
  align-items: center;
}

.option-table {
  margin-top: 20px;
}

.option-table :deep(.el-table__row) td {
  padding: 8px 0;
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
  </style>
  