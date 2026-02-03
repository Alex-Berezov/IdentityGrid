import type { AccountValidationErrors, AccountType } from '../types/account'
import { AccountType as AccountTypeConst } from '../types/account'

/**
 * Максимальная длина метки
 */
const MAX_LABEL_LENGTH = 50

/**
 * Максимальная длина логина
 */
const MAX_LOGIN_LENGTH = 100

/**
 * Максимальная длина пароля
 */
const MAX_PASSWORD_LENGTH = 100

/**
 * Сообщения об ошибках валидации
 */
const ValidationMessages = {
  LABEL_TOO_LONG: `Метка не должна превышать ${MAX_LABEL_LENGTH} символов`,
  LOGIN_REQUIRED: 'Логин обязателен для заполнения',
  LOGIN_TOO_LONG: `Логин не должен превышать ${MAX_LOGIN_LENGTH} символов`,
  PASSWORD_REQUIRED: 'Пароль обязателен для заполнения',
  PASSWORD_TOO_LONG: `Пароль не должен превышать ${MAX_PASSWORD_LENGTH} символов`,
} as const

/**
 * Composable для валидации учетной записи
 */
export function useAccountValidation() {
  /**
   * Валидация метки
   * @param label - строка метки (может быть пустой)
   * @returns сообщение об ошибке или undefined
   */
  function validateLabel(label: string): string | undefined {
    if (label.length > MAX_LABEL_LENGTH) {
      return ValidationMessages.LABEL_TOO_LONG
    }
    return undefined
  }

  /**
   * Валидация логина
   * @param login - строка логина
   * @returns сообщение об ошибке или undefined
   */
  function validateLogin(login: string): string | undefined {
    const trimmedLogin = login.trim()

    if (!trimmedLogin) {
      return ValidationMessages.LOGIN_REQUIRED
    }

    if (trimmedLogin.length > MAX_LOGIN_LENGTH) {
      return ValidationMessages.LOGIN_TOO_LONG
    }

    return undefined
  }

  /**
   * Валидация пароля
   * @param password - строка пароля (или null)
   * @param accountType - тип учетной записи
   * @returns сообщение об ошибке или undefined
   */
  function validatePassword(password: string | null, accountType: AccountType): string | undefined {
    // Для LDAP пароль не требуется
    if (accountType === AccountTypeConst.LDAP) {
      return undefined
    }

    // Для LOCAL пароль обязателен
    const trimmedPassword = (password ?? '').trim()

    if (!trimmedPassword) {
      return ValidationMessages.PASSWORD_REQUIRED
    }

    if (trimmedPassword.length > MAX_PASSWORD_LENGTH) {
      return ValidationMessages.PASSWORD_TOO_LONG
    }

    return undefined
  }

  /**
   * Полная валидация учетной записи
   * @param data - данные для валидации
   * @returns объект с ошибками по полям (пустой если валидация прошла)
   */
  function validateAccount(data: {
    label?: string
    login: string
    password: string | null
    type: AccountType
  }): AccountValidationErrors {
    const errors: AccountValidationErrors = {}

    const labelError = validateLabel(data.label ?? '')
    if (labelError) {
      errors.label = labelError
    }

    const loginError = validateLogin(data.login)
    if (loginError) {
      errors.login = loginError
    }

    const passwordError = validatePassword(data.password, data.type)
    if (passwordError) {
      errors.password = passwordError
    }

    return errors
  }

  /**
   * Проверка, есть ли ошибки валидации
   * @param errors - объект ошибок
   * @returns true если есть хотя бы одна ошибка
   */
  function hasErrors(errors: AccountValidationErrors): boolean {
    return Object.keys(errors).length > 0
  }

  return {
    validateLabel,
    validateLogin,
    validatePassword,
    validateAccount,
    hasErrors,
    ValidationMessages,
    MAX_LABEL_LENGTH,
    MAX_LOGIN_LENGTH,
    MAX_PASSWORD_LENGTH,
  }
}
