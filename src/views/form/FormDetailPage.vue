<!-- src/views/admin/FormDetailPage.vue 表单详情 -->
<template>
  <div class="form-detail">
    <!-- 表单基本信息 -->
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <h2>{{ itemContent.title }}</h2>
          <el-tag >
            进行中
          </el-tag>
        </div>
      </template>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="问卷id">
          {{ queryId }}
        </el-descriptions-item>
        <el-descriptions-item label="凭证名称">
          {{ itemContent.vcName }}
        </el-descriptions-item>
        <el-descriptions-item label="凭证到期时间">
          {{ itemContent.expireTime }}
        </el-descriptions-item>
        <el-descriptions-item label="问卷到期时间">
          {{ itemContent.deadline }}
        </el-descriptions-item>
        <el-descriptions-item label="问卷详情">
            <el-button type="primary" @click="showFormContent">查看表单具体内容</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="博客详情">
            <el-button type="primary" v-if="blogId!=-1" @click="showBlogContent">查看博客具体内容</el-button>
            <el-button type="primary" v-if="blogId==-1" @click="showBlogCreate">编写博客</el-button>
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

     <el-card class="card">
      <template #header>
      <div class="header-wrapper">
        <h3>填写记录</h3>
        <div style="display: flex; gap: 10px;">
          <el-input
            v-model="searchName"
            placeholder="请输入姓名搜索"
            clearable
            style="width: 200px;"
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
      </div>
    </template>


      <el-collapse v-model="activeNames">
        <el-collapse-item 
          v-for="(record, index) in records" 
          :key="index"
          :title="`提交时间：${record.createTime}`"
          :name="index"
        >
          <el-descriptions :column="2" border>
            <el-descriptions-item 
              v-for="(value, key) in getDisplayFields(record)" 
              :key="key"
              :label="fieldsMap[key]"
            >
              {{ value }}
            </el-descriptions-item>
            <el-descriptions-item >
              <el-button  @click="showEditDialog(record)">修改额度</el-button>
            </el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        
      </el-collapse>
    
      <el-pagination
      v-model:current-page="recordPage"
      :page-size="pageSize"
      :total="recordTotal"
      layout="prev, pager, next"
      @current-change="getRecordsContent"
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
            style="width: 100px; height: 100px"
            fit="cover"
          />
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogBlogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    <el-dialog
              v-model="dialogBlogCreateVisible"
              title="发布信息"
              width="600px"
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
 <!-- 添加额度修改对话框 -->
 <el-dialog
    v-model="editDialogVisible"
    title="修改额度"
    width="30%"
  >
    <el-form :model="editForm" label-width="80px">
      <el-form-item label="扣除额度" prop="value">
        <el-input-number 
          v-model="editForm.value" 
          :min="0" 
          :step="100"
          controls-position="right"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEdit">确认修改</el-button>
    </template>
  </el-dialog>
</template>
  
