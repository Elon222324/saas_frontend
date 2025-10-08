# ✅ Миграция Orders на новое API завершена!

## Что было изменено

### 1. `/src/pages/Orders/index.jsx`

**Добавлено:**
- Импорт `useSiteTokenString` для получения токена сайта
- Получение токена: `useSiteToken(siteNameForToken)`
- Проверка наличия токена перед загрузкой заказов

**Изменено:**
- `fetchOrders()` - использует новое API `https://{site}.domain/site-api/admin/orders/`
- `fetchOrderDetails()` - использует новый эндпоинт `/site-api/admin/orders/{id}/details`
- `reloadDetails` - обновлен для работы с новым API
- Добавлены useEffect для токена и обработки ошибок

**Props для OrderDetailsModal:**
- Было: `siteNameForApi, headers`
- Стало: `siteNameForToken, siteToken, baseDomain`

---

### 2. `/src/pages/Orders/components/OrderDetailsModal/hooks/useOrderDetails.js`

**Удалено:**
- `import api from '@/lib/axios'` - больше не используется

**Изменено:**
- Параметры функции: `(details, siteNameForToken, siteToken, baseDomain, orderId, ...)`
- Все эндпоинты переведены на `/site-api/admin/orders/...`
- Все запросы используют `fetch` с Site Token вместо axios с User Token

**Обновленные эндпоинты:**

| Действие | Старый эндпоинт | Новый эндпоинт |
|----------|----------------|----------------|
| Загрузка событий | `/orders/{site}/admin/{id}/events` | `/site-api/admin/orders/{id}/events` |
| Обновление заказа | `/orders/{site}/admin/{id}` | `/site-api/admin/orders/{id}` |
| Обновление статуса | `/orders/{site}/admin/{id}/status` | `/site-api/admin/orders/{id}/status` |
| Обновление оплаты | `/orders/{site}/admin/{id}/payment-status` | `/site-api/admin/orders/{id}/payment-status` |
| Добавление примечания | `/orders/{site}/admin/{id}/note` | `/site-api/admin/orders/{id}/note` |
| Обновление товара | `/orders/{site}/admin/{id}/items/{itemId}` | `/site-api/admin/orders/{id}/items/{itemId}` |

---

### 3. `/src/pages/Orders/components/OrderDetailsModal/index.jsx`

**Изменено:**
- Props компонента обновлены для передачи `siteNameForToken, siteToken, baseDomain`
- Вызов `useOrderDetails` с новыми параметрами

---

## Миграция всех эндпоинтов

### ✅ Реализованные эндпоинты

| Метод | Эндпоинт | Статус |
|-------|----------|--------|
| GET | `/site-api/admin/orders/` | ✅ |
| GET | `/site-api/admin/orders/{id}/details` | ✅ |
| GET | `/site-api/admin/orders/{id}/events` | ✅ |
| PATCH | `/site-api/admin/orders/{id}` | ✅ |
| PATCH | `/site-api/admin/orders/{id}/status` | ✅ |
| PATCH | `/site-api/admin/orders/{id}/payment-status` | ✅ |
| POST | `/site-api/admin/orders/{id}/note` | ✅ |
| PATCH | `/site-api/admin/orders/{id}/items/{itemId}` | ✅ |

### 📋 Эндпоинты в документации (не реализованы в UI)

| Метод | Эндпоинт | Примечание |
|-------|----------|------------|
| GET | `/site-api/admin/orders/list` | Альтернативный формат списка |
| POST | `/site-api/admin/orders/{id}/items` | Добавление товара |
| DELETE | `/site-api/admin/orders/{id}/items/{itemId}` | Удаление товара |
| POST | `/site-api/admin/orders/{id}/items/{itemId}/extras` | Добавление добавки |
| DELETE | `/site-api/admin/orders/{id}/items/{itemId}/extras/{extraId}` | Удаление добавки |
| POST | `/site-api/admin/orders/{id}/cancel` | Отмена заказа |

---

## Логирование

Все операции теперь логируются с префиксом `🔑 [Orders]` и `🔑 [OrderDetails]`:

