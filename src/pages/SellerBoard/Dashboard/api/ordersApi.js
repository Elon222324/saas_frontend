/**
 * API для работы с заказами на SellerBoard Dashboard
 * Согласно документации: docs/orders_api_admin.md
 * 
 * Эндпоинты:
 * - GET /site-api/admin/orders/ - Список заказов без деталей (быстро)
 * - GET /site-api/admin/orders/list - Список заказов с товарами (полнее)
 * - GET /site-api/admin/orders/{order_id}/details - Детали конкретного заказа
 */

const baseDomain = import.meta.env.VITE_BASE_DOMAIN

/**
 * Получить все заказы (быстрый список без деталей товаров)
 */
export async function fetchOrdersQuick(siteName, siteToken, options = {}) {
  const { limit = 100, offset = 0 } = options
  
  const url = `https://${siteName}.${baseDomain}/site-api/admin/orders/`
  const params = new URLSearchParams({
    limit: Math.min(limit, 1000),
    offset,
  })

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${siteToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data.orders || []
  } catch (error) {
    console.error('❌ [OrdersApi] Ошибка при загрузке заказов:', error)
    throw error
  }
}

/**
 * Получить заказы со всеми товарами (полный список)
 */
export async function fetchOrdersWithItems(siteName, siteToken, options = {}) {
  const { limit = 50, offset = 0 } = options
  
  const url = `https://${siteName}.${baseDomain}/site-api/admin/orders/list`
  const params = new URLSearchParams({
    limit: Math.min(limit, 100),
    offset,
  })

  try {
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${siteToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data.orders || []
  } catch (error) {
    console.error('❌ [OrdersApi] Ошибка при загрузке заказов с товарами:', error)
    throw error
  }
}

/**
 * Получить детали конкретного заказа
 */
export async function fetchOrderDetails(siteName, orderId, siteToken) {
  const url = `https://${siteName}.${baseDomain}/site-api/admin/orders/${orderId}/details`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${siteToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data.order || null
  } catch (error) {
    console.error('❌ [OrdersApi] Ошибка при загрузке деталей заказа:', error)
    throw error
  }
}

/**
 * Периодическая загрузка заказов (для автообновления доски)
 * Используется с быстрым эндпоинтом для минимизации нагрузки
 */
export async function startPollingOrders(siteName, siteToken, callback, interval = 3000) {
  // Первая загрузка
  try {
    const orders = await fetchOrdersQuick(siteName, siteToken)
    callback(orders, null)
  } catch (error) {
    callback(null, error)
  }

  // Периодические обновления
  const intervalId = setInterval(async () => {
    try {
      const orders = await fetchOrdersQuick(siteName, siteToken)
      callback(orders, null)
    } catch (error) {
      callback(null, error)
    }
  }, interval)

  return () => clearInterval(intervalId)
}

