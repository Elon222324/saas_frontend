import { AlertCircle, UserCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
}

const statusLabels = {
  new: 'Новый',
  in_progress: 'В работе',
  resolved: 'Решен',
  closed: 'Закрыт',
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  normal: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}

const priorityLabels = {
  low: 'Низкий',
  normal: 'Обычный',
  high: 'Высокий',
  urgent: 'Срочный',
}

const categoryLabels = {
  wrong_item: 'Неправильный товар',
  late_delivery: 'Задержка доставки',
  damaged_item: 'Поврежденный товар',
  missing_item: 'Отсутствует товар',
  other: 'Другое',
}

// Helper function to safely format date
const formatDate = (dateString) => {
  if (!dateString) return 'Не указано'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Не указано'
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (e) {
    console.warn('⚠️ [TicketInfo] Invalid date:', dateString)
    return 'Не указано'
  }
}

export default function TicketInfo({ ticket }) {
  if (!ticket) {
    console.warn('⚠️ [TicketInfo] Ticket is null or undefined')
    return null
  }

  console.log('🎨 [TicketInfo] Rendering ticket:', {
    id: ticket.id,
    status: ticket.status,
    priority: ticket.priority,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
    user_name: ticket.user_name,
    category: ticket.category,
  })

  return (
    <div className="space-y-4">
      {/* Status and Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Статус</p>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[ticket.status] || 'bg-gray-100'}`}>
            {statusLabels[ticket.status] || ticket.status}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Приоритет</p>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[ticket.priority] || 'bg-gray-100'}`}>
            {priorityLabels[ticket.priority] || ticket.priority}
          </span>
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Категория</p>
        <p className="text-sm text-gray-800">{categoryLabels[ticket.category] || ticket.category}</p>
      </div>

      {/* User Info */}
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Пользователь</p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-800">{ticket.user_name || 'Не указано'}</p>
          {ticket.order_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Получаем customer_id через глобальную функцию,
                // потому что user_id из ticket это не customer_id
                if (window.__getCustomerIdAndOpen) {
                  window.__getCustomerIdAndOpen(ticket)
                }
              }}
              className="flex items-center gap-1 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-800 transition-colors"
              title="Открыть профиль пользователя"
            >
              <UserCircle size={14} />
              <span className="text-xs">Профиль</span>
            </Button>
          )}
        </div>
        {ticket.user_id && (
          <p className="text-xs text-gray-500 mt-1">{ticket.user_id}</p>
        )}
      </div>

      {/* Order ID */}
      {ticket.order_id && (
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Заказ</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-800 font-mono">{ticket.order_id.slice(0, 8)}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (window.__openOrderDetails) {
                  window.__openOrderDetails(ticket.order_id)
                }
              }}
              className="flex items-center gap-1 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-800 transition-colors"
              title="Открыть детали заказа"
            >
              <FileText size={14} />
              <span className="text-xs">Детали</span>
            </Button>
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Создано</p>
          <p className="text-sm text-gray-800">
            {formatDate(ticket.created_at)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Обновлено</p>
          <p className="text-sm text-gray-800">
            {formatDate(ticket.updated_at)}
          </p>
        </div>
      </div>

      {/* Resolution Notes */}
      {ticket.resolution_notes && (
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <p className="text-xs text-green-700 uppercase font-semibold mb-1">Заметки разрешения</p>
          <p className="text-sm text-green-900">{ticket.resolution_notes}</p>
        </div>
      )}
    </div>
  )
}
