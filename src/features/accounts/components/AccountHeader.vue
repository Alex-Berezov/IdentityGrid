<template>
  <div class="account-header">
    <div class="account-header__title-row">
      <h2 class="account-header__title">Учетные записи</h2>
      <n-button type="primary" circle size="small" @click="handleAdd">
        <template #icon>
          <n-icon>
            <Add />
          </n-icon>
        </template>
      </n-button>
    </div>
    <p class="account-header__hint">
      В поле "Метка" можно указать несколько значений через знак <code>;</code>
    </p>
  </div>
</template>

<script setup lang="ts">
  import { NButton, NIcon } from 'naive-ui'
  import { Add } from '@vicons/ionicons5'

  const emit = defineEmits<{
    add: []
  }>()

  function handleAdd() {
    emit('add')
  }
</script>

<style scoped>
  .account-header {
    margin-bottom: 16px;
  }

  .account-header__title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .account-header__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }

  .account-header__hint {
    margin: 0;
    font-size: 13px;
    color: #666;
  }

  .account-header__hint code {
    background-color: #f0f0f0;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }
</style>
