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
            <el-form-item label="表单标题" prop="title" required>
              <el-input v-model="baseForm.title" placeholder="请输入表单标题" />
            </el-form-item>
            
            <el-form-item label="表单类型" prop="type" required>
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
                    v-if="field.type === 'input'"
                    :label="field.label"
                  >
                    <el-input v-model="previewData[field.key]" />
                  </el-form-item>
  
                  <!-- 下拉选择 -->
                  <el-form-item
                    v-if="field.type === 'select'"
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
  
                  <!-- 更多字段类型... -->
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
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { Rank, Delete } from '@element-plus/icons-vue'
  import draggable from 'vuedraggable'
  
  // 步骤控制
  const step = ref(1)
  
  // 基础表单信息
  const baseForm = reactive({
    title: '',
    type: 'survey',
    deadline: null
  })
  
  // 表单字段配置
  const formFields = ref([])
  const fieldTypes = [
    { label: '单行文本', value: 'input' },
    { label: '多行文本', value: 'textarea' },
    { label: '下拉选择', value: 'select' },
    { label: '日期选择', value: 'date' },
    { label: '文件上传', value: 'upload' }
  ]
  
  // 添加字段
  const addField = () => {
    formFields.value.push({
      id: Date.now(),
      label: '新字段',
      type: 'input',
      key: `field_${formFields.value.length + 1}`,
      required: false,
      options: [] // 用于选择型字段
    })
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
    const formData = {
      ...baseForm,
      fields: formFields.value,
      settings: publishSettings
    }
    
    try {
      // 调用API提交数据
      await api.createForm(formData)
      ElMessage.success('表单创建成功')
      router.push('/admin/forms')
    } catch (error) {
      ElMessage.error('表单创建失败')
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
  </style>
  