export function statusColor(status) {
  const s = String(status || '').toLowerCase()
  switch (s) {
    case 'new':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'confirmed':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'preparing':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'delivering':
      return 'bg-teal-50 text-teal-700 border-teal-200'
    case 'completed':
      return 'bg-green-50 text-green-700 border-green-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

export function statusLabel(status) {
  const map = { 
    new: 'Новый',
    confirmed: 'Подтвержден',
    preparing: 'Готовится',
    delivering: 'Доставка',
    completed: 'Завершен'
  }
  const key = String(status || '').toLowerCase()
  return map[key] || String(status || '')
}

export function paymentMethodLabel(method) {
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

export function paymentStatusLabel(st) {
  const map = { pending: 'Ожидает', paid: 'Оплачен', failed: 'Ошибка', refunded: 'Возврат' }
  const key = String(st || '').toLowerCase()
  return map[key] || String(st || '')
}

export function paymentStatusColor(status) {
  const s = String(status || '').toLowerCase()
  switch (s) {
    case 'paid':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'failed':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'refunded':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

export function formatEvent(ev) {
  try {
    if (!ev) return ''
    if (typeof ev === 'string') return ev
    const timestamp = ev.created_at || ev.timestamp || ev.time
    const when = timestamp ? `[${formatDate(timestamp)}] ` : ''
    const actor = ev.actor ? ` — ${ev.actor}` : ''
    const eventType = ev.event_type || ev.type || ev.event || 'event'
    const dataRaw = ev.data
    let data = dataRaw
    if (typeof dataRaw === 'string') {
      try { data = JSON.parse(dataRaw) } catch { /* ignore */ }
    }

    switch (eventType) {
      case 'status_changed': {
        const from = data?.from ? statusLabel(data.from) : '—'
        const to = data?.to ? statusLabel(data.to) : '—'
        return `${when}Статус изменён: ${from} → ${to}${actor}`
      }
      case 'payment_status_changed': {
        const from = data?.from ? paymentStatusLabel(data.from) : '—'
        const to = data?.to ? paymentStatusLabel(data.to) : '—'
        return `${when}Статус оплаты изменён: ${from} → ${to}${actor}`
      }
      case 'order_updated': {
        const fields = Array.isArray(data?.fields) ? data.fields : []
        const fieldMap = { address_text: 'Адрес', payment_method: 'Способ оплаты', comment: 'Комментарий' }
        const fieldsHuman = fields.map((f) => fieldMap[f] || f).join(', ')
        return `${when}Обновление заказа: ${fieldsHuman || 'поля обновлены'}${actor}`
      }
      case 'item_updated': {
        const quantity = data?.quantity
        const totals = data?.totals
        let message = 'Количество товара изменено'
        if (quantity !== undefined) {
          message += `: ${quantity} шт.`
        }
        if (totals?.total !== undefined) {
          message += ` (итого: ${formatPrice(totals.total)})`
        }
        return `${when}${message}${actor}`
      }
      case 'note': {
        const note = ev.note || data?.note
        return `${when}Примечание: ${note || ''}${actor}`.trim()
      }
      default: {
        const safe = data && typeof data === 'object' ? JSON.stringify(data) : (data || '')
        return `${when}${eventType}${actor}${safe ? `: ${safe}` : ''}`
      }
    }
  } catch (e) {
    return String(ev)
  }
}

// Импортируем formatDate и formatPrice из utils для использования в formatEvent
import { formatDate, formatPrice } from './utils.js'
