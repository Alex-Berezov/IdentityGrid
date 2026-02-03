<template>
  <div class="account-form">
    <AccountHeader @add="handleAdd" />
    <AccountList />
  </div>
</template>

<script setup lang="ts">
  import AccountHeader from './AccountHeader.vue'
  import AccountList from './AccountList.vue'
  import { useAccountsStore } from '../stores/accountsStore'

  const store = useAccountsStore()

  function handleAdd() {
    store.addAccount()
  }
</script>

<style scoped>
  .account-form {
    background-color: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
</style>
