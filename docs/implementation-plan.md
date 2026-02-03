# План реализации: Форма управления учетными записями

## Архитектура

**Выбранный подход:** Feature-Driven (Component-Based) Architecture

### Структура проекта

```
src/
├── features/
│   └── accounts/
│       ├── components/
│       │   ├── AccountForm.vue          # Главный контейнер формы
│       │   ├── AccountList.vue          # Список учетных записей
│       │   ├── AccountItem.vue          # Одна учетная запись
│       │   └── AccountHeader.vue        # Заголовок с кнопкой добавления
│       ├── composables/
│       │   ├── useAccountValidation.ts  # Логика валидации
│       │   └── useLabelParser.ts        # Парсинг меток
│       ├── stores/
│       │   └── accountsStore.ts         # Pinia store
│       ├── types/
│       │   └── account.ts               # TypeScript типы
│       ├── __tests__/                   # Unit тесты фичи
│       │   ├── accountsStore.spec.ts
│       │   ├── useAccountValidation.spec.ts
│       │   └── useLabelParser.spec.ts
│       └── index.ts                     # Публичный API фичи
├── shared/
│   ├── components/                      # Переиспользуемые UI компоненты
│   └── utils/                           # Утилиты
├── App.vue
└── main.ts
```

### Инструменты качества кода

| Инструмент      | Назначение                        |
| --------------- | --------------------------------- |
| ESLint          | Статический анализ кода           |
| Prettier        | Форматирование кода               |
| Vitest          | Unit тестирование                 |
| Vue Test Utils  | Тестирование компонентов          |
| @vue/test-utils | Монтирование компонентов в тестах |

---

## ✅ Этап 1: Инициализация проекта (ЗАВЕРШЁН)

### ✅ Задача 1.1: Создание Vue проекта

- [x] Инициализировать проект через Vite с Vue 3 + TypeScript
- [x] Vite 5.4.21 установлен (совместимость с Node.js 20.18.0)
- [x] `npm run dev` работает
- [x] `npm run build` проходит

### ✅ Задача 1.2: Установка основных зависимостей

- [x] Установить Pinia: `npm install pinia`
- [x] Установить UI фреймворк (Naive UI): `npm install naive-ui`
- [x] Установить плагин для персистентности: `npm install pinia-plugin-persistedstate`

### ✅ Задача 1.3: Настройка ESLint и Prettier

- [x] Установить ESLint с плагинами для Vue 3 и TypeScript
- [x] Установить Prettier и интеграцию с ESLint
- [x] Создать конфигурации:
  - [x] `eslint.config.js` — flat config
  - [x] `.prettierrc` — настройки форматирования
  - [x] `.prettierignore` — исключения
- [x] Добавить npm scripts: `lint`, `lint:fix`, `format`
- [x] `npm run lint` проходит без ошибок

### ✅ Задача 1.4: Настройка Vitest

- [x] Установить Vitest и Vue Test Utils
- [x] Создать `vitest.config.ts`
- [x] Добавить npm scripts: `test`, `test:run`, `test:coverage`
- [x] Тесты запускаются успешно

### ✅ Задача 1.5: Базовая конфигурация приложения

- [x] Настроить Pinia в main.ts с плагином persistedstate
- [x] Настроить Naive UI (NConfigProvider)
- [x] Очистить шаблонный код (удалён HelloWorld.vue, style.css)
- [x] `npm run lint` проходит без ошибок
- [x] `npm run build` проходит успешно

### ✅ Приемочные критерии этапа 1

- [x] Проект запускается: `npm run dev`
- [x] Сборка проходит: `npm run build`
- [x] Линтер работает без ошибок: `npm run lint`
- [x] Тесты запускаются: `npm run test`
- [x] Prettier форматирует код: `npm run format`

---

## Этап 2: Типы и Store

### Задача 2.1: Создание TypeScript типов

Файл: `src/features/accounts/types/account.ts`

- Интерфейс `LabelItem` (с полем text)
- Enum `AccountType` (LDAP, LOCAL)
- Интерфейс `Account` (id, labels, type, login, password)
- Интерфейс `AccountFormData` (для формы без id)

### Задача 2.2: Создание Pinia store

Файл: `src/features/accounts/stores/accountsStore.ts`

- State: массив учетных записей
- Actions: addAccount, updateAccount, removeAccount
- Getters: getAccountById (опционально)
- Настройка persist для localStorage

### Задача 2.3: Unit тесты для store

Файл: `src/features/accounts/__tests__/accountsStore.spec.ts`

- Тест: добавление учетной записи
- Тест: обновление учетной записи
- Тест: удаление учетной записи
- Тест: пароль null при типе LDAP

