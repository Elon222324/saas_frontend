# Поток работы Борда Продавца

## 🎯 Архитектура

```
/login
  ↓
  (auth header)
  ↓
/choose-role (RoleSelector)
  ├─→ "Админка" → / (MainLayout - текущая админка)
  └─→ "Борд Продавца" → /seller/sites (SellerSites)
                          ↓
                        (выбор сайта)
                          ↓
                        /board/:siteName (SellerBoard)
                          ↓
                        Борд с заказами
```

## 📁 Новые файлы

```
src/
├── pages/
│   ├── RoleSelector/
│   │   └── index.jsx              # Выбор между Админкой и Бордом
│   ├── SellerSites/
│   │   └── index.jsx              # Список сайтов продавца
│   └── SellerBoard/
│       └── index.jsx              # Главная страница борда (заглушка)
└── layouts/
    └── SellerLayout.jsx           # Layout для борда (темный UI)
```

## 🔄 Изменения в существующих файлах

### `src/App.jsx`
- Добавлены импорты новых компонентов
- Добавлены маршруты:
  - `GET /choose-role` → RoleSelector
  - `GET /seller/sites` → SellerSites  
  - `GET /board/:siteName` → SellerBoard

### `src/pages/Dashboard/index.jsx`
- Изменена логика: теперь редирект на `/choose-role`
- Это точка входа после успешного логина

## 🧪 Как тестировать

1. **Логин:**
   ```
   http://localhost:5173/login
   ```

2. **Выбор роли:**
   ```
   http://localhost:5173/choose-role
   (должно открыться автоматически после логина)
   ```

3. **Список сайтов продавца:**
   ```
   http://localhost:5173/seller/sites
   (кнопка "Борд Продавца" на RoleSelector)
   ```

4. **Борд конкретного сайта:**
   ```
   http://localhost:5173/board/t4a
   http://localhost:5173/board/t5b
   (клик на сайт в SellerSites)
   ```

5. **Админка (старая):**
   ```
   http://localhost:5173/
   (кнопка "Админка" на RoleSelector или /seller/sites)
   ```

## 🎨 Дизайн

- **RoleSelector**: Светлый градиент фон, две карточки с иконками
- **SellerSites**: Список сайтов в виде карточек
- **SellerLayout**: Темный UI (темное меню, белый текст) - идеально для планшета в магазине
- **SellerBoard**: Заглушка с информацией о сайте

## 📊 Токены и авторизация

Все компоненты используют:
- `localStorage.getItem('access_token')` - глобальный токен пользователя
- `useSiteTokenString(siteName)` - токены для конкретного сайта (когда будем загружать заказы)
- UserContext для проверки авторизации

## 🚀 Что дальше

1. **SellerBoard/useOrdersPolling.js** - хук для получения заказов
2. **SellerBoard/components/OrderCard.jsx** - карточка заказа
3. **SellerBoard/components/OrdersList.jsx** - список заказов
4. Интеграция с API заказов
5. Реал-тайм обновления (polling каждые N секунд)

## 📝 Заметки

- На MVP один пользователь = один сайт
- Токен на 7 дней (обновлено на бекенде)
- Админ может открыть борд любого сайта (для контроля)
- Борд будет работать на нескольких устройствах одновременно

