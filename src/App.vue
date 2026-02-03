<script setup lang="ts">
  import { NConfigProvider } from 'naive-ui'
</script>

<template>
  <NConfigProvider>
    <div class="app-container">
      <h1>IdentityGrid</h1>
      <p>Форма управления учетными записями</p>
    </div>
  </NConfigProvider>
</template>

<style scoped>
  .app-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>
