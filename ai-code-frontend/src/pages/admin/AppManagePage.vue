<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import {
  listAppVoByPageByAdmin,
  deleteAppByAdmin,
  updateAppByAdmin,
} from '@/api/appController'
import { formatTime } from '@/utils/time'

const router = useRouter()

// ---- Table State ----
const dataSource = ref<API.AppVO[]>([])
const total = ref(0)
const loading = ref(false)
const queryParams = reactive<API.AppQueryRequest>({
  pageNum: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// ---- Search Form ----
const searchForm = reactive({
  appName: '',
  codeGenType: '',
  priority: undefined as number | undefined,
  userId: undefined as number | undefined,
})

// ---- Columns ----
const columns: TableColumnsType = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '应用名称', dataIndex: 'appName', key: 'appName', width: 150, ellipsis: true },
  { title: '封面', dataIndex: 'cover', key: 'cover', width: 80 },
  { title: '代码类型', dataIndex: 'codeGenType', key: 'codeGenType', width: 100 },
  { title: '优先级', dataIndex: 'priority', key: 'priority', width: 80 },
  { title: '用户', key: 'user', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'actions', width: 220 },
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
    const res = await listAppVoByPageByAdmin(queryParams)
    const data = (res.data as API.BaseResponsePageAppVO).data
    if (data) {
      dataSource.value = data.records ?? []
      total.value = data.totalRow ?? 0
    }
  } catch {
    message.error('获取应用列表失败')
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
  queryParams.appName = searchForm.appName || undefined
  queryParams.codeGenType = searchForm.codeGenType || undefined
  queryParams.priority = searchForm.priority
  queryParams.userId = searchForm.userId
  fetchData()
}

function handleReset() {
  searchForm.appName = ''
  searchForm.codeGenType = ''
  searchForm.priority = undefined
  searchForm.userId = undefined
  queryParams.pageNum = 1
  queryParams.appName = undefined
  queryParams.codeGenType = undefined
  queryParams.priority = undefined
  queryParams.userId = undefined
  fetchData()
}

// ---- Delete ----
async function handleDelete(id: API.AppId) {
  try {
    const res = await deleteAppByAdmin({ id })
    const data = res.data as API.BaseResponseBoolean
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

// ---- Featured ----
async function handleFeatured(record: API.AppVO) {
  try {
    const res = await updateAppByAdmin({ id: record.id, priority: 99 })
    const data = res.data as API.BaseResponseBoolean
    if (data.code === 0) {
      message.success('已设为精选')
      fetchData()
    } else {
      message.error(data.message || '操作失败')
    }
  } catch {
    message.error('网络错误')
  }
}

async function handleUnfeatured(record: API.AppVO) {
  try {
    const res = await updateAppByAdmin({ id: record.id, priority: 0 })
    const data = res.data as API.BaseResponseBoolean
    if (data.code === 0) {
      message.success('已取消精选')
      fetchData()
    } else {
      message.error(data.message || '操作失败')
    }
  } catch {
    message.error('网络错误')
  }
}

// ---- Edit ----
function handleEdit(record: API.AppVO) {
  router.push(`/app/edit/${record.id}`)
}

// ---- Lifecycle ----
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="app-manage">
    <!-- Search -->
    <a-card class="search-card" size="small">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="应用名称">
          <a-input
            v-model:value="searchForm.appName"
            placeholder="请输入应用名称"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="代码类型">
          <a-input
            v-model:value="searchForm.codeGenType"
            placeholder="请输入代码类型"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="优先级">
          <a-input-number
            v-model:value="searchForm.priority"
            placeholder="优先级"
            style="width: 100px"
          />
        </a-form-item>
        <a-form-item label="用户ID">
          <a-input-number
            v-model:value="searchForm.userId"
            placeholder="用户ID"
            style="width: 120px"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

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
        <template
          #bodyCell="{ column, record }: { column: { key: string }; record: API.AppVO }"
        >
          <template v-if="column.key === 'cover'">
            <a-avatar
              v-if="record.cover"
              :src="record.cover"
              :size="40"
              shape="square"
            />
            <span v-else style="color: rgba(0,0,0,0.25)">-</span>
          </template>
          <template v-else-if="column.key === 'codeGenType'">
            <a-tag v-if="record.codeGenType" color="blue">{{ record.codeGenType }}</a-tag>
            <span v-else style="color: rgba(0,0,0,0.25)">-</span>
          </template>
          <template v-else-if="column.key === 'priority'">
            <a-tag v-if="record.priority && record.priority >= 99" color="red">
              {{ record.priority }}（精选）
            </a-tag>
            <span v-else>{{ record.priority ?? 0 }}</span>
          </template>
          <template v-else-if="column.key === 'user'">
            {{ record.user?.userName || record.user?.userAccount || '-' }}
          </template>
          <template v-else-if="column.key === 'createTime'">
            {{ formatTime(record.createTime) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-popconfirm
              title="确认删除该应用？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleDelete(record.id!)"
            >
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
            <a-button
              v-if="!record.priority || record.priority < 99"
              type="link"
              size="small"
              @click="handleFeatured(record)"
            >
              精选
            </a-button>
            <a-button
              v-else
              type="link"
              size="small"
              @click="handleUnfeatured(record)"
            >
              取消精选
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped>
.app-manage {
  max-width: 1400px;
  margin: 0 auto;
}

.search-card {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}
</style>
