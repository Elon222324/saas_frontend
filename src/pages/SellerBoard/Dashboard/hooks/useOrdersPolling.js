import { useEffect, useState, useCallback } from 'react'
import { fetchOrdersWithItems } from '../api/ordersApi'

/**
 * Хук для автоматической загрузки и обновления заказов с помощью polling
 * @param {string} siteName - Имя сайта
 * @param {string} siteToken - Токен сайта
 * @param {number} interval - Интервал обновления в мс (по умолчанию 3000)
 */
export function useOrdersPolling(siteName, siteToken, interval = 3000) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchOrders = useCallback(async () => {
    if (!siteName || !siteToken) {
      console.log('⏳ [useOrdersPolling] Ожидаем siteName и siteToken...')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('🔄 [useOrdersPolling] Загружаю заказы для:', siteName)
      const fetchedOrders = await fetchOrdersWithItems(siteName, siteToken)
      setOrders(fetchedOrders)
      console.log('✅ [useOrdersPolling] Получено заказов:', fetchedOrders.length)
    } catch (err) {
      console.error('❌ [useOrdersPolling] Ошибка:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [siteName, siteToken])

  // Начальная загрузка
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Периодическое обновление
  useEffect(() => {
    if (!siteName || !siteToken) return

    const intervalId = setInterval(() => {
      fetchOrders()
    }, interval)

    return () => clearInterval(intervalId)
  }, [siteName, siteToken, interval, fetchOrders])

  return { orders, loading, error, refetch: fetchOrders }
}

