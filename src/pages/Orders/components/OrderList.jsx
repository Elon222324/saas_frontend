import { Package } from 'lucide-react'
import OrderItem from './OrderItem'
import DataList from '@/components/PageTemplate/DataList'

export default function OrderList({ orders, onDetails, ...props }) {
  return (
    <DataList
      items={orders}
      onItemClick={onDetails}
      emptyIcon={Package}
      title="Список заказов"
      countLabel="заказов"
      emptyTitle="Заказов не найдено"
      emptyDescription="Попробуйте изменить параметры поиска"
      clickHint="Кликните на заказ для просмотра деталей"
      itemComponent={OrderItem}
      itemPropName="order"
      itemKeySelector={(order) => order.id || order.order_id || JSON.stringify(order)}
      {...props}
    />
  )
}