### ✅ Приемочные критерии этапа 2

- [ ] Типы корректно описывают структуру данных
- [ ] Store CRUD операции работают
- [ ] Все тесты store проходят: `npm run test`
- [ ] Линтер проходит: `npm run lint`

---

## Этап 3: Composables (бизнес-логика)

### Задача 3.1: Создание composable для валидации

Файл: `src/features/accounts/composables/useAccountValidation.ts`

- Функция валидации логина (обязательное, max 100)
- Функция валидации пароля (обязательное для LOCAL, max 100)
- Функция валидации метки (необязательное, max 50)
- Функция проверки всей учетной записи
- Возврат объекта с ошибками по полям

### Задача 3.2: Создание composable для парсинга меток

Файл: `src/features/accounts/composables/useLabelParser.ts`

- Функция `parseLabels`: строка → массив `{ text: string }[]`
- Функция `stringifyLabels`: массив → строка (для отображения)
- Обработка пустых значений и пробелов

### Задача 3.3: Unit тесты для валидации

Файл: `src/features/accounts/__tests__/useAccountValidation.spec.ts`

- Тест: пустой логин — ошибка
- Тест: логин > 100 символов — ошибка
- Тест: валидный логин — успех
- Тест: пароль обязателен для LOCAL
- Тест: пароль не обязателен для LDAP
- Тест: метка > 50 символов — ошибка

### Задача 3.4: Unit тесты для парсера меток

Файл: `src/features/accounts/__tests__/useLabelParser.spec.ts`

- Тест: `"admin;user"` → `[{ text: "admin" }, { text: "user" }]`
- Тест: пустая строка → пустой массив
- Тест: обратное преобразование
- Тест: обрезка пробелов

### ✅ Приемочные критерии этапа 3

- [ ] Валидация корректно проверяет все поля
- [ ] Парсер меток работает в обе стороны
- [ ] Все тесты composables проходят
- [ ] Покрытие критических сценариев ≥ 90%

---

## Этап 4: UI компоненты

### Задача 4.1: Создание компонента AccountHeader

Файл: `src/features/accounts/components/AccountHeader.vue`

- Заголовок "Учетные записи"
- Кнопка "+" для добавления
- Подсказка для поля метка
- Emit события `add` при клике

### Задача 4.2: Создание компонента AccountItem

Файл: `src/features/accounts/components/AccountItem.vue`

- Props: `account: Account`
- Поле "Метка" (input, необязательное)
- Поле "Тип записи" (select: LDAP/Локальная)
- Поле "Логин" (input, обязательное)
- Поле "Пароль" (input, условное отображение при LOCAL)
- Кнопка удаления
- Локальное состояние для редактирования
- Обработка `@blur` / `@change` → валидация → сохранение в store
- Отображение ошибок (красная обводка)

### Задача 4.3: Создание компонента AccountList

Файл: `src/features/accounts/components/AccountList.vue`

- Заголовки колонок (Метка, Тип записи, Логин, Пароль, Действия)
- Рендер списка AccountItem через v-for
- Отображение пустого состояния

### Задача 4.4: Создание компонента AccountForm

Файл: `src/features/accounts/components/AccountForm.vue`

- Контейнер, объединяющий Header и List
- Обработка события add от Header
- Общая стилизация контейнера

### ✅ Приемочные критерии этапа 4

- [ ] Все компоненты рендерятся без ошибок
- [ ] Кнопка "+" добавляет пустую запись
- [ ] Поля отображают данные из store
- [ ] Валидация срабатывает на blur/change
- [ ] Ошибки отображаются красной обводкой
- [ ] Пароль скрыт при типе LDAP
- [ ] Линтер проходит: `npm run lint`

---

## Этап 5: Интеграция

### Задача 5.1: Экспорт публичного API фичи

Файл: `src/features/accounts/index.ts`

- Экспорт главного компонента AccountForm
- Экспорт типов (Account, AccountType, LabelItem)
- Экспорт store (useAccountsStore)

### Задача 5.2: Интеграция в App.vue

- Импорт и использование AccountForm
- Базовая стилизация страницы
- Центрирование контента

### ✅ Приемочные критерии этапа 5

- [ ] Приложение полностью функционально
- [ ] Данные сохраняются в localStorage
- [ ] После перезагрузки данные восстанавливаются
- [ ] Все тесты проходят: `npm run test`

---

## Этап 6: Финализация и тестирование

### Задача 6.1: Стилизация и UX

- Финальная стилизация компонентов
- Состояния валидации (красная обводка для ошибок)
- Hover/focus состояния для интерактивных элементов
- Адаптивность (опционально)

