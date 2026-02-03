<template>
  <div class="account-item">
    <!-- Метка -->
    <div class="account-item__field">
      <n-input
        v-model:value="localLabel"
        placeholder="Метки через ;"
        :status="errors.label ? 'error' : undefined"
        @blur="handleLabelBlur"
      />
    </div>

    <!-- Тип записи -->
    <div class="account-item__field">
      <n-select v-model:value="localType" :options="typeOptions" @update:value="handleTypeChange" />
    </div>

    <!-- Логин -->
    <div class="account-item__field">
      <n-input
        v-model:value="localLogin"
        placeholder="Логин"
        :status="errors.login ? 'error' : undefined"
        @blur="handleLoginBlur"
      />
    </div>

    <!-- Пароль (только для LOCAL) -->
    <div class="account-item__field">
      <n-input
        v-if="localType === AccountType.LOCAL"
        v-model:value="localPassword"
        type="password"
        placeholder="Пароль"
        show-password-on="click"
        :status="errors.password ? 'error' : undefined"
        @blur="handlePasswordBlur"
      />
      <div v-else class="account-item__password-placeholder">—</div>
    </div>

    <!-- Кнопка удаления -->
    <div class="account-item__actions">
      <n-button quaternary circle type="error" @click="handleRemove">
        <template #icon>
          <n-icon>
            <TrashOutline />
          </n-icon>
        </template>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { NInput, NSelect, NButton, NIcon } from 'naive-ui'
  import { TrashOutline } from '@vicons/ionicons5'
  import type { Account, AccountType as AccountTypeValue } from '../types/account'
  import { AccountType } from '../types/account'
  import { useAccountsStore } from '../stores/accountsStore'
  import { useAccountValidation } from '../composables/useAccountValidation'
  import { useLabelParser } from '../composables/useLabelParser'

  const props = defineProps<{
    account: Account
  }>()

  const store = useAccountsStore()
  const { validateLabel, validateLogin, validatePassword } = useAccountValidation()
  const { parseLabels, stringifyLabels } = useLabelParser()

  // Локальное состояние для редактирования
  const localLabel = ref(stringifyLabels(props.account.labels))
  const localType = ref<AccountTypeValue>(props.account.type)
  const localLogin = ref(props.account.login)
  const localPassword = ref(props.account.password ?? '')

  // Состояние ошибок валидации
  const errors = ref<{
    label?: string
    login?: string
    password?: string
  }>({})

  // Опции для выбора типа записи
  const typeOptions = [
    { label: 'Локальная', value: AccountType.LOCAL },
    { label: 'LDAP', value: AccountType.LDAP },
  ]

  // Синхронизация с props при внешних изменениях
  watch(
    () => props.account,
    (newAccount) => {
      localLabel.value = stringifyLabels(newAccount.labels)
      localType.value = newAccount.type
      localLogin.value = newAccount.login
      localPassword.value = newAccount.password ?? ''
    },
    { deep: true }
  )

  /**
   * Обработка потери фокуса поля "Метка"
   */
  function handleLabelBlur() {
    const labelError = validateLabel(localLabel.value)
    errors.value.label = labelError

    if (!labelError) {
      store.updateAccount(props.account.id, {
        labels: parseLabels(localLabel.value),
      })
    }
  }

  /**
   * Обработка изменения типа записи
   */
  function handleTypeChange(newType: AccountTypeValue) {
    localType.value = newType

    // Очищаем ошибку пароля при смене на LDAP
    if (newType === AccountType.LDAP) {
      errors.value.password = undefined
    }

    // Валидируем пароль для нового типа
    const passwordError = validatePassword(
      newType === AccountType.LDAP ? null : localPassword.value,
      newType
    )
    errors.value.password = passwordError

    // Сохраняем изменение типа в store
    store.updateAccount(props.account.id, {
      type: newType,
      password: newType === AccountType.LDAP ? null : localPassword.value || null,
    })
  }

  /**
   * Обработка потери фокуса поля "Логин"
   */
  function handleLoginBlur() {
    const loginError = validateLogin(localLogin.value)
    errors.value.login = loginError

    if (!loginError) {
      store.updateAccount(props.account.id, {
        login: localLogin.value.trim(),
      })
    }
  }

  /**
   * Обработка потери фокуса поля "Пароль"
   */
  function handlePasswordBlur() {
    const passwordError = validatePassword(localPassword.value, localType.value)
    errors.value.password = passwordError

    if (!passwordError) {
      store.updateAccount(props.account.id, {
        password: localPassword.value,
      })
    }
  }

  /**
   * Обработка удаления записи
   */
  function handleRemove() {
    store.removeAccount(props.account.id)
  }
</script>

<style scoped>
  .account-item {
    display: grid;
    grid-template-columns: 1fr 150px 1fr 1fr 50px;
    gap: 12px;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }

  .account-item:last-child {
    border-bottom: none;
  }

  .account-item__field {
    min-width: 0;
  }

  .account-item__password-placeholder {
    color: #999;
    text-align: center;
    padding: 8px;
  }

  .account-item__actions {
    display: flex;
    justify-content: center;
  }
</style>
