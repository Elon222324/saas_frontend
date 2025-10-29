import { useEffect, useState } from 'react'
import { AlertCircle, MessageCircle } from 'lucide-react'
import ModalTemplate from '@/components/ModalTemplate'
import { fetchTicketDetails } from '../../api/tickets'
import { useTicketDetails } from './hooks/useTicketDetails'
import TicketInfo from './components/TicketInfo'
import MessagesSection from './components/MessagesSection'
import CustomerProfileModal from '@/components/CustomerProfileModal'
import OrderDetailsModal from '@/pages/Orders/components/OrderDetailsModal'

export default function TicketDetailsModal({
  ticketId,
  siteToken,
  baseDomain,
  siteName,
  onClose = () => {},
  refreshTickets = () => {},
}) {
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null)
  const {
    ticket,
    setTicket,
    isUpdating,
    error: updateError,
    setError: setUpdateError,
    handleStatusChange,
    handleAddResponse,
    handleResolve,
    handleClose,
  } = useTicketDetails(ticketId, siteToken, baseDomain, siteName)

  const fetchOrderDetails = async (orderId) => {
    if (!siteName || !siteToken) return
    try {
      const siteForUrl = siteName.endsWith('_app') ? siteName.slice(0, -4) : siteName
      const newApiUrl = `https://${siteForUrl}.${baseDomain}/site-api/admin/orders/${orderId}/details`
      
      console.log('🔑 [Tickets] → Запрашиваю детали заказа:', newApiUrl)

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
      console.log('✅ [Tickets] ← Детали заказа получены')
      setSelectedOrderDetails(data)
    } catch (e) {
      console.error('❌ [Tickets] Ошибка при получении заказа:', e)
      alert(`Не удалось загрузить детали заказа: ${e.message}`)
    }
  }

  // Получить customer_id по order_id из ticket
  const getCustomerIdFromTicket = async (ticketData) => {
    if (!ticketData.order_id || !siteName || !siteToken) {
      console.warn('⚠️ [Tickets] Недостаточно данных для получения customer_id')
      return null
    }

    try {
      const siteForUrl = siteName.endsWith('_app') ? siteName.slice(0, -4) : siteName
      // FIX: Добавляем /details к URL для получения деталей заказа
      const orderUrl = `https://${siteForUrl}.${baseDomain}/site-api/admin/orders/${ticketData.order_id}/details`
      
      console.log('🔑 [Tickets] → Получаю customer_id через order:', orderUrl)

      const res = await fetch(orderUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!res.ok) {
        console.warn('⚠️ [Tickets] Не удалось получить order для customer_id')
        return null
      }

      const orderData = await res.json()
      // FIX: Данные могут быть вложены в { order: {...} }
      const order = orderData.order || orderData
      const customerId = order?.customer_id || order?.customer?.id || order?.user_id
      
      if (customerId) {
        console.log('✅ [Tickets] ← Получен customer_id:', customerId)
        return customerId
      }
      
      return null
    } catch (e) {
      console.error('⚠️ [Tickets] Ошибка при получении customer_id из order:', e)
      return null
    }
  }

  // Register the profile opener function on window
  useEffect(() => {
    window.__openCustomerProfile = (userId) => {
      setSelectedCustomerId(userId)
    }
    return () => {
      delete window.__openCustomerProfile
    }
  }, [])

  // Register the function that gets customer_id from ticket and opens profile
  useEffect(() => {
    window.__getCustomerIdAndOpen = async (ticketData) => {
      console.log('🔑 [Tickets] → Попытка открыть профиль пользователя из ticket...')
      const customerId = await getCustomerIdFromTicket(ticketData)
      if (customerId) {
        console.log('✅ [Tickets] → Открываю профиль customer:', customerId)
        setSelectedCustomerId(customerId)
      } else {
        console.error('❌ [Tickets] Не удалось получить customer_id из ticket')
        alert('Не удалось загрузить профиль пользователя. Убедитесь, что тикет связан с заказом.')
      }
    }
    return () => {
      delete window.__getCustomerIdAndOpen
    }
  }, [getCustomerIdFromTicket])

  // Register the function that opens order details
  useEffect(() => {
    window.__openOrderDetails = (orderId) => {
      console.log('🔑 [Tickets] → Попытка открыть детали заказа...', orderId)
      fetchOrderDetails(orderId)
    }
    return () => {
      delete window.__openOrderDetails
    }
  }, [fetchOrderDetails])

  useEffect(() => {
    if (!ticketId || !siteToken) return

    const loadTicketDetails = async () => {
      setLoading(true)
      setFetchError('')
      try {
        console.log('🔄 [Ticket Details Modal] Loading ticket:', ticketId)
        const data = await fetchTicketDetails(siteToken, ticketId, baseDomain, siteName)
        // Handle API response structure: may be { ticket: {...} } or just ticket object
        const ticketData = data.ticket || data
        console.log('📥 [Ticket Details Modal] Raw API response:', data)
        console.log('📥 [Ticket Details Modal] Extracted ticket data:', ticketData)
        console.log('📥 [Ticket Details Modal] Ticket fields:', {
          id: ticketData.id,
          status: ticketData.status,
          priority: ticketData.priority,
          created_at: ticketData.created_at,
          updated_at: ticketData.updated_at,
          user_name: ticketData.user_name,
          category: ticketData.category,
          messages: Array.isArray(ticketData.messages) ? ticketData.messages.length : 0,
        })
        setTicket(ticketData)
      } catch (e) {
        const msg = e.message || 'Ошибка при загрузке деталей тикета'
        setFetchError(msg)
        console.error('❌ [Ticket Details Modal] Load error:', e)
      } finally {
        setLoading(false)
      }
    }

    loadTicketDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId, siteToken, baseDomain, siteName])

  const handleActionAndRefresh = async (action) => {
    console.log('🔄 [Ticket Details Modal] Executing action and refresh...')
    try {
      const result = await action()
      console.log('✅ [Ticket Details Modal] Action completed, ticket state:', ticket)
      setTimeout(() => {
        console.log('🔄 [Ticket Details Modal] Refreshing tickets list...')
        refreshTickets?.()
      }, 500)
    } catch (e) {
      console.error('❌ [Ticket Details Modal] Error in action:', e)
    }
  }

  if (loading) {
    return (
      <ModalTemplate
        title="Загрузка..."
        subtitle="Получение деталей тикета"
        icon={MessageCircle}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
        onClose={onClose}
        maxWidth="max-w-4xl"
        showFooter={false}
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ModalTemplate>
    )
  }

  if (fetchError) {
    return (
      <ModalTemplate
        title="Ошибка загрузки"
        subtitle="Не удалось загрузить детали тикета"
        icon={AlertCircle}
        iconBgColor="bg-red-50"
        iconColor="text-red-600"
        onClose={onClose}
        maxWidth="max-w-2xl"
      >
        <div className="p-8">
          <div className="flex gap-3 items-start text-red-800">
            <AlertCircle size={24} className="flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm">{fetchError}</p>
            </div>
          </div>
        </div>
      </ModalTemplate>
    )
  }

  if (!ticket) return null

  const ticketShortId = ticket.id?.slice(0, 8) || ticket.id
  const ticketCreatedDate = ticket.created_at 
    ? new Date(ticket.created_at).toLocaleString('ru-RU')
    : ''

  return (
    <>
      <ModalTemplate
        title={`Тикет #${ticketShortId}`}
        subtitle={ticketCreatedDate ? `Создано: ${ticketCreatedDate}` : 'Детали тикета'}
        icon={MessageCircle}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
        onClose={onClose}
        maxWidth="max-w-4xl"
      >
        <div className="p-8 space-y-6">
          {/* Error message */}
          {updateError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{updateError}</p>
            </div>
          )}

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Ticket Info */}
            <div className="lg:col-span-1 bg-gray-50 rounded-lg p-4">
              <TicketInfo ticket={ticket} />
            </div>

            {/* Right: Messages */}
            <div className="lg:col-span-2">
              <MessagesSection
                ticket={ticket}
                isUpdating={isUpdating}
                onAddResponse={(msg, status) =>
                  handleActionAndRefresh(() => handleAddResponse(msg, status))
                }
              />
            </div>
          </div>
        </div>
      </ModalTemplate>

      {/* Customer Profile Modal - with higher z-index to appear above ticket modal */}
      <CustomerProfileModal
        isOpen={Boolean(selectedCustomerId)}
        onClose={() => setSelectedCustomerId(null)}
        customerId={selectedCustomerId}
        siteName={siteName}
        siteToken={siteToken}
        zIndex="z-[60]"
        onOpenOrderDetails={fetchOrderDetails}
      />

      {/* Order Details Modal - with higher z-index to appear above ticket and profile modals */}
      {selectedOrderDetails && (
        <OrderDetailsModal
          details={selectedOrderDetails}
          onClose={() => setSelectedOrderDetails(null)}
          siteNameForToken={siteName}
          siteToken={siteToken}
          baseDomain={baseDomain}
          refreshOrders={refreshTickets} // Re-fetch tickets to get any updates reflected
          reloadDetails={() => fetchOrderDetails(selectedOrderDetails.order?.id || selectedOrderDetails.order?.order_id)}
        />
      )}
    </>
  )
}
