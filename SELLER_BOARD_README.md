# 🛍️ БОРД ПРОДАВЦА - Полная документация

## 🎯 Что это такое?

Борд продавца - это минималистичный интерфейс для просмотра заказов в реальном времени. Оптимизирован для планшета, который будет лежать на прилавке магазина.

**Основная задача**: Продавец видит поступающие заказы, их время забора и может изменять статусы.

---

## 📊 Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                         ВХОД                                │
│                    /login (OAuth)                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              ВЫБОР РОЛИ (/choose-role)                      │
│                                                             │
│    ┌──────────────────┐        ┌──────────────────┐        │
│    │   📊 Админка     │        │  🛒 Борд         │        │
│    │   (MainLayout)   │        │  (SellerLayout)  │        │
│    └────────┬─────────┘        └────────┬─────────┘        │
└─────────────┼──────────────────────────┼──────────────────┘
              │                          │
              ▼                          ▼
     ┌────────────────────┐    ┌────────────────────┐
     │   /                │    │  /seller/sites     │
     │ (MainLayout)       │    │  (SellerSites)     │
     │                    │    │                    │
     │ - Сайты           │    │ - Список сайтов    │
     │ - Заказы          │    │ - Клик → выбор     │
     │ - Клиенты         │    │   сайта            │
     │ - Настройки       │    └────────┬───────────┘
     └────────────────────┘             │
                                        ▼
                            ┌──────────────────────┐
                            │  /board/:siteName    │
                            │  (SellerLayout)      │
                            │                      │
                            │  📦 БОРД ЗАКАЗОВ    │
                            │  - Новые заказы     │
                            │  - Время забора     │
                            │  - Статусы          │
                            │  - Реал-тайм        │
                            └──────────────────────┘
```

---

## 🗂️ Структура файлов

```
src/
├── pages/
│   ├── RoleSelector/
│   │   └── index.jsx              # 🔐 Выбор между Админкой и Бордом
│   │
│   ├── SellerSites/
│   │   └── index.jsx              # 🏪 Список магазинов продавца
│   │
│   └── SellerBoard/
│       ├── index.jsx              # 📊 Главная страница борда
│       ├── api/
│       │   └── boardApi.js        # (будет) API для заказов
│       ├── hooks/
│       │   └── useOrdersPolling.js # (будет) Получение заказов
│       └── components/
│           ├── OrderCard.jsx      # (будет) Карточка заказа
│           └── OrdersList.jsx     # (будет) Список заказов
│
└── layouts/
    └── SellerLayout.jsx           # 🎨 Темный layout для планшета
```

---

## 🔄 Поток данных

```
1. LOGIN
   └─→ POST /user/login
       └─→ access_token → localStorage

2. CHOOSE ROLE
   └─→ RoleSelector компонент

3. SELLER SITES
   └─→ GET /sites/get_all/
       Header: Authorization: Bearer {access_token}
       └─→ [ {domain: "t4a_app", ...}, {domain: "t5b_app", ...} ]

4. SELECT SITE
   └─→ Navigate to /board/t4a

5. SELLER BOARD
   └─→ GET https://t4a.domain.com/site-api/admin/orders/
       Header: Authorization: Bearer {siteToken}
       └─→ [ {id: 123, customer: "Ivan", pickup_time: "14:30", ...} ]
       └─→ POLLING каждые 5 сек

6. REAL-TIME UPDATES
   └─→ Новые заказы появляются автоматически
```

---

## 🎯 Компоненты и их задачи

### 1️⃣ RoleSelector (`/choose-role`)
**Задача**: Выбор между админкой и бордом

**Функционал**:
- Две кнопки: "Админка" и "Борд Продавца"
- Красивый дизайн с градиентом
- Перенаправление в нужное место

**Технология**: React, Tailwind, Lucide Icons

---

### 2️⃣ SellerSites (`/seller/sites`)
**Задача**: Список магазинов для выбора

**Функционал**:
- Загрузка сайтов из API
- Отображение в виде карточек
- Клик на карточку → `/board/:siteName`
- Кнопки "Назад" и "Админка"

**API**:
```
GET /sites/get_all/
Authorization: Bearer {access_token}
```

**Технология**: React, API, Tailwind

---

### 3️⃣ SellerLayout (`src/layouts/SellerLayout.jsx`)
**Задача**: Обертка для всех страниц борда

**Компоненты**:
- **Header**: 
  - Логотип "БОРД ЗАКАЗОВ"
  - Статус "● ONLINE"
  - Кнопки навигации
- **Content**: 
  - Место для контента (Outlet)

**Стиль**: Темная тема (темный фон, белый текст) - идеально для планшета

---

### 4️⃣ SellerBoard (`/board/:siteName`)
**Задача**: Главная страница борда с заказами

**Текущее состояние**: 🚧 Заглушка
```
Будет содержать:
- Список заказов в реальном времени
- Карточки с информацией о заказах
- Время забора каждого заказа
- Кнопки изменения статуса
```

**API**:
```
GET https://{siteName}.domain.com/site-api/admin/orders/
Authorization: Bearer {siteToken}
```

**Polling**: Каждые 5 секунд получаем новые заказы

---

## 🧪 Как тестировать

### 1. Логин
```
URL: http://localhost:5173/login
Username: admin
Password: [пароль]
Ожидание: Редирект на /choose-role
```

### 2. Выбор роли
```
URL: http://localhost:5173/choose-role
Ожидание: Две кнопки - "Админка" и "Борд Продавца"
Клик "Борд Продавца" → /seller/sites
```

### 3. Список сайтов
```
URL: http://localhost:5173/seller/sites
Ожидание: Карточки с сайтами (t4a, t5b, и т.д.)
Клик на карточку → /board/t4a
```

### 4. Борд
```
URL: http://localhost:5173/board/t4a
Ожидание: Страница с информацией о сайте t4a
(Заглушка - тут будут заказы)
```

### 5. Навигация между режимами
```
На борде кнопка "Админка" → /
На борде кнопка "Выбрать сайт" → /seller/sites
На админке кнопка "choose-role" не видна (редирект скрыт в Dashboard)
```

---

## 🔐 Авторизация

### Access Token
```javascript
// Получение при логине
const accessToken = response.data.access_token
localStorage.setItem('access_token', accessToken)

