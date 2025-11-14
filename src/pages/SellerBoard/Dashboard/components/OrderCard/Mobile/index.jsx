import { getStatusConfig } from '../../../constants/orderStatuses'
import { MobileHeader } from './Header'
import { MobileItemsList } from './ItemsList'
import { MobileFooter } from './Footer'
import { MobileActionButton } from './ActionButton'

export function OrderCardMobile({ order }) {
  const statusConfig = getStatusConfig(order.status)

  return (
    <div className={`border rounded-lg overflow-hidden flex flex-col max-h-72 cursor-pointer hover:shadow-md transition ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
      <MobileHeader order={order} statusConfig={statusConfig} />
      <MobileItemsList items={order.items} />
      <MobileFooter order={order} />
      <MobileActionButton />
    </div>
  )
}
