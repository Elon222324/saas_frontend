import { DollarSign } from 'lucide-react'
import { formatPrice } from '../utils.js'
import { Row } from './Row.jsx'

export function OrderTotal({ order }) {
  const subtotal = order.subtotal_amount ?? order.subtotal
  const discount = order.discount_amount ?? order.discount
  const deliveryCost = order.delivery_fee_amount ?? order.delivery_cost ?? order.delivery_price
  const total = order.total_amount ?? order.total

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <DollarSign className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="font-semibold text-lg text-gray-900">Итоговая сумма</h3>
      </div>
      <div className="space-y-4">
        {typeof subtotal !== 'undefined' && (
          <Row label="Сумма товаров" value={formatPrice(subtotal)} />
        )}
        {typeof discount !== 'undefined' && discount ? (
          <Row label="Скидка" value={formatPrice(discount)} className="text-green-600 font-medium" />
        ) : null}
        {typeof deliveryCost !== 'undefined' && (
          <Row label="Доставка" value={formatPrice(deliveryCost)} />
        )}
        {typeof total !== 'undefined' && (
          <div className="flex justify-between pt-4 border-t border-blue-200">
            <span className="text-lg font-semibold text-gray-900">К оплате</span>
            <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
          </div>
        )}
      </div>
    </section>
  )
}
