<!-- src/views/admin/FormAdminPage.vue 表单列表 -->
<template>
    <div class="form-management">
      <!-- 搜索和新建区域 -->
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索表单名称"
          style="width: 300px"
          clearable
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
        
        <el-button 
          type="primary" 
          :icon="Plus"
          @click="navigateToCreate"
        >
          新建表单
        </el-button>
      </div>
  
    <!-- 表单列表 -->
    <el-table 
      :data="pagedForms" 
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column label="序号" width="80" align="center">
        <template #default="{ $index }">
          {{ (currentPage - 1) * pageSize + $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="queryId" label="ID" width="80" />
      <el-table-column prop="title" label="表单名称" />
      <!-- <el-table-column prop="type" label="类型" width="120">
        <template #default="{row}">
          <el-tag :type="formTypeMap[row.type]?.tagType">
            {{ formTypeMap[row.type]?.label }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="deadline" label="截止时间" width="180">
        <template #default="{row}">
          {{ formatTime(row.deadline) }}
        </template>
      </el-table-column>
      <el-table-column prop="orgDid" label="发布机构" width="600" />
      
      <el-table-column label="操作" width="200">
        <template #default="{row}">
          <el-button 
            type="primary" 
            size="small" 
            @click="viewDetail(row.queryId)"
          >
            查看
          </el-button>
          <el-button 
            type="danger" 
            size="small"
            @click="confirmDelete(row.queryId)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!-- 分页 -->
    <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
    />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus } from '@element-plus/icons-vue'
import instance from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 表单数据
const formList = ref([])
const loading = ref(false)

// 表单类型映射
const formTypeMap = {
  INFO_COLLECTION: { label: '信息采集', tagType: 'success' },
  ACTIVITY_REGISTRATION: { label: '活动报名', tagType: 'warning' },
  SURVEY: { label: '问卷调查', tagType: 'info' }
}

// 时间格式化
const formatTime = (timeStr) => {
  if (!timeStr) return '-'
  return new Date(timeStr).toLocaleString()
}

// 加载表单数据
const loadForms = async () => {
  try {
    loading.value = true
    const response = await instance.get('/api/query/getQueries')
    
    if (response.code === 1) {
      formList.value = response.data
    } else {
      ElMessage.error('数据加载失败: ' + response.msg)
    }
  } catch (error) {
    ElMessage.error('网络请求异常')
  } finally {
    loading.value = false
  }
}

// 搜索功能
const searchQuery = ref('')
const filteredForms = computed(() => {
  return formList.value.filter(form => 
    form.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => filteredForms.value.length)

// 分页数据计算
const pagedForms = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredForms.value.slice(start, end)
})

// 查看详情
const viewDetail = (queryId) => {
  router.push(`/admin/form/detail/${queryId}`)
}

// 删除确认
const confirmDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除该表单吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 调用删除接口
    // await instance.delete(`/api/query/deleteQuery/${id}`)
    
    // 本地更新数据
    formList.value = formList.value.filter(form => form.queryId !== id)
    ElMessage.success('删除成功')
  } catch (error) {
    // 取消删除不处理
  }
}

const navigateToCreate=()=>{
  router.push("/admin/form/create")
}
// 初始化加载数据
onMounted(() => {
  loadForms()
})
</script>

<style scoped>
.form-management {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>