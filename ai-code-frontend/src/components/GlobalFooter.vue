<script setup lang="ts">
function handleClick() {
  window.open('https://github.com/TJOTH10', '_blank')
}
</script>

<template>
  <div class="global-footer" @click="handleClick">
    AI智能应用，程序员chenjl&Github
  </div>
</template>

<style scoped>
.global-footer {
  text-align: center;
  padding: 24px 50px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  cursor: pointer;
  background: #001529;
  transition: color 0.3s;
}

.global-footer:hover {
  color: #fff;
}
</style>
