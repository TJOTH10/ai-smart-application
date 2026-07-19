<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { userLogin } from '@/api/userController'
import { useLoginUserStore } from '@/stores/loginUser'

const router = useRouter()
const route = useRoute()
const store = useLoginUserStore()

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})
const loading = ref(false)

async function handleLogin() {
  if (!formState.userAccount || !formState.userPassword) {
    message.warning('请填写完整信息')
    return
  }

  loading.value = true
  try {
    const res = await userLogin(formState)
    const data = res.data as API.BaseResponseLoginUserVO
    if (data.code === 0 && data.data) {
      store.currentUser = data.data
      store.clearLogoutFlag()
      message.success('登录成功')
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    } else {
      message.error(data.message || '登录失败')
    }
  } catch {
    message.error('网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <a-card class="login-card" title="AI智能生成-用户登录" :bordered="false">
      <a-form
        :model="formState"
        autocomplete="off"
        layout="vertical"
        @finish="handleLogin"
      >
        <a-form-item
          label="账号"
          name="userAccount"
          :rules="[
            { required: true, message: '请输入账号' },
            { min: 4, message: '账号长度不能少于4位' },
          ]"
        >
          <a-input
            v-model:value="formState.userAccount"
            placeholder="请输入账号"
            size="large"
          />
        </a-form-item>

        <a-form-item
          label="密码"
          name="userPassword"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码长度不能少于8位' },
          ]"
        >
          <a-input-password
            v-model:value="formState.userPassword"
            placeholder="请输入密码"
            size="large"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            block
            size="large"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>

      <div class="form-footer">
        还没有账号？
        <router-link to="/user/register">立即注册</router-link>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px - 80px);
}

.login-card {
  width: 420px;
}

.login-card :deep(.ant-card-head-title) {
  text-align: center;
  font-size: 20px;
}

.form-footer {
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
</style>
