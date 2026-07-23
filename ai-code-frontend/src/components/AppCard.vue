<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { CommentOutlined, ExportOutlined } from '@ant-design/icons-vue'
import { formatTime } from '@/utils/time'

const props = withDefaults(
  defineProps<{
    app: API.AppVO
    showActions?: boolean
  }>(),
  {
    showActions: false,
  },
)

const router = useRouter()

function handleClick() {
  if (!props.app.id) return
  router.push(`/app/chat/${props.app.id}`)
}

const conversationUrl = computed(() => {
  const appId = props.app.id
  if (!appId) return ''

  return `/app/chat/${encodeURIComponent(appId)}`
})

const deployedUrl = computed(() => {
  const deployKey = props.app.deployKey?.trim()
  if (!deployKey) return ''

  return `http://localhost/${encodeURIComponent(deployKey)}/`
})
</script>

<template>
  <a-card hoverable class="app-card" @click="handleClick">
    <template #cover>
      <div class="card-cover">
        <img v-if="app.cover" :src="app.cover" :alt="app.appName" class="cover-img" />
        <div v-else class="cover-placeholder">
          <span class="placeholder-icon">📄</span>
        </div>
        <div v-if="showActions" class="card-actions">
          <a-button v-if="conversationUrl" type="primary" :href="conversationUrl" @click.stop>
            <template #icon><CommentOutlined /></template>
            查看对话
          </a-button>
          <a-button
            v-if="deployedUrl"
            :href="deployedUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            <template #icon><ExportOutlined /></template>
            查看作品
          </a-button>
        </div>
        <a-tag v-if="app.priority && app.priority >= 99" color="red" class="featured-tag">
          精选
        </a-tag>
      </div>
    </template>
    <a-card-meta :title="app.appName || '未命名应用'">
      <template #description>
        <div class="card-description">
          <span class="author">{{ app.user?.userName || '未知用户' }}</span>
          <span class="divider">·</span>
          <span class="time">{{ formatTime(app.createTime, 'YYYY-MM-DD') }}</span>
        </div>
      </template>
    </a-card-meta>
  </a-card>
</template>

<style scoped>
.app-card {
  border-radius: 8px;
  transition: transform 0.2s;
}

.app-card:hover {
  transform: translateY(-4px);
}

.card-cover {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #f5f5f5;
}

.card-actions {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(15, 23, 42, 0.62);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.card-cover:hover .card-actions,
.card-actions:focus-within {
  opacity: 1;
  pointer-events: auto;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.placeholder-icon {
  font-size: 48px;
}

.featured-tag {
  position: absolute;
  z-index: 2;
  top: 8px;
  right: 8px;
}

.card-description {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.divider {
  color: rgba(0, 0, 0, 0.25);
}
</style>
