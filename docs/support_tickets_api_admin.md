# 🔧 API Документация: Управление тикетами поддержки (Админка)

## Общая информация

Полнофункциональная система управления тикетами поддержки для администраторов. Позволяет просматривать, фильтровать, обновлять статусы, добавлять ответы и отслеживать статистику по тикетам.

**Базовый URL**: `/site-api/admin/support/tickets`  
**Аутентификация**: JWT токен администратора (обязательна для всех эндпоинтов)

---

## 📊 Модели данных

### UpdateTicketStatusIn
Модель для изменения статуса тикета
```json
{
  "status": "string"
}
```

**Допустимые значения status**:
- `new` — Новый
- `in_progress` — В работе
- `resolved` — Решен
- `closed` — Закрыт

---

### AddAdminResponseIn
Модель для добавления ответа администратора с опциональным изменением статуса
```json
{
  "message": "string (минимум 1, максимум 2000 символов)",
  "status": "string (опционально)"
}
```

---

### ResolveTicketIn
Модель для разрешения тикета
```json
{
  "resolution_notes": "string (минимум 1, максимум 1000 символов)"
}
```

---

### SupportTicketAdminOut
Полная информация о тикете для администратора
```json
{
  "id": "uuid",
  "order_id": "uuid",
  "user_id": "uuid",
  "user_name": "string | null",
  "status": "string",
  "category": "string",
  "priority": "string",
  "message": "string",
  "admin_response": "string | null",
  "admin_id": "uuid | null",
  "resolution_notes": "string | null",
  "messages": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "message": "string",
      "is_admin": "boolean",
      "created_at": "datetime"
    }
  ],
  "created_at": "datetime",
  "updated_at": "datetime",
  "resolved_at": "datetime | null",
  "closed_at": "datetime | null"
}
```

---

### SupportTicketAdminListOut
Сокращенная информация о тикете для списков
```json
{
  "id": "uuid",
  "order_id": "uuid",
  "user_id": "uuid",
  "user_name": "string | null",
  "status": "string",
  "category": "string",
  "priority": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

### DashboardStats
Статистика для дашборда
```json
{
  "total_tickets": "integer",
  "by_status": {
    "new": "integer",
    "in_progress": "integer",
    "resolved": "integer",
    "closed": "integer"
  },
  "by_category": {
    "wrong_item": "integer",
    "late_delivery": "integer",
    "damaged_item": "integer",
    "missing_item": "integer",
    "other": "integer"
  },
  "avg_resolution_time_hours": "float",
  "urgent_tickets_count": "integer"
}
```

---

## 🔗 Эндпоинты

### GET — Получить список тикетов
```
GET /admin/support/tickets
```

Получить список всех тикетов с поддержкой фильтрации, сортировки и пагинации.

**Query параметры**:

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `status` | string | null | Фильтр по статусу: `new`, `in_progress`, `resolved`, `closed` |
| `category` | string | null | Фильтр по категории: `wrong_item`, `late_delivery`, `damaged_item`, `missing_item`, `other` |
| `priority` | string | null | Фильтр по приоритету: `low`, `normal`, `high`, `urgent` |
| `user_id` | uuid | null | Фильтр по ID пользователя |
| `order_id` | uuid | null | Фильтр по ID заказа |
| `sort_by` | string | `created_at` | Сортировка: `created_at`, `updated_at`, `priority` |
| `sort_order` | string | `desc` | Порядок сортировки: `asc`, `desc` |
| `skip` | integer | 0 | Пропустить N записей (пагинация) |
| `limit` | integer | 20 | Количество записей (пагинация) |

**Ответ**: 200 OK
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "order_id": "660e8400-e29b-41d4-a716-446655440001",
    "user_id": "770e8400-e29b-41d4-a716-446655440002",
    "user_name": "Иван Петров",
    "status": "new",
    "category": "late_delivery",
    "priority": "urgent",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

**Примеры запросов**:

Получить все срочные новые тикеты, отсортированные по приоритету:
```bash
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:8001/site-api/admin/support/tickets?status=new&priority=urgent&sort_by=priority&sort_order=desc&limit=50"
```

Получить тикеты пользователя, отсортированные по дате обновления:
```bash
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:8001/site-api/admin/support/tickets?user_id=770e8400-e29b-41d4-a716-446655440002&sort_by=updated_at"
```

---

### GET — Получить деталь тикета
```
GET /admin/support/tickets/{ticket_id}
```

Получить полную информацию о тикете, включая всю историю сообщений.

**Path параметры**:
- `ticket_id` (uuid) — ID тикета

**Ответ**: 200 OK
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "order_id": "660e8400-e29b-41d4-a716-446655440001",
  "user_id": "770e8400-e29b-41d4-a716-446655440002",
  "user_name": "Иван Петров",
  "status": "in_progress",
  "category": "damaged_item",
  "priority": "high",
  "message": "Товар пришел с поврежденной упаковкой",
  "admin_response": "Мы уже разбираемся в ситуации",
  "admin_id": "880e8400-e29b-41d4-a716-446655440003",
  "resolution_notes": null,
  "messages": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440004",
      "user_id": "770e8400-e29b-41d4-a716-446655440002",
      "message": "Товар пришел с поврежденной упаковкой",
      "is_admin": false,
      "created_at": "2025-01-15T10:30:00Z"
    },
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440005",
      "user_id": "880e8400-e29b-41d4-a716-446655440003",
      "message": "Мы уже разбираемся в ситуации",
      "is_admin": true,
      "created_at": "2025-01-15T11:00:00Z"
    }
  ],
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T11:00:00Z",
  "resolved_at": null,
  "closed_at": null
}
```

