import { OrderCard } from './OrderCard'
import { getStatusConfig } from '../constants/orderStatuses'

export function OrderColumn({ status, orders }) {
  const statusOrders = orders.filter(order => order.status === status)
  const config = getStatusConfig(status)

  return (
    <div className="flex flex-col bg-gray-800/30 rounded-lg border border-gray-700 overflow-hidden h-full">
      {/* Заголовок столбца */}
      <div className={`${config.headerBg} border-b p-4`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{config.icon}</span>
          <h3 className="text-white font-bold text-sm">{config.title}</h3>
        </div>
        <div className="text-gray-300 text-xs">
          {statusOrders.length} {statusOrders.length === 1 ? 'заказ' : 'заказов'}
        </div>
      </div>

      {/* Список заказов */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-96">
        {statusOrders.length === 0 ? (
          <div className="text-gray-500 text-xs text-center py-8">
            Нет заказов
          </div>
        ) : (
          statusOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  )
}

