import { OrderColumn } from './OrderColumn'
import { getOrderStatusesInOrder } from '../constants/orderStatuses'

export function OrderBoard({ orders = [], siteName, siteToken }) {
  const statuses = getOrderStatusesInOrder()

  return (
    <div className="w-full h-full overflow-x-auto">
      {/* Адаптивная ширина столбцов:
          - iPad Mini (< 768px): w-56
          - iPad 11 (768-1023px): w-60 
          - iPad 13+ (>= 1024px): w-72 */}
      <div className="grid grid-cols-3 max-md:gap-2 md:gap-3 lg:gap-4 max-md:p-3 md:p-3 lg:p-4 min-w-max">
        {statuses.map((status) => (
          <div key={status} className="max-md:w-56 md:w-60 lg:w-72">
            <OrderColumn 
              status={status}
              orders={orders}
              siteName={siteName}
              siteToken={siteToken}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

