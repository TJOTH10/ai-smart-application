import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const source = await readFile(
  new URL('../src/pages/admin/AppManagePage.vue', import.meta.url),
  'utf8',
)

test('featured apps can be restored to the normal priority', () => {
  assert.match(
    source,
    /async function handleUnfeatured[\s\S]*updateAppByAdmin\(\{ id: record\.id, priority: 0 \}\)/,
  )
  assert.match(source, /v-else[\s\S]*@click="handleUnfeatured\(record\)"[\s\S]*取消精选/)
})
