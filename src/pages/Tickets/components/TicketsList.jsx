import { AlertCircle } from 'lucide-react'
import TicketItem from './TicketItem'
import DataList from '@/components/PageTemplate/DataList'

export default function TicketsList({ tickets, onDetails, unreadByTicket = {}, ...props }) {
  return (
    <DataList
      items={tickets}
      onItemClick={onDetails}
      emptyIcon={AlertCircle}
      title="Список тикетов"
      countLabel="тикетов"
      emptyTitle="Тикеты не найдены"
      emptyDescription="Попробуйте изменить параметры поиска"
      clickHint="Кликните на тикет для просмотра деталей"
      itemComponent={TicketItem}
      itemPropName="ticket"
      extraItemProps={{ unreadByTicket }}
      itemKeySelector={(ticket) => ticket.id || JSON.stringify(ticket)}
      {...props}
    />
  )
}
