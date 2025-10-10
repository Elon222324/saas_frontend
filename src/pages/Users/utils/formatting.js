// Formatting and mapping helpers for Users page

export function getCustomerName(customer) {
  if (!customer) return 'Без имени'
  const first = customer.first_name || customer.firstName || ''
  const last = customer.last_name || customer.lastName || ''
  const combined = `${first} ${last}`.trim()
  return (
    customer.full_name ||
    customer.fullName ||
    customer.name ||
    combined ||
    customer.username ||
    customer.email ||
    'Без имени'
  )
}

export function formatDate(dateString) {
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
    return String(dateString)
  }
}

export function formatPrice(value) {
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


