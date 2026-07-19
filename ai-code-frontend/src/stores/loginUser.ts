import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUser } from '@/api/userController'

export const useLoginUserStore = defineStore('loginUser', () => {
  const currentUser = ref<API.LoginUserVO | null>(null)

  const isLoggedIn = computed(() => !!currentUser.value)
  const userRole = computed(() => currentUser.value?.userRole)

  let fetchPromise: Promise<void> | null = null

  async function fetchLoginUser() {
    // 避免重复请求
    if (fetchPromise) return fetchPromise
    fetchPromise = getLoginUser()
      .then((res) => {
        const data = res.data as API.BaseResponseLoginUserVO
        if (data.code === 0 && data.data) {
          currentUser.value = data.data
        } else {
          currentUser.value = null
        }
      })
      .catch(() => {
        currentUser.value = null
      })
      .finally(() => {
        fetchPromise = null
      })
    return fetchPromise
  }

  function logout() {
    currentUser.value = null
    // 标记用户主动退出，刷新后不再自动恢复登录态
    sessionStorage.setItem('logout', '1')
  }

  function clearLogoutFlag() {
    sessionStorage.removeItem('logout')
  }

  return { currentUser, isLoggedIn, userRole, fetchLoginUser, logout, clearLogoutFlag }
})
