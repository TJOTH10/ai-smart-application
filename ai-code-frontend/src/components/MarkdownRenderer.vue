<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps<{
  content: string
}>()

const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  highlight(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        )
      } catch {
        // fall through
      }
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  },
})

const renderedHtml = computed(() => md.render(props.content))
</script>

<template>
  <div class="markdown-renderer" v-html="renderedHtml" />
</template>

<style scoped>
.markdown-renderer {
  line-height: 1.7;
  word-break: break-word;
}

.markdown-renderer :deep(h1) {
  font-size: 22px;
  font-weight: 600;
  margin: 16px 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
}

.markdown-renderer :deep(h2) {
  font-size: 19px;
  font-weight: 600;
  margin: 14px 0 8px;
}

.markdown-renderer :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  margin: 12px 0 6px;
}

.markdown-renderer :deep(p) {
  margin: 6px 0;
}

.markdown-renderer :deep(ul),
.markdown-renderer :deep(ol) {
  padding-left: 20px;
  margin: 6px 0;
}

.markdown-renderer :deep(li) {
  margin: 2px 0;
}

.markdown-renderer :deep(pre) {
  background: #f6f8fa;
  border-radius: 6px;
  padding: 12px 16px;
  overflow-x: auto;
  margin: 10px 0;
  font-size: 13px;
  line-height: 1.5;
}

.markdown-renderer :deep(code) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
}

.markdown-renderer :deep(p > code) {
  background: rgba(175, 184, 193, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.markdown-renderer :deep(blockquote) {
  border-left: 4px solid #dfe2e5;
  padding: 0 14px;
  color: rgba(0, 0, 0, 0.55);
  margin: 10px 0;
}

.markdown-renderer :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
}

.markdown-renderer :deep(th),
.markdown-renderer :deep(td) {
  border: 1px solid #dfe2e5;
  padding: 8px 12px;
  text-align: left;
}

.markdown-renderer :deep(th) {
  background: #f6f8fa;
  font-weight: 600;
}

.markdown-renderer :deep(a) {
  color: #1890ff;
}

.markdown-renderer :deep(a:hover) {
  text-decoration: underline;
}
</style>
