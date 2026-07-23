import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const source = await readFile(
  new URL('../src/components/GlobalHeader.vue', import.meta.url),
  'utf8',
)

test('header brand links to the website home page', () => {
  assert.match(source, /<router-link\s+to="\/"\s+class="header-left"/)
  assert.match(source, /<router-link[\s\S]*<img class="logo"[\s\S]*<\/router-link>/)
})

test('header navigation is aligned to the left', () => {
  assert.match(
    source,
    /\.header-center\s*{[\s\S]*?justify-content:\s*flex-start;[\s\S]*?}/,
  )
  assert.match(
    source,
    /\.header-menu\s*{[\s\S]*?flex:\s*1;[\s\S]*?min-width:\s*0;[\s\S]*?justify-content:\s*flex-start;[\s\S]*?}/,
  )
  assert.match(source, /<a-menu\s+class="header-menu"/)
  assert.match(source, /<a-menu-item\s+v-for="item in menuItems"/)
})
