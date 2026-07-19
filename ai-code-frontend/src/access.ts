import router from '@/router'
import { useLoginUserStore } from '@/stores/loginUser'
import { message } from 'ant-design-vue'

// 标记是否已完成首次用户信息获取
let firstFetchDone = false

router.beforeEach(async (to, _from, next) => {
  const store = useLoginUserStore()

  // 首次加载时获取登录用户信息（用户已主动退出则跳过）
  if (!firstFetchDone) {
    if (!sessionStorage.getItem('logout')) {
      await store.fetchLoginUser()
    }
    firstFetchDone = true
  }

  // 管理员路由校验
  if (to.path.startsWith('/admin')) {
    if (store.userRole !== 'admin') {
      message.warning('无权限，仅管理员可访问')
      next({ path: '/', replace: true })
      return
    }
  }

  next()
})
