import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const source = await readFile(new URL('../src/pages/app/AppChatPage.vue', import.meta.url), 'utf8')

test('code generation connects to the backend with EventSource', () => {
  assert.match(source, /new EventSource\(/)
  assert.match(source, /http:\/\/localhost:8123\/api\/app\/chat\/gen\/code/)
})

test('code generation unwraps message data and handles the done event', () => {
  assert.match(source, /JSON\.parse\(event\.data\)/)
  assert.match(source, /payload\.d/)
  assert.match(source, /addEventListener\(['"]done['"]/)
})

test('completed code generation forces the website preview to reload', () => {
  assert.match(source, /const previewRefreshKey = ref\(0\)/)
  assert.match(source, /await loadAppInfo\(true\)/)
  assert.match(source, /:key="previewRefreshKey"/)
})