```javascript
🔑 [Orders] → Запрашиваю новый API: https://t4a.domain.com/site-api/admin/orders/
✅ [Orders] ← Получено заказов: 15

🔑 [OrderDetails] → PATCH статус: https://t4a.domain.com/site-api/admin/orders/123/status
✅ [OrderDetails] ← Статус обновлен
```

---

## Преимущества миграции

1. ✅ **Единая система токенов** - как у Products, Options, Extras
2. ✅ **Автоматическое кеширование** - токен кешируется на 5 минут
3. ✅ **Прямой доступ к API** - меньше промежуточных слоев
4. ✅ **Детальное логирование** - легко отлаживать
5. ✅ **Консистентность кода** - одинаковый подход во всех модулях

---

## Как тестировать

### 1. Открыть страницу Orders
```
http://localhost:5173/orders
```

### 2. Проверить в консоли
```
🔑 [useSiteToken] → Получаем токен для сайта: t4a
✅ [useSiteToken] ← Токен получен для: t4a
🧾 [useSiteToken] Claims: { user_id: "123", site_name: "t4a", exp: "..." }
```

### 3. Выбрать сайт
- Токен должен получиться автоматически
- Заказы должны загрузиться

### 4. Открыть детали заказа
- Проверить что события загружаются
- Проверить что можно изменить статус
- Проверить что можно добавить примечание
- Проверить что можно изменить количество товара

### 5. Проверить в React Query DevTools
- Найти ключ `['siteToken', 'siteName']`
- Убедиться что токен кешируется

---

## Обработка ошибок

### Токен не получен
```
❌ [Orders] Ошибка получения токена: Error: ...
```
→ Проверить что User Token актуален

### Ошибка 401
```
🔑 [Orders] ← Статус ответа: 401 Unauthorized
```
→ Проверить что Site Token валиден

### Ошибка сети
```
Не удалось загрузить заказы
```
→ Проверить доступность site-api

---

## Совместимость

### Что изменилось для пользователя
❌ **Ничего** - UI остался прежним

### Что изменилось для разработчика
- ✅ Новые props для OrderDetailsModal
- ✅ Новые параметры useOrderDetails
- ✅ Использование Site Token вместо User Token
- ✅ Fetch вместо axios для Orders API

---

## Известные особенности

### Формат ответа
API поддерживает разные форматы:
```javascript
// Вариант 1: массив напрямую
[{ id: 1, ... }, { id: 2, ... }]

// Вариант 2: объект с orders
{ orders: [{ id: 1, ... }] }

// Вариант 3: объект с results
{ results: [{ id: 1, ... }] }
```

Код обрабатывает все варианты автоматически.

---

## Следующие шаги (опционально)

### Добавить недостающие функции UI

1. **Добавление товара в заказ**
   ```javascript
   POST /site-api/admin/orders/{id}/items
   body: { product_id, quantity, price }
   ```

2. **Удаление товара из заказа**
   ```javascript
   DELETE /site-api/admin/orders/{id}/items/{itemId}
   ```

3. **Управление добавками**
   ```javascript
   POST /site-api/admin/orders/{id}/items/{itemId}/extras
   DELETE /site-api/admin/orders/{id}/items/{itemId}/extras/{extraId}
   ```

4. **Отмена заказа**
   ```javascript
   POST /site-api/admin/orders/{id}/cancel
   ```

---

## Сравнение с другими модулями

| Модуль | API Prefix | Token | Паттерн |
|--------|-----------|-------|---------|
| Products | `/site-api/admin/categories/` | Site Token | ✅ useCategories |
| Options | `/site-api/admin/options/` | Site Token | ✅ useOptionGroups |
| Extras | `/site-api/admin/extras/` | Site Token | ✅ useExtraGroups |
| **Orders** | `/site-api/admin/orders/` | Site Token | ✅ **Мигрировано** |

---

**Дата миграции:** Октябрь 2025  
**Статус:** ✅ **Готово к использованию**  
**Тестирование:** ⏳ Требуется проверка на проде

