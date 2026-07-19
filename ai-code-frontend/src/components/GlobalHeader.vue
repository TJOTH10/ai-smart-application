<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/loginUser'

interface MenuItem {
  key: string
  label: string
  path: string
}

const menuItems: MenuItem[] = [
  { key: 'home', label: '首页', path: '/' },
  { key: 'about', label: '关于', path: '/about' },
]

const router = useRouter()
const route = useRoute()
const store = useLoginUserStore()

const selectedKeys = computed<string[]>(() => {
  const matched = menuItems.find((item) => item.path === route.path)
  return matched ? [matched.key] : []
})

function handleMenuClick(item: { key: string }) {
  const target = menuItems.find((m) => m.key === item.key)
  if (target) {
    router.push(target.path)
  }
}

function handleLogout() {
  store.logout()
  router.push('/user/login')
}
</script>

<template>
  <div class="global-header">
    <div class="header-left">
      <img class="logo" src="@/assets/logo.svg" alt="logo" />
      <span class="site-title">AI智能生成</span>
    </div>

    <div class="header-center">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="horizontal"
        @click="handleMenuClick"
      >
        <a-menu-item v-for="item in menuItems" :key="item.key">
          {{ item.label }}
        </a-menu-item>
      </a-menu>
    </div>

    <div class="header-right">
      <!-- 已登录 -->
      <template v-if="store.isLoggedIn">
        <a-dropdown placement="bottomRight">
          <div class="user-info">
            <a-avatar
              v-if="store.currentUser?.userAvatar"
              :src="store.currentUser.userAvatar"
              :size="32"
            />
            <a-avatar v-else :size="32" style="background-color: #1890ff">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <span class="user-name">
              {{ store.currentUser?.userName || store.currentUser?.userAccount }}
            </span>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="profile" @click="router.push('/user/profile')">
                <UserOutlined /> 个人中心
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="handleLogout">
                <LogoutOutlined /> 退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>

      <!-- 未登录 -->
      <template v-else>
        <a-button type="primary" @click="router.push('/user/login')">
          <template #icon><UserOutlined /></template>
          登录
        </a-button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.global-header {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.site-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  white-space: nowrap;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 24px;
}

.header-right {
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-info:hover {
  background: rgba(0, 0, 0, 0.04);
}

.user-name {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.88);
}
</style>
