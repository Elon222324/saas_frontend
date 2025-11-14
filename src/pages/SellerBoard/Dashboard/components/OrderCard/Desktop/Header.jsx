import { useTimerLogic } from '../shared/useTimerLogic'

export function DesktopHeader({ order, statusConfig }) {
  const { timeData, formattedTime } = useTimerLogic(order.pickup_time)

  return (
    <div className={`${statusConfig.bgColor} border-b-2 ${statusConfig.borderColor} p-3 flex items-start justify-between gap-3`}>
      <div className="flex flex-col gap-1 min-w-0">
        {order.pickup_time && (
          <div className={`${timeData?.isPulsing ? 'timer-pulse' : ''}`}>
            <div className="text-yellow-300 font-bold text-lg">
              {formattedTime}
            </div>
            {timeData && (
              <div className={`text-xs font-semibold ${timeData.color}`}>
                {timeData.text}
              </div>
            )}
          </div>
        )}
        <div className="text-white text-base truncate">
          {order.customer_name}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-white font-bold text-sm bg-black/20 px-2 py-1 rounded">
          #{order.order_number}
        </div>
        <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center cursor-help" title="Информация о заказе">
          <span className="text-gray-300 text-xs font-semibold">i</span>
        </div>
      </div>
    </div>
  )
}

