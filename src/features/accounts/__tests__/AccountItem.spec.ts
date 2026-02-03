import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AccountItem from '../components/AccountItem.vue'
import { useAccountsStore } from '../stores/accountsStore'
import { AccountType } from '../types/account'
import type { Account } from '../types/account'

describe('AccountItem', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const createAccount = (overrides: Partial<Account> = {}): Account => ({
    id: 'test-1',
    labels: [],
    type: AccountType.LOCAL,
    login: '',
    password: '',
    ...overrides,
  })

  describe('рендеринг', () => {
    it('рендерит все поля для LOCAL типа', () => {
      const account = createAccount({ type: AccountType.LOCAL })
      const wrapper = mount(AccountItem, {
        props: { account },
      })

      expect(wrapper.find('.account-item').exists()).toBe(true)
      expect(wrapper.findAll('input').length).toBeGreaterThanOrEqual(3) // label, login, password
      expect(wrapper.find('.n-select').exists()).toBe(true)
    })

    it('скрывает поле пароля для LDAP типа', () => {
      const account = createAccount({ type: AccountType.LDAP })
      const wrapper = mount(AccountItem, {
        props: { account },
      })

      expect(wrapper.find('.account-item__password-placeholder').exists()).toBe(true)
      // Проверяем, что поле пароля не рендерится (только 2 input: label и login)
      const inputs = wrapper.findAll('input')
      expect(inputs.length).toBe(2)
    })

    it('отображает данные из props', () => {
      const account = createAccount({
        labels: [{ text: 'admin' }, { text: 'user' }],
        login: 'testuser',
        password: 'secret',
      })
      const wrapper = mount(AccountItem, {
        props: { account },
      })

      const inputs = wrapper.findAll('input')
      // Первый input - метка
      expect(inputs[0]!.element.value).toBe('admin;user')
      // Второй input - логин
      expect(inputs[1]!.element.value).toBe('testuser')
    })

    it('рендерит кнопку удаления', () => {
      const account = createAccount()
      const wrapper = mount(AccountItem, {
        props: { account },
      })

      expect(wrapper.find('.account-item__actions button').exists()).toBe(true)
    })
  })

  describe('валидация', () => {
    it('показывает ошибку для пустого логина при blur', async () => {
      const account = createAccount({ login: '' })
      const wrapper = mount(AccountItem, {
        props: { account },
      })

      const loginInput = wrapper.findAll('input')[1]!
      await loginInput.trigger('blur')

      // Проверяем что статус input изменился на error
      const inputWrapper = wrapper.findAll('.n-input')[1]!
      expect(inputWrapper.classes()).toContain('n-input--error-status')
    })

    it('показывает ошибку для пустого пароля (LOCAL) при blur', async () => {
      const account = createAccount({ type: AccountType.LOCAL, password: '' })
      const wrapper = mount(AccountItem, {
        props: { account },
      })

      const inputs = wrapper.findAll('input')
      const passwordInput = inputs[2]!
      await passwordInput.trigger('blur')

      const inputWrappers = wrapper.findAll('.n-input')
      expect(inputWrappers[2]!.classes()).toContain('n-input--error-status')
    })

    it('не показывает ошибку для валидного логина', async () => {
      const account = createAccount({ login: 'validlogin' })
      const wrapper = mount(AccountItem, {
        props: { account },
      })

      const loginInput = wrapper.findAll('input')[1]!
      await loginInput.trigger('blur')

      const inputWrapper = wrapper.findAll('.n-input')[1]!
      expect(inputWrapper.classes()).not.toContain('n-input--error-status')
    })
  })

  describe('взаимодействие со store', () => {
    it('вызывает store.removeAccount при клике на удаление', async () => {
      const store = useAccountsStore()
      const account = store.addAccount()

      const wrapper = mount(AccountItem, {
        props: { account },
      })

      expect(store.accounts.length).toBe(1)

      const deleteButton = wrapper.find('.account-item__actions button')
      await deleteButton.trigger('click')

      expect(store.accounts.length).toBe(0)
    })

    it('обновляет store при изменении логина', async () => {
      const store = useAccountsStore()
      const account = store.addAccount()

      const wrapper = mount(AccountItem, {
        props: { account },
      })

      const loginInput = wrapper.findAll('input')[1]!
      await loginInput.setValue('newlogin')
      await loginInput.trigger('blur')

      expect(store.accounts[0]!.login).toBe('newlogin')
    })

    it('обновляет store при изменении типа на LDAP', async () => {
      const store = useAccountsStore()
      const account = store.addAccount()
      store.updateAccount(account.id, { password: 'secret' })

      const wrapper = mount(AccountItem, {
        props: { account: store.accounts[0]! },
      })

      // Симулируем выбор LDAP в select
      const component = wrapper.vm as unknown as {
        handleTypeChange: (type: string) => void
      }
      component.handleTypeChange(AccountType.LDAP)

      expect(store.accounts[0]!.type).toBe(AccountType.LDAP)
      expect(store.accounts[0]!.password).toBeNull()
    })
  })
})
