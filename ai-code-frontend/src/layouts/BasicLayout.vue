<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
</script>

<template>
  <a-layout class="basic-layout">
    <a-layout-header class="basic-layout-header">
      <GlobalHeader />
    </a-layout-header>
    <a-layout-content class="basic-layout-content">
      <router-view />
    </a-layout-content>
    <a-layout-footer class="basic-layout-footer">
      <GlobalFooter />
    </a-layout-footer>
  </a-layout>
</template>

<style scoped>
.basic-layout {
  min-height: 100vh;
}

.basic-layout-header {
  height: auto;
  line-height: normal;
  padding: 0;
}

.basic-layout-content {
  flex: 1;
  padding: 24px;
}

.basic-layout-footer {
  padding: 0;
}
</style>
