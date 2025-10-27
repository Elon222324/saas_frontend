import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/axios'
import { useSiteTokenString } from '@/hooks/useSiteToken'
import PageLayout from '@/components/PageTemplate/PageLayout'
import UsersHeader from './components/UsersHeader'
import CustomersList from './components/CustomersList'
import CustomerDetailsModal from './components/CustomerDetailsModal'
import OrderDetailsModal from '../Orders/components/OrderDetailsModal'
import { stripAppSuffix, baseDomain } from './utils/domain'
import { fetchCustomersApi, fetchCustomerDetailsApi } from './api/customers'
import { getCustomerName, formatDate } from './utils/formatting'

export default function Users() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(50)
  const [offset, setOffset] = useState(0)

  // Sites and site token (like Orders page)
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState('')
  const [loadingSites, setLoadingSites] = useState(true)

  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [ordersLimit, setOrdersLimit] = useState(20)
  const [ordersOffset, setOrdersOffset] = useState(0)

  // Order details modal state
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null)

  const authHeaders = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  }), [])

  const siteNameForToken = useMemo(() => stripAppSuffix(selectedSite), [selectedSite])
  const { token: siteToken, isLoading: tokenLoading } = useSiteTokenString(
    siteNameForToken,
    { enabled: Boolean(siteNameForToken) }
  )

  const fetchCustomers = async () => {
    if (!selectedSite || !siteToken) {
      console.log('⏳ [Customers] Ожидаем выбор сайта и токен...')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await fetchCustomersApi({
        siteName: selectedSite,
        siteToken,
        limit,
        offset,
        query,
      })
      setCustomers(data)
    } catch (e) {
      console.error('❌ [Customers] Ошибка получения списка клиентов:', e)
      setError('Не удалось загрузить клиентов')
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerDetails = async (customerId) => {
    if (!selectedSite || !siteToken) return
    setDetailsLoading(true)
    setError('')
    try {
      const { profileData, ordersData } = await fetchCustomerDetailsApi({
        siteName: selectedSite,
        siteToken,
        customerId,
        ordersLimit,
        ordersOffset,
      })
      setProfile(profileData || null)
      setOrders(ordersData)
    } catch (e) {
      console.error('❌ [Customers] Ошибка получения профиля/заказов клиента:', e)
      setError('Не удалось загрузить детали клиента')
    } finally {
      setDetailsLoading(false)
    }
  }

  const fetchOrderDetails = async (orderId) => {
    if (!selectedSite || !siteToken) return
    try {
      const siteForUrl = stripAppSuffix(selectedSite)
      const newApiUrl = `https://${siteForUrl}.${baseDomain}/site-api/admin/orders/${orderId}/details`
      
      console.log('🔑 [Customers] → Запрашиваю детали заказа:', newApiUrl)

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
      console.log('✅ [Customers] ← Детали заказа получены')
      setSelectedOrderDetails(data)
    } catch (e) {
      console.error('❌ [Customers] Ошибка при получении заказа:', e)
      alert(`Не удалось загрузить детали заказа: ${e.message}`)
    }
  }

  // Load sites list on mount and auto-select first site
  useEffect(() => {
    const fetchSites = async () => {
      setLoadingSites(true)
      try {
        const res = await api.get('/sites/get_all/', { headers: authHeaders })
        setSites(res.data || [])
        if ((res.data || []).length > 0 && !selectedSite) {
          const first = res.data[0]
          const domainNoSuffix = stripAppSuffix(first.domain)
          setSelectedSite(domainNoSuffix)
        }
      } catch (e) {
        console.error('❌ [Customers] Ошибка загрузки сайтов:', e)
        setError('Не удалось загрузить список сайтов')
      } finally {
        setLoadingSites(false)
      }
    }
    fetchSites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-load customers when site/token ready
  useEffect(() => {
    if (selectedSite && siteToken) {
      fetchCustomers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSite, siteToken])

  const openDetails = (customerId) => {
    setSelectedCustomerId(customerId)
    setOrdersOffset(0)
    fetchCustomerDetails(customerId)
  }

  const closeDetails = () => {
    setSelectedCustomerId(null)
    setProfile(null)
    setOrders([])
  }

  const handleSearch = () => {
    setOffset(0)
    fetchCustomers()
  }

  const handleNextPage = () => {
    setOffset((prev) => {
      const next = prev + limit
      setTimeout(fetchCustomers, 0)
      return next
    })
  }

  const handlePrevPage = () => {
    setOffset((prev) => {
      const next = Math.max(0, prev - limit)
      setTimeout(fetchCustomers, 0)
      return next
    })
  }

  const handleOrdersNext = () => {
    setOrdersOffset((prev) => {
      const next = prev + ordersLimit
      setTimeout(() => {
        if (selectedCustomerId) fetchCustomerDetails(selectedCustomerId)
      }, 0)
      return next
    })
  }

  const handleOrdersPrev = () => {
    setOrdersOffset((prev) => {
      const next = Math.max(0, prev - ordersLimit)
      setTimeout(() => {
        if (selectedCustomerId) fetchCustomerDetails(selectedCustomerId)
      }, 0)
      return next
    })
  }

  return (
    <PageLayout
      backgroundGradient="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      containerClass="p-6 space-y-6 max-w-7xl mx-auto"
      gridHeight="auto"
      header={
        <UsersHeader
          sites={sites}
          selectedSite={selectedSite}
          onChangeSite={setSelectedSite}
          loadingSites={loadingSites}
          limit={limit}
          onChangeLimit={setLimit}
          offset={offset}
          onChangeOffset={setOffset}
          onSearch={handleSearch}
          baseDomain={baseDomain}
          stripAppSuffix={stripAppSuffix}
          searchQuery={query}
          onChangeSearch={setQuery}
        />
      }
      content={
        <>
          {/* Error message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">{error}</div>
          )}

          {/* Customers list */}
          <CustomersList
            customers={customers}
            loading={loading}
            error={error}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
            onOpenDetails={openDetails}
            canPrev={offset > 0}
            canNext={customers.length >= limit}
          />

          {/* Customer Details Modal */}
          <CustomerDetailsModal
            isOpen={Boolean(selectedCustomerId)}
            onClose={closeDetails}
            profile={profile}
            orders={orders}
            detailsLoading={detailsLoading}
            ordersLimit={ordersLimit}
            setOrdersLimit={setOrdersLimit}
            ordersOffset={ordersOffset}
            onPrevOrders={handleOrdersPrev}
            onNextOrders={handleOrdersNext}
            selectedCustomerId={selectedCustomerId}
            onOpenOrderDetails={fetchOrderDetails}
          />

          {/* Order Details Modal */}
          {selectedOrderDetails && (
            <OrderDetailsModal 
              details={selectedOrderDetails} 
              onClose={() => setSelectedOrderDetails(null)}
              siteNameForToken={siteNameForToken}
              siteToken={siteToken}
              baseDomain={baseDomain}
              refreshOrders={async () => {
                // Refresh customer's orders list when order is updated
                if (selectedCustomerId) {
                  await fetchCustomerDetails(selectedCustomerId)
                }
              }}
              reloadDetails={async () => {
                try {
                  if (!selectedOrderDetails || !siteToken) return
                  const order = selectedOrderDetails.order || selectedOrderDetails
                  const id = order?.id || order?.order_id
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
                  setSelectedOrderDetails(data)
                } catch (e) {
                  console.error('❌ [Customers] Не удалось обновить детали заказа:', e)
                  alert(`Не удалось обновить детали заказа: ${e.message}`)
                }
              }}
            />
          )}
        </>
      }
    />
  )
}
