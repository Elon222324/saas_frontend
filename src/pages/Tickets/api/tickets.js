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
export const fetchTicketDetails = async (siteToken, ticketId, baseDomain, siteName) => {
  // If baseDomain and siteName are provided, construct full URL
  let url = `${BASE_URL}/${ticketId}`
  if (baseDomain && siteName) {
    url = `https://${siteName}.${baseDomain}${url}`
  }
  
  console.log('🔑 [Tickets API] → GET ticket details:', url)
  
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
    console.error('❌ [Tickets API] Failed to fetch ticket:', errorData)
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  const data = await response.json()
  console.log('✅ [Tickets API] ← Ticket details received:', {
    id: data.id || data.ticket?.id,
    status: data.status || data.ticket?.status,
    keys: Object.keys(data)
  })
  return data
}

/**
 * Изменить статус тикета
 */
export const updateTicketStatus = async (siteToken, ticketId, status, baseDomain, siteName) => {
  let url = `${BASE_URL}/${ticketId}/status`
  if (baseDomain && siteName) {
    url = `https://${siteName}.${baseDomain}${url}`
  }
  
  console.log('🔑 [Tickets API] → PATCH ticket status:', url, { status })
  
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
    console.error('❌ [Tickets API] Failed to update status:', errorData)
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  const data = await response.json()
  console.log('✅ [Tickets API] ← Status updated:', {
    id: data.id || data.ticket?.id,
    status: data.status || data.ticket?.status,
    keys: Object.keys(data),
    fullResponse: data
  })
  return data
}

/**
 * Добавить ответ администратора
 */
export const addAdminResponse = async (siteToken, ticketId, message, status = null, baseDomain, siteName) => {
  let url = `${BASE_URL}/${ticketId}/messages`
  if (baseDomain && siteName) {
    url = `https://${siteName}.${baseDomain}${url}`
  }
  
  const body = { message }
  if (status) body.status = status

  console.log('🔑 [Tickets API] → POST admin response:', url, { messageLength: message.length, status })
  
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
    console.error('❌ [Tickets API] Failed to add response:', errorData)
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  const data = await response.json()
  console.log('✅ [Tickets API] ← Admin response added:', {
    id: data.id || data.ticket?.id,
    keys: Object.keys(data),
    fullResponse: data
  })
  return data
}

/**
 * Разрешить тикет (resolve)
 */
export const resolveTicket = async (siteToken, ticketId, resolutionNotes, baseDomain, siteName) => {
  let url = `${BASE_URL}/${ticketId}/resolve`
  if (baseDomain && siteName) {
    url = `https://${siteName}.${baseDomain}${url}`
  }
  
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
export const closeTicket = async (siteToken, ticketId, baseDomain, siteName) => {
  let url = `${BASE_URL}/${ticketId}/close`
  if (baseDomain && siteName) {
    url = `https://${siteName}.${baseDomain}${url}`
  }
  
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
export const fetchTicketsStats = async (siteToken, baseDomain, siteName) => {
  let url = `${BASE_URL}/stats/dashboard`
  if (baseDomain && siteName) {
    url = `https://${siteName}.${baseDomain}${url}`
  }
  
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
 * Получить статистику непрочитанных сообщений/тикетов админом
 * GET /admin/support/tickets/unread/stats
 */
export const fetchUnreadStats = async (siteToken, baseDomain, siteName) => {
  let url = `${BASE_URL}/unread/stats`
  if (baseDomain && siteName) {
    url = `https://${siteName}.${baseDomain}${url}`
  }

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
 * Отметить все сообщения в тикете как прочитанные админом
 * POST /admin/support/tickets/{ticket_id}/mark-read
 */
export const markTicketAsRead = async (siteToken, ticketId, baseDomain, siteName) => {
  let url = `${BASE_URL}/${ticketId}/mark-read`
  if (baseDomain && siteName) {
    url = `https://${siteName}.${baseDomain}${url}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return await response.json()
}

/**
 * Отметить конкретное сообщение как прочитанное админом
 * POST /admin/support/tickets/messages/{message_id}/mark-read
 */
export const markMessageAsRead = async (siteToken, messageId, baseDomain, siteName) => {
  let url = `${BASE_URL}/messages/${messageId}/mark-read`
  if (baseDomain && siteName) {
    url = `https://${siteName}.${baseDomain}${url}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${siteToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}`)
  }

  return await response.json()
}
