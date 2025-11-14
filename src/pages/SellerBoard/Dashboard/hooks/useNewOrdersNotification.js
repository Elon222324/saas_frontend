import { useEffect, useRef } from 'react'
import { playNotificationSound } from '../utils/soundNotification'

export const useNewOrdersNotification = (orders) => {
  const previousOrdersCountRef = useRef(0)

  useEffect(() => {
    const currentOrdersCount = orders.length
    
    // Если это не первая загрузка и количество заказов увеличилось
    if (previousOrdersCountRef.current > 0 && currentOrdersCount > previousOrdersCountRef.current) {
      const newOrdersCount = currentOrdersCount - previousOrdersCountRef.current
      console.log(`🔔 Новых заказов: ${newOrdersCount}`)
      playNotificationSound()
    }
    
    previousOrdersCountRef.current = currentOrdersCount
  }, [orders])
}

