# OrderCard - Архитектура и Структура

## 📦 Модульная архитектура

```
OrderCard/
│
├── index.jsx                          ⭐ Главный компонент (выбор версии)
├── shared/                            🔄 ОБЩАЯ ЛОГИКА
│   ├── useTimerLogic.js              ⏱️  Логика таймера (цвет, пульс)
│   └── usePaymentStatus.js           💳 Статус оплаты
│
├── Desktop/                           🖥️  ПОЛНАЯ ВЕРСИЯ (1024px+)
│   ├── index.jsx                      ⭐ Главный компонент Desktop
│   ├── Header.jsx                     📌 Хедер с таймером
│   ├── CustomerName.jsx               👤 Имя клиента (крупно)
│   ├── ItemsList.jsx                  📦 Товары (все деньги)
│   ├── Footer.jsx                     💰 Статус + сумма
│   └── ActionButton.jsx               🔘 Кнопка (большая)
│
├── Tablet/                            📱 КОМПАКТНАЯ ВЕРСИЯ (768-1023px)
│   ├── index.jsx                      ⭐ Главный компонент Tablet
│   ├── Header.jsx                     📌 Компактный хедер
│   ├── CustomerName.jsx               👤 Имя с truncate
│   ├── ItemsList.jsx                  📦 Товары (3 шт.)
│   ├── Footer.jsx                     💰 Компактный футер
│   └── ActionButton.jsx               🔘 Кнопка (средняя)
│
└── Mobile/                            📲 МИНИМАЛЬНАЯ ВЕРСИЯ (<768px)
    ├── index.jsx                      ⭐ Главный компонент Mobile
    ├── Header.jsx                     📌 Минимальный хедер
    ├── CustomerName.jsx               👤 Имя с truncate
    ├── ItemsList.jsx                  📦 Товары (2 шт.)
    ├── Footer.jsx                     💰 Минимальный футер
    └── ActionButton.jsx               🔘 Кнопка ("✓ ВЗЯТЬ")
```

## 🛠️ Компоненты

### Shared (Общие)

#### `useTimerLogic.js`
- **Вход**: `pickupTime`
- **Выход**: `{ timeData, formattedTime }`
- Используется во всех версиях

#### `usePaymentStatus.js`
- **Вход**: `paymentStatus`
- **Выход**: `{ icon, text, color }`
- Используется во всех версиях

### Версии

| Параметр | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| `max-h-*` | `max-h-96` | `max-h-80` | `max-h-72` |
| Хедер | `text-lg` | `text-base` | `text-sm` |
| Товары | Все | 3 шт. | 2 шт. |
| Кнопка | `py-3` | `py-2` | `py-1.5` |

