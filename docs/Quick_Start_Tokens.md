# 🚀 Быстрый старт: Работа с токенами сайтов

## За 30 секунд

```javascript
import { useSiteToken } from '@/hooks/useSiteToken'

function MyComponent() {
  const siteName = 't4a' // БЕЗ суффикса _app
  const { data: token, isLoading } = useSiteToken(siteName)
  
  if (!token) return null
  
  // Используй токен в запросах к site-api
  fetch(`https://${siteName}.domain.com/site-api/admin/...`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
```

---

## 📝 Шпаргалка

### Когда использовать какой токен?

| API | Токен | Как получить |
|-----|-------|--------------|
| Центральная админка (`/sites/*`, `/users/*`) | User Token | `localStorage.getItem('access_token')` |
| Site API (`/site-api/admin/*`) | Site Token | `useSiteToken(siteName)` |

### Правило большого пальца

```
Если URL содержит:
  - VITE_API_URL          → используй User Token
  - {site}.domain/site-api → используй Site Token (useSiteToken)
```

---

## 🎯 Частые сценарии

### 1. Получить токен в компоненте

```javascript
import { useSiteToken } from '@/hooks/useSiteToken'

const { data: token, isLoading, error } = useSiteToken('t4a')
```

### 2. Использовать с React Query

```javascript
import { useQuery } from '@tanstack/react-query'
import { useSiteToken } from '@/hooks/useSiteToken'

function useMyData(siteName) {
  const { data: token } = useSiteToken(siteName)
  
  return useQuery({
    queryKey: ['myData', siteName, token],
    enabled: Boolean(token), // ← важно!
    queryFn: async () => {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.json()
    }
  })
}
```

### 3. Получить токен в контексте

```javascript
import { useSiteToken } from '@/hooks/useSiteToken'

export const MyContext = ({ children }) => {
  const { domain } = useParams()
  const { data: token, isLoading } = useSiteToken(domain)
  
  return (
    <MyContext.Provider value={{ token, isLoading }}>
      {children}
    </MyContext.Provider>
  )
}
```

---

## ⚡ Примеры запросов

### GET запрос

```javascript
const { data: token } = useSiteToken('t4a')

const response = await fetch(
  'https://t4a.domain.com/site-api/admin/categories/',
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }
)
```

### POST запрос

```javascript
const { data: token } = useSiteToken('t4a')

const response = await fetch(
  'https://t4a.domain.com/site-api/admin/categories/',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name: 'New Category' })
  }
)
```

### PATCH/DELETE аналогично

---

## 🛠️ Готовые примеры из кодовой базы

**Смотри файлы:**
- `src/pages/Sites/SiteSettings/Catalog/Products/hooks/useCategories.js`
- `src/pages/Sites/SiteSettings/Catalog/Options/hooks/useOptionGroups.js`
- `src/pages/Sites/SiteSettings/Catalog/Extras/hooks/useExtraGroups.js`

---

## 🐛 Типичные ошибки

### ❌ Неправильно

```javascript
// Использование User Token для site-api
const token = localStorage.getItem('access_token')
fetch('https://t4a.domain/site-api/...', {
  headers: { Authorization: `Bearer ${token}` }
})

// Забыли enabled
useQuery({
  queryKey: ['data'],
  queryFn: () => fetch(...) // Выполнится до получения токена!
})

// Используем siteName с суффиксом
useSiteToken('t4a_app') // ❌ БЕЗ _app!
```

### ✅ Правильно

```javascript
// Site Token для site-api
const { data: token } = useSiteToken('t4a')
fetch('https://t4a.domain/site-api/...', {
  headers: { Authorization: `Bearer ${token}` }
})

// С enabled
const { data: token } = useSiteToken('t4a')
useQuery({
  queryKey: ['data', token],
  enabled: Boolean(token), // ✅
  queryFn: () => fetch(...)
})

// БЕЗ суффикса
useSiteToken('t4a') // ✅
```

---

## 📚 Дополнительная документация

- **Подробное руководство**: `src/hooks/README.md`
- **Архитектура**: `docs/Архитектура_токенов.md`
- **Миграция Orders**: `src/pages/Orders/MIGRATION_GUIDE.md`
- **Changelog**: `CHANGELOG_tokens.md`

---

## 💬 FAQ

**Q: Нужно ли кешировать токен вручную?**  
A: Нет, React Query делает это автоматически на 5 минут.

**Q: Что если токен истёк?**  
A: React Query автоматически запросит новый при следующем refetch.

**Q: Можно ли использовать для Orders?**  
A: Да, когда бэкенд будет готов. Смотри `src/pages/Orders/MIGRATION_GUIDE.md`

**Q: Как отладить проблемы с токеном?**  
A: Открой консоль браузера - все операции логируются с эмодзи 🔑

**Q: Токен хранится в localStorage?**  
A: Нет, только в памяти (React Query кеш). Это безопаснее.

---

**Последнее обновление:** Октябрь 2025

