import { getStatusConfig } from '../../../constants/orderStatuses'
import { TabletHeader } from './Header'
import { TabletItemsList } from './ItemsList'
import { TabletFooter } from './Footer'
import { TabletActionButton } from './ActionButton'

export function OrderCardTablet({ order, siteName, siteToken, onOrderStatusChanged }) {
  const statusConfig = getStatusConfig(order.status)

  return (
    <div className={`border-2 rounded-lg overflow-hidden flex flex-col max-h-80 cursor-pointer hover:shadow-lg transition ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
      <TabletHeader order={order} statusConfig={statusConfig} siteName={siteName} siteToken={siteToken} onOrderStatusChanged={onOrderStatusChanged} />
      <TabletItemsList items={order.items} />
      <TabletFooter order={order} />
      <TabletActionButton order={order} siteName={siteName} siteToken={siteToken} onOrderStatusChanged={onOrderStatusChanged} />
    </div>
  )
}
