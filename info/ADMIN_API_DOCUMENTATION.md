# 📚 API Документация для Админ-панели

## Обзор

Этот документ содержит полное описание API эндпоинтов для управления пользователями из админ-панели.

**Важно:** Все эндпоинты требуют авторизации с токеном пользователя с ролью `super_admin`.

---

## 🔐 Авторизация

Все запросы должны содержать заголовок авторизации:

```
Authorization: Bearer {access_token}
```

---

## 📋 Список всех эндпоинтов для Админки

### 1. **Получить список всех пользователей (с информацией о сайтах)** ⭐ РЕКОМЕНДУЕТСЯ

**GET** `/api/user/admin/users`

**Требует:** `super_admin`

**Описание:** Получить список всех пользователей в системе с подробной информацией об их сайтах.

**Request:**
```http
GET /api/user/admin/users
Authorization: Bearer {super_admin_token}
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "user_name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "partner_id": null,
    "created_at": "2025-10-10T12:00:00Z",
    "sites": [
      {
        "id": 5,
        "domain": "example.com",
        "status": "running",
        "created_at": "2025-10-08T15:30:00Z"
      },
      {
        "id": 8,
        "domain": "shop.example.com",
        "status": "stopped",
        "created_at": "2025-10-09T10:00:00Z"
      }
    ],
    "sites_count": 2
  },
  {
    "id": 2,
    "user_name": "Jane Admin",
    "email": "jane@example.com",
    "role": "admin",
    "partner_id": 1,
    "created_at": "2025-10-09T10:30:00Z",
    "sites": [],
    "sites_count": 0
  }
]
```

---

### 1.1. **Получить список всех пользователей (базовый)**

**GET** `/api/user/get`

**Требует:** `super_admin`

**Описание:** Получить список всех пользователей в системе без информации о сайтах (облегченная версия).

**Request:**
```http
GET /api/user/get
Authorization: Bearer {super_admin_token}
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "user_name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "partner_id": null,
    "created_at": "2025-10-10T12:00:00Z"
  },
  {
    "id": 2,
    "user_name": "Jane Admin",
    "email": "jane@example.com",
    "role": "admin",
    "partner_id": 1,
    "created_at": "2025-10-09T10:30:00Z"
  }
]
```

---

### 2. **Получить пользователя по ID (с информацией о сайтах)**

**GET** `/api/user/admin/users/{user_id}`

**Требует:** `super_admin`

**Описание:** Получить подробную информацию о конкретном пользователе с информацией обо всех его сайтах.

**Request:**
```http
GET /api/user/admin/users/5
Authorization: Bearer {super_admin_token}
```

**Response:** `200 OK`
```json
{
  "id": 5,
  "user_name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "partner_id": null,
  "created_at": "2025-10-08T14:20:00Z",
  "sites": [
    {
      "id": 12,
      "domain": "testsite.com",
      "status": "running",
      "created_at": "2025-10-09T16:00:00Z"
    }
  ],
  "sites_count": 1
}
```

**Ошибки:**
- `404` - Пользователь не найден

---

### 3. **Создать нового пользователя (Админ)**

**POST** `/api/user/admin/users`

**Требует:** `super_admin`

**Описание:** Создать нового пользователя с возможностью установки роли и partner_id.

**Request:**
```http
POST /api/user/admin/users
Authorization: Bearer {super_admin_token}
Content-Type: application/json

{
  "user_name": "New User",
  "email": "newuser@example.com",
  "password": "securePassword123",
  "role": "user",
  "partner_id": null
}
```

**Схема данных (UserAdminCreate):**
```typescript
{
  user_name: string;        // Обязательно - Имя пользователя
  email: string;            // Обязательно - Email (должен быть валидным)
  password: string;         // Обязательно - Пароль (будет захеширован)
  role?: string;            // Опционально - Роль (по умолчанию "user")
  partner_id?: number | null; // Опционально - ID партнера
}
```

**Допустимые роли:**
- `user` - обычный пользователь (по умолчанию)
- `admin` - администратор
- `super_admin` - супер-администратор
- `partner` - партнер

**Response:** `200 OK`
```json
{
  "id": 10,
  "user_name": "New User",
  "email": "newuser@example.com",
  "role": "user",
  "partner_id": null,
  "created_at": "2025-10-10T15:00:00Z"
}
```

**Ошибки:**
- `400` - Пользователь с таким email уже существует
- `400` - Недопустимая роль
- `404` - Партнер не найден (если указан partner_id)

---

### 4. **Обновить пользователя (Админ)**

**PUT** `/api/user/admin/users/{user_id}`

