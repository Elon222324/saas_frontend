# API Категорий Товаров с JWT Аутентификацией

## Обзор

Все эндпоинты работы с категориями товаров теперь требуют JWT аутентификации от админки. Токен должен быть передан в заголовке `Authorization` в формате `Bearer <token>`.

## Аутентификация

### Заголовок авторизации
```
Authorization: Bearer <admin_jwt_token>
```

### Формат JWT токена
JWT токен должен содержать следующие поля:
- `user_id` - ID пользователя админки
- `site_name` - Название сайта
- `exp` - Время истечения токена

### Ошибки аутентификации

Все ошибки аутентификации возвращаются в едином формате:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Описание ошибки"
  }
}
```

#### Возможные коды ошибок:
- `MISSING_AUTH_HEADER` - Отсутствует заголовок Authorization
- `INVALID_AUTH_FORMAT` - Неверный формат заголовка (должен начинаться с "Bearer ")
- `MISSING_TOKEN` - Отсутствует токен
- `INVALID_ADMIN_TOKEN` - Неверный токен
- `ADMIN_TOKEN_EXPIRED` - Токен истек
- `SITE_MISMATCH` - Токен предназначен для другого сайта

## Эндпоинты

### 1. Получить все категории
```http
GET /site-api/admin/products/categories/
```

**Заголовки:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "parent_id": null,
    "code": "PIZZA",
    "slug": "pizza",
    "name": "Пицца",
    "description": "Итальянская пицца",
    "image_url": "https://example.com/pizza.jpg",
    "display_order": 1,
    "is_active": true,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z",
    "count": 15
  }
]
```

### 2. Получить категорию по ID
```http
GET /site-api/admin/products/categories/{category_id}
```

**Параметры:**
- `category_id` (int) - ID категории

**Заголовки:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "parent_id": null,
  "code": "PIZZA",
  "slug": "pizza",
  "name": "Пицца",
  "description": "Итальянская пицца",
  "image_url": "https://example.com/pizza.jpg",
  "display_order": 1,
  "is_active": true,
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z",
  "count": 15
}
```

**Ошибки:**
- `404 Not Found` - Категория не найдена
- `401 Unauthorized` - Ошибка аутентификации

### 3. Получить категорию по slug
```http
GET /site-api/admin/products/categories/by-slug/{slug}
```

**Параметры:**
- `slug` (string) - URL-слаг категории

**Заголовки:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "parent_id": null,
  "code": "PIZZA",
  "slug": "pizza",
  "name": "Пицца",
  "description": "Итальянская пицца",
  "image_url": "https://example.com/pizza.jpg",
  "display_order": 1,
  "is_active": true,
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z",
  "count": 15
}
```

**Ошибки:**
- `404 Not Found` - Категория не найдена
- `401 Unauthorized` - Ошибка аутентификации

### 4. Создать категорию
```http
POST /site-api/admin/products/categories/
```

**Заголовки:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Тело запроса:**
```json
{
  "parent_id": null,
  "code": "PIZZA",
  "slug": "pizza",
  "name": "Пицца",
  "description": "Итальянская пицца",
  "image_url": "https://example.com/pizza.jpg",
  "display_order": 1,
  "is_active": true
}
```

**Обязательные поля:**
- `slug` - URL-слаг (только строчные буквы, цифры и дефисы)
- `name` - Название категории

**Опциональные поля:**
- `parent_id` - ID родительской категории
- `code` - Код для интеграций (до 64 символов)
- `description` - Описание
- `image_url` - URL изображения
- `display_order` - Порядок сортировки (по умолчанию 0)
- `is_active` - Активность (по умолчанию true)

**Ответ (201 Created):**
```json
{
  "id": 1,
  "parent_id": null,
  "code": "PIZZA",
  "slug": "pizza",
  "name": "Пицца",
  "description": "Итальянская пицца",
  "image_url": "https://example.com/pizza.jpg",
  "display_order": 1,
  "is_active": true,
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z",
  "count": 0
}
```

**Ошибки:**
- `400 Bad Request` - Ошибка валидации данных
- `409 Conflict` - Категория с таким slug или code уже существует
- `401 Unauthorized` - Ошибка аутентификации

### 5. Обновить категорию
```http
PATCH /site-api/admin/products/categories/{category_id}
```

**Параметры:**
- `category_id` (int) - ID категории

**Заголовки:**
```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Тело запроса (все поля опциональны):**
```json
{
  "parent_id": null,
  "code": "PIZZA_NEW",
  "slug": "pizza-new",
  "name": "Новая пицца",
  "description": "Обновленное описание",
  "image_url": "https://example.com/new-pizza.jpg",
  "display_order": 2,
  "is_active": false
}
```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "parent_id": null,
  "code": "PIZZA_NEW",
  "slug": "pizza-new",
  "name": "Новая пицца",
  "description": "Обновленное описание",
  "image_url": "https://example.com/new-pizza.jpg",
  "display_order": 2,
  "is_active": false,
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-02T15:30:00Z",
  "count": 15
}
```

**Ошибки:**
- `400 Bad Request` - Не передано ни одного поля для обновления
- `404 Not Found` - Категория не найдена
- `409 Conflict` - Категория с таким slug или code уже существует
- `401 Unauthorized` - Ошибка аутентификации

### 6. Удалить категорию
```http
DELETE /site-api/admin/products/categories/{category_id}
```

**Параметры:**
- `category_id` (int) - ID категории

**Заголовки:**
```
Authorization: Bearer <admin_jwt_token>
```

**Ответ (204 No Content):**
```
(пустое тело ответа)
```

**Ошибки:**
- `404 Not Found` - Категория не найдена
- `401 Unauthorized` - Ошибка аутентификации

## Валидация данных

### Slug
- Обязательное поле
- Может содержать только строчные буквы, цифры и дефисы
- Не может начинаться или заканчиваться дефисом
- Максимум 255 символов
- Примеры: `pizza`, `hot-drinks`, `desserts-123`

### Code
- Опциональное поле
- Максимум 64 символа
- Не может быть пустой строкой, если указан
- Используется для интеграций с внешними системами

## Коды ошибок валидации

При ошибках валидации возвращается стандартная ошибка FastAPI:
```json
{
  "detail": [
    {
      "loc": ["body", "slug"],
      "msg": "Slug может содержать только строчные буквы, цифры и дефисы. Не может начинаться или заканчиваться дефисом",
      "type": "value_error"
    }
  ]
}
```

## Примеры использования

### JavaScript/TypeScript (fetch)
```javascript
const token = 'your_admin_jwt_token';

// Получить все категории
const response = await fetch('/site-api/admin/products/categories/', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const categories = await response.json();
```

### Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/site-api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Создать категорию
const newCategory = await api.post('/admin/products/categories/', {
  slug: 'new-category',
  name: 'Новая категория',
  description: 'Описание категории'
});
```

### React Hook
```typescript
import { useState, useEffect } from 'react';

const useCategories = (token: string) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/site-api/admin/products/categories/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  return { categories, loading };
};
```

## Важные замечания

1. **Все эндпоинты требуют аутентификации** - без валидного JWT токена доступ будет запрещен
2. **Токен должен быть админским** - используется `AdminAuthService` для проверки токенов
3. **Проверка сайта** - токен должен соответствовать текущему сайту
4. **Автоматическое кэширование** - изменения категорий автоматически очищают кэш сайта
5. **Транзакции** - операции удаления выполняются в транзакциях для обеспечения целостности данных
