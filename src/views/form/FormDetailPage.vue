<!-- src/views/admin/FormDetailPage.vue 表单详情 -->
<template>
  <div class="form-detail">
    <!-- 表单基本信息 -->
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <h2>{{ formData.title }}</h2>
          <el-tag >
            进行中
          </el-tag>
        </div>
      </template>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="问卷id">
          {{ queryId }}
        </el-descriptions-item>
        <el-descriptions-item label="问卷类型">
          {{ formData.type }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{formData.createTime}}
        </el-descriptions-item>
        <el-descriptions-item label="参与人数">
          {{ formData.participants }}
        </el-descriptions-item>
        <el-descriptions-item label="问卷详情">
            <el-button type="primary" @click="showFormContent">查看表单具体内容</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="博客详情">
            <el-button type="primary" v-if="blogId.value!=-1" @click="showBlogContent">查看博客具体内容</el-button>
            <el-button type="primary" v-else>编写博客</el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 数据统计 -->
     <el-card class="card">
          <el-row :gutter="20" class="stats-row">
            <el-col :span="6">
              <el-statistic title="总访问量" :value="stats.views" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="完成率" :value="stats.completionRate">
                <template #suffix>%</template>
              </el-statistic>
            </el-col>
          </el-row>
     </el-card>

    <!-- 填写记录 -->
    <el-card class="card">
      <template #header>
        <h3>填写记录</h3>
      </template>
      
      <el-collapse v-model="activeNames">
        <el-collapse-item 
          v-for="record in records" 
          :key="record.id" 
          :title="`提交时间：${record.submitTime}`"
          :name="record.id"
        >
          <el-descriptions :column="2">
            <el-descriptions-item 
              v-for="(value, key) in record.data" 
              :key="key" 
              :label="fieldsMap[key]"
            >
              {{ value }}
            </el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>
      
      <el-pagination
        v-model:current-page="recordPage"
        :page-size="10"
        :total="recordTotal"
        layout="prev, pager, next"
      />
    </el-card>
  </div>
  <el-dialog 
    v-model="dialogVisible" 
    title="表单具体内容" 
    width="50%"
    top="5vh"
    center
  >
    <el-form :model="formContent" label-width="120px" >
      <template v-for="(field, index) in formFields" :key="index">
        <!-- 文本输入 -->
        <el-form-item 
          v-if="field.type === '单行文本'"
          :label="field.title"
        >
          <el-input  disabled/>
        </el-form-item>
        <!-- 多行文本 -->
        <el-form-item 
          v-if="field.type === '多行文本'"
          :label="field.title"
        >
          <el-input   type="textarea" disabled/>
        </el-form-item>
        <!-- 下拉选择 -->
        <el-form-item
          v-if="field.type === '下拉选择'"
          :label="field.title"
        >
          <el-select>
            <el-option
              v-for="opt in field.options"
              :key="opt.value"
              :label="opt"
            />
          </el-select>
        </el-form-item>

        <!-- 日期选择 -->
        <el-form-item
          v-if="field.type === '日期选择'"
          :label="field.title"
        >
          <el-date-picker
            
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>

        <!-- 文件上传 -->
        <el-form-item
          v-if="field.type === '文件上传'"
          :label="field.title"
        >
          <el-upload
            
            action="#"
            list-type="text"
          >
            <el-button type="primary" disabled>点击上传</el-button>
          </el-upload>
        </el-form-item>
      </template>
    </el-form>
  </el-dialog>
  <el-dialog
      title="博客详情"
      v-model="dialogBlogVisible"
      width="60%"
      @close="resetBlogData"
    >
      <div v-if="blogData">
        <!-- 博客标题 -->
        <h3>{{ blogData.blogTitle }}</h3>
        
        <!-- 博客内容 -->
        <p>{{ blogData.content }}</p>
        
        <!-- 博客图片 -->
        <div v-if="blogData.image1">
          <el-image
            v-for="(image, index) in blogImages"
            :key="index"
            :src="image"
            style="width: 100%; margin-bottom: 10px"
            fit="cover"
          />
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogBlogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
</template>
  
