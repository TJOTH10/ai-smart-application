import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const cardSource = await readFile(new URL('../src/components/AppCard.vue', import.meta.url), 'utf8')
const homeSource = await readFile(new URL('../src/pages/HomeView.vue', import.meta.url), 'utf8')
const chatSource = await readFile(
  new URL('../src/pages/app/AppChatPage.vue', import.meta.url),
  'utf8',
)

test('my app cards expose conversation and deployed website actions', () => {
  assert.match(homeSource, /<AppCard\s+:app="app"\s+show-actions\s*\/>/)
  assert.match(cardSource, /查看对话/)
  assert.match(cardSource, /查看作品/)
  assert.match(cardSource, /v-if="deployedUrl"/)
})

test('conversation action renders a direct link and preserves the app ID', () => {
  assert.match(cardSource, /const conversationUrl = computed\(\(\) => \{/)
  assert.match(cardSource, /return `\/app\/chat\/\$\{encodeURIComponent\(appId\)\}`/)
  assert.match(cardSource, /:href="conversationUrl"/)
  assert.match(cardSource, /@click\.stop/)
  assert.doesNotMatch(cardSource, /handleViewConversation/)
  assert.doesNotMatch(cardSource, /window\.location/)
})

test('deployed website action opens the public deployment host in a new tab', () => {
  assert.match(cardSource, /props\.app\.deployKey/)
  assert.match(cardSource, /http:\/\/localhost\/\$\{encodeURIComponent\(deployKey\)\}\//)
  assert.doesNotMatch(cardSource, /\/api\/static\/\$\{encodeURIComponent\(deployKey\)\}\//)
  assert.match(cardSource, /target="_blank"/)
  assert.match(cardSource, /rel="noopener noreferrer"/)
})

test('returning to an existing conversation does not regenerate the website', () => {
  assert.match(chatSource, /route\.query\.generate === '1'/)
  assert.match(
    chatSource,
    /shouldAutoGenerate && messages\.value\.length === 0 && appInfo\.value\?\.initPrompt/,
  )
})
