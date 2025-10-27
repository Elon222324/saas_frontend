# PageTemplate Components

## Overview
PageTemplate contains reusable components for common page layouts and patterns.

## Components

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
