import { useTimerLogic } from '../shared/useTimerLogic'

export function MobileHeader({ order, statusConfig }) {
  const { timeData, formattedTime } = useTimerLogic(order.pickup_time)

  return (
    <div className={`${statusConfig.bgColor} border-b ${statusConfig.borderColor} p-1.5 flex items-start justify-between gap-1`}>
      <div className="flex flex-col gap-0.5 min-w-0">
        {order.pickup_time && (
          <div className={`${timeData?.isPulsing ? 'timer-pulse' : ''}`}>
            <div className="text-yellow-300 font-bold text-sm">
              {formattedTime}
            </div>
            {timeData && (
              <div className={`text-xs font-semibold ${timeData.color}`}>
                {timeData.text}
              </div>
            )}
          </div>
        )}
        <div className="text-white text-xs truncate">
          {order.customer_name}
        </div>
      </div>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <div className="text-white font-bold text-xs bg-black/20 px-1 py-0.5 rounded">
          #{order.order_number}
        </div>
        <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center cursor-help flex-shrink-0" title="Информация о заказе">
          <span className="text-gray-300 text-xs font-semibold leading-none">i</span>
        </div>
      </div>
    </div>
  )
}

