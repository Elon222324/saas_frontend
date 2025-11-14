import { useEffect } from 'react'

export const useOrderStatusListener = (refetch) => {
  useEffect(() => {
    const handleOrderStatusChanged = async (event) => {
      console.log('📢 Статус заказа изменён:', event.detail.orderId)
      // Обновляем список заказов через 500мс, чтобы бекенд успел обновиться
      setTimeout(() => {
        refetch()
      }, 500)
    }

    window.addEventListener('orderStatusChanged', handleOrderStatusChanged)
    return () => window.removeEventListener('orderStatusChanged', handleOrderStatusChanged)
  }, [refetch])
}

