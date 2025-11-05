import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/axios'
import { useSiteTokenString } from '@/hooks/useSiteToken'
import PageLayout from '@/components/PageTemplate/PageLayout'
import TicketsHeader from './components/TicketsHeader'
import TicketsSidebar from './components/TicketsSidebar'
import TicketsList from './components/TicketsList'
import TicketDetailsModal from './components/TicketDetailsModal'
import { fetchTickets } from './api/tickets'
import { fetchUnreadStats } from './api/tickets'

export default function TicketsPage() {
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState('')
  const [tickets, setTickets] = useState([])
  const [loadingSites, setLoadingSites] = useState(true)
  const [loadingTickets, setLoadingTickets] = useState(false)
  const [limit, setLimit] = useState(50)
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState('')
  const [detailsTicket, setDetailsTicket] = useState(null)
  const [unreadStats, setUnreadStats] = useState(null)
  const [unreadByTicket, setUnreadByTicket] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [selectedPriorities, setSelectedPriorities] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const baseDomain = import.meta.env.VITE_BASE_DOMAIN
  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'

  const stripAppSuffix = (value) => {
    if (!value) return value
    return value.endsWith(containerSuffix) ? value.slice(0, -containerSuffix.length) : value
  }

  // 🔑 Получаем токен сайта
  const siteNameForToken = useMemo(() => stripAppSuffix(selectedSite), [selectedSite, containerSuffix])
  const { token: siteToken, isLoading: tokenLoading, error: tokenError } = useSiteTokenString(
    siteNameForToken,
    { enabled: Boolean(siteNameForToken) }
  )

  // User token для старых эндпоинтов (список сайтов)
  const authHeaders = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  }), [])

  // Подсчет тикетов по статусам
  const statusCounts = useMemo(() => {
    const counts = {
      new: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
    }

    tickets.forEach(ticket => {
      const status = String(ticket.status || '').toLowerCase()
      if (counts.hasOwnProperty(status)) {
        counts[status]++
      }
    })

    return counts
  }, [tickets])

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
      console.error('❌ [Tickets] Ошибка загрузки сайтов:', e)
      setError('Не удалось загрузить список сайтов')
    } finally {
      setLoadingSites(false)
    }
  }

  const fetchTicketsList = async () => {
    if (!selectedSite || !siteToken) {
      console.log('⏳ [Tickets] Ожидаем токен сайта...')
      return
    }

    setLoadingTickets(true)
    setError('')
    try {
      const siteForUrl = stripAppSuffix(selectedSite)
      const siteApiUrl = `https://${siteForUrl}.${baseDomain}`

      console.log('🔑 [Tickets] → Запрашиваю API:', siteApiUrl)
      console.log('🔑 [Tickets] → Токен сайта:', siteToken ? 'получен' : 'отсутствует')

      const params = { limit, offset }
      if (searchQuery) params.search = searchQuery
      if (selectedStatuses.length > 0) params.status = selectedStatuses.join(',')
      if (selectedPriorities.length > 0) params.priority = selectedPriorities.join(',')
      if (selectedCategories.length > 0) params.category = selectedCategories.join(',')

      console.log('📋 [Tickets] Параметры запроса:', params)

      // Используем fetch вместо api.get, чтобы обойти базовый URL
      const queryString = new URLSearchParams(params).toString()
      const fullUrl = `${siteApiUrl}/site-api/admin/support/tickets?${queryString}`
      console.log('🔑 [Tickets] → Полный URL:', fullUrl)

      const res = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('🔑 [Tickets] ← Статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`
        try {
          const errorData = await res.json()
          console.error('❌ [Tickets] ← Детали ошибки сервера:', errorData)

          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          } else if (errorData.detail) {
            errorMessage = errorData.detail
          }
        } catch (e) {
          console.error('❌ [Tickets] ← Не удалось прочитать детали ошибки:', e)
        }

        if (res.status === 401) {
          throw new Error('Ошибка аутентификации. Токен сайта недействителен или истек.')
        } else if (res.status === 403) {
          throw new Error('Доступ запрещен. Недостаточно прав для просмотра тикетов.')
        } else if (res.status === 404) {
          throw new Error('API тикетов не найден.')
        }

        throw new Error(`Не удалось получить тикеты: ${errorMessage}`)
      }

      const data = await res.json()
      console.log('🍀 [Tickets] ← Полный ответ API:', data)

      const ticketsList = Array.isArray(data) ? data : (data?.tickets || data?.results || data?.data || [])
      console.log('✅ [Tickets] ← Получено тикетов:', ticketsList.length)

      setTickets(ticketsList)
    } catch (e) {
      console.error('❌ [Tickets] Ошибка при получении тикетов:', e)

      let userMessage = 'Не удалось загрузить тикеты'
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
      setLoadingTickets(false)
    }
  }

  const fetchUnread = async () => {
    if (!selectedSite || !siteToken) return
    try {
      const siteForUrl = stripAppSuffix(selectedSite)
      const stats = await fetchUnreadStats(siteToken, baseDomain, siteForUrl)
      setUnreadStats(stats)
      const map = {}
      ;(stats?.unread_by_ticket || []).forEach((item) => {
        map[item.ticket_id] = item.unread_count || 0
      })
      setUnreadByTicket(map)
    } catch (e) {
      // тихо логируем, не ломаем UI списка
      console.warn('⚠️ [Tickets] Не удалось получить статистику непрочитанных:', e)
    }
  }

  const onToggleStatus = (value) => {
    setSelectedStatuses((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const onTogglePriority = (value) => {
    setSelectedPriorities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const onToggleCategory = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const onApplyFilters = () => {
    setOffset(0)
    fetchTicketsList()
  }

  const canPrev = offset > 0
  const canNext = tickets.length >= limit

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

  // Обновляем тикеты когда токен готов
  useEffect(() => {
    if (siteToken) {
      fetchTicketsList()
      fetchUnread()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSite, limit, offset, siteToken])

  // Пулинг статистики непрочитанных
  useEffect(() => {
    if (!siteToken || !selectedSite) return
    const id = setInterval(() => {
      fetchUnread()
    }, 5000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteToken, selectedSite])

  useEffect(() => {
    if (tokenError) {
      console.error('❌ [Tickets] Ошибка получения токена:', tokenError)
      setError(`Не удалось получить токен для сайта: ${tokenError.message}`)
    }
  }, [tokenError])

  return (
    <PageLayout
      backgroundGradient="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      header={
        <TicketsHeader
          sites={sites}
          selectedSite={selectedSite}
          onChangeSite={setSelectedSite}
          loadingSites={loadingSites}
          limit={limit}
          onChangeLimit={setLimit}
          offset={offset}
          onChangeOffset={setOffset}
          onSearch={fetchTicketsList}
          baseDomain={baseDomain}
          stripAppSuffix={stripAppSuffix}
          searchQuery={searchQuery}
          onChangeSearch={setSearchQuery}
        />
      }
      sidebar={
        <TicketsSidebar
          selectedStatuses={selectedStatuses}
          onToggleStatus={onToggleStatus}
          selectedPriorities={selectedPriorities}
          onTogglePriority={onTogglePriority}
          selectedCategories={selectedCategories}
          onToggleCategory={onToggleCategory}
          onApply={onApplyFilters}
          statusCounts={statusCounts}
        />
      }
      content={
        <>
          <TicketsList
            tickets={tickets}
            loading={loadingTickets}
            error={error}
            onDetails={setDetailsTicket}
            unreadByTicket={unreadByTicket}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            canPrev={canPrev}
            canNext={canNext}
          />

          {detailsTicket && (
            <TicketDetailsModal
              ticketId={detailsTicket}
              siteToken={siteToken}
              baseDomain={baseDomain}
              siteName={selectedSite}
              onClose={() => setDetailsTicket(null)}
              refreshTickets={() => {
                fetchTicketsList()
                fetchUnread()
              }}
            />
          )}
        </>
      }
    />
  )
}
