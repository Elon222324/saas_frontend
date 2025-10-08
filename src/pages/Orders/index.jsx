import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/axios'
import { useSiteTokenString } from '@/hooks/useSiteToken'
// removed unused local UI imports
import OrdersHeader from './components/OrdersHeader'
import OrdersSidebar from './components/OrdersSidebar'
import OrderList from './components/OrderList'
import OrderDetailsModal from './components/OrderDetailsModal'

export default function OrdersPage() {
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState('')
  const [orders, setOrders] = useState([])
  const [loadingSites, setLoadingSites] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [limit, setLimit] = useState(50)
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState('')
  const [detailsOrder, setDetailsOrder] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [datePreset, setDatePreset] = useState('today')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN
  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'

  const stripAppSuffix = (value) => {
    if (!value) return value
    return value.endsWith(containerSuffix) ? value.slice(0, -containerSuffix.length) : value
  }

  // 🔑 Получаем токен сайта для нового API
  const siteNameForToken = useMemo(() => stripAppSuffix(selectedSite), [selectedSite, containerSuffix])
  const { token: siteToken, isLoading: tokenLoading, error: tokenError } = useSiteTokenString(
    siteNameForToken, 
    { enabled: Boolean(siteNameForToken) }
  )

  // User token для старых эндпоинтов (список сайтов)
  const authHeaders = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  }), [])

  // Текущее имя сайта для API с контейнерным суффиксом (для старого API)
  const siteNameForApi = useMemo(() => {
    if (!selectedSite) return ''
    return selectedSite.endsWith(containerSuffix)
      ? selectedSite
      : `${selectedSite}${containerSuffix}`
  }, [selectedSite, containerSuffix])

  // Подсчет заказов по статусам
  const statusCounts = useMemo(() => {
    const counts = {
      new: 0,
      confirmed: 0,
      preparing: 0,
      delivering: 0,
      completed: 0,
    }
    
    orders.forEach(order => {
      const status = String(order.status || '').toLowerCase()
      if (counts.hasOwnProperty(status)) {
        counts[status]++
      }
    })
    
    return counts
  }, [orders])

  const fetchSites = async () => {
    setLoadingSites(true)
    try {
      const res = await api.get('/sites/get_all/', { headers: authHeaders })
      setSites(res.data || [])
      // Автовыбор первого сайта
      if ((res.data || []).length > 0 && !selectedSite) {
        const first = res.data[0]
        const domainNoSuffix = stripAppSuffix(first.domain)
        setSelectedSite(domainNoSuffix)
      }
    } catch (e) {
      console.error('❌ [Orders] Ошибка загрузки сайтов:', e)
      setError('Не удалось загрузить список сайтов')
    } finally {
      setLoadingSites(false)
    }
  }

  const fetchOrders = async () => {
    if (!selectedSite || !siteToken) {
      console.log('⏳ [Orders] Ожидаем токен сайта...')
      return
    }
    
    setLoadingOrders(true)
    setError('')
    try {
      const siteForUrl = stripAppSuffix(selectedSite)
      const newApiUrl = `https://${siteForUrl}.${baseDomain}/site-api/admin/orders/`
      
      console.log('🔑 [Orders] → Запрашиваю новый API:', newApiUrl)
      console.log('🔑 [Orders] → Токен сайта:', siteToken ? 'получен' : 'отсутствует')
      console.log('🔑 [Orders] → Сайт для API:', siteForUrl)

      const params = { limit, offset }
      if (searchQuery) params.search = searchQuery
      if (Array.isArray(selectedStatuses) && selectedStatuses.length > 0) {
        params.status = selectedStatuses.join(',')
      }
      if (datePreset === 'today') {
        const today = new Date()
        const from = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
        params.date_from = from.toISOString()
        params.date_to = to.toISOString()
      } else if (datePreset === 'week') {
        const today = new Date()
        const from = new Date(today)
        from.setDate(today.getDate() - 7)
        params.date_from = from.toISOString()
        params.date_to = today.toISOString()
      } else if (datePreset === 'range' && dateFrom && dateTo) {
        params.date_from = new Date(dateFrom).toISOString()
        params.date_to = new Date(dateTo).toISOString()
      }

      const queryString = new URLSearchParams(params).toString()
      const fullUrl = `${newApiUrl}?${queryString}`
      console.log('🔑 [Orders] → Полный URL с параметрами:', fullUrl)

      const res = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('🔑 [Orders] ← Статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        // Пытаемся получить детали ошибки от сервера
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`
        let errorDetails = null
        
        try {
          const errorData = await res.json()
          console.error('❌ [Orders] ← Детали ошибки сервера:', errorData)
          errorDetails = errorData
          
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          } else if (errorData.detail) {
            errorMessage = errorData.detail
          } else if (errorData.errors) {
            // Обработка валидационных ошибок
            const errors = Array.isArray(errorData.errors) 
              ? errorData.errors.join(', ')
              : JSON.stringify(errorData.errors)
            errorMessage = `Ошибки валидации: ${errors}`
          }
        } catch (e) {
          console.error('❌ [Orders] ← Не удалось прочитать детали ошибки:', e)
        }

        // Специальная обработка для разных статусов
        if (res.status === 401) {
          throw new Error('Ошибка аутентификации. Токен сайта недействителен или истек.')
        } else if (res.status === 403) {
          throw new Error('Доступ запрещен. Недостаточно прав для просмотра заказов.')
        } else if (res.status === 404) {
          throw new Error('API заказов не найден. Возможно, сайт не поддерживает этот функционал.')
        } else if (res.status === 500) {
          throw new Error(`Ошибка сервера: ${errorMessage}. Проверьте логи сервера.`)
        } else if (res.status === 502 || res.status === 503) {
          throw new Error('Сервис временно недоступен. Попробуйте позже.')
        }
        
        throw new Error(`Не удалось получить заказы: ${errorMessage}`)
      }

      const data = await res.json()
      console.log('🔍 [Orders] ← Полный ответ API:', data)
      
      // Поддержка разных форматов ответа
      const orders = Array.isArray(data)
        ? data
        : (data?.orders || data?.results || data?.data || [])
      
      console.log('✅ [Orders] ← Получено заказов:', orders.length)
      console.log('📋 [Orders] ← Обработанные заказы:', orders.length, orders)
      setOrders(orders)
    } catch (e) {
      console.error('❌ [Orders] Ошибка при получении заказов:', e)
      
      // Более информативные сообщения об ошибках
      let userMessage = 'Не удалось загрузить заказы'
      if (e.message.includes('Failed to fetch')) {
        userMessage = 'Ошибка сети. Проверьте подключение к интернету.'
      } else if (e.message.includes('аутентификации')) {
        userMessage = 'Ошибка авторизации. Попробуйте перезагрузить страницу.'
      } else if (e.message.includes('сервера')) {
        userMessage = 'Ошибка сервера. Обратитесь к администратору.'
      } else if (e.message) {
        userMessage = e.message
      }
      
      setError(userMessage)
    } finally {
      setLoadingOrders(false)
    }
  }

  const fetchOrderDetails = async (orderId) => {
    if (!selectedSite || !siteToken) return
    try {
      const siteForUrl = stripAppSuffix(selectedSite)
      const newApiUrl = `https://${siteForUrl}.${baseDomain}/site-api/admin/orders/${orderId}/details`
      
      console.log('🔑 [Orders] → Запрашиваю детали заказа:', newApiUrl)

      const res = await fetch(newApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`
        try {
          const errorData = await res.json()
          if (errorData.message) errorMessage = errorData.message
        } catch (e) {
          // Игнорируем ошибки парсинга
        }
        throw new Error(`Не удалось получить детали заказа: ${errorMessage}`)
      }

      const data = await res.json()
      console.log('✅ [Orders] ← Детали заказа получены')
      setDetailsOrder(data)
    } catch (e) {
      console.error('❌ [Orders] Ошибка при получении заказа:', e)
      alert(`Не удалось загрузить детали заказа: ${e.message}`)
    }
  }

  // Отмена заказа не поддерживается сервером (нет статуса canceled)

  const onToggleStatus = (value) => {
    setSelectedStatuses((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value])
  }

  const onApplyFilters = () => {
    setOffset(0)
    fetchOrders()
  }

  const canPrev = offset > 0
  const canNext = orders.length >= limit
  const onPrevPage = () => {
    if (!canPrev) return
    setOffset(Math.max(0, offset - limit))
  }
  const onNextPage = () => {
    if (!canNext) return
    setOffset(offset + limit)
  }

  useEffect(() => {
    fetchSites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Обновляем заказы когда токен готов
  useEffect(() => {
    if (siteToken) {
      fetchOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSite, limit, offset, siteToken])

  // Показываем ошибку токена если есть
  useEffect(() => {
    if (tokenError) {
      console.error('❌ [Orders] Ошибка получения токена:', tokenError)
      setError(`Не удалось получить токен для сайта: ${tokenError.message}`)
    }
  }, [tokenError])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <OrdersHeader
          title="Заказы"
          sites={sites}
          selectedSite={selectedSite}
          onChangeSite={setSelectedSite}
          loadingSites={loadingSites}
          limit={limit}
          onChangeLimit={setLimit}
          offset={offset}
          onChangeOffset={setOffset}
          onSearch={fetchOrders}
          baseDomain={baseDomain}
          stripAppSuffix={stripAppSuffix}
          searchQuery={searchQuery}
          onChangeSearch={setSearchQuery}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
          <div className="lg:col-span-3">
            <OrdersSidebar
              selectedStatuses={selectedStatuses}
              onToggleStatus={onToggleStatus}
              datePreset={datePreset}
              onChangeDatePreset={setDatePreset}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onChangeDateFrom={setDateFrom}
              onChangeDateTo={setDateTo}
              onApply={onApplyFilters}
              statusCounts={statusCounts}
            />
          </div>

          <div className="lg:col-span-9">
            <OrderList
              orders={orders}
              loading={loadingOrders}
              error={error}
              onDetails={fetchOrderDetails}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
              canPrev={canPrev}
              canNext={canNext}
            />
          </div>
        </div>

        {detailsOrder && (
          <OrderDetailsModal 
            details={detailsOrder} 
            onClose={() => setDetailsOrder(null)}
            siteNameForToken={siteNameForToken}
            siteToken={siteToken}
            baseDomain={baseDomain}
            refreshOrders={fetchOrders}
            reloadDetails={async () => {
              try {
                if (!detailsOrder || !siteToken) return
                const id = (detailsOrder.order || detailsOrder)?.id || (detailsOrder.order || detailsOrder)?.order_id
                if (!id) return
                
                const siteForUrl = stripAppSuffix(selectedSite)
                const url = `https://${siteForUrl}.${baseDomain}/site-api/admin/orders/${id}/details`
                
                const res = await fetch(url, {
                  headers: { 
                    'Authorization': `Bearer ${siteToken}`,
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include',
                })
                
                if (!res.ok) {
                  let errorMessage = `HTTP ${res.status}: ${res.statusText}`
                  try {
                    const errorData = await res.json()
                    if (errorData.message) errorMessage = errorData.message
                  } catch (e) {
                    // Игнорируем ошибки парсинга
                  }
                  throw new Error(`Не удалось обновить детали заказа: ${errorMessage}`)
                }
                
                const data = await res.json()
                setDetailsOrder(data)
              } catch (e) {
                console.error('❌ [Orders] Не удалось обновить детали заказа:', e)
                alert(`Не удалось обновить детали заказа: ${e.message}`)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}