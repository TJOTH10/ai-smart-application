<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { SendOutlined, RocketOutlined } from '@ant-design/icons-vue'
import { getAppVoById, deployApp } from '@/api/appController'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

const route = useRoute()
const router = useRouter()
const appId = String(route.params.appId)
const shouldAutoGenerate = route.query.generate === '1'
const codeGenerationUrl = 'http://localhost:8123/api/app/chat/gen/code'
const chatHistoryKey = `app-chat-history:${appId}`

// ---- App Info ----
const appInfo = ref<API.AppVO | null>(null)
const appInfoLoading = ref(true)

// ---- Chat State ----
const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const streaming = ref(false)
const sending = ref(false)
const restoringGeneratedHistory = ref(false)
let activeEventSource: EventSource | null = null

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<ChatMessage>
  return (
    (candidate.role === 'user' || candidate.role === 'ai') && typeof candidate.content === 'string'
  )
}

function restoreChatHistory() {
  try {
    const storedHistory = localStorage.getItem(chatHistoryKey)
    if (!storedHistory) return

    const parsedHistory: unknown = JSON.parse(storedHistory)
    if (Array.isArray(parsedHistory) && parsedHistory.every(isChatMessage)) {
      messages.value = parsedHistory
    }
  } catch {
    localStorage.removeItem(chatHistoryKey)
  }
}

function saveChatHistory() {
  try {
    localStorage.setItem(chatHistoryKey, JSON.stringify(messages.value))
  } catch (error) {
    console.warn('Unable to save chat history:', error)
  }
}

// ---- Preview ----
const previewUrl = ref('')
const previewReady = ref(false)
const previewRefreshKey = ref(0)

// ---- Scrolling ----
const chatListRef = ref<HTMLElement | null>(null)

function scrollToBottom() {
  nextTick(() => {
    if (chatListRef.value) {
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight
    }
  })
}

// ---- API Helpers ----
async function loadAppInfo(refreshPreview = false) {
  try {
    const res = await getAppVoById({ id: appId })
    const data = (res.data as API.BaseResponseAppVO).data
    if (res.data.code === 0 && data) {
      appInfo.value = data
      // If codeGenType already exists (pre-generated), show preview
      if (data.codeGenType) {
        previewUrl.value = `http://localhost:8123/api/static/${data.codeGenType}_${appId}/`
        previewReady.value = true
        if (refreshPreview) {
          previewRefreshKey.value += 1
        }
      }
    }
  } catch {
    message.error('获取应用信息失败')
  } finally {
    appInfoLoading.value = false
  }
}

async function fetchGeneratedFile(fileName: string) {
  try {
    const response = await fetch(`${previewUrl.value}${fileName}`, {
      credentials: 'include',
    })
    return response.ok ? await response.text() : ''
  } catch {
    return ''
  }
}

function formatGeneratedFile(fileName: string, language: string, content: string) {
  const backtickRuns = content.match(/`+/g) ?? []
  const fenceLength = Math.max(3, ...backtickRuns.map((run) => run.length + 1))
  const fence = '`'.repeat(fenceLength)
  return `### ${fileName}\n\n${fence}${language}\n${content.trim()}\n${fence}`
}

async function restoreGeneratedConversation() {
  if (!previewReady.value || !appInfo.value?.codeGenType) return

  restoringGeneratedHistory.value = true
  try {
    const generatedFiles =
      appInfo.value.codeGenType === 'multi_file'
        ? [
            { name: 'index.html', language: 'html' },
            { name: 'style.css', language: 'css' },
            { name: 'script.js', language: 'javascript' },
          ]
        : [{ name: 'index.html', language: 'html' }]
    const fileContents = await Promise.all(
      generatedFiles.map(async (file) => ({
        ...file,
        content: await fetchGeneratedFile(file.name),
      })),
    )
    const availableFiles = fileContents.filter((file) => file.content.trim())
    if (availableFiles.length === 0) return

    const restoredMessages: ChatMessage[] = []
    if (appInfo.value.initPrompt) {
      restoredMessages.push({ role: 'user', content: appInfo.value.initPrompt })
    }
    restoredMessages.push({
      role: 'ai',
      content: `已从现有作品文件恢复生成结果。\n\n${availableFiles
        .map((file) => formatGeneratedFile(file.name, file.language, file.content))
        .join('\n\n')}`,
    })
    messages.value = restoredMessages
    saveChatHistory()
    scrollToBottom()
  } finally {
    restoringGeneratedHistory.value = false
  }
}

function generateCode(message: string, onChunk: (chunk: string) => void) {
  const params = new URLSearchParams({ appId, message })
  const eventSource = new EventSource(`${codeGenerationUrl}?${params}`, {
    withCredentials: true,
  })
  activeEventSource = eventSource

  return new Promise<void>((resolve, reject) => {
    const close = () => {
      eventSource.close()
      if (activeEventSource === eventSource) {
        activeEventSource = null
      }
    }

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { d?: unknown }
        if (typeof payload.d === 'string') {
          onChunk(payload.d)
        }
      } catch {
        close()
        reject(new Error('AI 返回的数据格式无效'))
      }
    }

    eventSource.addEventListener('done', () => {
      close()
      resolve()
    })

    eventSource.onerror = () => {
      close()
      reject(new Error('AI 对话连接失败'))
    }
  })
}

