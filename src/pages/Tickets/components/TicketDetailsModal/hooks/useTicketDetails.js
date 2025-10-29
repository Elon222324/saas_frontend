import { useState } from 'react'
import {
  updateTicketStatus,
  addAdminResponse,
  resolveTicket,
  closeTicket,
  fetchTicketDetails,
} from '../../../api/tickets'

// Helper function to merge updated ticket data with existing data
const mergeTicketData = (oldTicket, updateResponse) => {
  if (!oldTicket) return updateResponse
  
  // Extract ticket object if wrapped
  const updated = updateResponse.ticket || updateResponse
  
  console.log('🔄 [mergeTicketData] Analyzing response:', {
    hasId: !!updated.id,
    hasStatus: !!updated.status,
    hasPriority: !!updated.priority,
    hasMessages: !!updated.messages,
    hasIsAdmin: !!updated.is_admin,
    hasMessage: !!updated.message,
    keys: Object.keys(updated),
  })
  
  // Check if this is a full ticket object (has status and priority, or has messages array)
  // NOT just a message response (which has is_admin and message fields)
  const isFullTicket = updated.status !== undefined && updated.priority !== undefined && 
                       (!updated.is_admin || Array.isArray(updated.messages))
  
  if (isFullTicket) {
    console.log('✅ [mergeTicketData] Full ticket object detected')
    return updated
  }
  
  // This is a partial update (message, status change, etc) - merge with old data
  console.log('⚠️ [mergeTicketData] Partial update detected - merging with old ticket data')
  const merged = {
    ...oldTicket,
    ...updated,
    // Ensure critical ticket fields are preserved
    status: updated.status !== undefined ? updated.status : oldTicket.status,
    priority: updated.priority !== undefined ? updated.priority : oldTicket.priority,
    user_name: updated.user_name !== undefined ? updated.user_name : oldTicket.user_name,
    category: updated.category !== undefined ? updated.category : oldTicket.category,
    created_at: updated.created_at !== undefined ? updated.created_at : oldTicket.created_at,
    updated_at: updated.updated_at !== undefined ? updated.updated_at : new Date().toISOString(),
    messages: Array.isArray(updated.messages) ? updated.messages : oldTicket.messages,
  }
  
  console.log('✅ [mergeTicketData] Merged result:', {
    id: merged.id,
    status: merged.status,
    priority: merged.priority,
    user_name: merged.user_name,
  })
  
  return merged
}

export const useTicketDetails = (ticketId, siteToken, baseDomain, siteName) => {
  const [ticket, setTicket] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')

  const handleStatusChange = async (newStatus) => {
    if (!ticket || !siteToken) return
    setIsUpdating(true)
    setError('')
    
    try {
      const response = await updateTicketStatus(siteToken, ticket.id, newStatus, baseDomain, siteName)
      const updated = mergeTicketData(ticket, response)
      console.log('✅ [Ticket Details] Ticket updated after status change:', updated)
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
      const response = await addAdminResponse(siteToken, ticket.id, message, status, baseDomain, siteName)
      console.log('✅ [Ticket Details] Admin response API returned:', response)
      
      // API might return just the message, so reload full ticket to get updated messages
      const fullTicket = await fetchTicketDetails(siteToken, ticket.id, baseDomain, siteName)
      const updated = fullTicket.ticket || fullTicket
      
      console.log('✅ [Ticket Details] Full ticket reloaded after adding response:', {
        id: updated.id,
        status: updated.status,
        messagesCount: Array.isArray(updated.messages) ? updated.messages.length : 0,
      })
      
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
      const response = await resolveTicket(siteToken, ticket.id, resolutionNotes, baseDomain, siteName)
      const updated = mergeTicketData(ticket, response)
      console.log('✅ [Ticket Details] Ticket updated after resolve:', updated)
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
      const response = await closeTicket(siteToken, ticket.id, baseDomain, siteName)
      const updated = mergeTicketData(ticket, response)
      console.log('✅ [Ticket Details] Ticket updated after close:', updated)
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
