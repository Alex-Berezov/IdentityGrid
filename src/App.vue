<script setup lang="ts">
  import { NConfigProvider } from 'naive-ui'
  import { AccountForm } from './features/accounts'
</script>

<template>
  <NConfigProvider>
    <div class="app-container">
      <AccountForm />
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