**Требует:** `super_admin`

**Описание:** Обновить данные пользователя. Можно обновить любые поля: имя, email, пароль, роль, partner_id.

**Request:**
```http
PUT /api/user/admin/users/5
Authorization: Bearer {super_admin_token}
Content-Type: application/json

{
  "user_name": "Updated Name",
  "email": "newemail@example.com",
  "role": "admin"
}
```

**Схема данных (UserAdminUpdate):**
```typescript
{
  user_name?: string;        // Опционально - Новое имя пользователя
  email?: string;            // Опционально - Новый email
  password?: string;         // Опционально - Новый пароль
  role?: string;             // Опционально - Новая роль
  partner_id?: number | null; // Опционально - Новый partner_id
}
```

**Примечания:**
- Все поля опциональны
- Обновляются только те поля, которые указаны в запросе
- Если указать `password`, он будет захеширован
- Email проверяется на уникальность

**Response:** `200 OK`
```json
{
  "id": 5,
  "user_name": "Updated Name",
  "email": "newemail@example.com",
  "role": "admin",
  "partner_id": null,
  "created_at": "2025-10-08T14:20:00Z"
}
```

**Ошибки:**
- `404` - Пользователь не найден
- `400` - Недопустимая роль
- `400` - Пользователь с таким email уже существует
- `404` - Партнер не найден (если указан partner_id)

---

### 5. **Удалить пользователя (Админ)**

**DELETE** `/api/user/admin/users/{user_id}`

**Требует:** `super_admin`

**Описание:** Удалить пользователя из системы.

**⚠️ ВНИМАНИЕ:** Также будут удалены все связанные данные (API ключи, сайты) благодаря каскадному удалению.

**Request:**
```http
DELETE /api/user/admin/users/5
Authorization: Bearer {super_admin_token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Пользователь test@example.com успешно удален",
  "deleted_user_id": 5
}
```

**Ошибки:**
- `404` - Пользователь не найден
- `400` - Нельзя удалить самого себя
- `500` - Ошибка при удалении

---

### 6. **Изменить роль пользователя**

**PUT** `/api/user/role/{user_id}`

**Требует:** `super_admin`

**Описание:** Изменить только роль пользователя.

**Request:**
```http
PUT /api/user/role/5
Authorization: Bearer {super_admin_token}
Content-Type: application/json

{
  "role": "admin"
}
```

**Схема данных (UserRoleUpdate):**
```typescript
{
  role: string; // Обязательно - Новая роль
}
```

**Response:** `200 OK`
```json
{
  "id": 5,
  "user_name": "Test User",
  "email": "test@example.com",
  "role": "admin",
  "partner_id": null,
  "created_at": "2025-10-08T14:20:00Z"
}
```

---

### 7. **Изменить партнера пользователя**

**PUT** `/api/user/partner/{user_id}`

**Требует:** `super_admin`

**Описание:** Изменить только partner_id пользователя.

**Request:**
```http
PUT /api/user/partner/5
Authorization: Bearer {super_admin_token}
Content-Type: application/json

{
  "partner_id": 3
}
```

**Схема данных (UserPartnerUpdate):**
```typescript
{
  partner_id: number | null; // Обязательно - ID партнера или null
}
```

**Response:** `200 OK`
```json
{
  "id": 5,
  "user_name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "partner_id": 3,
  "created_at": "2025-10-08T14:20:00Z"
}
```

---

## 📊 Сводная таблица эндпоинтов

| Метод | Эндпоинт | Описание | Доступ |
|-------|----------|----------|--------|
| GET | `/api/user/admin/users` | ⭐ Список пользователей с сайтами | super_admin |
| GET | `/api/user/get` | Список пользователей (базовый) | super_admin |
| GET | `/api/user/admin/users/{user_id}` | Получить пользователя с сайтами | super_admin |
| POST | `/api/user/admin/users` | Создать пользователя | super_admin |
| PUT | `/api/user/admin/users/{user_id}` | Обновить пользователя | super_admin |
| DELETE | `/api/user/admin/users/{user_id}` | Удалить пользователя | super_admin |
| PUT | `/api/user/role/{user_id}` | Изменить роль | super_admin |
| PUT | `/api/user/partner/{user_id}` | Изменить партнера | super_admin |

**Примечание:** ⭐ - Рекомендуется использовать для админки, так как включает информацию о сайтах.

---

## 🎨 Примеры использования для фронтенда

### Пример 1: Получение списка пользователей с сайтами (рекомендуется)