// Живет: 7 дней
// Использование: GET /sites/get_all/
```

### Site Token
```javascript
// Получение при нужде
const siteToken = useSiteTokenString('t4a')

// Живет: в React Query кеше
// Использование: GET /site-api/admin/orders/
```

### Проверка авторизации
```javascript
import { useUser } from '@/context/UserContext'

const { user, loading, logout } = useUser()

if (loading) return <LoadingScreen />
if (!user) return <RedirectToLogin />
```

---

## 📱 Оптимизация для планжета

### Дизайн решения
- ✅ Большой шрифт
- ✅ Темная тема (меньше слепит)
- ✅ Минимум навигации
- ✅ Большие кнопки
- ✅ Быстрые обновления

### Что нужно добавить
- 🔔 Звуковые уведомления о новых заказах
- ☀️ Яркие цвета для важной информации
- 📏 Адаптивный размер текста
- 🎨 Контрастные цвета для видимости на свету

---

## 🚀 Следующие шаги

### Этап 1: Интеграция заказов (⏳ в процессе)
- [ ] Создать `useOrdersPolling` хук
- [ ] Создать `OrderCard` компонент
- [ ] Создать `OrdersList` компонент
- [ ] Подключить API заказов

### Этап 2: Функциональность
- [ ] Изменение статуса заказа
- [ ] Фильтрация по статусам
- [ ] Сортировка по времени
- [ ] Поиск по номеру заказа

### Этап 3: Реал-тайм
- [ ] Notifications при новых заказах
- [ ] Звуковые алерты
- [ ] WebSocket если нужен истинный реал-тайм

### Этап 4: Логирование и контроль
- [ ] История изменений статусов
- [ ] Информация кто менял статус
- [ ] Логирование всех действий

---

## 📊 Статистика на борде

Планируемая статистика:
```
Новые заказы:      [N]
Готовятся:         [N]
К отправке:        [N]
Выполнено:         [N]
```

---

## 💾 Файлы конфигурации

### Environment Variables (`.env`)
```
VITE_API_URL=http://api.domain.com
VITE_BASE_DOMAIN=domain.com
VITE_CONTAINER_SUFFIX=_app
```

### Маршруты в `App.jsx`
```javascript
<Route path="/choose-role" element={<RoleSelector />} />
<Route path="/seller" element={<SellerLayout />}>
  <Route path="sites" element={<SellerSites />} />
</Route>
<Route path="/board/:siteName" element={<SellerLayout />}>
  <Route index element={<SellerBoard />} />
</Route>
```

---

## 🔧 Отладка

### Проверить токены в консоли
```javascript
console.log(localStorage.getItem('access_token'))
console.log(localStorage.getItem('refresh_token'))
```

### Проверить какой сайт выбран
```javascript
const { siteName } = useParams()
console.log('Current site:', siteName)
```

### Проверить API ответ
```javascript
// Откройте Network tab в dev tools
// Посмотрите запросы к /sites/get_all/
// Посмотрите запросы к /site-api/admin/orders/
```

---

## 📞 Контакты для вопросов

Если возникают проблемы:
1. Проверьте консоль браузера (F12 → Console)
2. Проверьте Network tab (какие запросы идут)
3. Проверьте есть ли access_token в localStorage
4. Убедитесь что бекенд вернул токен с TTL 7 дней

---

## 🎉 Готово!

Борд готов к интеграции с API заказов. 
Можно начинать наполнять его реальными данными.

**Happy coding! 🚀**

