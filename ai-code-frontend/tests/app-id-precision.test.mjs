import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import test from 'node:test'

const appPages = ['AppChatPage.vue', 'AppEditPage.vue']

for (const page of appPages) {
  test(`${page} preserves a snowflake app ID from the route`, async () => {
    const source = await readFile(new URL(`../src/pages/app/${page}`, import.meta.url), 'utf8')
    const initializer = source.match(/^const appId = (.+)$/m)?.[1]

    assert.ok(initializer, `${page} should initialize appId from the route`)

    const originalId = '437869900385234945'
    const route = { params: { appId: originalId } }
    const appId = Function('route', `return ${initializer}`)(route)

    assert.equal(String(appId), originalId)
  })
}

test('application ID API contracts remain string-based', async () => {
  const typings = await readFile(new URL('../src/api/typings.d.ts', import.meta.url), 'utf8')

  assert.match(typings, /type AppId = string/)
  assert.match(typings, /type BaseResponseLong = \{[\s\S]*?data\?: string[\s\S]*?\}/)
  assert.match(typings, /type AppVO = \{[\s\S]*?id\?: AppId[\s\S]*?\}/)
  assert.match(typings, /type AppDeployRequest = \{[\s\S]*?appId\?: AppId[\s\S]*?\}/)
})

test('source code never coerces an application ID to a JavaScript number', async () => {
  const srcDirectory = new URL('../src/', import.meta.url)
  const entries = await readdir(srcDirectory, { recursive: true, withFileTypes: true })
  const sourceFiles = entries.filter((entry) => entry.isFile() && /\.(?:ts|vue)$/.test(entry.name))

  const numericCoercionPatterns = [
    /\b(?:Number|parseInt|parseFloat)\s*\([^)]*(?:\bappId\b|\bapp\.id\b)/,
    /(?:[=(,:?]|\breturn)\s*\+\s*(?:\bappId\b|\bapp\.id\b)/,
    /~~\s*(?:\bappId\b|\bapp\.id\b)/,
    /(?:\bappId\b|\bapp\.id\b)\s*(?:[-*/%|&^])(?!=)/,
    /(?:\bappId\b|\bapp\.id\b)\s+as\s+(?:unknown\s+as\s+)?number\b/,
    /\bMath\.\w+\s*\([^)]*(?:\bappId\b|\bapp\.id\b)/,
  ]

  for (const file of sourceFiles) {
    const filePath = join(file.parentPath, file.name)
    const source = await readFile(filePath, 'utf8')
    for (const pattern of numericCoercionPatterns) {
      assert.doesNotMatch(source, pattern, `${filePath} must preserve application IDs as strings`)
    }
  }
})