**Ошибки**:
- `404 TICKET_NOT_FOUND` — Тикет не найден

**Пример запроса**:
```bash
curl -H "Authorization: Bearer <admin_token>" \
  http://localhost:8001/site-api/admin/support/tickets/550e8400-e29b-41d4-a716-446655440000
```

---

### PATCH — Изменить статус тикета
```
PATCH /admin/support/tickets/{ticket_id}/status
```

Изменить статус тикета. При переходе в статус `in_progress` автоматически устанавливается ID администратора.

**Path параметры**:
- `ticket_id` (uuid) — ID тикета

**Тело запроса**:
```json
{
  "status": "in_progress"
}
```

**Ответ**: 200 OK — Возвращает обновленный тикет (SupportTicketAdminOut)

**Ошибки**:
- `404 TICKET_NOT_FOUND` — Тикет не найден
- `400 INVALID_STATUS` — Недопустимый статус

**Примеры запросов**:

Взять тикет в работу:
```bash
curl -X PATCH \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}' \
  http://localhost:8001/site-api/admin/support/tickets/550e8400-e29b-41d4-a716-446655440000/status
```

Закрыть тикет:
```bash
curl -X PATCH \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "closed"}' \
  http://localhost:8001/site-api/admin/support/tickets/550e8400-e29b-41d4-a716-446655440000/status
```

---

### POST — Добавить ответ администратора
```
POST /admin/support/tickets/{ticket_id}/messages
```

Добавить сообщение от администратора и опционально изменить статус тикета.

**Path параметры**:
- `ticket_id` (uuid) — ID тикета

**Тело запроса**:
```json
{
  "message": "Мы уже подготовили замену товара, она будет отправлена на завтра",
  "status": "in_progress"
}
```

**Ответ**: 200 OK
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "user_id": "880e8400-e29b-41d4-a716-446655440003",
  "message": "Мы уже подготовили замену товара, она будет отправлена на завтра",
  "is_admin": true,
  "created_at": "2025-01-15T12:00:00Z"
}
```

**Ошибки**:
- `404 TICKET_NOT_FOUND` — Тикет не найден
- `400 INVALID_STATUS` — Недопустимый статус (если указан)

**Пример запроса**:
```bash
curl -X POST \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Мы рассмотрели вашу жалобу и готовы предложить компенсацию",
    "status": "in_progress"
  }' \
  http://localhost:8001/site-api/admin/support/tickets/550e8400-e29b-41d4-a716-446655440000/messages
