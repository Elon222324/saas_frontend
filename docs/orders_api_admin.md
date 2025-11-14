# API Заказов для Админки (Обновлено)

## Обзор

API заказов для админки предоставляет функционал для:
- Получения списка заказов
- Получения списка заказов с полными деталями (товары, комментарии)
- Получения деталей конкретного заказа
- Управления статусами и платежами
- Работы с товарами в заказе

**Базовый путь:** `/site-api/admin/orders`

**Требуется JWT авторизация** с ролью администратора

---

## 🆕 Что Изменилось в MVP

### Новые Поля в Ответах

Все эндпоинты теперь возвращают дополнительные поля:

| Поле | Тип | Описание |
|------|-----|---------|
| `delivery_type` | string | Тип доставки: `delivery` или `pickup` |
| `pickup_time` | datetime | Время самовывоза (если `delivery_type: 'pickup'`) |
| `cash_payment_detail` | string | Деталь оплаты: `exact_change` или `needs_change` |
| `cash_denominal` | float | Сумма наличных (если указана) |
| `address_text` | string | Адрес доставки (может быть `null` для pickup) |
| `comment` | string | Комментарий к заказу |

### Новые Данные в Товарах

Поле `item_comment` теперь загружается для каждого товара:

```json
{
  "id": "uuid-товара",
  "product_title": "Капучино",
  "quantity": 2,
  "item_comment": "На кокосовом молоке, пожалуйста",
  "extras": [...]
}
```

---

## Endpoints

### 1. Получить Список Заказов

**GET** `/`

Возвращает список заказов без деталей товаров (быстрая загрузка).

**Параметры запроса:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|---------|
| `limit` | int | 100 | Количество заказов (1-1000) |
| `offset` | int | 0 | Смещение |

**Ответ (200 OK):**
```json
{
  "orders": [
    {
      "id": "uuid",
      "order_number": 123,
      "status": "new",
      "delivery_type": "pickup",
      "pickup_time": "2025-01-20T14:15:00Z",
      "payment_method": "cash",
      "payment_status": "pending",
      "cash_payment_detail": "needs_change",
      "cash_denominal": 5000.00,
      "address_text": null,
      "comment": "Позвоните перед приездом",
      "subtotal_amount": 1000.00,
      "discount_amount": 100.00,
      "delivery_fee_amount": 0.00,
      "total_amount": 900.00,
      "currency": "RUB",
      "created_at": "2025-01-20T14:30:00Z",
      "updated_at": "2025-01-20T14:30:00Z",
      "customer_name": "Иван Иванов",
      "customer_phone": "79991234567"
    }
  ]
}
```

---

### 2. Получить Список Заказов с Товарами

**GET** `/list`

Возвращает список заказов со всеми товарами, комментариями и доп. опциями.

**Параметры запроса:**

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|---------|
| `limit` | int | 50 | Количество заказов (1-100) |
| `offset` | int | 0 | Смещение |

**Ответ (200 OK):**
```json
{
  "orders": [
    {
      "id": "uuid",
      "order_number": 123,
      "status": "new",
      "delivery_type": "pickup",
      "pickup_time": "2025-01-20T14:15:00Z",
      "payment_method": "cash",
      "payment_status": "pending",
      "cash_payment_detail": "needs_change",
      "cash_denominal": 5000.00,
      "address_text": null,
      "comment": "Позвоните перед приездом",
      "subtotal_amount": 1000.00,
      "discount_amount": 100.00,
      "delivery_fee_amount": 0.00,
      "total_amount": 900.00,
      "currency": "RUB",
      "customer_name": "Иван Иванов",
      "customer_phone": "79991234567",
      "created_at": "2025-01-20T14:30:00Z",
      "updated_at": "2025-01-20T14:30:00Z",
      "items": [
        {
          "id": "uuid-товара",
          "product_id": 42,
          "product_title": "Капучино",
          "display_name": "Капучино (300ml)",
          "quantity": 2,
          "unit_price": 250.00,
          "line_total": 500.00,
          "item_comment": "На кокосовом молоке, пожалуйста",
          "extras": [
            {
              "id": "uuid",
              "extra_id": 1,
              "extra_name": "Дополнительный шот",
              "extra_price": 50.00,
              "quantity": 1
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 3. Получить Детали Заказа

**GET** `/{order_id}/details`

Возвращает полные детали конкретного заказа со всеми товарами и комментариями.

**Ответ (200 OK):**
```json
{
  "order": {
    "id": "uuid",
    "order_number": 123,
    "status": "new",
    "delivery_type": "pickup",
    "pickup_time": "2025-01-20T14:15:00Z",
    "payment_method": "cash",
    "payment_status": "pending",
    "cash_payment_detail": "needs_change",
    "cash_denominal": 5000.00,
    "address_text": null,
    "comment": "Позвоните перед приездом",
    ...другие поля заказа...
  },
  "items": [
    {
      "id": "uuid",
      "product_title": "Капучино",
      "quantity": 2,
      "unit_price": 250.00,
      "item_comment": "На кокосовом молоке, пожалуйста",
      "extras": [...]
    }
  ]
}
```

---

## Интеграция с UI Админки

### Пример: Борд Продавца

На основе полученных данных можно построить "борд" примерно так:

```
┌─────────────────────────────────────────────────────────┐
│                    Заказ №123                           │
├─────────────────────────────────────────────────────────┤
│ Статус: new                    Оплата: НАЛИЧНЫЕ         │
│ ⏰ Самовывоз: 14:15            📱 +7 999 123-45-67      │
│                                                         │
│ Сумма: 900₽                                             │
│ Оплачено: 5000₽                                         │
│ СДАЧА: 4100₽  ⬅️ Рассчитано: 5000 - 900               │
├─────────────────────────────────────────────────────────┤
│ ТОВАРЫ:                                                 │
│ ✓ 2x Капучино (300ml) @ 250₽ = 500₽                    │
│   → На кокосовом молоке, пожалуйста                   │
│   → +1x Дополнительный шот @ 50₽                      │
│                                                         │
│ Заметка: Позвоните перед приездом                      │
├─────────────────────────────────────────────────────────┤
│ [Подтвердить] [Готовится] [Готово] [Отмена]           │
└─────────────────────────────────────────────────────────┘
```

### Пример Фильтрации по типу доставки

```javascript
// Показать только заказы на самовывоз
const pickupOrders = orders.filter(o => o.delivery_type === 'pickup');

