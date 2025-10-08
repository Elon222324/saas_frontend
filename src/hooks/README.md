# Хуки приложения

## useSiteToken

Централизованный хук для получения токенов сайтов с автоматическим кешированием.

### Описание

`useSiteToken` - это хук на базе React Query, который управляет получением и кешированием JWT токенов для доступа к API конкретных сайтов. Токен получается один раз и автоматически кешируется на 5 минут.

### Когда использовать

- Когда нужен токен для доступа к site-api конкретного сайта
- Для запросов к эндпоинтам вида `https://{site}.{domain}/site-api/admin/...`
- В любых компонентах, где требуется авторизация на уровне сайта

### Базовое использование

```javascript
import { useSiteToken } from '@/hooks/useSiteToken'

function MyComponent() {
  const siteName = 't4a' // БЕЗ суффикса _app
  
  const { data: token, isLoading, error } = useSiteToken(siteName)
  
  if (isLoading) return <div>Загрузка токена...</div>
  if (error) return <div>Ошибка: {error.message}</div>
  
  // Используем токен в запросах
  const fetchData = async () => {
    const response = await fetch(
      `https://${siteName}.example.com/site-api/admin/categories/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    )
    return response.json()
  }
}
```

### Использование с хелпером

```javascript
import { useSiteTokenString } from '@/hooks/useSiteToken'

function MyComponent() {
  // Более удобный API - возвращает { token, isLoading, error }
  const { token, isLoading, error } = useSiteTokenString('t4a')
  
  // ... остальная логика
}
```

### Интеграция с React Query

```javascript
import { useQuery } from '@tanstack/react-query'
import { useSiteToken } from '@/hooks/useSiteToken'

function useCategories(siteName) {
  const { data: token, isLoading: tokenLoading } = useSiteToken(siteName)
  
  return useQuery({
    queryKey: ['categories', siteName, token],
    enabled: Boolean(token), // Запрос выполнится только после получения токена
    queryFn: async () => {
      const response = await fetch(
        `https://${siteName}.example.com/site-api/admin/categories/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      )
      return response.json()
    }
  })
}
```

### Опции

```javascript
const { data: token } = useSiteToken('t4a', {
  enabled: Boolean(someCondition), // Условное выполнение
  staleTime: 10 * 60 * 1000,       // Переопределить время кеша (по умолчанию 5 минут)
  retry: 3,                         // Количество повторов (по умолчанию 2)
})
```

### Особенности

1. **Автоматическое кеширование**: Токен кешируется на 5 минут (staleTime) и хранится в памяти 10 минут (cacheTime)
2. **Дедупликация**: Если несколько компонентов одновременно запрашивают токен для одного сайта, выполнится только один запрос
3. **Нормализация**: Автоматически извлекает строку токена из разных форматов ответа
4. **Логирование**: Выводит детальные логи в консоль для отладки

### Формат токена

Токен содержит следующие claims:

```json
{
  "user_id": "123",
  "site_name": "t4a",
  "exp": 1234567890
}
```

### Примеры использования в проекте

- **`SiteSettingsContext`** - получает токен для текущего сайта из URL
- **`useCategories`** - использует токен для работы с категориями товаров
- **`useOptionGroups`** - использует токен для работы с опциями товаров
- **`useExtraGroups`** - использует токен для работы с экстра-опциями

### Отличие от localStorage токена

```javascript
// ❌ НЕ ПРАВИЛЬНО - для site-api
const token = localStorage.getItem('access_token') // Это токен пользователя, не сайта!

// ✅ ПРАВИЛЬНО - для site-api
const { token } = useSiteToken(siteName) // Это токен конкретного сайта
```

### API Reference

#### `useSiteToken(siteName, options?)`

**Параметры:**
- `siteName` (string, required) - имя сайта БЕЗ суффикса `_app`
- `options` (object, optional) - опции для React Query useQuery

**Возвращает:**
- `data` (string | undefined) - строка токена
- `isLoading` (boolean) - индикатор загрузки
- `error` (Error | null) - ошибка если есть
- `refetch` (function) - функция для принудительного обновления токена

#### `useSiteTokenString(siteName, options?)`

Алиас для `useSiteToken` с более удобным API.

**Возвращает:**
- `token` (string | undefined) - строка токена (вместо data)
- `isLoading` (boolean)
- `error` (Error | null)
- `refetch` (function)

### Troubleshooting

**Проблема**: Токен не получается, ошибка 401

**Решение**: Убедитесь, что в localStorage есть актуальный `access_token` пользователя

---

**Проблема**: Запросы выполняются без токена

**Решение**: Используйте `enabled: Boolean(token)` в useQuery для ожидания токена

---

**Проблема**: Токен устарел

**Решение**: Вызовите `refetch()` для принудительного обновления или дождитесь автоматического обновления через 5 минут

