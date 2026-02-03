import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountsStore } from '../stores/accountsStore'
import { AccountType } from '../types/account'

describe('accountsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('addAccount', () => {
    it('should add a new empty account to the list', () => {
      const store = useAccountsStore()

      expect(store.accounts).toHaveLength(0)

      const account = store.addAccount()

      expect(store.accounts).toHaveLength(1)
      expect(account.id).toBeDefined()
      expect(account.labels).toEqual([])
      expect(account.type).toBe(AccountType.LOCAL)
      expect(account.login).toBe('')
      expect(account.password).toBe('')
    })

    it('should add multiple accounts with unique ids', () => {
      const store = useAccountsStore()

      const account1 = store.addAccount()
      const account2 = store.addAccount()
      const account3 = store.addAccount()

      expect(store.accounts).toHaveLength(3)
      expect(account1.id).not.toBe(account2.id)
      expect(account2.id).not.toBe(account3.id)
    })
  })

  describe('updateAccount', () => {
    it('should update account login', () => {
      const store = useAccountsStore()
      const account = store.addAccount()

      const result = store.updateAccount(account.id, { login: 'admin' })

      expect(result).toBe(true)
      expect(store.accounts[0]!.login).toBe('admin')
    })

    it('should update account password', () => {
      const store = useAccountsStore()
      const account = store.addAccount()

      store.updateAccount(account.id, { password: 'secret123' })

      expect(store.accounts[0]!.password).toBe('secret123')
    })

    it('should update account labels', () => {
      const store = useAccountsStore()
      const account = store.addAccount()

      store.updateAccount(account.id, {
        labels: [{ text: 'admin' }, { text: 'user' }],
      })

      expect(store.accounts[0]!.labels).toEqual([{ text: 'admin' }, { text: 'user' }])
    })

    it('should update account type', () => {
      const store = useAccountsStore()
      const account = store.addAccount()

      store.updateAccount(account.id, { type: AccountType.LDAP })

      expect(store.accounts[0]!.type).toBe(AccountType.LDAP)
    })

    it('should return false when updating non-existent account', () => {
      const store = useAccountsStore()

      const result = store.updateAccount('non-existent-id', { login: 'admin' })

      expect(result).toBe(false)
    })

    it('should set password to null when type changes to LDAP', () => {
      const store = useAccountsStore()
      const account = store.addAccount()

      // Сначала устанавливаем пароль
      store.updateAccount(account.id, { password: 'secret123' })
      expect(store.accounts[0]!.password).toBe('secret123')

      // Меняем тип на LDAP — пароль должен стать null
      store.updateAccount(account.id, { type: AccountType.LDAP })

      expect(store.accounts[0]!.type).toBe(AccountType.LDAP)
      expect(store.accounts[0]!.password).toBeNull()
    })

    it('should keep password as null when updating LDAP account with password', () => {
      const store = useAccountsStore()
      const account = store.addAccount()

      // Устанавливаем тип LDAP с паролем в одном обновлении
      store.updateAccount(account.id, {
        type: AccountType.LDAP,
        password: 'should-be-null',
      })

      expect(store.accounts[0]!.password).toBeNull()
    })

    it('should keep password null when updating other fields on LDAP account', () => {
      const store = useAccountsStore()
      const account = store.addAccount()

      // Устанавливаем тип LDAP
      store.updateAccount(account.id, { type: AccountType.LDAP })
      expect(store.accounts[0]!.password).toBeNull()

      // Обновляем логин — пароль должен остаться null
      store.updateAccount(account.id, { login: 'ldapuser' })
      expect(store.accounts[0]!.password).toBeNull()
      expect(store.accounts[0]!.login).toBe('ldapuser')
    })
  })

  describe('removeAccount', () => {
    it('should remove account by id', () => {
      const store = useAccountsStore()
      const account = store.addAccount()

      expect(store.accounts).toHaveLength(1)

      const result = store.removeAccount(account.id)

      expect(result).toBe(true)
      expect(store.accounts).toHaveLength(0)
    })

    it('should return false when removing non-existent account', () => {
      const store = useAccountsStore()

      const result = store.removeAccount('non-existent-id')

      expect(result).toBe(false)
    })

    it('should remove correct account from multiple accounts', () => {
      const store = useAccountsStore()
      const account1 = store.addAccount()
      const account2 = store.addAccount()
      const account3 = store.addAccount()

      store.updateAccount(account1.id, { login: 'user1' })
      store.updateAccount(account2.id, { login: 'user2' })
      store.updateAccount(account3.id, { login: 'user3' })

      store.removeAccount(account2.id)

      expect(store.accounts).toHaveLength(2)
      expect(store.accounts[0]!.login).toBe('user1')
      expect(store.accounts[1]!.login).toBe('user3')
    })
  })

  describe('clearAccounts', () => {
    it('should remove all accounts', () => {
      const store = useAccountsStore()
      store.addAccount()
      store.addAccount()
      store.addAccount()

      expect(store.accounts).toHaveLength(3)

      store.clearAccounts()

      expect(store.accounts).toHaveLength(0)
    })
  })

  describe('getAccountById', () => {
    it('should return account by id', () => {
      const store = useAccountsStore()
      const account = store.addAccount()
      store.updateAccount(account.id, { login: 'admin' })

      const found = store.getAccountById(account.id)

      expect(found).toBeDefined()
      expect(found?.login).toBe('admin')
    })

    it('should return undefined for non-existent id', () => {
      const store = useAccountsStore()

      const found = store.getAccountById('non-existent-id')

      expect(found).toBeUndefined()
    })
  })

  describe('accountsCount', () => {
    it('should return correct count', () => {
      const store = useAccountsStore()

      expect(store.accountsCount).toBe(0)

      store.addAccount()
      expect(store.accountsCount).toBe(1)

      store.addAccount()
      expect(store.accountsCount).toBe(2)

      store.removeAccount(store.accounts[0]!.id)
      expect(store.accountsCount).toBe(1)
    })
  })
})
