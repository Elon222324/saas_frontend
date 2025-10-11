# 🌐 API Документация - Управление Сайтами Пользователей (Admin)

## Обзор

Этот документ содержит полное описание API эндпоинтов для управления сайтами пользователей из админ-панели.

**Важно:** Все эндпоинты требуют авторизации с токеном пользователя с ролью `super_admin`.

**Особенности:**
- Супер-админ может создавать, просматривать и удалять сайты для любых пользователей
- Не требуется переавторизация под другим пользователем
- Автоматическое связывание с API ключами пользователя
- Детальное логирование всех операций

---

## 🔐 Авторизация

Все запросы должны содержать заголовок авторизации:

```
Authorization: Bearer {access_token}
```

---

## 📋 Список эндпоинтов для управления сайтами

### 1. **Добавить сайт пользователю** ⭐

**POST** `/api/user/admin/users/{user_id}/sites`

**Требует:** `super_admin`

**Описание:** Создать новый сайт для указанного пользователя с **полным автоматическим деплоем**. 

**Что происходит при создании:**
1. ✅ Создание записи в базе данных
2. ✅ Создание директорий и файлов сайта
3. ✅ Создание базы данных PostgreSQL для сайта
4. ✅ Инициализация всех таблиц сайта
5. ✅ Создание и запуск Docker контейнера
6. ✅ Сайт автоматически становится доступен


**Path Parameters:**
- `user_id` (integer, required) - ID пользователя, которому добавляем сайт

**Request Body:**
```json
{
  "user_id": 5,
  "domain": "example.com"
}
```

**Schema `AdminSiteCreate`:**
| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `user_id` | integer | ✅ Да | ID пользователя (должен совпадать с user_id в URL) |
| `domain` | string | ✅ Да | Домен сайта (уникальный) |

**Request Example:**
```http
POST /api/user/admin/users/5/sites
Authorization: Bearer {super_admin_token}
Content-Type: application/json

{
  "user_id": 5,
  "domain": "myshop.com"
}
```

**Response:** `200 OK`
```json
{
  "id": 15,
  "user_id": 5,
  "domain": "myshop.com",
  "status": "running",
  "created_at": "2025-10-10T14:30:00Z",
  "owner_email": "user@example.com",
  "owner_name": "John Doe"
}
```

**Schema `AdminSiteResponse`:**
| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | ID сайта |
| `user_id` | integer | ID владельца сайта |
| `domain` | string | Домен сайта |
| `status` | string | Статус сайта (`running`, `stopped`, `deploying`, etc.) |
| `created_at` | datetime | Дата создания |
| `owner_email` | string | Email владельца |
| `owner_name` | string | Имя владельца |

**Возможные ошибки:**

**400 Bad Request** - Неверные данные
```json
{
  "detail": "user_id в URL (5) не совпадает с user_id в теле запроса (7)"
}
```

```json
{
  "detail": "Сайт с доменом myshop.com уже существует (владелец: 3)"
}
```

**404 Not Found** - Пользователь не найден
```json
{
  "detail": "Пользователь с ID 5 не найден"
}
```

**Примечания:**
- Домен должен быть уникальным в системе
- **Сайт автоматически деплоится и запускается** - не нужны дополнительные вызовы
- Процесс деплоя может занять 30-60 секунд
- После успешного деплоя сайт сразу доступен по домену

---

### 2. **Получить все сайты пользователя**

**GET** `/api/user/admin/users/{user_id}/sites`

**Требует:** `super_admin`

**Описание:** Получить список всех сайтов конкретного пользователя с их текущими статусами.

**Path Parameters:**
- `user_id` (integer, required) - ID пользователя

**Request:**
```http
GET /api/user/admin/users/5/sites
Authorization: Bearer {super_admin_token}
```

