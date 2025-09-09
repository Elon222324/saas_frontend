import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/axios'
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

  const authHeaders = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  }), [])

  // Текущее имя сайта для API с контейнерным суффиксом
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
      console.error(e)
    } finally {
      setLoadingSites(false)
    }
  }

  const fetchOrders = async () => {
    if (!selectedSite) return
    setLoadingOrders(true)
    setError('')
    try {
      const siteNameForApi = selectedSite.endsWith(containerSuffix)
        ? selectedSite
        : `${selectedSite}${containerSuffix}`
      const params = { limit, offset }
      if (searchQuery) params.search = searchQuery
      if (Array.isArray(selectedStatuses) && selectedStatuses.length > 0) params.status = selectedStatuses.join(',')
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

      const res = await api.get(`/orders/${siteNameForApi}/`, {
        params,
        headers: authHeaders,
      })
      // Поддержка разных форматов ответа
      // 1) { orders: [...] }
      // 2) { results: [...] }
      // 3) [...]
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data?.orders || res.data?.results || [])
      setOrders(data)
    } catch (e) {
      console.error('Ошибка при получении заказов', e)
      setError('Не удалось загрузить заказы')
    } finally {
      setLoadingOrders(false)
    }
  }

  const fetchOrderDetails = async (orderId) => {
    if (!selectedSite) return
    try {
      const siteNameForApi = selectedSite.endsWith(containerSuffix)
        ? selectedSite
        : `${selectedSite}${containerSuffix}`
      const res = await api.get(`/orders/${siteNameForApi}/${orderId}`, { headers: authHeaders })
      setDetailsOrder(res.data)
    } catch (e) {
      console.error('Ошибка при получении заказа', e)
      alert('Не удалось загрузить детали заказа')
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

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSite, limit, offset])

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
            siteNameForApi={siteNameForApi}
            headers={authHeaders}
            refreshOrders={fetchOrders}
            reloadDetails={async () => {
              try {
                if (!detailsOrder) return
                const id = (detailsOrder.order || detailsOrder)?.id || (detailsOrder.order || detailsOrder)?.order_id
                if (!id) return
                const res = await api.get(`/orders/${siteNameForApi}/${id}`, { headers: authHeaders })
                setDetailsOrder(res.data)
              } catch (e) {
                console.error('Не удалось обновить детали заказа', e)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}


