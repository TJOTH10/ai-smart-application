<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { addApp, listMyAppVoByPage, listGoodAppVoByPage } from '@/api/appController'
import AppCard from '@/components/AppCard.vue'

const router = useRouter()

// ---- Prompt Input ----
const promptInput = ref('')
const creating = ref(false)

async function handleCreateApp() {
  const trimmed = promptInput.value.trim()
  if (!trimmed) {
    message.warning('请输入您想要创建的应用描述')
    return
  }

  creating.value = true
  try {
    const res = await addApp({ initPrompt: trimmed })
    const data = (res.data as API.BaseResponseLong).data
    if (res.data.code === 0 && data) {
      router.push({
        path: `/app/chat/${data}`,
        query: { generate: '1' },
      })
    } else {
      message.error(res.data.message || '创建失败')
    }
  } catch {
    message.error('网络错误，请稍后重试')
  } finally {
    creating.value = false
  }
}

// ---- My Apps ----
const myApps = ref<API.AppVO[]>([])
const myAppsTotal = ref(0)
const myAppsLoading = ref(false)
const myAppsQuery = reactive<API.AppQueryRequest>({
  pageNum: 1,
  pageSize: 20,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const myAppSearchName = ref('')

function handleMyAppsSearch() {
  myAppsQuery.pageNum = 1
  myAppsQuery.appName = myAppSearchName.value.trim() || undefined
  fetchMyApps()
}

async function fetchMyApps() {
  myAppsLoading.value = true
  try {
    const res = await listMyAppVoByPage(myAppsQuery)
    const data = (res.data as API.BaseResponsePageAppVO).data
    if (data) {
      myApps.value = data.records ?? []
      myAppsTotal.value = data.totalRow ?? 0
    }
  } catch {
    message.error('获取我的应用列表失败')
  } finally {
    myAppsLoading.value = false
  }
}

function handleMyAppsPageChange(page: number, pageSize: number) {
  myAppsQuery.pageNum = page
  myAppsQuery.pageSize = pageSize
  fetchMyApps()
}

// ---- Good Apps ----
const goodApps = ref<API.AppVO[]>([])
const goodAppsTotal = ref(0)
const goodAppsLoading = ref(false)
const goodAppsQuery = reactive<API.AppQueryRequest>({
  pageNum: 1,
  pageSize: 20,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const goodAppSearchName = ref('')

function handleGoodAppsSearch() {
  goodAppsQuery.pageNum = 1
  goodAppsQuery.appName = goodAppSearchName.value.trim() || undefined
  fetchGoodApps()
}

async function fetchGoodApps() {
  goodAppsLoading.value = true
  try {
    const res = await listGoodAppVoByPage(goodAppsQuery)
    const data = (res.data as API.BaseResponsePageAppVO).data
    if (data) {
      goodApps.value = data.records ?? []
      goodAppsTotal.value = data.totalRow ?? 0
    }
  } catch {
    message.error('获取精选应用列表失败')
  } finally {
    goodAppsLoading.value = false
  }
}

function handleGoodAppsPageChange(page: number, pageSize: number) {
  goodAppsQuery.pageNum = page
  goodAppsQuery.pageSize = pageSize
  fetchGoodApps()
}

// ---- Lifecycle ----
onMounted(() => {
  fetchMyApps()
  fetchGoodApps()
})
</script>

<template>
  <div class="home-page">
    <!-- Banner -->
    <div class="home-banner">
      <h1 class="banner-title">AI 智能应用生成平台</h1>
      <p class="banner-subtitle">通过 AI 对话，轻松创建属于你自己的网站应用</p>
    </div>

    <!-- Prompt Input -->
    <div class="prompt-section">
      <a-card :bordered="false" class="prompt-card">
        <a-textarea
          v-model:value="promptInput"
          placeholder="描述你想要创建的应用，例如：帮我创建一个个人博客网站，包含首页、文章列表和关于页面..."
          :auto-size="{ minRows: 3, maxRows: 6 }"
          class="prompt-textarea"
          @press-enter="handleCreateApp"
        />
        <div class="prompt-actions">
          <span class="prompt-hint">按 Enter 发送，Shift + Enter 换行</span>
          <a-button type="primary" size="large" :loading="creating" @click="handleCreateApp">
            开始生成
          </a-button>
        </div>
      </a-card>
    </div>

    <!-- My Apps -->
    <a-card title="我的应用" class="section-card">
      <template #extra>
        <a-input-search
          v-model:value="myAppSearchName"
          placeholder="搜索应用名称"
          style="width: 240px"
          @search="handleMyAppsSearch"
        />
      </template>

      <a-spin :spinning="myAppsLoading">
        <div v-if="myApps.length > 0" class="app-grid">
          <a-row :gutter="[16, 16]">
            <a-col v-for="app in myApps" :key="app.id" :xs="24" :sm="12" :md="8" :lg="6">
              <AppCard :app="app" show-actions />
            </a-col>
          </a-row>
        </div>
        <a-empty v-else description="暂无应用，快去创建一个吧" />

        <div v-if="myAppsTotal > 0" class="pagination-wrapper">
          <a-pagination
            :current="myAppsQuery.pageNum"
            :page-size="myAppsQuery.pageSize"
            :total="myAppsTotal"
            :show-total="(t: number) => `共 ${t} 个应用`"
            @change="handleMyAppsPageChange"
          />
        </div>
      </a-spin>
    </a-card>

    <!-- Good Apps -->
    <a-card title="精选应用" class="section-card">
      <template #extra>
        <a-input-search
          v-model:value="goodAppSearchName"
          placeholder="搜索应用名称"
          style="width: 240px"
          @search="handleGoodAppsSearch"
        />
      </template>

      <a-spin :spinning="goodAppsLoading">
        <div v-if="goodApps.length > 0" class="app-grid">
          <a-row :gutter="[16, 16]">
            <a-col v-for="app in goodApps" :key="app.id" :xs="24" :sm="12" :md="8" :lg="6">
              <AppCard :app="app" show-actions />
            </a-col>
          </a-row>
        </div>
        <a-empty v-else description="暂无精选应用" />

        <div v-if="goodAppsTotal > 0" class="pagination-wrapper">
          <a-pagination
            :current="goodAppsQuery.pageNum"
            :page-size="goodAppsQuery.pageSize"
            :total="goodAppsTotal"
            :show-total="(t: number) => `共 ${t} 个应用`"
            @change="handleGoodAppsPageChange"
          />
        </div>
      </a-spin>
    </a-card>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.home-banner {
  text-align: center;
  padding: 48px 0 32px;
}

.banner-title {
  font-size: 36px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.88);
  margin-bottom: 12px;
}

.banner-subtitle {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.45);
}

.prompt-section {
  margin-bottom: 32px;
}

.prompt-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.prompt-textarea {
  font-size: 15px;
}

.prompt-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.prompt-hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
}

.section-card {
  margin-bottom: 24px;
}

.app-grid {
  min-height: 100px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
