<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import {
  listUserVoByPage,
  addUser,
  updateUser,
  deleteUser,
} from '@/api/userController'

// ---- Table State ----
const dataSource = ref<API.UserVO[]>([])
const total = ref(0)
const loading = ref(false)
const queryParams = reactive<API.UserQueryRequest>({
  pageNum: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// ---- Search Form ----
const searchForm = reactive({
  userAccount: '',
  userName: '',
  userRole: undefined as string | undefined,
})

// ---- Columns ----
const columns: TableColumnsType = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '账号', dataIndex: 'userAccount', key: 'userAccount', width: 120 },
  { title: '昵称', dataIndex: 'userName', key: 'userName', width: 120 },
  { title: '头像', dataIndex: 'userAvatar', key: 'userAvatar', width: 80 },
  { title: '简介', dataIndex: 'userProfile', key: 'userProfile', ellipsis: true },
  { title: '角色', dataIndex: 'userRole', key: 'userRole', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'actions', width: 160 },
]

// ---- Pagination ----
const pagination = computed(() => ({
  current: queryParams.pageNum ?? 1,
  pageSize: queryParams.pageSize ?? 10,
  total: total.value,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

// ---- Data Fetching ----
async function fetchData() {
  loading.value = true
  try {
    const res = await listUserVoByPage(queryParams)
    const data = (res.data as API.BaseResponsePageUserVO).data
    if (data) {
      dataSource.value = data.records ?? []
      total.value = data.totalRow ?? 0
    }
  } catch {
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

function handleTableChange(pag: { current: number; pageSize: number }) {
  queryParams.pageNum = pag.current
  queryParams.pageSize = pag.pageSize
  fetchData()
}

// ---- Search ----
function handleSearch() {
  queryParams.pageNum = 1
  queryParams.userAccount = searchForm.userAccount || undefined
  queryParams.userName = searchForm.userName || undefined
  queryParams.userRole = searchForm.userRole
  fetchData()
}

function handleReset() {
  searchForm.userAccount = ''
  searchForm.userName = ''
  searchForm.userRole = undefined
  queryParams.pageNum = 1
  queryParams.userAccount = undefined
  queryParams.userName = undefined
  queryParams.userRole = undefined
  fetchData()
}

// ---- Modal ----
const modalVisible = ref(false)
const modalTitle = ref('新增用户')
const editingId = ref<number | null>(null)
const modalLoading = ref(false)

const modalForm = reactive({
  userAccount: '',
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: 'user' as string,
})

function openAddModal() {
  modalTitle.value = '新增用户'
  editingId.value = null
  modalForm.userAccount = ''
  modalForm.userName = ''
  modalForm.userAvatar = ''
  modalForm.userProfile = ''
  modalForm.userRole = 'user'
  modalVisible.value = true
}

function openEditModal(record: API.UserVO) {
  modalTitle.value = '编辑用户'
  editingId.value = record.id ?? null
  modalForm.userAccount = record.userAccount ?? ''
  modalForm.userName = record.userName ?? ''
  modalForm.userAvatar = record.userAvatar ?? ''
  modalForm.userProfile = record.userProfile ?? ''
  modalForm.userRole = record.userRole ?? 'user'
  modalVisible.value = true
}

async function handleModalOk() {
  modalLoading.value = true
  try {
    let res
    if (editingId.value) {
      res = await updateUser({
        id: editingId.value,
        userName: modalForm.userName || undefined,
        userAvatar: modalForm.userAvatar || undefined,
        userProfile: modalForm.userProfile || undefined,
        userRole: modalForm.userRole,
      })
    } else {
      res = await addUser({
        userAccount: modalForm.userAccount,
        userName: modalForm.userName || undefined,
        userAvatar: modalForm.userAvatar || undefined,
        userProfile: modalForm.userProfile || undefined,
        userRole: modalForm.userRole,
      })
    }
    const data = res.data as { code?: number; message?: string }
    if (data.code === 0) {
      message.success(editingId.value ? '更新成功' : '新增成功')
      modalVisible.value = false
      fetchData()
    } else {
      message.error(data.message || '操作失败')
    }
  } catch {
    message.error('网络错误')
  } finally {
    modalLoading.value = false
  }
}

// ---- Delete ----
async function handleDelete(id: number) {
  try {
    const res = await deleteUser({ id })
    const data = res.data as { code?: number; message?: string }
    if (data.code === 0) {
      message.success('删除成功')
      fetchData()
    } else {
      message.error(data.message || '删除失败')
    }
  } catch {
    message.error('网络错误')
  }
}

// ---- Lifecycle ----
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="user-manage">
    <!-- Search -->
    <a-card class="search-card" size="small">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="账号">
          <a-input v-model:value="searchForm.userAccount" placeholder="请输入账号" allow-clear />
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="searchForm.userName" placeholder="请输入昵称" allow-clear />
        </a-form-item>
        <a-form-item label="角色">
          <a-select
            v-model:value="searchForm.userRole"
            placeholder="请选择角色"
            allow-clear
            style="width: 120px"
          >
            <a-select-option value="user">用户</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Action Bar -->
    <div class="action-bar">
      <a-button type="primary" @click="openAddModal">新增用户</a-button>
    </div>

    <!-- Table -->
    <a-card class="table-card" size="small">
      <a-table
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }: { column: { key: string }; record: API.UserVO }">
          <template v-if="column.key === 'userAvatar'">
            <a-avatar v-if="record.userAvatar" :src="record.userAvatar" :size="32" />
            <span v-else style="color: rgba(0,0,0,0.25)">-</span>
          </template>
          <template v-else-if="column.key === 'userRole'">
            <a-tag :color="record.userRole === 'admin' ? 'red' : 'blue'">
              {{ record.userRole === 'admin' ? '管理员' : '用户' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
            <a-popconfirm
              title="确认删除该用户？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleDelete(record.id!)"
            >
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Add / Edit Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
    >
      <a-form layout="vertical" :model="modalForm">
        <a-form-item label="账号" v-if="!editingId">
          <a-input v-model:value="modalForm.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="modalForm.userName" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="头像地址">
          <a-input v-model:value="modalForm.userAvatar" placeholder="请输入头像URL" />
        </a-form-item>
        <a-form-item label="简介">
          <a-textarea v-model:value="modalForm.userProfile" placeholder="请输入简介" :rows="3" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model:value="modalForm.userRole">
            <a-select-option value="user">用户</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.user-manage {
  max-width: 1200px;
  margin: 0 auto;
}

.search-card {
  margin-bottom: 16px;
}

.action-bar {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}
</style>
