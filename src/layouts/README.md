# 📄 layouts/

Layout-компоненты — это обёртки, которые содержат структуру страницы, но не сами данные.

## 🔹 MainLayout.jsx

### Назначение
Главный layout для авторизованной части админки.  
Используется для всех внутренних маршрутов после логина.

### Структура
- Верхний `header` с логотипом, навигацией и кнопкой выхода
- Основной контент рендерится через `<Outlet />`
- Используется в `App.jsx` как обёртка для:
  - `/`
  - `/sites`
  - `/users`
  - `/settings/:domain/...`

### Навигация
Использует `react-router-dom` и `lucide-react` для иконок:
- Dashboard → `/`
- Sites → `/sites`
- Users → `/users`

### Как подключено

```jsx
<Route path="/" element={<MainLayout />}>
  <Route index element={<Dashboard />} />
  ...
</Route>