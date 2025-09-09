import { User, Phone, MapPin, Calendar } from 'lucide-react'
import { formatDate, formatAddress } from '../utils.js'

export function CustomerInfo({ order, details }) {
  const customerName = order.customer_name || order.name || order.customer?.name || details.customer?.name || 'Не указано'
  const customerPhone = order.customer_phone || order.phone || order.customer?.phone || details.customer?.phone || 'Не указано'
  const customerAddress = order.address_text || order.customer_address || order.address || formatAddress(order)
  const createdAt = order.created_at || order.createdAt || order.date

  return (
    <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-50 rounded-lg">
          <User className="h-5 w-5 text-gray-600" />
        </div>
        <h3 className="font-semibold text-lg text-gray-900">Информация о клиенте</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <User className="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Имя</div>
            <div className="font-medium text-gray-900">{customerName}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Phone className="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Телефон</div>
            <div className="font-medium text-gray-900">{customerPhone}</div>
          </div>
        </div>
        {customerAddress && (
          <div className="flex items-start gap-3 md:col-span-2">
            <div className="p-2 bg-gray-50 rounded-lg mt-1">
              <MapPin className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Адрес доставки</div>
              <div className="font-medium text-gray-900">{customerAddress}</div>
            </div>
          </div>
        )}
        {createdAt && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Дата заказа</div>
              <div className="font-medium text-gray-900">{formatDate(createdAt)}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
