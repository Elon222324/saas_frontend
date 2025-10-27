// API functions for support tickets

const BASE_URL = '/site-api/admin/support/tickets'

/**
 * Получить список тикетов с фильтрацией и пагинацией
 */
export const fetchTickets = async (siteToken, params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  const url = `${BASE_URL}?${queryString}`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return await response.json()
}

/**
 * Получить детали тикета
 */
export const fetchTicketDetails = async (siteToken, ticketId) => {
  const url = `${BASE_URL}/${ticketId}`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return await response.json()
}

/**
 * Изменить статус тикета
 */
export const updateTicketStatus = async (siteToken, ticketId, status) => {
  const url = `${BASE_URL}/${ticketId}/status`
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return await response.json()
}

/**
 * Добавить ответ администратора
 */
export const addAdminResponse = async (siteToken, ticketId, message, status = null) => {
  const url = `${BASE_URL}/${ticketId}/messages`
  
  const body = { message }
  if (status) body.status = status

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return await response.json()
}

/**
 * Разрешить тикет (resolve)
 */
export const resolveTicket = async (siteToken, ticketId, resolutionNotes) => {
  const url = `${BASE_URL}/${ticketId}/resolve`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resolution_notes: resolutionNotes }),
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return await response.json()
}

/**
 * Закрыть тикет
 */
export const closeTicket = async (siteToken, ticketId) => {
  const url = `${BASE_URL}/${ticketId}/close`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return await response.json()
}

/**
 * Получить статистику по тикетам
 */
export const fetchTicketsStats = async (siteToken) => {
  const url = `${BASE_URL}/stats/dashboard`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return await response.json()
}
