import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const homeSource = await readFile(new URL('../src/pages/HomeView.vue', import.meta.url), 'utf8')
const cardSource = await readFile(new URL('../src/components/AppCard.vue', import.meta.url), 'utf8')
const chatSource = await readFile(
  new URL('../src/pages/app/AppChatPage.vue', import.meta.url),
  'utf8',
)

test('new apps explicitly opt in to first code generation', () => {
  assert.match(homeSource, /query:\s*\{\s*generate:\s*['"]1['"]\s*\}/)
})

test('my apps and featured apps both expose card actions', () => {
  const actionCards = homeSource.match(/<AppCard\s+:app="app"\s+show-actions\s*\/>/g) ?? []
  assert.equal(actionCards.length, 2)
})

test('my app cards expose separate chat and deployed-work actions', () => {
  assert.match(cardSource, /showActions\?: boolean/)
  assert.match(cardSource, /查看对话/)
  assert.match(cardSource, /查看作品/)
  assert.match(cardSource, /app\.deployKey/)
  assert.match(cardSource, /http:\/\/localhost\/\$\{encodeURIComponent\(deployKey\)\}\//)
})

test('opening an existing chat restores history without regenerating code', () => {
  assert.match(chatSource, /route\.query\.generate === ['"]1['"]/)
  assert.match(chatSource, /localStorage\.getItem/)
  assert.match(chatSource, /localStorage\.setItem/)
  assert.match(chatSource, /restoreChatHistory\(\)/)
  assert.match(
    chatSource,
    /shouldAutoGenerate\s*&&\s*messages\.value\.length === 0\s*&&\s*appInfo\.value\?\.initPrompt/,
  )
  assert.doesNotMatch(
    chatSource,
    /if \(appInfo\.value\?\.initPrompt\) \{\s*await sendMessage\(appInfo\.value\.initPrompt\)/,
  )
})

test('older apps recover their generated files instead of waiting for AI', () => {
  assert.match(chatSource, /async function restoreGeneratedConversation\(\)/)
  assert.match(chatSource, /['"]index\.html['"]/)
  assert.match(chatSource, /['"]style\.css['"]/)
  assert.match(chatSource, /['"]script\.js['"]/)
  assert.match(chatSource, /await restoreGeneratedConversation\(\)/)
  assert.match(chatSource, /暂无历史对话/)
  assert.doesNotMatch(chatSource, /等待 AI 生成/)
})
