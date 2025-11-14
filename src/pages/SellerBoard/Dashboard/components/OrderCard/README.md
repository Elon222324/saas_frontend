# OrderCard Component

Модульная архитектура карточки заказа для Seller Board Dashboard.

## Структура

```
OrderCard/
├── index.jsx                    # Главный компонент - выбирает версию по размеру экрана
├── shared/                      # Общая логика для всех версий
│   ├── useTimerLogic.js        # Логика таймера (цвет, пульсация)
│   └── usePaymentStatus.js     # Логика статуса оплаты
├── Desktop/                     # Полная версия для больших экранов (≥1024px)
│   ├── index.jsx               # Главный компонент Desktop
│   ├── Header.jsx              # Хедер с таймером, номером, инфо
│   ├── CustomerName.jsx        # Имя клиента
│   ├── ItemsList.jsx           # Список товаров (полный, со всеми деталями)
│   ├── Footer.jsx              # Статус оплаты + итоговая сумма
│   └── ActionButton.jsx        # Большая кнопка "ВЗЯТЬ В РАБОТУ"
├── Tablet/                      # Компактная версия для планшетов (768px-1024px)
│   ├── index.jsx               # Главный компонент Tablet
│   ├── Header.jsx              # Компактный хедер
│   ├── CustomerName.jsx        # Имя клиента с обрезкой
│   ├── ItemsList.jsx           # Список товаров (первые 3 + счётчик)
│   ├── Footer.jsx              # Компактный футер
│   └── ActionButton.jsx        # Компактная кнопка
└── Mobile/                      # Минимальная версия для телефонов (<768px)
    ├── index.jsx               # Главный компонент Mobile
    ├── Header.jsx              # Минимальный хедер
    ├── CustomerName.jsx        # Имя клиента с обрезкой
    ├── ItemsList.jsx           # Список товаров (первые 2 + счётчик)
    ├── Footer.jsx              # Минимальный футер
    └── ActionButton.jsx        # Компактная кнопка
```

## Использование

```jsx
import { OrderCard } from './OrderCard'

export function Example() {
  const order = {
    id: 'uuid',
    order_number: 11,
    status: 'new',
    customer_name: 'Карамов',
    total_amount: 679,
    currency: '₽',
    payment_status: 'paid',
    pickup_time: '2025-01-20T14:45:00Z',
    items: [
      {
        quantity: 1,
        product_title: 'Матча Латте (Кокос)',
        item_comment: 'На кокосовом молоке',
        extras: [
          { extra_name: 'Дополнительный шот' }
        ]
      }
    ]
  }

  return <OrderCard order={order} />
}
```

## Таймер

- **Зелёный** (> 10 мин): без пульсации
- **Оранжевый** (2-10 мин): без пульсации
- **Красный** (< 2 мин): с пульсацией
- **Красный ПРОСРОЧЕНО**: с пульсацией

