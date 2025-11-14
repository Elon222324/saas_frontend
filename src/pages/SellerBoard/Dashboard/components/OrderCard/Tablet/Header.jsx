import { useState } from 'react'
import { useTimerLogic } from '../shared/useTimerLogic'
import { formatCustomerName } from '../utils/formatCustomerName'
import { OrderMenuDropdown } from './OrderMenuDropdown'
import { CancelOrderModal } from './CancelOrderModal'

export function TabletHeader({ order, statusConfig, siteName, siteToken, onOrderStatusChanged }) {
  const { timeData, formattedTime } = useTimerLogic(order.pickup_time)
  const [showCancelModal, setShowCancelModal] = useState(false)
  
  console.log('📦 TabletHeader order:', { 
    order_number: order.order_number,
    customer_name: order.customer_name,
    customer_name_type: typeof order.customer_name,
    formatted: formatCustomerName(order.customer_name)
  })

  return (
    <div className={`${statusConfig.bgColor} border-b-2 ${statusConfig.borderColor} p-2 flex items-stretch justify-between gap-2`}>
      {/* СЛЕВА: Время */}
      <div>
        {order.pickup_time && (
          <div className={`${timeData?.isPulsing ? 'timer-pulse' : ''}`}>
            <div className="text-yellow-300 font-bold text-base">
              {formattedTime}
            </div>
            {timeData && (
              <div className={`text-xs font-semibold ${timeData.color}`}>
                {/* На портретном экране показываем shortText, если есть */}
                <span className="md:hidden">
                  {timeData.shortText || timeData.text}
                </span>
                {/* На горизонтальном показываем полный текст */}
                <span className="hidden md:inline">
                  {timeData.text}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* СПРАВА: Имя + Номер + иконка + меню (все зафиксировано справа) */}
      <div className="flex flex-col gap-1 items-end flex-shrink-0">
        {/* Имя клиента (с ellipsis если длинное) */}
        {formatCustomerName(order.customer_name) && (
          <div className="text-white text-sm max-w-40 truncate text-right">
            {formatCustomerName(order.customer_name)}
          </div>
        )}
        
        {/* Номер заказа, иконка, меню в один ряд */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="text-white font-bold text-sm bg-black/20 px-1.5 py-0.5 rounded">
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