### Задача 6.2: Интеграционные тесты компонентов

Файл: `src/features/accounts/__tests__/AccountItem.spec.ts`

- Тест: рендер всех полей
- Тест: скрытие пароля при LDAP
- Тест: отображение ошибки при невалидном логине
- Тест: вызов store.updateAccount при blur

### Задача 6.3: E2E проверка по ТЗ (ручная)

Проверить все сценарии из технического задания:

- [ ] Добавление учетной записи по кнопке "+"
- [ ] Удаление учетной записи
- [ ] Валидация обязательных полей на blur
- [ ] Красная обводка при ошибке
- [ ] Скрытие пароля при выборе LDAP
- [ ] Сохранение пароля как null для LDAP
- [ ] Преобразование меток в массив объектов
- [ ] Сохранение в localStorage
- [ ] Восстановление данных после перезагрузки

### Задача 6.4: Финальная проверка качества

- `npm run lint` — без ошибок
- `npm run build` — успешная сборка
- `npm run test:coverage` — покрытие критического кода
- Проверка TypeScript strict mode

### ✅ Приемочные критерии этапа 6

- [ ] Все пункты ТЗ выполнены
- [ ] Линтер проходит без ошибок
- [ ] Сборка успешна
- [ ] Тесты проходят с покрытием ≥ 80% для критических модулей
- [ ] Код готов к ревью

---

## Порядок выполнения задач

| #   | Задача                              | Зависит от    |
| --- | ----------------------------------- | ------------- |
| 1   | 1.1 Создание проекта                | -             |
| 2   | 1.2 Установка основных зависимостей | 1.1           |
| 3   | 1.3 Настройка ESLint и Prettier     | 1.2           |
| 4   | 1.4 Настройка Vitest                | 1.2           |
| 5   | 1.5 Базовая конфигурация приложения | 1.3, 1.4      |
| 6   | 2.1 TypeScript типы                 | 1.5           |
| 7   | 2.2 Pinia store                     | 2.1           |
| 8   | 2.3 Unit тесты для store            | 2.2           |
| 9   | 3.1 Валидация composable            | 2.1           |
| 10  | 3.2 Label parser composable         | 2.1           |
| 11  | 3.3 Тесты для валидации             | 3.1           |
| 12  | 3.4 Тесты для парсера меток         | 3.2           |
| 13  | 4.1 AccountHeader                   | 2.2           |
| 14  | 4.2 AccountItem                     | 2.2, 3.1, 3.2 |
| 15  | 4.3 AccountList                     | 4.2           |
| 16  | 4.4 AccountForm                     | 4.1, 4.3      |
| 17  | 5.1 Экспорт API                     | 4.4           |
| 18  | 5.2 Интеграция в App                | 5.1           |
| 19  | 6.1 Стилизация                      | 5.2           |
| 20  | 6.2 Интеграционные тесты            | 6.1           |
| 21  | 6.3 E2E проверка по ТЗ              | 6.2           |
| 22  | 6.4 Финальная проверка качества     | 6.3           |

---

## Технические заметки

### Валидация

- Использовать `@blur` для текстовых полей
- Использовать `@change` для select
- Хранить состояние ошибок в компоненте AccountItem

### Сохранение

- Использовать `pinia-plugin-persistedstate` для автосохранения в localStorage
- Store обновляется после успешной валидации

### Преобразование меток

```typescript
// Вход: "admin;user;guest"
// Выход: [{ text: "admin" }, { text: "user" }, { text: "guest" }]
```

### Тип записи и пароль

```typescript
if (accountType === 'LDAP') {
  password = null
}
```

---

## Конфигурации инструментов

### ESLint (eslint.config.js)

```javascript
// Flat config для ESLint 9+
// Включает: @eslint/js, typescript-eslint, eslint-plugin-vue
// Правила: рекомендованные + специфичные для проекта
```

**Ключевые правила:**

- `vue/multi-word-component-names: off` — разрешаем однословные имена для простых компонентов
- `@typescript-eslint/explicit-function-return-type: off` — TypeScript сам выводит типы
- `@typescript-eslint/no-unused-vars: error` — не забываем про неиспользуемые переменные

### Prettier (.prettierrc)

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "vueIndentScriptAndStyle": true
}
```

### Vitest (vitest.config.ts)

```typescript
// Окружение: happy-dom (легче jsdom)
// Globals: true (describe, it, expect без импорта)
// Coverage: v8
```

---

## NPM Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .vue,.js,.ts,.tsx",
    "lint:fix": "eslint src --ext .vue,.js,.ts,.tsx --fix",
    "format": "prettier --write src/",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```
