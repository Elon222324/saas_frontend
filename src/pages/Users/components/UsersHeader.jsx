import { Users as UsersIcon } from 'lucide-react'
import PageHeader from '@/components/PageTemplate/PageHeader'

export default function UsersHeader(props) {
  return (
    <PageHeader
      title="Клиенты"
      subtitle="Поиск клиентов, просмотр профиля и заказов"
      icon={UsersIcon}
      searchPlaceholder="Имя, телефон или email"
      searchLabel="Поиск клиентов"
      {...props}
    />
  )
}
