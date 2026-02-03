import { describe, it, expect } from 'vitest'
import { useAccountValidation } from '../composables/useAccountValidation'
import { AccountType } from '../types/account'

describe('useAccountValidation', () => {
  const { validateLabel, validateLogin, validatePassword, validateAccount, hasErrors } =
    useAccountValidation()

  describe('validateLabel', () => {
    it('should return undefined for empty label', () => {
      expect(validateLabel('')).toBeUndefined()
    })

    it('should return undefined for valid label', () => {
      expect(validateLabel('admin')).toBeUndefined()
    })

    it('should return undefined for label with exactly 50 characters', () => {
      const label = 'a'.repeat(50)
      expect(validateLabel(label)).toBeUndefined()
    })

    it('should return error for label exceeding 50 characters', () => {
      const label = 'a'.repeat(51)
      expect(validateLabel(label)).toBe('Метка не должна превышать 50 символов')
    })
  })

  describe('validateLogin', () => {
    it('should return error for empty login', () => {
      expect(validateLogin('')).toBe('Логин обязателен для заполнения')
    })

    it('should return error for login with only spaces', () => {
      expect(validateLogin('   ')).toBe('Логин обязателен для заполнения')
    })

    it('should return undefined for valid login', () => {
      expect(validateLogin('admin')).toBeUndefined()
    })

    it('should return undefined for login with exactly 100 characters', () => {
      const login = 'a'.repeat(100)
      expect(validateLogin(login)).toBeUndefined()
    })

    it('should return error for login exceeding 100 characters', () => {
      const login = 'a'.repeat(101)
      expect(validateLogin(login)).toBe('Логин не должен превышать 100 символов')
    })
  })

  describe('validatePassword', () => {
    it('should return undefined for LDAP type regardless of password', () => {
      expect(validatePassword(null, AccountType.LDAP)).toBeUndefined()
      expect(validatePassword('', AccountType.LDAP)).toBeUndefined()
      expect(validatePassword('password123', AccountType.LDAP)).toBeUndefined()
    })

    it('should return error for empty password with LOCAL type', () => {
      expect(validatePassword('', AccountType.LOCAL)).toBe('Пароль обязателен для заполнения')
    })

    it('should return error for null password with LOCAL type', () => {
      expect(validatePassword(null, AccountType.LOCAL)).toBe('Пароль обязателен для заполнения')
    })

    it('should return error for password with only spaces with LOCAL type', () => {
      expect(validatePassword('   ', AccountType.LOCAL)).toBe('Пароль обязателен для заполнения')
    })

    it('should return undefined for valid password with LOCAL type', () => {
      expect(validatePassword('password123', AccountType.LOCAL)).toBeUndefined()
    })

    it('should return undefined for password with exactly 100 characters', () => {
      const password = 'a'.repeat(100)
      expect(validatePassword(password, AccountType.LOCAL)).toBeUndefined()
    })

    it('should return error for password exceeding 100 characters', () => {
      const password = 'a'.repeat(101)
      expect(validatePassword(password, AccountType.LOCAL)).toBe(
        'Пароль не должен превышать 100 символов'
      )
    })
  })

  describe('validateAccount', () => {
    it('should return empty object for valid LOCAL account', () => {
      const errors = validateAccount({
        label: 'admin',
        login: 'user1',
        password: 'secret123',
        type: AccountType.LOCAL,
      })
      expect(errors).toEqual({})
    })

    it('should return empty object for valid LDAP account', () => {
      const errors = validateAccount({
        label: 'admin',
        login: 'user1',
        password: null,
        type: AccountType.LDAP,
      })
      expect(errors).toEqual({})
    })

    it('should return login error for empty login', () => {
      const errors = validateAccount({
        login: '',
        password: 'secret123',
        type: AccountType.LOCAL,
      })
      expect(errors.login).toBe('Логин обязателен для заполнения')
    })

    it('should return password error for empty password with LOCAL type', () => {
      const errors = validateAccount({
        login: 'user1',
        password: '',
        type: AccountType.LOCAL,
      })
      expect(errors.password).toBe('Пароль обязателен для заполнения')
    })

    it('should not return password error for empty password with LDAP type', () => {
      const errors = validateAccount({
        login: 'user1',
        password: null,
        type: AccountType.LDAP,
      })
      expect(errors.password).toBeUndefined()
    })

    it('should return multiple errors when multiple fields are invalid', () => {
      const errors = validateAccount({
        label: 'a'.repeat(51),
        login: '',
        password: '',
        type: AccountType.LOCAL,
      })
      expect(errors.label).toBeDefined()
      expect(errors.login).toBeDefined()
      expect(errors.password).toBeDefined()
    })
  })

  describe('hasErrors', () => {
    it('should return false for empty errors object', () => {
      expect(hasErrors({})).toBe(false)
    })

    it('should return true when there is at least one error', () => {
      expect(hasErrors({ login: 'Ошибка' })).toBe(true)
    })

    it('should return true when there are multiple errors', () => {
      expect(hasErrors({ login: 'Ошибка', password: 'Ошибка' })).toBe(true)
    })
  })
})