```typescript
// TypeScript/JavaScript пример
const getUsersWithSites = async () => {
  const response = await fetch('https://api.example.com/api/user/admin/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  const users = await response.json();
  // users теперь содержит массив пользователей с полем sites и sites_count
  return users;
};
```

### Пример 1.1: Получение базового списка пользователей (без сайтов)

```typescript
const getUsers = async () => {
  const response = await fetch('https://api.example.com/api/user/get', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  const users = await response.json();
  return users;
};
```

### Пример 2: Создание пользователя

```typescript
const createUser = async (userData: {
  user_name: string;
  email: string;
  password: string;
  role?: string;
  partner_id?: number | null;
}) => {
  const response = await fetch('https://api.example.com/api/user/admin/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }
  
  const newUser = await response.json();
  return newUser;
};
```

### Пример 3: Обновление пользователя

```typescript
const updateUser = async (userId: number, updates: {
  user_name?: string;
  email?: string;
  password?: string;
  role?: string;
  partner_id?: number | null;
}) => {
  const response = await fetch(`https://api.example.com/api/user/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }
  
  const updatedUser = await response.json();
  return updatedUser;
};
```

### Пример 4: Удаление пользователя

```typescript
const deleteUser = async (userId: number) => {
  const response = await fetch(`https://api.example.com/api/user/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }
  
  const result = await response.json();
  return result;
};
```

---

## 🔒 Безопасность

1. **Авторизация:** Все эндпоинты требуют токен с ролью `super_admin`
2. **Валидация данных:** Email проверяется на валидность и уникальность
3. **Безопасность паролей:** Пароли автоматически хешируются перед сохранением
4. **Каскадное удаление:** При удалении пользователя удаляются все связанные данные
5. **Защита от самоудаления:** Администратор не может удалить самого себя

---

## ❌ Общие коды ошибок

| Код | Описание |
|-----|----------|
| 200 | Успешно |
| 400 | Некорректные данные |
| 401 | Не авторизован |
| 403 | Доступ запрещен (не super_admin) |
| 404 | Ресурс не найден |
| 500 | Внутренняя ошибка сервера |

---

## 📝 TypeScript интерфейсы

```typescript
// Интерфейсы для работы с API

// Базовая информация о пользователе
interface User {
  id: number;
  user_name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin' | 'partner';
  partner_id: number | null;
  created_at: string;
}

// Информация о сайте (краткая)
interface UserSiteInfo {
  id: number;
  domain: string;
  status: string;
  created_at: string;
}

// Расширенная информация о пользователе с сайтами (рекомендуется для админки)
interface UserWithSites {
  id: number;
  user_name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin' | 'partner';
  partner_id: number | null;
  created_at: string;
  sites: UserSiteInfo[];
  sites_count: number;
}

interface UserAdminCreate {
  user_name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'super_admin' | 'partner';
  partner_id?: number | null;
}

interface UserAdminUpdate {
  user_name?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'admin' | 'super_admin' | 'partner';
  partner_id?: number | null;
}

interface UserRoleUpdate {
  role: 'user' | 'admin' | 'super_admin' | 'partner';
}

interface UserPartnerUpdate {
  partner_id: number | null;
}

interface DeleteUserResponse {
  success: boolean;
  message: string;
  deleted_user_id: number;
}
```

---

## 🚀 Рекомендации по реализации UI

### Список пользователей
- **Использовать эндпоинт:** `GET /api/user/admin/users` (с информацией о сайтах)
- Показывать таблицу с колонками: 
  - ID
  - Имя
  - Email
  - Роль
  - Партнер
  - **Количество сайтов** (sites_count)
  - Дата создания
- Добавить фильтрацию по роли
- Добавить поиск по имени/email
- Кнопки действий: Редактировать, Удалить
- **Дополнительно:** Показывать список сайтов при раскрытии строки или в модальном окне
  - Отображать домен, статус и дату создания каждого сайта

### Форма создания пользователя
- Поля: Имя (обязательно), Email (обязательно), Пароль (обязательно)
- Выпадающий список для выбора роли
- Выпадающий список для выбора партнера (опционально)
- Валидация на клиенте перед отправкой

### Форма редактирования пользователя
- Все поля опциональны
- Показывать текущие значения в полях
- Для пароля - показывать как "••••••" и менять только если введен новый
- Подтверждение перед удалением

### Обработка ошибок
- Показывать понятные сообщения об ошибках пользователю
- Подсвечивать поля с ошибками
- При ошибке сервера показывать детали из `error.detail`

---

## 📞 Контакты и поддержка

Если у вас возникли вопросы по API, обратитесь к разработчикам бэкенда.

**Версия документации:** 1.0  
**Дата последнего обновления:** 10 октября 2025

