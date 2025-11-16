# Multi-Tenancy Changes - Админка (Admin Panel)

## Что изменилось?

JWT токен админа теперь содержит **`tenant_id`** вместо `site_name`. Все запросы автоматически фильтруют данные по тенанту админа.

## Критичные примеры

### 1. Логин админа

**ДО:**
```javascript
const response = await fetch('http://localhost:8000/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'admin@food-le.app', 
    password: 'password123' 
  })
})

const data = await response.json()
// data.token содержал site_name
localStorage.setItem('adminToken', data.token)
```

**ПОСЛЕ - токен содержит tenant_id:**
```javascript
const response = await fetch('http://localhost:8000/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'admin@food-le.app', 
    password: 'password123' 
  })
})

const data = await response.json()
// data.token теперь содержит tenant_id (UUID)
// Пример payload: { user_id: "uuid", tenant_id: "uuid", exp: ... }
localStorage.setItem('adminToken', data.token)
```

### 2. Получение списка заказов

**ДО:**
```javascript
// Админ видит все заказы всех сайтов (если было multi-instance)
const orders = await fetch('http://localhost:8000/admin/orders', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json())
```

**ПОСЛЕ - видит только заказы своего тенанта:**
```javascript
// Автоматически фильтруется по tenant_id из токена
const orders = await fetch('http://localhost:8000/admin/orders', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json())
// Возвращает ТОЛЬКО заказы этого сайта
```

### 3. Создание товара

**ДО:**
```javascript
const product = {
  title: 'Пицца Маргарита',
  price: 599,
  category_id: 1,
  // ... другие поля
}

const response = await fetch('http://localhost:8000/admin/products', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(product)
})
```

**ПОСЛЕ - tenant_id автоматически добавляется из токена:**
```javascript
const product = {
  title: 'Пицца Маргарита',
  price: 599,
  category_id: 1,
  // ... другие поля
}

const response = await fetch('http://localhost:8000/admin/products', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
    // tenant_id достается из JWT токена автоматически!
  },
  body: JSON.stringify(product)
})

const data = await response.json()
// Товар создается ТОЛЬКО для этого тенанта
```

### 4. Обновление заказа

**ДО:**
```javascript
const response = await fetch('http://localhost:8000/admin/orders/order-uuid/status', {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ status: 'completed' })
})
```

**ПОСЛЕ - система проверяет что заказ принадлежит тенанту админа:**
```javascript
const response = await fetch('http://localhost:8000/admin/orders/order-uuid/status', {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ status: 'completed' })
})

// Если заказ принадлежит другому тенанту → 403 Forbidden
// Если заказ этого тенанта → 200 OK (обновляется)
```

### 5. Helper для админки

```javascript
// helpers/adminApi.js
export async function adminApiCall(endpoint, options = {}) {
  const token = localStorage.getItem('adminToken')
  
  if (!token) {
    window.location.href = '/login'
    return
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  }
  
  return fetch(`http://localhost:8000${endpoint}`, {
    ...options,
    headers
  })
}

// Usage - никаких изменений!
const orders = await adminApiCall('/admin/orders').then(r => r.json())
const updated = await adminApiCall('/admin/orders/uuid/status', {
  method: 'PATCH',
  body: JSON.stringify({ status: 'completed' })
})
```

## Безопасность!

✅ **Админ видит ТОЛЬКО свой тенант**
- Не может увидеть заказы других сайтов
- Не может обновлять товары других сайтов
- Система автоматически фильтрует по tenant_id

✅ **Если админ попробует получить заказ другого тенанта:**
```javascript
// Результат:
// 404 Not Found - заказ не существует (для этого админа)
// На самом деле заказ существует, но принадлежит другому тенанту
```

## Что НЕ меняется

✅ Все эндпоинты остаются прежними
✅ Все параметры остаются прежними
✅ Все ответы остаются прежними
✅ Аутентификация через Bearer token
❌ Только теперь токен содержит tenant_id вместо site_name

