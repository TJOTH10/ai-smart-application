<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { userRegister } from '@/api/userController'

const router = useRouter()

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})
const loading = ref(false)

async function handleRegister() {
  if (!formState.userAccount || !formState.userPassword || !formState.checkPassword) {
    message.warning('请填写完整信息')
    return
  }
  if (formState.userPassword !== formState.checkPassword) {
    message.warning('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    const res = await userRegister(formState)
    const data = res.data as API.BaseResponseLong
    if (data.code === 0) {
      message.success('注册成功，请登录')
      router.push('/user/login')
    } else {
      message.error(data.message || '注册失败')
    }
  } catch {
    message.error('网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <a-card class="register-card" title="用户注册" :bordered="false">
      <a-form
        :model="formState"
        autocomplete="off"
        layout="vertical"
        @finish="handleRegister"
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

        <a-form-item
          label="确认密码"
          name="checkPassword"
          :rules="[
            { required: true, message: '请确认密码' },
            {
              validator: async (_rule: unknown, value: string) => {
                if (value !== formState.userPassword) {
                  throw new Error('两次输入的密码不一致')
                }
              },
              trigger: 'blur',
            },
          ]"
        >
          <a-input-password
            v-model:value="formState.checkPassword"
            placeholder="请再次输入密码"
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
            注册
          </a-button>
        </a-form-item>
      </a-form>

      <div class="form-footer">
        已有账号？
        <router-link to="/user/login">立即登录</router-link>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px - 80px);
}

.register-card {
  width: 420px;
}

.register-card :deep(.ant-card-head-title) {
  text-align: center;
  font-size: 20px;
}

.form-footer {
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
</style>
