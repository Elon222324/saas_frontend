/**
 * Хук для логики статуса оплаты - используется во всех версиях
 * Возможные значения: paid, pending, failed, refunded
 */
export function usePaymentStatus(paymentStatus) {
  const status = String(paymentStatus || '').toLowerCase()
  
  const statusMap = {
    paid: {
      text: 'ОПЛАЧЕНО',
      color: 'bg-green-600'
    },
    pending: {
      text: 'ОЖИДАНИЕ',
      color: 'bg-yellow-600'
    },
    failed: {
      text: 'ОШИБКА',
      color: 'bg-red-600'
    },
    refunded: {
      text: 'ВОЗВРАТ',
      color: 'bg-blue-600'
    }
  }

  return statusMap[status] || statusMap.pending
}

