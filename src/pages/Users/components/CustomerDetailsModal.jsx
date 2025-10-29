import ModalTemplate from '@/components/ModalTemplate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Phone, Mail, Calendar, Eye } from 'lucide-react'
import { getCustomerName, formatDate, formatPrice } from '../utils/formatting'

function CustomerOrderRow({ order, onOpenDetails }) {
  const orderId = order?.id ?? order?.order_id
  const orderNo = order?.order_number || '—'
  const total = order?.total_amount ?? order?.total
  const status = order?.status
  const createdAt = order?.created_at || order?.createdAt || order?.date

  return (
    <div className="p-5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="font-semibold text-gray-900">Заказ № {orderNo}</div>
            {status && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                {String(status)}
              </span>
            )}
          </div>
          {createdAt && (
            <div className="text-sm text-gray-600">{formatDate(createdAt)}</div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            {typeof total !== 'undefined' && (
              <div className="text-sm text-gray-500 mb-1">
                Итого: <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
              </div>
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

  const customerName = profile ? getCustomerName(profile) : 'Клиент'
  const customerId = profile?.id ?? selectedCustomerId

  return (
    <ModalTemplate
      title={customerName}
      subtitle="Профиль клиента"
      icon={User}
      iconBgColor="bg-blue-50"
      iconColor="text-blue-600"
      onClose={onClose}
      maxWidth="max-w-5xl"
    >
      <div className="p-8 space-y-6">
        {detailsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Загрузка...</div>
          </div>
        ) : (
          <>
            <div>
              <div className="text-sm text-gray-500 mb-3 font-medium">Профиль</div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                {profile ? (
                  <div className="space-y-3">
                    <div className="text-lg font-semibold text-gray-900">{getCustomerName(profile)}</div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-700">
                      {(profile?.phone || profile?.phone_number || profile?.mobile || profile?.customer_phone) && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{profile?.phone || profile?.phone_number || profile?.mobile || profile?.customer_phone}</span>
                        </div>
                      )}
                      {(profile?.email || profile?.mail || profile?.customer_email) && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{profile?.email || profile?.mail || profile?.customer_email}</span>
                        </div>
                      )}
                      {(profile?.created_at || profile?.createdAt || profile?.created) && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(profile?.created_at || profile?.createdAt || profile?.created)}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">ID: {String(customerId)}</div>
                  </div>
                ) : (
                  <div className="text-gray-500">Нет данных профиля</div>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-3 font-medium">Заказы клиента</div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Заказы не найдены</div>
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
                <div className="p-4 flex items-center justify-between bg-gray-50 border-t border-gray-200">
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
          </>
        )}
      </div>
    </ModalTemplate>
  )
}


