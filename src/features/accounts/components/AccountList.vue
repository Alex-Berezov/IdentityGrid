<template>
  <div class="account-list">
    <!-- Заголовки колонок -->
    <div class="account-list__header">
      <div class="account-list__column">Метка</div>
      <div class="account-list__column account-list__column--type">Тип записи</div>
      <div class="account-list__column">Логин</div>
      <div class="account-list__column">Пароль</div>
      <div class="account-list__column account-list__column--actions">Действия</div>
    </div>

    <!-- Список учетных записей -->
    <div v-if="accounts.length > 0" class="account-list__items">
      <AccountItem v-for="account in accounts" :key="account.id" :account="account" />
    </div>

    <!-- Пустое состояние -->
    <n-empty v-else class="account-list__empty" description="Нет учетных записей">
      <template #extra>
        <n-text depth="3">Нажмите "+" чтобы добавить запись</n-text>
      </template>
    </n-empty>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { NEmpty, NText } from 'naive-ui'
  import AccountItem from './AccountItem.vue'
  import { useAccountsStore } from '../stores/accountsStore'

  const store = useAccountsStore()

  const accounts = computed(() => store.accounts)
</script>

<style scoped>
  .account-list {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
  }

  .account-list__header {
    display: grid;
    grid-template-columns: 1fr 150px 1fr 1fr 50px;
    gap: 12px;
    padding: 12px 16px;
    background-color: #f5f5f5;
    font-weight: 600;
    font-size: 13px;
    color: #666;
    border-bottom: 1px solid #e0e0e0;
  }

  .account-list__column--type {
    text-align: center;
  }

  .account-list__column--actions {
    text-align: center;
  }

  .account-list__items {
    padding: 8px 16px;
  }

  .account-list__empty {
    padding: 48px 16px;
  }
</style>