<script setup>
import instance from '@/utils/request'
import { ElMessage } from 'element-plus'
import { ref, computed,onMounted,watch } from 'vue'
import { useRoute,useRouter } from 'vue-router'
const router=useRouter()
const route = useRoute()
const formId = route.params.id
const activeNames = ref([0,1]) // 默认展开前两条
const recordPage = ref(1)
const recordTotal = ref(20) // 模拟总数据量
const editDialogVisible = ref(false)
const editForm = ref({
  commitId: '',
  value: 0
})
const currentRecord = ref(null)
const queryId = ref(null)
const searchName = ref('')
const pageSize = ref(10)
// const commitId=ref(null)
const itemContent = ref(JSON.parse(route.query.item))
const blogId = ref(JSON.parse(route.query.item).blogId)// 获取查询参数
console.log('itemContent:', itemContent.value)
console.log('blogId:', blogId.value)
const dialogVisible=ref(false)
const dialogBlogVisible = ref(false)
const dialogBlogCreateVisible = ref(false)
// 打开对话框的方法
const showFormContent = async () => {
  await getQueryContent(); // 确保先加载数据
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

// 统计信息:总访问量以及完成率
const stats = ref({
  views: 1500,
  completionRate: 85
})

// 填写记录
// 调整后的填写记录数据结构
const records = ref([
  {
    name: '张三',
    did: '111',
    type: 'insider',
    phoneNum: '123123123',
    createTime: '2025-02-27 16:12:40',
    commitId:'-1'
  },
  {
    name: '李四',
    did: '222',
    type: 'outsider',
    phoneNum: '321321321',
    createTime: '2025-02-27 16:13:54',
    commitId:'-1'
  }
])


// 字段映射
// 更新后的字段映射
const fieldsMap = {
  name: '姓名',
  did: 'did编号',
  type: '人员类型',
  phoneNum: '联系电话',
  createTime: '提交时间',
  account:"账户余额"
}

// 过滤需要显示的字段（排除可能存在的空值或不需要显示的字段）
const getDisplayFields = (record) => {
  return Object.fromEntries(
    Object.entries(record).filter(([key]) => 
      key !== 'commit_id' && 
      key !== 'phoneNum' && 
      key !== 'query_id' &&
      fieldsMap[key]
    )
  )
}

//获取问卷填写情况
// 修改获取记录的请求方法
const getRecordsContent = async () => {
  try {
    const response = await instance.post('/api/commit/getCommits', {
      queryId: queryId.value,
      current: recordPage.value,
      size: pageSize.value,
      name: searchName.value.trim()
    })
    console.log("人员填写记录",response)
    if(response.code === 1){
      // commitId.value=response.data.commitId
      records.value = response.data
      recordTotal.value = response.data.length
      // stats.value.views = response.data.total
      // 计算完成率（根据实际业务逻辑调整）
      if(recordTotal.value > 0) {
        const completed = records.value.filter(r => r.status === '完成').length
        stats.value.completionRate = Math.round((completed / pageSize.value) * 100)
      }
    }
  } catch (error) {
    ElMessage.error('获取记录失败')
    console.error(error)
  }
}

// 新增搜索处理函数
const handleSearch = () => {
  recordPage.value = 1
  getRecordsContent()
}

// 监听页码变化
watch(recordPage, () => {
  getRecordsContent()
})

//获取问卷内容
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

//获取博客内容
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

      //dialogBlogVisible.value = true
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
  getRecordsContent()
  // getQueryContent()
  // getBlogContent()
  // loadFormDetail(queryId.value)
})



//编写博客部分
const showBlogCreate = () => {
  dialogBlogCreateVisible.value = true
}

const BlogForm = ref({
  title:'',
  content: '',
  tag:'',
  queryId:'',
})

const fileList = ref([])

// 新增：单个文件上传方法
const uploadFile = async (file) => {
  console.log("11111111111111111111111111")
  console.log("上传图片：",file)
  const formData = new FormData()
  formData.append('file', file)
  console.log("上传图片：",formData)
  try {
    const response = await instance.post('/api/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log("图片上传结果：",response)
    if (response.code === 1) {
      return response.data // 返回图片 URL
    } else {
      throw new Error(response.msg || '图片上传失败')
    }
  } catch (error) {
    throw new Error(`图片上传失败: ${error.message}`)
  }
}

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
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('单张图片大小不能超过 2MB!')
    return false
  }
  return true
}


// 提交表单
const handleBlogSubmit = async () => {
  if (!BlogForm.value.content.trim() && fileList.value.length === 0) {
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
      ElMessage.success('提交成功')
      blogId.value=response.data.blogId
      dialogBlogCreateVisible.value = false
      //目前先跳转到原来的界面吧
      router.push("/")
      // getBlogContent()
      // window.location.reload()  // 刷新页面
    }else{
      ElMessage.error(response.msg)
      dialogVisible.value = false
    }
    
    // 重置表单
    BlogForm.value = { title: '', content: '', tag: '', queryId: '' }
    fileList.value = []

  } catch (error) {
    ElMessage.error(error.message || '提交失败')
    console.error('提交错误:', error)
  }
}
// 显示修改对话框
const showEditDialog = (record) => {
  currentRecord.value = record
  editForm.value = {
    commitId: record.commitId,
    value: record.account || 0
  }
  editDialogVisible.value = true
}

// 提交修改
const submitEdit = async () => {
  if (editForm.value.value < 0) {
    ElMessage.warning('额度不能为负数')
    return
  }
  
  try {
    const response = await instance.post('/api/commit/modifyAccount', {
      value: editForm.value.value,
      commitId: editForm.value.commitId
    })
    
    if (response.code === 1) {
      ElMessage.success('修改成功')
      // 更新本地数据
      currentRecord.value.account = editForm.value.value
      editDialogVisible.value = false
    } else {
      ElMessage.error(response.msg || '修改失败')
    }
  } catch (error) {
    console.error('修改额度失败:', error)
    ElMessage.error('修改请求失败')
  }
}
</script>

<style>
.card {
    margin: 5px;
}
.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
  