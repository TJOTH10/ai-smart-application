<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  getAppVoById,
  getAppVoByIdByAdmin,
  updateApp,
  updateAppByAdmin,
} from '@/api/appController'
import { useLoginUserStore } from '@/stores/loginUser'

const route = useRoute()
const router = useRouter()
const store = useLoginUserStore()

const appId = String(route.params.appId)
const isAdmin = store.userRole === 'admin'
const loading = ref(false)
const submitting = ref(false)
const notAuthorized = ref(false)

// ---- Form State ----
const formState = reactive({
  appName: '',
  cover: '',
  priority: 0,
})

// ---- Load App Info ----
async function loadAppInfo() {
  loading.value = true
  try {
    const fetchFn = isAdmin ? getAppVoByIdByAdmin : getAppVoById
    const res = await fetchFn({ id: appId })
    const data = (res.data as API.BaseResponseAppVO).data

    if (res.data.code === 0 && data) {
      // Non-admin users can only edit their own apps
      if (!isAdmin && data.userId !== store.currentUser?.id) {
        notAuthorized.value = true
        message.warning('无权编辑此应用')
        return
      }
      formState.appName = data.appName || ''
      formState.cover = data.cover || ''
      formState.priority = data.priority ?? 0
    } else {
      message.error('获取应用信息失败')
    }
  } catch {
    message.error('获取应用信息失败')
  } finally {
    loading.value = false
  }
}

// ---- Submit ----
async function handleSubmit() {
  if (!formState.appName.trim()) {
    message.warning('应用名称不能为空')
    return
  }

  submitting.value = true
  try {
    let res
    if (isAdmin) {
      res = await updateAppByAdmin({
        id: appId,
        appName: formState.appName.trim(),
        cover: formState.cover || undefined,
        priority: formState.priority,
      })
    } else {
      res = await updateApp({
        id: appId,
        appName: formState.appName.trim(),
      })
    }

    const data = res.data as API.BaseResponseBoolean
    if (data.code === 0) {
      message.success('更新成功')
      router.push(isAdmin ? '/admin/app' : '/')
    } else {
      message.error(data.message || '更新失败')
    }
  } catch {
    message.error('网络错误')
  } finally {
    submitting.value = false
  }
}

function handleBack() {
  router.back()
}

// ---- Lifecycle ----
onMounted(() => {
  loadAppInfo()
})
</script>

<template>
  <div class="app-edit-page">
    <a-card :title="isAdmin ? '编辑应用（管理员）' : '编辑应用信息'" :bordered="false">
      <a-spin :spinning="loading">
        <div v-if="notAuthorized" class="not-authorized">
          <a-result status="403" title="403" sub-title="无权编辑此应用">
            <template #extra>
              <a-button type="primary" @click="handleBack">返回</a-button>
            </template>
          </a-result>
        </div>

        <a-form
          v-else
          :model="formState"
          layout="vertical"
          style="max-width: 560px"
          @finish="handleSubmit"
        >
          <a-form-item
            label="应用名称"
            name="appName"
            :rules="[{ required: true, message: '请输入应用名称' }]"
          >
            <a-input
              v-model:value="formState.appName"
              placeholder="请输入应用名称"
              size="large"
            />
          </a-form-item>

          <template v-if="isAdmin">
            <a-form-item label="应用封面" name="cover">
              <a-input
                v-model:value="formState.cover"
                placeholder="请输入封面图片URL（可选）"
              />
            </a-form-item>

            <a-form-item label="优先级" name="priority">
              <a-input-number
                v-model:value="formState.priority"
                :min="0"
                style="width: 100%"
                placeholder="0 为普通，99 为精选"
              />
            </a-form-item>
          </template>

          <a-form-item>
            <a-space>
              <a-button
                type="primary"
                html-type="submit"
                :loading="submitting"
                size="large"
              >
                保存
              </a-button>
              <a-button size="large" @click="handleBack">返回</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-card>
  </div>
</template>

<style scoped>
.app-edit-page {
  max-width: 640px;
  margin: 0 auto;
  padding-top: 24px;
}

.not-authorized {
  padding: 48px 0;
}
</style>
