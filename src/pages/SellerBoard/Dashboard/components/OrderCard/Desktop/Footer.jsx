export function DesktopFooter({ order }) {
  const getPaymentMethodDisplay = () => {
    const method = String(order.payment_method || '').toLowerCase()
    const methodMap = {
      'cash': { text: 'НАЛИЧНЫЕ', color: 'bg-orange-600' },
      'card': { text: 'КАРТА', color: 'bg-green-600' },
      'online': { text: 'ОНЛАЙН', color: 'bg-orange-600' },
    }
    return methodMap[method] || { text: method.toUpperCase(), color: 'bg-gray-600' }
  }

  const paymentMethod = getPaymentMethodDisplay()

  return (
    <div className="px-3 py-2 border-t border-black/20 flex items-center justify-between">
      <button className={`${paymentMethod.color} hover:brightness-110 text-white font-bold text-xs px-2 py-1 rounded transition`}>
        {paymentMethod.text}
      </button>
      <div className="text-gray-300 font-bold text-sm">
        Итого: <span className="text-white">{order.total_amount}</span> {order.currency}
      </div>
    </div>
  )
}

