import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account, LabelItem } from '../types/account'
import { AccountType } from '../types/account'

export const useAccountsStore = defineStore(
  'accounts',
  () => {
    // State
    const accounts = ref<Account[]>([])

    // Getters
    const getAccountById = computed(() => {
      return (id: string) => accounts.value.find((account) => account.id === id)
    })

    const accountsCount = computed(() => accounts.value.length)

    // Actions
    function generateId(): string {
      return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }

    function addAccount(): Account {
      const newAccount: Account = {
        id: generateId(),
        labels: [],
        type: AccountType.LOCAL,
        login: '',
        password: '',
      }
      accounts.value.push(newAccount)
      return newAccount
    }

    function updateAccount(
      id: string,
      updates: {
        labels?: LabelItem[]
        type?: AccountType
        login?: string
        password?: string | null
      }
    ): boolean {
      const index = accounts.value.findIndex((account) => account.id === id)
      if (index === -1) return false

      const account = accounts.value[index]!

      // Определяем итоговый тип
      const finalType = updates.type ?? account.type

      // Если тип LDAP (новый или текущий), пароль должен быть null
      const passwordValue =
        finalType === AccountType.LDAP ? null : (updates.password ?? account.password)

      accounts.value[index] = {
        id: account.id,
        labels: updates.labels ?? account.labels,
        type: updates.type ?? account.type,
        login: updates.login ?? account.login,
        password: passwordValue,
      }

      return true
    }

    function removeAccount(id: string): boolean {
      const index = accounts.value.findIndex((account) => account.id === id)
      if (index === -1) return false

      accounts.value.splice(index, 1)
      return true
    }

    function clearAccounts(): void {
      accounts.value = []
    }

    return {
      // State
      accounts,
      // Getters
      getAccountById,
      accountsCount,
      // Actions
      addAccount,
      updateAccount,
      removeAccount,
      clearAccounts,
    }
  },
  {
    persist: {
      key: 'identity-grid-accounts',
      storage: localStorage,
    },
  }
)