```

---

### POST — Разрешить тикет
```
POST /admin/support/tickets/{ticket_id}/resolve
```

Установить статус `resolved`, добавить заметки администратора и установить время разрешения.

**Path параметры**:
- `ticket_id` (uuid) — ID тикета

**Тело запроса**:
```json
{
  "resolution_notes": "Клиенту предоставлена скидка 50%, товар будет заменен в течение 3 дней"
}
```

**Ответ**: 200 OK — Возвращает обновленный тикет (SupportTicketAdminOut)

**Ошибки**:
- `404 TICKET_NOT_FOUND` — Тикет не найден

**Пример запроса**:
```bash
curl -X POST \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resolution_notes": "Проблема решена. Отправлена замена товара. Клиент уведомлен"
  }' \
  http://localhost:8001/site-api/admin/support/tickets/550e8400-e29b-41d4-a716-446655440000/resolve
```

---

### POST — Закрыть тикет
```
POST /admin/support/tickets/{ticket_id}/close
```

Установить статус `closed` и время закрытия тикета.

**Path параметры**:
- `ticket_id` (uuid) — ID тикета

**Ответ**: 200 OK — Возвращает обновленный тикет (SupportTicketAdminOut)

**Ошибки**:
- `404 TICKET_NOT_FOUND` — Тикет не найден

**Пример запроса**:
```bash
curl -X POST \
  -H "Authorization: Bearer <admin_token>" \
  http://localhost:8001/site-api/admin/support/tickets/550e8400-e29b-41d4-a716-446655440000/close
```

---

### GET — Получить статистику для дашборда
```
GET /admin/support/tickets/stats/dashboard
```

Получить общую статистику по тикетам для административного дашборда.

**Ответ**: 200 OK
```json
{
  "total_tickets": 248,
  "by_status": {
    "new": 45,
    "in_progress": 32,
    "resolved": 156,
    "closed": 15
  },
  "by_category": {
    "wrong_item": 52,
    "late_delivery": 68,
    "damaged_item": 45,
    "missing_item": 38,
    "other": 45
  },
  "avg_resolution_time_hours": 15.3,
  "urgent_tickets_count": 8
}
```

**Пример запроса**:
```bash
curl -H "Authorization: Bearer <admin_token>" \
  http://localhost:8001/site-api/admin/support/tickets/stats/dashboard
```

---

## 🎯 Типичные сценарии

### Сценарий 1: Просмотр и обработка новых тикетов

```bash
# 1. Получить все новые срочные тикеты
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:8001/site-api/admin/support/tickets?status=new&priority=urgent"

# 2. Получить деталь тикета
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:8001/site-api/admin/support/tickets/550e8400-e29b-41d4-a716-446655440000"

# 3. Взять тикет в работу
curl -X PATCH \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}' \
  "http://localhost:8001/site-api/admin/support/tickets/550e8400-e29b-41d4-a716-446655440000/status"

# 4. Добавить ответ
curl -X POST \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"message": "Спасибо за жалобу, мы разбираемся"}' \
  "http://localhost:8001/site-api/admin/support/tickets/550e8400-e29b-41d4-a716-446655440000/messages"
```

### Сценарий 2: Получение статистики

```bash
# Получить полную статистику по дашборду
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:8001/site-api/admin/support/tickets/stats/dashboard"

# Получить тикеты, требующие срочного внимания
curl -H "Authorization: Bearer <admin_token>" \
  "http://localhost:8001/site-api/admin/support/tickets?priority=urgent,high&status=new"
```

---

## ⚠️ Обработка ошибок

Все ошибки возвращаются в единообразном формате:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Описание ошибки на русском"
  }
}
```

**Коды ошибок**:

| Код | HTTP | Описание |
|-----|------|----------|
| `TICKET_NOT_FOUND` | 404 | Тикет не найден |
| `INVALID_STATUS` | 400 | Недопустимый статус |
| `UNAUTHORIZED` | 403 | Требуются права администратора |
| `INTERNAL_ERROR` | 500 | Внутренняя ошибка сервера |

---

## 🔐 Требования к аутентификации

Все эндпоинты требуют JWT токена администратора в заголовке:

```
Authorization: Bearer <jwt_token>
```

Если токен отсутствует или невалиден, сервер вернет:
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Требуются права администратора"
  }
}
```
