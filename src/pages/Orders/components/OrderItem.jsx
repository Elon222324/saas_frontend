import { Button } from '@/components/ui/button'
import { Eye, Phone, CreditCard, Calendar } from 'lucide-react'

export default function OrderItem({ order, onDetails }) {
  const orderId = order.id || order.order_id
  const orderNo = order.order_number || '—'
  const customerName = order.customer_name || order.name
  const customerPhone = order.customer_phone || order.phone
  const total = order.total_amount ?? order.total
  const status = order.status
  const paymentMethod = order.payment_method || order.paymentMethod || order.payment_type || order.paymentType
  const createdAt = order.created_at || order.createdAt || order.date

  const statusStyles = getStatusStyles(status)

  const handleCardClick = (e) => {
    onDetails(orderId)
  }

  return (
    <div 
      className="p-6 hover:bg-blue-50 transition-colors duration-200 cursor-pointer group relative"
      onClick={handleCardClick}
    >
      {/* Status indicator bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusStyles.barColor}`}></div>
      
      <div className="flex items-start justify-between gap-4 pl-4">
        {/* Order info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              № {orderNo}
            </div>
            {status && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                {statusLabel(status)}
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            {customerName && (
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">{customerName}</span>
              </div>
            )}
            
            {customerPhone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{customerPhone}</span>
              </div>
            )}
            
            {createdAt && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(createdAt)}</span>
              </div>
            )}
            
            {paymentMethod && (
              <div className="flex items-center gap-2 text-gray-600">
                <CreditCard className="h-4 w-4" />
                <span>{paymentMethodLabel(paymentMethod)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total and actions */}
        <div className="flex flex-col items-end gap-3">
          {typeof total !== 'undefined' && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Итого</div>
              <div className="text-xl font-bold text-gray-900">{formatPrice(total)}</div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-800 transition-colors" 
              onClick={(e) => {
                e.stopPropagation()
                onDetails(orderId)
              }}
            >
              <Eye size={16} /> 
              Детали
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function statusLabel(status) {
  const map = {
    new: 'Новый',
    confirmed: 'Подтвержден',
    preparing: 'Готовится',
    delivering: 'Доставка',
    completed: 'Завершен'
  }
  return map[normalize(status)] || status
}

function normalize(value) {
  if (!value) return ''
  return String(value).toLowerCase()
}

function getStatusStyles(status) {
  const s = normalize(status)
  switch (s) {
    case 'new':
      return { bg: 'bg-blue-100', text: 'text-blue-700', barColor: 'bg-blue-500' }
    case 'confirmed':
      return { bg: 'bg-indigo-100', text: 'text-indigo-700', barColor: 'bg-indigo-500' }
    case 'preparing':
      return { bg: 'bg-amber-100', text: 'text-amber-800', barColor: 'bg-amber-500' }
    case 'delivering':
      return { bg: 'bg-teal-100', text: 'text-teal-700', barColor: 'bg-teal-500' }
    case 'completed':
      return { bg: 'bg-green-100', text: 'text-green-700', barColor: 'bg-green-500' }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', barColor: 'bg-gray-400' }
  }
}

function formatPrice(value) {
  if (typeof value === 'undefined' || value === null) return '—'
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

function formatDate(dateString) {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return dateString
  }
}

function paymentMethodLabel(method) {
  const map = { 
    cash: 'Наличные', 
    card: 'Карта', 
    card_to_courier: 'Карта курьеру',
    online: 'Онлайн',
    'card-online': 'Карта онлайн',
    'cash-on-delivery': 'Наличными при получении'
  }
  const key = String(method || '').toLowerCase()
  return map[key] || String(method || '')
}


