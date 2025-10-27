# PageTemplate Components

## Overview
PageTemplate contains reusable components for common page layouts and patterns.

## Components

### PageLayout
Universal layout component that supports both single-column and two-column layouts.

#### Props
- `header` (React component) - Header component (optional but recommended)
- `content` (React component) - Main content component (required)
- `sidebar` (React component) - Sidebar component (optional - if provided, enables 2-column layout)
- `backgroundGradient` (string) - Background CSS classes. Default: `'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'`
- `containerClass` (string) - Container CSS classes. Default: `'p-6 space-y-6 max-w-7xl mx-auto'`
- `gridHeight` (string) - Grid height CSS class. Default: `'h-[calc(100vh-280px)]'`

#### Usage Examples

**Two-column layout (with sidebar):**
```jsx
import PageLayout from '@/components/PageTemplate/PageLayout'
import OrdersHeader from './components/OrdersHeader'
import OrdersSidebar from './components/OrdersSidebar'
import OrderList from './components/OrderList'

export default function OrdersPage() {
  return (
    <PageLayout
      header={<OrdersHeader {...props} />}
      sidebar={<OrdersSidebar {...props} />}
      content={<OrderList {...props} />}
    />
  )
}
```

**Single-column layout (without sidebar):**
```jsx
import PageLayout from '@/components/PageTemplate/PageLayout'
import UsersHeader from './components/UsersHeader'
import CustomersList from './components/CustomersList'

export default function UsersPage() {
  return (
    <PageLayout
      backgroundGradient="min-h-screen bg-white"
      containerClass="p-6 space-y-6"
      gridHeight="auto"
      header={<UsersHeader {...props} />}
      content={<CustomersList {...props} />}
    />
  )
}
```

### PageHeaderTitle
Минималистичный компонент заголовка для сохранения единства дизайна на всех страницах.
Можно использовать отдельно или встроить в PageHeader.

#### Props
- `title` (string) - Заголовок страницы (обязательно)
- `subtitle` (string) - Подзаголовок (опционально)
- `icon` (React Component) - Icon из lucide-react (опционально)
- `onRefresh` (function) - Callback кнопки обновления (опционально)

#### Примеры использования

**Отдельно (для быстрого применения на новых страницах):**
```jsx
import PageHeaderTitle from '@/components/PageTemplate/PageHeaderTitle'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-6">
      <PageHeaderTitle 
        title="Настройки"
        subtitle="Общие параметры сайта"
        icon={Settings}
        onRefresh={() => location.reload()}
      />
      {/* контент */}
    </div>
  )
}
```

**Встроена в PageHeader:**
```jsx
import PageHeader from '@/components/PageTemplate/PageHeader'

// PageHeader теперь использует PageHeaderTitle внутри для консистентности
```

### PageHeader
Header component for pages with title, subtitle, icon, and search functionality.

### Sidebar
Sidebar component for navigation and filters.

### DataList
Universal list component with pagination, loading states, and error handling.

#### Props
- `items` (array) - The items to display
- `loading` (boolean) - Loading state
- `error` (string|null) - Error message
- `onItemClick` (function) - Callback when an item is clicked
- `onPrevPage` (function) - Callback for previous page button
- `onNextPage` (function) - Callback for next page button
- `canPrev` (boolean) - Whether previous page is available
- `canNext` (boolean) - Whether next page is available
- `itemComponent` (React component) - Component to render each item
- `emptyIcon` (icon component) - Icon to show when list is empty
- `title` (string) - Header title. Default: 'Список элементов'
- `countLabel` (string) - Label for item count. Default: 'элементов'
- `emptyTitle` (string) - Title when list is empty. Default: 'Данные не найдены'
- `emptyDescription` (string) - Description when list is empty. Default: 'Попробуйте изменить параметры поиска'
- `clickHint` (string) - Hint text when list has items. Default: 'Кликните на элемент для просмотра деталей'
- `itemKeySelector` (function) - Function to get key for each item. Default: (item) => item.id || JSON.stringify(item)
- `itemPropName` (string) - Name of the prop to pass the item to the component. Default: 'item'
- `showCount` (boolean) - Show count badge. Default: true
- `showClickHint` (boolean) - Show click hint. Default: true

#### Usage Example
```jsx
import { Package } from 'lucide-react'
import DataList from '@/components/PageTemplate/DataList'
import OrderItem from './OrderItem'

export default function OrderList({ orders, onDetails, ...props }) {
  return (
    <DataList
      items={orders}
      onItemClick={onDetails}
      emptyIcon={Package}
      title="Список заказов"
      countLabel="заказов"
      emptyTitle="Заказов не найдено"
      clickHint="Кликните на заказ для просмотра деталей"
      itemComponent={OrderItem}
      itemPropName="order"  // The prop name the component expects
      itemKeySelector={(order) => order.id || order.order_id}
      {...props}
    />
  )
}
```

The DataList component will render the ItemComponent for each item, passing:
- `[itemPropName]` - The item data
- `onDetails` - The onItemClick callback
