import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Phone, Mail, Calendar, X, Eye } from 'lucide-react'
import { getCustomerName, formatDate, formatPrice } from '../utils/formatting'

function CustomerOrderRow({ order, onOpenDetails }) {
  const orderId = order?.id ?? order?.order_id
  const orderNo = order?.order_number || '—'
  const total = order?.total_amount ?? order?.total
  const status = order?.status
  const createdAt = order?.created_at || order?.createdAt || order?.date

  return (
    <div className="p-4 hover:bg-blue-50/40 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="font-semibold text-gray-900">Заказ № {orderNo}</div>
            {status && (<span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{String(status)}</span>)}
          </div>
          {createdAt && (
            <div className="text-sm text-gray-600">{formatDate(createdAt)}</div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            {typeof total !== 'undefined' && (
              <div className="text-sm text-gray-500">Итого: <span className="font-semibold text-gray-900">{formatPrice(total)}</span></div>
            )}
            {orderId && (
              <div className="text-xs text-gray-400">ID: {String(orderId)}</div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-800 transition-colors"
            onClick={() => onOpenDetails(orderId)}
          >
            <Eye size={14} /> Детали
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CustomerDetailsModal({
  isOpen,
  onClose,
  profile,
  orders,
  detailsLoading,
  ordersLimit,
  setOrdersLimit,
  ordersOffset,
  onPrevOrders,
  onNextOrders,
  selectedCustomerId,
  onOpenOrderDetails,
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-[95vw] max-w-5xl max-h-[85vh] overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="font-semibold text-lg">Профиль клиента</div>
          <button className="p-1 rounded hover:bg-gray-100" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {detailsLoading ? (
            <div>Загрузка...</div>
          ) : (
            <div className="space-y-8">
              <div>
                <div className="text-sm text-gray-500 mb-2">Профиль</div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  {profile ? (
                    <div className="space-y-2">
                      <div className="text-lg font-semibold">{getCustomerName(profile)}</div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-700">
                        {profile?.phone && (
                          <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{profile.phone}</span></div>
                        )}
                        {profile?.email && (
                          <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{profile.email}</span></div>
                        )}
                        {profile?.created_at && (
                          <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{formatDate(profile.created_at)}</span></div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">ID: {String(profile?.id ?? selectedCustomerId)}</div>
                    </div>
                  ) : (
                    <div className="text-gray-500">Нет данных профиля</div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2">Заказы клиента</div>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  {orders.length === 0 ? (
                    <div className="p-4 text-gray-500">Заказы не найдены</div>
                  ) : (
                    <div className="divide-y">
                      {orders.map((o) => (
                        <CustomerOrderRow 
                          key={String(o?.id || o?.order_id || Math.random())} 
                          order={o}
                          onOpenDetails={onOpenOrderDetails}
                        />
                      ))}
                    </div>
                  )}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Лимит</span>
                      <Input type="number" min={1} max={1000} value={ordersLimit} onChange={(e) => setOrdersLimit(Number(e.target.value) || 20)} className="w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={onPrevOrders} disabled={ordersOffset === 0}>Назад</Button>
                      <div className="text-sm text-gray-500">Смещение: {ordersOffset}</div>
                      <Button variant="outline" onClick={onNextOrders}>Далее</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


