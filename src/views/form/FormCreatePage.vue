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
        <!-- 步骤1：基本信息 -->
        <div v-show="step === 1">
          <h3>基本信息设置</h3>
          <el-form :model="baseForm" label-width="120px">
            <el-form-item label="表单标题" prop="title" >
              <el-input v-model="baseForm.title" placeholder="请输入表单标题" />
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
            <el-form-item label="问卷模板" prop="type" >
              <el-select v-model="baseForm.cptId">
                <el-option
                  v-for="model in formModels"
                  :key="model.value"
                  :label="model.label"
                  :value="model.value"
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
                v-model="baseForm.vcvcdeadline"
                type="datetime"
                placeholder="选择截止时间"
              />
            </el-form-item>
            <el-form-item label="机构did" prop="title" >
              <el-input v-model="baseForm.issuerDid" placeholder="请输入机构did" />
            </el-form-item>
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
                      :on-exceed="handleExceed"
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
            <!-- <el-form-item label="发布方式">
              <el-radio-group v-model="publishSettings.immediate">
                <el-radio :label="true">立即发布</el-radio>
                <el-radio :label="false">定时发布</el-radio>
              </el-radio-group>
            </el-form-item> -->
  
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
        <!-- 批量输入方式 -->
        <!-- <el-input
          v-model="bulkOptions"
          type="textarea"
          :rows="4"
          placeholder="可批量输入选项（每行一个选项，格式：显示文本:值）例：男:male"
        />
        <div class="actions">
          <el-button @click="handleBulkAdd">批量添加</el-button>
          <span class="tip">或逐个添加：</span>
        </div> -->
    
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
  </template>
  
<script setup>
import { ref, reactive } from 'vue'
import { Rank, Delete } from '@element-plus/icons-vue'
import { Edit } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { valueEquals } from 'element-plus'
import instance from "@/utils/request.js"
import { ElMessage } from 'element-plus'
  // 步骤控制
const step = ref(1)

// step1中填写信息汇总
const baseForm = ref({
  title: '',
  type: '',
  deadline: null,
  vcvcdeadline:null,
  issuerDid:"did:tdid:w1:0x8ad750852661514cae2e8dda1b4587bd46072bcc",
  cptId:null
})
// step1中表单类型中字段配置
const formTypes=ref([
  {
    value:"活动报名",
    label:"活动报名"
  },
  {
    value:"信息采集",
    label:"信息采集"
  }
])

//step1中问卷模板
const formModels=ref([
  {
    value:"2001",
    label:"学校"
  },
  {
    value:"2001",
    label:"社团"
  }
])


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
    required: false,
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

// 提交表单
const submitForm = async () => {
  // 转换时间格式
  const formatTime = (date) => {
    return date ? new Date(date).toISOString() : null
  }

  // 转换字段结构
  const convertedFields = formFields.value.map(field => {
    const converted = {
      label: field.label,
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
    type: baseForm.value.type,
    cptId: Number(baseForm.value.cptId), // 转换为数字
    deadline: formatTime(baseForm.value.deadline),
    expireTime: formatTime(baseForm.value.expireTime),
    field: convertedFields
  }

  console.log('最终提交数据:', JSON.stringify(formData, null, 2))//不使用替代器,设置缩进空格数2
  
  const requestBody=JSON.stringify(formData,null,2)
  console.log("请求体；",requestBody)
  const response=await instance.post("/api/query/issueQuery",requestBody)
  console.log(response)
  ElMessage({
    message: response.msg,
    type: 'warning',
  })

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
  </style>
  