// Показать только заказы с необходимостью сдачи
const cashWithChange = orders.filter(o => 
  o.cash_payment_detail === 'needs_change' && o.cash_denominal
);
```

### Пример Расчёта Сдачи

```javascript
function calculateChange(order) {
  if (order.cash_payment_detail === 'needs_change' && order.cash_denominal) {
    return order.cash_denominal - order.total_amount;
  }
  return 0;
}

const change = calculateChange(order);
console.log(`Сдача: ${change}₽`);
```

---

## Изменения, Применённые к Админ-API

### Файл: `app/api/admin/admin_orders.py`

#### Эндпоинт GET / (list_orders)
- ✅ Добавлены поля: `delivery_type`, `pickup_time`, `cash_payment_detail`, `cash_denominal`, `address_text`, `comment`

#### Эндпоинт GET /list (list_orders_with_items)
- ✅ Добавлены те же поля в SELECT заказа
- ✅ Добавлена загрузка комментариев из `order_item_comments` для каждого товара
- ✅ Оптимизирована загрузка: комментарии загружаются одним массивным запросом, а не по одному на товар

#### Эндпоинт GET /{order_id}/details (get_order)
- ✅ SELECT уже использовал `o.*`, поэтому все поля загружаются автоматически
- ✅ Добавлена загрузка комментариев в товарах (аналогично /list)

---

## Примеры Использования

### Получить все заказы на самовывоз

```bash
curl -X GET "http://localhost:8000/site-api/admin/orders/list?limit=50" \
  -H "Authorization: Bearer <admin_token>"
```

Затем отфильтровать на клиенте:
```javascript
const response = await fetch('/site-api/admin/orders/list', {
  headers: { 'Authorization': 'Bearer <token>' }
});
const data = await response.json();
const pickupOrders = data.orders.filter(o => o.delivery_type === 'pickup');
```

### Показать информацию о сдаче

```javascript
data.orders.forEach(order => {
  if (order.cash_payment_detail === 'needs_change') {
    const change = order.cash_denominal - order.total_amount;
    console.log(`Заказ №${order.order_number}: оплачено ${order.cash_denominal}₽, сдача ${change}₽`);
  }
});
```

### Отобразить пожелания клиента к каждому товару

```javascript
order.items.forEach(item => {
  console.log(`${item.product_title} x${item.quantity}`);
  if (item.item_comment) {
    console.log(`  → Пожелание: ${item.item_comment}`);
  }
  item.extras.forEach(extra => {
    console.log(`    + ${extra.extra_name}`);
  });
});
```

---

## Статусы Заказов

| Статус | Описание | Может быть изменён |
|--------|---------|-------------------|
| `new` | Новый заказ | Да |
| `confirmed` | Подтверждён | Да |
| `preparing` | Готовится | Да |
| `delivering` | В пути | Да (только для доставки) |
| `completed` | Завершён | Нет (финальный) |
| `canceled` | Отменён | Нет (финальный) |

---

## Обработка Ошибок

| Код | Ошибка | Причина |
|-----|--------|---------|
| `404` | `ORDER_NOT_FOUND` | Заказ не существует |
| `409` | `ORDER_FINALIZED` | Заказ уже завершён или отменён |
| `409` | `ORDER_IN_PROGRESS` | Заказ уже готовится или в пути |

---

## Таблица Совместимости

| Функция | MVP | Поддерживается |
|---------|-----|----------------|
| Доставка (delivery) | ✅ | Да |
| Самовывоз (pickup) | ✅ | Да |
| Комментарии к товарам | ✅ | Да |
| Оплата наличными | ✅ | Да |
| Расчёт сдачи | ✅ | Да |
| Управление статусами | ✅ | Да |
| Промокоды | ✅ | Да |
