import { getStatusConfig } from '../../../constants/orderStatuses'
import { DesktopHeader } from './Header'
import { DesktopItemsList } from './ItemsList'
import { DesktopFooter } from './Footer'
import { DesktopActionButton } from './ActionButton'

export function OrderCardDesktop({ order }) {
  const statusConfig = getStatusConfig(order.status)

  return (
    <div className={`border-2 rounded-lg overflow-hidden flex flex-col max-h-96 cursor-pointer hover:shadow-lg transition ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
      <DesktopHeader order={order} statusConfig={statusConfig} />
      <DesktopItemsList items={order.items} />
      <DesktopFooter order={order} />
      <DesktopActionButton />
    </div>
  )
}
