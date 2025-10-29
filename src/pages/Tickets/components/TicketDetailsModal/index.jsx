import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { fetchTicketDetails } from '../../api/tickets'
import { useTicketDetails } from './hooks/useTicketDetails'
import ModalHeader from './components/ModalHeader'
import TicketInfo from './components/TicketInfo'
import MessagesSection from './components/MessagesSection'
import ModalFooter from './components/ModalFooter'

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

  useEffect(() => {
    if (!ticketId || !siteToken) return

    const loadTicketDetails = async () => {
      setLoading(true)
      setFetchError('')
      try {
        const data = await fetchTicketDetails(siteToken, ticketId, baseDomain, siteName)
        setTicket(data)
      } catch (e) {
        const msg = e.message || 'Ошибка при загрузке деталей тикета'
        setFetchError(msg)
        console.error('❌ [Ticket Details Modal] Load error:', e)
      } finally {
        setLoading(false)
      }
    }

    loadTicketDetails()
  }, [ticketId, siteToken, baseDomain, siteName, setTicket])

  const handleActionAndRefresh = async (action) => {
    try {
      await action()
      setTimeout(() => {
        refreshTickets?.()
      }, 500)
    } catch (e) {
      console.error('Error in action:', e)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="flex gap-3 items-start text-red-800">
            <AlertCircle size={24} className="flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Ошибка загрузки</h3>
              <p className="text-sm mb-4">{fetchError}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!ticket) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <ModalHeader ticket={ticket} onClose={onClose} />

          {/* Error message */}
          {updateError && (
            <div className="bg-red-50 border border-red-200 rounded p-4 flex gap-3">
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

          {/* Footer with action buttons */}
          <ModalFooter
            ticket={ticket}
            isUpdating={isUpdating}
            onStatusChange={(status) =>
              handleActionAndRefresh(() => handleStatusChange(status))
            }
            onResolve={(notes) =>
              handleActionAndRefresh(() => handleResolve(notes))
            }
            onClose={() =>
              handleActionAndRefresh(() => handleClose())
            }
          />
        </div>
      </div>
    </div>
  )
}
