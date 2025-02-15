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
        :data="filteredForms" 
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column prop="title" label="表单名称" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{row}">
            <el-tag :type="formTypeMap[row.type]?.tagType">
              {{ formTypeMap[row.type]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{row}">
            <el-tag :type="statusTypeMap[row.status]">
              {{ statusTextMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="participants" label="参与人数" width="120" />
        <el-table-column prop="createTime" label="发布时间" width="180" />
        
        <el-table-column label="操作" width="200">
          <template #default="{row}">
            <el-button 
              type="primary" 
              size="small" 
              @click="viewDetail(row.id)"
            >
              查看
            </el-button>
            <el-button 
              type="warning" 
              size="small"
              @click="editForm(row.id)"
            >
              编辑
            </el-button>
            <el-button 
              type="danger" 
              size="small"
              @click="confirmDelete(row.id)"
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
  
  const router = useRouter()
  
  // 模拟数据
  const formList = ref([
    {
      id: 1,
      title: '入校申请表单',
      type: 'campus',
      status: 1,
      participants: 235,
      createTime: '2024-03-01 14:30'
    },
    // 更多数据...
  ])
  
  // 表单类型映射
  const formTypeMap = {
    campus: { label: '入校申请', tagType: 'success' },
    activity: { label: '活动报名', tagType: 'warning' },
    survey: { label: '问卷调查', tagType: 'info' }
  }
  
  // 状态类型映射
  const statusTextMap = {
    0: '未发布',
    1: '已发布',
    2: '已关闭'
  }
  
  const statusTypeMap = {
    0: 'info',
    1: 'success',
    2: 'danger'
  }
  
  // 搜索功能
  const searchQuery = ref('')
  const filteredForms = computed(() => {
    return formList.value.filter(form => 
      form.title.includes(searchQuery.value)
    )
  })
  
  // 分页相关
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = computed(() => formList.value.length)
  
  // 查看详情
  const viewDetail = (id) => {
    router.push(`/admin/form/detail/${id}`)
  }
  
  // 新建表单
  const navigateToCreate = () => {
    router.push('/admin/form/create')
  }
  
  // 删除确认
  const confirmDelete = (id) => {
    ElMessageBox.confirm('确定删除该表单吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 执行删除操作
      formList.value = formList.value.filter(form => form.id !== id)
      ElMessage.success('删除成功')
    })
  }
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
  