**Response:** `200 OK`
```json
{
  "user_id": 5,
  "sites_count": 3,
  "sites": [
    {
      "id": 15,
      "user_id": 5,
      "name": "myshop_com_app",
      "domain": "myshop.com",
      "path": "/sites/myshop.com",
      "status": "running",
      "created_at": "2025-10-10T14:30:00Z",
      "owner_email": "user@example.com",
      "owner_name": "John Doe"
    },
    {
      "id": 18,
      "user_id": 5,
      "name": "store_example_com_app",
      "domain": "store.example.com",
      "path": "/sites/store.example.com",
      "status": "stopped",
      "created_at": "2025-10-09T10:00:00Z",
      "owner_email": "user@example.com",
      "owner_name": "John Doe"
    },
    {
      "id": 22,
      "user_id": 5,
      "name": "demo_site_com_app",
      "domain": "demo-site.com",
      "path": "/sites/demo-site.com",
      "status": "unknown",
      "created_at": "2025-10-08T08:15:00Z",
      "owner_email": "user@example.com",
      "owner_name": "John Doe"
    }
  ]
}
```

**Response Schema:**
| Поле | Тип | Описание |
|------|-----|----------|
| `user_id` | integer | ID пользователя |
| `sites_count` | integer | Количество сайтов |
| `sites` | array | Массив объектов сайтов |

**Объект сайта в массиве:**
| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | ID сайта |
| `user_id` | integer | ID владельца |
| `name` | string | Имя контейнера |
| `domain` | string | Домен сайта |
| `path` | string | Путь к файлам сайта |
| `status` | string | Статус контейнера: `running`, `stopped`, `created`, `unknown` |
| `created_at` | datetime | Дата создания |
| `owner_email` | string | Email владельца |
| `owner_name` | string | Имя владельца |

**Возможные ошибки:**

**404 Not Found** - Пользователь не найден
```json
{
  "detail": "Пользователь с ID 5 не найден"
}
```

**Примечания:**
- Статусы контейнеров получаются в реальном времени через API docker_update сервиса
- Если пользователь не имеет сайтов, возвращается пустой массив
- Статус `unknown` означает, что не удалось получить реальный статус контейнера

---

### 3. **Получить информацию о сайте по ID**

**GET** `/api/user/admin/sites/{site_id}`

**Требует:** `super_admin`

**Описание:** Получить подробную информацию о конкретном сайте, включая данные владельца.

**Path Parameters:**
- `site_id` (integer, required) - ID сайта

**Request:**
```http
GET /api/user/admin/sites/15
Authorization: Bearer {super_admin_token}
```

**Response:** `200 OK`
```json
{
  "id": 15,
  "user_id": 5,
  "domain": "myshop.com",
  "status": "running",
  "created_at": "2025-10-10T14:30:00Z",
  "owner_email": "user@example.com",
  "owner_name": "John Doe"
}
```

**Response Schema:**
| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | ID сайта |
| `user_id` | integer | ID владельца |
| `domain` | string | Домен сайта |
| `status` | string | Текущий статус контейнера |
| `created_at` | datetime | Дата создания |
| `owner_email` | string | Email владельца |
| `owner_name` | string | Имя владельца |

**Возможные ошибки:**

**404 Not Found** - Сайт не найден
```json
{
  "detail": "Сайт с ID 15 не найден"
}
```

**Примечания:**
- Возвращает актуальный статус контейнера
- Полезно для получения информации о владельце сайта

---

### 4. **Удалить сайт пользователя** ⚠️

**DELETE** `/api/user/admin/users/{user_id}/sites/{site_id}`

**Требует:** `super_admin`

**Описание:** **Полностью удалить сайт** со всей инфраструктурой. 

**Что происходит при удалении:**
1. ✅ Остановка Docker контейнера
2. ✅ Удаление контейнера
3. ✅ Удаление записи из базы данных SaaS
4. ✅ Удаление всех файлов и директорий сайта
5. ✅ Удаление базы данных PostgreSQL сайта
6. ✅ Очистка кэша фронтенда

**⚠️ ВНИМАНИЕ:** Это необратимая операция! Все данные сайта будут удалены без возможности восстановления.

**Path Parameters:**
- `user_id` (integer, required) - ID пользователя (для проверки владения)
- `site_id` (integer, required) - ID сайта для удаления

**Request:**
```http
DELETE /api/user/admin/users/5/sites/15
Authorization: Bearer {super_admin_token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Сайт myshop.com успешно удален",
  "deleted_site_id": 15,
  "user_id": 5
}
```

