import { getStatusConfig } from '../../../constants/orderStatuses'

export function OrderCardMobile({ order }) {
  const statusConfig = getStatusConfig(order.status)

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`border rounded p-2 cursor-pointer hover:shadow-md transition ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
      {order.pickup_time && (
        <div className="text-yellow-300 font-bold text-xl mb-2">
          {formatTime(order.pickup_time)}
        </div>
      )}
      <div className="flex justify-between items-start mb-1">
        <div className="text-white font-bold text-xs">
          #{order.order_number}
        </div>
        {order.payment_status === 'pending' && (
          <div className="text-xs text-yellow-300">
            ⏳
          </div>
        )}
      </div>
      <div className="text-gray-300 text-xs mb-0.5 truncate">
        {order.customer_name}
      </div>
      <div className="text-gray-400 text-xs mb-0.5">
        {order.total_amount} {order.currency}
      </div>
      <div className="flex gap-1 text-xs">
        {order.delivery_type === 'pickup' && (
          <span className="text-cyan-300">🏪</span>
        )}
      </div>
    </div>
  )
}

