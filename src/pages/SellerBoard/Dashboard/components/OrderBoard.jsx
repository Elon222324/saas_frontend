import { OrderColumn } from './OrderColumn'
import { getOrderStatusesInOrder } from '../constants/orderStatuses'

export function OrderBoard({ orders = [], siteName, siteToken }) {
  const statuses = getOrderStatusesInOrder()

  return (
    <div className="w-full h-full overflow-x-auto">
      <div className="grid grid-cols-3 gap-4 p-4 min-w-max">
        {statuses.map((status) => (
          <div key={status} className="w-72">
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