**Response Schema:**
| Поле | Тип | Описание |
|------|-----|----------|
| `success` | boolean | Статус операции |
| `message` | string | Сообщение об успешном удалении |
| `deleted_site_id` | integer | ID удаленного сайта |
| `user_id` | integer | ID владельца |

**Возможные ошибки:**

**400 Bad Request** - Сайт не принадлежит пользователю
```json
{
  "detail": "Сайт myshop.com (ID: 15) не принадлежит пользователю 7"
}
```

**404 Not Found** - Сайт не найден
```json
{
  "detail": "Сайт с ID 15 не найден"
}
```

**Примечания:**
- Проверяется принадлежность сайта указанному пользователю
- **Выполняется полное удаление** всей инфраструктуры сайта
- Операция необратима - все данные будут потеряны
- Процесс удаления занимает 10-30 секунд
- Если контейнер не может быть остановлен, удаление продолжится с предупреждением

---

## 🔄 Типичные сценарии использования

### Сценарий 1: Создание пользователя и добавление сайтов

```javascript
// Шаг 1: Создать пользователя
const createUserResponse = await fetch('/api/user/admin/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_name: 'John Doe',
    email: 'john@example.com',
    password: 'secure_password',
    role: 'user'
  })
});

const newUser = await createUserResponse.json();
console.log('Created user:', newUser.id);

// Шаг 2: Добавить сайт пользователю (сразу же, без переавторизации)
const addSiteResponse = await fetch(`/api/user/admin/users/${newUser.id}/sites`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: newUser.id,
    domain: 'john-shop.com'
  })
});

const newSite = await addSiteResponse.json();
console.log('Created site:', newSite.domain);
```

### Сценарий 2: Просмотр всех сайтов пользователя

```javascript
const userId = 5;

const response = await fetch(`/api/user/admin/users/${userId}/sites`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

const data = await response.json();
console.log(`Пользователь ${userId} имеет ${data.sites_count} сайтов:`);
data.sites.forEach(site => {
  console.log(`- ${site.domain} (${site.status})`);
});
```

### Сценарий 3: Добавление нескольких сайтов пользователю

```javascript
const userId = 5;
const domains = ['shop1.com', 'shop2.com', 'demo.com'];

// Добавляем сайты последовательно
for (const domain of domains) {
  const response = await fetch(`/api/user/admin/users/${userId}/sites`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId,
      domain: domain
    })
  });
  
  if (response.ok) {
    const site = await response.json();
    console.log(`✅ Создан сайт: ${site.domain}`);
  } else {
    const error = await response.json();
    console.error(`❌ Ошибка для ${domain}:`, error.detail);
  }
}
```

### Сценарий 4: Получение детальной информации о сайте

