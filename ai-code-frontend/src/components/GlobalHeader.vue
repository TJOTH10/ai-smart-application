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

const router = useRouter()
const route = useRoute()
const store = useLoginUserStore()

const menuItems = computed<MenuItem[]>(() => {
  const items: MenuItem[] = [
    { key: 'home', label: '首页', path: '/' },
  ]
  if (store.userRole === 'admin') {
    items.push({ key: 'adminApp', label: '应用管理', path: '/admin/app' })
    items.push({ key: 'adminUser', label: '用户管理', path: '/admin/user' })
  }
  return items
})

const selectedKeys = computed<string[]>(() => {
  const currentPath = route.path
  // Exact match first
  const exactMatch = menuItems.value.find((item) => item.path === currentPath)
  if (exactMatch) return [exactMatch.key]
  // Prefix match for sub-routes
  const prefixMatch = menuItems.value.find(
    (item) => item.path !== '/' && currentPath.startsWith(item.path),
  )
  if (prefixMatch) return [prefixMatch.key]
  return []
})

function handleMenuClick(item: { key: string }) {
  const target = menuItems.value.find((m) => m.key === item.key)
  if (target) {
    router.push(target.path)
  }
}

function handleLogout() {
  store.logout()
  router.replace('/')
}
</script>

<template>
  <div class="global-header">
    <router-link to="/" class="header-left" aria-label="返回首页">
      <img class="logo" src="@/assets/logo.svg" alt="logo" />
      <span class="site-title">AI智能生成</span>
    </router-link>

    <div class="header-center">
      <a-menu
        class="header-menu"
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
  text-decoration: none;
}

.header-left:focus-visible {
  outline: 2px solid #1677ff;
  outline-offset: 4px;
  border-radius: 4px;
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
  justify-content: flex-start;
  min-width: 0;
  margin: 0 24px;
}

.header-menu {
  flex: 1;
  min-width: 0;
  justify-content: flex-start;
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
