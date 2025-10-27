import { ShoppingBag } from 'lucide-react'
import PageHeader from '@/components/PageTemplate/PageHeader'

export default function OrdersHeader(props) {
  return (
    <PageHeader
      title="Заказы"
      subtitle="Управление заказами и их статусами"
      icon={ShoppingBag}
      searchPlaceholder="№ заказа или телефон клиента"
      searchLabel="Поиск заказов"
      {...props}
    />
  )
}


