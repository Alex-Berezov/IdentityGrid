/**
 * Элемент метки учетной записи
 * Преобразуется из строки вида "admin;user" в массив объектов
 */
export interface LabelItem {
  text: string
}

/**
 * Тип учетной записи
 * LDAP - пароль скрыт и сохраняется как null
 * LOCAL - пароль отображается и сохраняется
 */
export const AccountType = {
  LDAP: 'LDAP',
  LOCAL: 'LOCAL',
} as const

export type AccountType = (typeof AccountType)[keyof typeof AccountType]

/**
 * Учетная запись
 */
export interface Account {
  /** Уникальный идентификатор записи */
  id: string
  /** Массив меток (преобразованный из строки через ;) */
  labels: LabelItem[]
  /** Тип записи (LDAP или Локальная) */
  type: AccountType
  /** Логин (обязательное поле, макс. 100 символов) */
  login: string
  /** Пароль (null для LDAP, строка для LOCAL, макс. 100 символов) */
  password: string | null
}

/**
 * Данные формы учетной записи (без id, используется при создании)
 */
export interface AccountFormData {
  /** Строка меток через ; (макс. 50 символов) */
  labelString: string
  /** Тип записи */
  type: AccountType
  /** Логин */
  login: string
  /** Пароль */
  password: string | null
}

/**
 * Ошибки валидации полей учетной записи
 */
export interface AccountValidationErrors {
  label?: string
  login?: string
  password?: string
}