<script setup>
import instance from '@/utils/request'
import { ElMessage } from 'element-plus'
import { ref, computed,onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const formId = route.params.id
const activeNames = ref([1, 2]) // 默认展开前两条
const recordPage = ref(1)
const recordTotal = ref(20) // 模拟总数据量
const queryId = ref(null)
const blogId = ref(route.query.blogId)  // 获取查询参数
console.log('blogId:', blogId.value)
const dialogVisible=ref(false)
const dialogBlogVisible = ref(false)
// 打开对话框的方法
const showFormContent = () => {
  dialogVisible.value = true
}

const showBlogContent = async () => {
  await getBlogContent(); // 确保先加载数据
  dialogBlogVisible.value = true;
};



// 表单字段配置
const formFields = ref([
  {
    type: '单行文本',
    title: '申请人姓名',
    required: true
  },
  {
    type: '多行文本',
    title: '学号',
    required: true
  },
  {
    type: '下拉选择',
    title: '申请类型',
    options: [
      "没吸",
      "吸螺"
    ]
  },
  {
    type: '日期选择',
    title: '申请日期',
    required: true
  },
  {
    type: '文件上传',
    title: '附件材料',
    accept: '.pdf,.doc,.docx'
  }
])



// 表单模拟数据
const formData = ref({
  id: formId,
  title: '入校申请表单',
  type: 'campus',
  status: 1,
  participants: 235,
  createTime: '2024-03-01 14:30'
})

// 统计信息:总访问量以及完成率
const stats = ref({
  views: 1500,
  completionRate: 85
})

// 填写记录
const records = ref([
  {
    id: 1,
    submitTime: '2024-03-02 09:30:15',
    data: {
      name: '张三',
      studentId: '20200001',
      reason: '参加学术讲座',
      contact: '13800138000',
      department: '计算机学院'
    }
  },
  {
    id: 2,
    submitTime: '2024-03-02 10:15:22',
    data: {
      name: '李四',
      studentId: '20200002',
      reason: '实验室交流',
      contact: '13912345678',
      grade: '大三',
      suggestion: '希望延长开放时间'
    }
  },
  {
    id: 3,
    submitTime: '2024-03-02 11:05:47',
    data: {
      name: '王五',
      studentId: '20200003',
      reason: '社团活动',
      participants: 5,
      department: '电子工程学院'
    }
  },
  {
    id: 4,
    submitTime: '2024-03-02 14:20:33',
    data: {
      name: '赵六',
      studentId: '20200004',
      contact: '13678901234',
      grade: '研一',
      suggestion: '预约系统改进建议'
    }
  }
])

// 字段映射
const fieldsMap = {
  name: '姓名',
  studentId: '学号',
  reason: '申请理由',
  contact: '联系方式',
  participants: '参与人数',
  department: '院系',
  grade: '年级',
  suggestion: '意见建议'
}


const getQueryContent=async ()=>{
  const response=await instance.post('/api/question/getQuestion',{
    queryId:queryId.value
  })
  if(response.code===1){
      formFields.value=response.data
  }else{
    ElMessage({
    message: response.msg,
    type: 'warning',
  })
  }
}


const blogData = ref(null)
const blogImages = ref([])
const getBlogContent= async () => {
  if(blogId.value!=-1){
    try {
    const response = await instance.post('/api/query/getQueryDetails', {
      queryId: queryId.value, // 示例 queryId
      blogId: blogId.value,  // 示例 blogId
    })
    console.log("response",response)
    if (response.code === 1) {
      const data = response.data
      blogData.value = data
      // 过滤非 null 的图片地址
      blogImages.value = [
        data.image1, data.image2, data.image3, data.image4,
        data.image5, data.image6, data.image7, data.image8, data.image9
      ].filter(image => image != null); // 过滤null和undefined

      dialogBlogVisible.value = true
    } else {
      ElMessage.error('数据加载失败：' + response.msg)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('请求失败，请稍后重试')
  }
  }
}

// 重置博客数据，关闭对话框时清空数据
const resetBlogData = () => {
  blogData.value = null
  blogImages.value = []
}

// 获取路由参数
onMounted(() => {
  queryId.value = route.params.queryId
  getQueryContent()
  getBlogContent()
  // loadFormDetail(queryId.value)
})

</script>

<style>
.card {
    margin: 5px;
}

</style>
  