```javascript
const siteId = 15;

const response = await fetch(`/api/user/admin/sites/${siteId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

const site = await response.json();
console.log('Информация о сайте:');
console.log(`- Домен: ${site.domain}`);
console.log(`- Статус: ${site.status}`);
console.log(`- Владелец: ${site.owner_name} (${site.owner_email})`);
console.log(`- Создан: ${new Date(site.created_at).toLocaleDateString()}`);
```

---

## 📊 Интеграция с существующими эндпоинтами

### Связь с управлением пользователями

После создания сайта через новые эндпоинты, информация о сайтах автоматически появляется в:

- **GET** `/api/user/admin/users` - список всех пользователей с сайтами
- **GET** `/api/user/admin/users/{user_id}` - конкретный пользователь с сайтами

### Workflow полного цикла работы с сайтом

#### ✅ Упрощенный workflow (рекомендуется)

**Создание сайта** - один эндпоинт делает всё:
```
POST /api/user/admin/users/{user_id}/sites
→ Автоматически: создание БД + файлы + контейнер + запуск
```

**Удаление сайта** - один эндпоинт удаляет всё:
```
DELETE /api/user/admin/users/{user_id}/sites/{site_id}
→ Автоматически: остановка + удаление контейнера + файлов + БД
```

**Управление существующим сайтом**:
```
POST /api/sites/start-site   # Запустить остановленный сайт
POST /api/sites/stop-site     # Остановить сайт
POST /api/sites/restart-all   # Перезапустить все (super_admin)
```

#### 🔧 Старый workflow (для справки)

Ранее требовалась комбинация вызовов:
1. Создание записи в БД
2. Отдельный вызов деплоя
3. Управление контейнером

**Теперь это не нужно!** Новые эндпоинты делают всё автоматически.

---

## 🛡️ Безопасность

### Проверки доступа

1. **Требуется роль `super_admin`** - все эндпоинты защищены
2. **Проверка принадлежности** - при удалении проверяется, что сайт принадлежит указанному пользователю
3. **Валидация данных** - проверка user_id в URL и в теле запроса
4. **Уникальность доменов** - система не позволит создать дубликаты

### Логирование

Все операции логируются с префиксом:
- `[ADMIN_ADD_SITE]` - добавление сайта
- `[ADMIN_GET_SITES]` - получение списка сайтов
- `[ADMIN_DELETE_SITE]` - удаление сайта
- `[ADMIN_GET_SITE]` - получение информации о сайте

Пример лога:
```
🌐 [ADMIN_ADD_SITE] Admin 1 добавил сайт myshop.com пользователю 5
📋 [ADMIN_GET_SITES] Admin 1 запросил список сайтов пользователя 5 (найдено: 3)
🗑️ [ADMIN_DELETE_SITE] Admin 1 удалил сайт myshop.com (ID: 15) у пользователя 5
```

---

## ❗ Важные замечания

### Автоматический деплой

- **При создании сайта выполняется полный деплой** (30-60 секунд)
- Сайт сразу доступен после успешного создания
- Не нужны дополнительные вызовы для запуска
- В случае ошибки деплоя, запись из БД автоматически удаляется

### Автоматическое удаление

- **При удалении выполняется полная очистка** (10-30 секунд)
- Удаляется контейнер, файлы, база данных
- Операция необратима
- Если контейнер не остановился, удаление продолжается с предупреждением


### Статусы сайтов

Возможные значения `status`:
- `deploying` - сайт в процессе деплоя (временный статус)
- `running` - контейнер работает (финальный статус после успешного деплоя)
- `stopped` - контейнер остановлен
- `not_found` - контейнер не найден
- `error` - ошибка получения статуса
- `unknown` - статус неизвестен (проблемы с API)

**Примечание:** При создании сайта через админ-панель, статус автоматически меняется с `deploying` на `running` после успешного деплоя.

### Ограничения

- Домены должны быть уникальными в пределах всей системы
- Один сайт может быть привязан только к одному пользователю
- Процесс деплоя занимает 30-60 секунд (асинхронная операция)
- Во время деплоя сайт недоступен
- Удаление необратимо - все данные сайта будут потеряны

---

## 🆘 Обработка ошибок

### Общие коды ошибок

| Код | Значение | Что делать |
|-----|----------|------------|
| 400 | Bad Request | Проверить данные запроса |
| 401 | Unauthorized | Проверить токен авторизации |
| 403 | Forbidden | Проверить роль пользователя (нужен super_admin) |
| 404 | Not Found | Проверить существование пользователя/сайта |
| 500 | Internal Server Error | Обратиться к администратору |

### Примеры обработки ошибок

```javascript
async function addSiteToUser(userId, domain) {
  try {
    const response = await fetch(`/api/user/admin/users/${userId}/sites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        domain: domain
      })
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 400) {
        if (error.detail.includes('уже существует')) {
          console.error('Домен уже занят');
          // Показать пользователю, что домен занят
        } else if (error.detail.includes('API ключей')) {
          console.error('Нужно создать API ключ');
          // Предложить создать API ключ
        }
      } else if (response.status === 404) {
        console.error('Пользователь не найден');
        // Обновить список пользователей
      }
      
      throw new Error(error.detail);
    }

    const site = await response.json();
    console.log('Сайт создан:', site);
    return site;
    
  } catch (error) {
    console.error('Ошибка при создании сайта:', error.message);
    throw error;
  }
}
```

---

## 📞 Поддержка

Если у вас возникли вопросы или проблемы с API, обратитесь к разработчикам backend команды.

**Версия документации:** 1.0  
**Последнее обновление:** 10 октября 2025

