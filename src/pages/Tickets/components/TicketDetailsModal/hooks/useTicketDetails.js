import { useState } from 'react'
import {
  updateTicketStatus,
  addAdminResponse,
  resolveTicket,
  closeTicket,
} from '../../../api/tickets'

export const useTicketDetails = (ticketId, siteToken, baseDomain, siteName) => {
  const [ticket, setTicket] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')

  const handleStatusChange = async (newStatus) => {
    if (!ticket || !siteToken) return
    setIsUpdating(true)
    setError('')
    
    try {
      const updated = await updateTicketStatus(siteToken, ticket.id, newStatus, baseDomain, siteName)
      setTicket(updated)
      return updated
    } catch (e) {
      const msg = e.message || 'Ошибка при изменении статуса'
      setError(msg)
      console.error('❌ [Ticket Details] Status update error:', e)
      throw e
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddResponse = async (message, status = null) => {
    if (!ticket || !siteToken) return
    setIsUpdating(true)
    setError('')
    
    try {
      const updated = await addAdminResponse(siteToken, ticket.id, message, status, baseDomain, siteName)
      setTicket(updated)
      return updated
    } catch (e) {
      const msg = e.message || 'Ошибка при добавлении ответа'
      setError(msg)
      console.error('❌ [Ticket Details] Response add error:', e)
      throw e
    } finally {
      setIsUpdating(false)
    }
  }

  const handleResolve = async (resolutionNotes) => {
    if (!ticket || !siteToken) return
    setIsUpdating(true)
    setError('')
    
    try {
      const updated = await resolveTicket(siteToken, ticket.id, resolutionNotes, baseDomain, siteName)
      setTicket(updated)
      return updated
    } catch (e) {
      const msg = e.message || 'Ошибка при разрешении тикета'
      setError(msg)
      console.error('❌ [Ticket Details] Resolve error:', e)
      throw e
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClose = async () => {
    if (!ticket || !siteToken) return
    setIsUpdating(true)
    setError('')
    
    try {
      const updated = await closeTicket(siteToken, ticket.id, baseDomain, siteName)
      setTicket(updated)
      return updated
    } catch (e) {
      const msg = e.message || 'Ошибка при закрытии тикета'
      setError(msg)
      console.error('❌ [Ticket Details] Close error:', e)
      throw e
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    ticket,
    setTicket,
    isUpdating,
    error,
    setError,
    handleStatusChange,
    handleAddResponse,
    handleResolve,
    handleClose,
  }
}
