import { useState } from 'react'
import { useTimerLogic } from '../shared/useTimerLogic'
import { OrderMenuDropdown } from './OrderMenuDropdown'
import { CancelOrderModal } from './CancelOrderModal'

export function TabletHeader({ order, statusConfig, siteName, siteToken, onOrderStatusChanged }) {
  const { timeData, formattedTime } = useTimerLogic(order.pickup_time)
  const [showCancelModal, setShowCancelModal] = useState(false)

  return (
    <div className={`${statusConfig.bgColor} border-b-2 ${statusConfig.borderColor} p-2 flex items-start justify-between gap-2`}>
      <div>
        {order.pickup_time && (
          <div className={`${timeData?.isPulsing ? 'timer-pulse' : ''}`}>
            <div className="text-yellow-300 font-bold text-base">
              {formattedTime}
            </div>
            {timeData && (
              <div className={`text-xs font-semibold ${timeData.color}`}>
                {timeData.text}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <div className="text-white font-bold text-xs bg-black/20 px-1.5 py-0.5 rounded">
            #{order.order_number}
          </div>
          <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center cursor-help flex-shrink-0" title="Информация о заказе">
            <span className="text-gray-300 text-xs font-semibold leading-none">i</span>
          </div>
          <OrderMenuDropdown 
            order={order}
            onCancelClick={() => setShowCancelModal(true)}
          />
        </div>
        <div className="text-white text-sm truncate">
          {order.customer_name}
        </div>
      </div>

      {showCancelModal && (
        <CancelOrderModal
          order={order}
          siteName={siteName}
          siteToken={siteToken}
          onClose={() => setShowCancelModal(false)}
          onCanceled={() => {
            setShowCancelModal(false)
            onOrderStatusChanged?.(order.id)
          }}
        />
      )}
    </div>
  )
}

