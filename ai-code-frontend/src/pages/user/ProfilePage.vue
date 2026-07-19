<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { UserOutlined, EditOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/loginUser'
import { getLoginUser } from '@/api/userController'

const store = useLoginUserStore()
const loading = ref(false)

interface UserProfile {
  id?: number
  userAccount?: string
  userName?: string
  userAvatar?: string
  userProfile?: string
  userRole?: string
  createTime?: string
}

const userInfo = reactive<UserProfile>({})

async function fetchUserInfo() {
  loading.value = true
  try {
    const res = await getLoginUser()
    const data = res.data as API.BaseResponseLoginUserVO
    if (data.code === 0 && data.data) {
      Object.assign(userInfo, data.data)
      store.currentUser = data.data
    }
  } catch {
    message.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <div class="profile-page">
    <a-spin :spinning="loading">
      <a-row :gutter="24">
        <!-- 左侧：头像 + 基本信息 -->
        <a-col :xs="24" :md="8">
          <a-card :bordered="false">
            <div class="avatar-section">
              <a-avatar
                v-if="userInfo.userAvatar"
                :src="userInfo.userAvatar"
                :size="96"
              />
              <a-avatar v-else :size="96" style="background-color: #1890ff">
                <template #icon><UserOutlined :style="{ fontSize: '48px' }" /></template>
              </a-avatar>
              <h2 class="user-name">
                {{ userInfo.userName || userInfo.userAccount || '-' }}
              </h2>
              <a-tag :color="userInfo.userRole === 'admin' ? 'red' : 'blue'">
                {{ userInfo.userRole === 'admin' ? '管理员' : '普通用户' }}
              </a-tag>
            </div>
          </a-card>
        </a-col>

        <!-- 右侧：详细信息 -->
        <a-col :xs="24" :md="16">
          <a-card title="基本信息" :bordered="false">
            <a-descriptions :column="1" layout="horizontal" size="middle">
              <a-descriptions-item label="用户 ID">
                {{ userInfo.id ?? '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="账号">
                {{ userInfo.userAccount ?? '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="昵称">
                {{ userInfo.userName || '未设置' }}
              </a-descriptions-item>
              <a-descriptions-item label="简介">
                {{ userInfo.userProfile || '暂无简介' }}
              </a-descriptions-item>
              <a-descriptions-item label="注册时间">
                {{ userInfo.createTime ?? '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 960px;
  margin: 0 auto;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.user-name {
  margin: 16px 0 8px;
  font-size: 18px;
}
</style>