async function sendMessage(msg: string) {
  const trimmed = msg.trim()
  if (!trimmed || streaming.value) return

  inputMessage.value = ''
  sending.value = true

  // Add user message
  messages.value.push({ role: 'user', content: trimmed })
  scrollToBottom()

  // Add empty AI message placeholder
  messages.value.push({ role: 'ai', content: '' })
  const aiMsgIndex = messages.value.length - 1
  streaming.value = true
  saveChatHistory()

  try {
    await generateCode(trimmed, (chunk) => {
      const aiMessage = messages.value[aiMsgIndex]
      if (aiMessage) {
        aiMessage.content += chunk
        scrollToBottom()
      }
    })

    // After streaming completes, update app info to get codeGenType
    await loadAppInfo(true)
  } catch (e) {
    console.error('SSE error:', e)
    const aiMsg = messages.value[aiMsgIndex]
    if (aiMsg && aiMsg.content === '') {
      aiMsg.content = '抱歉，生成过程中出现了错误，请重试。'
    }
  } finally {
    streaming.value = false
    sending.value = false
    saveChatHistory()
  }
}

// ---- Deploy ----
const deploying = ref(false)

async function handleDeploy() {
  deploying.value = true
  try {
    const res = await deployApp({ appId })
    const data = res.data as API.BaseResponseString
    if (res.data.code === 0 && data.data) {
      Modal.success({
        title: '部署成功',
        content: `您的应用已部署到：${data.data}`,
        okText: '打开应用',
        onOk: () => {
          window.open(data.data, '_blank')
        },
      })
    } else {
      message.error(res.data.message || '部署失败')
    }
  } catch {
    message.error('部署失败，请稍后重试')
  } finally {
    deploying.value = false
  }
}

// ---- Keyboard ----
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage(inputMessage.value)
  }
}

// ---- Lifecycle ----
onMounted(async () => {
  restoreChatHistory()
  if (shouldAutoGenerate) {
    await router.replace({ path: route.path })
  }
  await loadAppInfo()

  if (shouldAutoGenerate && messages.value.length === 0 && appInfo.value?.initPrompt) {
    await sendMessage(appInfo.value.initPrompt)
  } else if (messages.value.length === 0) {
    await restoreGeneratedConversation()
  }
})

onUnmounted(() => {
  activeEventSource?.close()
  activeEventSource = null
  saveChatHistory()
})
</script>

<template>
  <div class="chat-page">
    <!-- Loading State -->
    <div v-if="appInfoLoading" class="loading-wrapper">
      <a-spin size="large" tip="加载中..." />
    </div>

    <template v-else>
      <!-- Top Bar -->
      <div class="chat-topbar">
        <div class="topbar-left">
          <h2 class="app-title">{{ appInfo?.appName || '未命名应用' }}</h2>
          <a-tag v-if="appInfo?.codeGenType" color="blue">{{ appInfo.codeGenType }}</a-tag>
        </div>
        <div class="topbar-right">
          <a-button type="primary" :loading="deploying" @click="handleDeploy">
            <template #icon><RocketOutlined /></template>
            部署
          </a-button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="chat-main">
        <!-- Left: Chat Panel -->
        <div class="chat-left">
          <!-- Messages -->
          <div ref="chatListRef" class="chat-messages">
            <div v-if="messages.length === 0" class="chat-empty">
              <a-spin v-if="restoringGeneratedHistory" tip="正在恢复历史对话..." />
              <a-empty v-else description="暂无历史对话" />
            </div>
            <div
              v-for="(msg, idx) in messages"
              :key="idx"
              class="message-wrapper"
              :class="msg.role === 'user' ? 'message-user' : 'message-ai'"
            >
              <div class="message-bubble">
                <template v-if="msg.role === 'ai'">
                  <MarkdownRenderer :content="msg.content" />
                  <div v-if="idx === messages.length - 1 && streaming" class="streaming-cursor" />
                </template>
                <template v-else>
                  <div class="user-message-text">{{ msg.content }}</div>
                </template>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="chat-input-area">
            <a-textarea
              v-model:value="inputMessage"
              placeholder="输入消息，Enter 发送，Shift+Enter 换行..."
              :auto-size="{ minRows: 1, maxRows: 4 }"
              :disabled="streaming"
              class="chat-input"
              @keydown="handleKeyDown"
            />
            <a-button
              type="primary"
              shape="circle"
              :loading="sending"
              :disabled="!inputMessage.trim() || streaming"
              class="send-btn"
              @click="sendMessage(inputMessage)"
            >
              <template #icon><SendOutlined /></template>
            </a-button>
          </div>
        </div>

        <!-- Right: Preview Panel -->
        <div class="chat-right">
          <div v-if="previewReady" class="preview-container">
            <iframe
              :key="previewRefreshKey"
              :src="previewUrl"
              class="preview-iframe"
              frameborder="0"
            />
          </div>
          <div v-else class="preview-placeholder">
            <a-empty description="生成完成后将在此展示预览" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Layout */
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px - 80px);
  margin: -24px;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Top Bar */
.chat-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

/* Main Content */
.chat-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left Chat Panel */
.chat-left {
  display: flex;
  flex-direction: column;
  width: 45%;
  min-width: 400px;
  border-right: 1px solid #f0f0f0;
  background: #fff;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.chat-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Message Bubbles */
.message-wrapper {
  display: flex;
  margin-bottom: 16px;
}

.message-user {
  justify-content: flex-end;
}

.message-ai {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 85%;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.message-user .message-bubble {
  background: #1890ff;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message-user .message-bubble :deep(p) {
  margin: 0;
}

.user-message-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.message-ai .message-bubble {
  background: #f5f5f5;
  border-bottom-left-radius: 4px;
}

/* Streaming Cursor */
.streaming-cursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  background: rgba(0, 0, 0, 0.65);
  animation: blink 1s infinite;
  vertical-align: text-bottom;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

/* Input Area */
.chat-input-area {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
}

.send-btn {
  flex-shrink: 0;
}

/* Right Preview Panel */
.chat-right {
  flex: 1;
  background: #fff;
}

.preview-container {
  width: 100%;
  height: 100%;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
