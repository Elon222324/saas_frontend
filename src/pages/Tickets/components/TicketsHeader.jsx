import { AlertCircle } from 'lucide-react'
import PageHeader from '@/components/PageTemplate/PageHeader'

export default function TicketsHeader(props) {
  return (
    <PageHeader
      title="Обращения (Тикеты)"
      subtitle="Управление обращениями и их статусами"
      icon={AlertCircle}
      searchPlaceholder="Поиск по номеру тикета, пользователю или сообщению..."
      searchLabel="Поиск"
      {...props}
    />
  )
}
