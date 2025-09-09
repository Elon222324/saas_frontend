export function formatAddress(order) {
  const parts = [order?.city, order?.street, order?.house, order?.apartment]
  return parts.filter(Boolean).join(', ')
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
    return dateString
  }
}

export function getImageSrc(raw) {
  if (!raw) return ''
  const base = import.meta.env.VITE_LIBRARY_ASSETS_URL || ''
  const cleanBase = String(base).replace(/\/$/, '')
  const cleanRaw = String(raw).replace(/^\//, '')
  // convention: store small preview variant
  return `${cleanBase}/${cleanRaw}_small.webp`
}

export function extractErrorMessage(err) {
  return err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Неизвестная ошибка'
}

export function mapStatusForBackend(value) {
  return String(value || '').toLowerCase()
}

export function mapPaymentStatusForBackend(value) {
  const v = String(value || '').toLowerCase()
  const map = {
    paid: 'paid',
    pending: 'pending',
    failed: 'failed',
  }
  return map[v] || v
}
