import { getStatusConfig } from '../../../constants/orderStatuses'

export function OrderCardTablet({ order }) {
  const statusConfig = getStatusConfig(order.status)

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`border-2 rounded-lg p-2 cursor-pointer hover:shadow-lg transition ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
      {order.pickup_time && (
        <div className="text-yellow-300 font-bold text-2xl mb-2">
          {formatTime(order.pickup_time)}
        </div>
      )}
      <div className="text-white font-bold text-xs mb-0.5">
        #{order.order_number}
      </div>
      <div className="text-gray-300 text-xs mb-0.5 truncate">
        {order.customer_name}
      </div>
      <div className="text-gray-400 text-xs mb-1">
        {order.total_amount} {order.currency}
      </div>
      {order.delivery_type === 'pickup' && (
        <div className="text-xs text-cyan-300 mb-0.5">
          🏪 Самовывоз
        </div>
      )}
      {order.payment_status === 'pending' && (
        <div className="text-xs text-yellow-300">
          ⏳ Оплата
        </div>
      )}
    </div>
  )
}

