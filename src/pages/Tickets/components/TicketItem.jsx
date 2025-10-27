import { Button } from '@/components/ui/button'
import { Eye, AlertCircle, Calendar, User } from 'lucide-react'

const statusColors = {
  new: { bg: 'bg-blue-100', text: 'text-blue-700', barColor: 'bg-blue-500' },
  in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', barColor: 'bg-yellow-500' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', barColor: 'bg-green-500' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-700', barColor: 'bg-gray-400' },
}

const priorityColors = {
  low: 'text-gray-500',
  normal: 'text-blue-500',
  high: 'text-orange-500',
  urgent: 'text-red-500',
}

const categoryLabels = {
  wrong_item: 'Неправильный товар',
  late_delivery: 'Задержка доставки',
  damaged_item: 'Поврежденный товар',
  missing_item: 'Отсутствует товар',
  other: 'Другое',
}

export default function TicketItem({ ticket, onDetails }) {
  if (!ticket) return null

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    } catch {
      return dateString
    }
  }

  const statusLabel = {
    new: 'Новый',
    in_progress: 'В работе',
    resolved: 'Решен',
    closed: 'Закрыт',
  }[ticket.status] || ticket.status

  const statusStyle = statusColors[ticket.status] || statusColors.closed
  const priorityLabel = {
    low: 'Низкий',
    normal: 'Обычный',
    high: 'Высокий',
    urgent: 'Срочный',
  }[ticket.priority] || ticket.priority

  const handleCardClick = () => {
    onDetails(ticket.id)
  }

  return (
    <div 
      className="p-6 hover:bg-blue-50 transition-colors duration-200 cursor-pointer group relative"
      onClick={handleCardClick}
    >
      {/* Status indicator bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusStyle.barColor}`}></div>
      
      <div className="flex items-start justify-between gap-4 pl-4">
        {/* Ticket info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              Тикет #{ticket.id.slice(0, 8).toUpperCase()}
            </div>
            {ticket.status && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                {statusLabel}
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            {ticket.user_name && (
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4" />
                <span className="font-medium">{ticket.user_name}</span>
              </div>
            )}
            
            {(ticket.message || ticket.subject) && (
              <div className="text-gray-700 line-clamp-2">
                <span className="font-medium">Тема:</span> {ticket.subject || ticket.message}
              </div>
            )}
            
            {ticket.category && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Категория:</span> {categoryLabels[ticket.category] || ticket.category}
              </div>
            )}
            
            {ticket.created_at && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(ticket.created_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Priority and actions */}
        <div className="flex flex-col items-end gap-3">
          {ticket.priority && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Приоритет</div>
              <div className={`font-semibold ${priorityColors[ticket.priority] || 'text-gray-600'}`}>
                {priorityLabel}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-800 transition-colors" 
              onClick={(e) => {
                e.stopPropagation()
                onDetails(ticket.id)
              }}
            >
              <Eye size={16} /> 
              Детали
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
