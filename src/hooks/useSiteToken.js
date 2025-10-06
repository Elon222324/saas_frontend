import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL

/**
 * Централизованный хук для получения токена сайта
 * 
 * @param {string} siteName - имя сайта БЕЗ суффикса _app (например, 't4a')
 * @param {Object} options - дополнительные опции для useQuery
 * @returns {Object} { data: string (token), isLoading: boolean, error: Error, refetch: function }
 * 
 * @example
 * const { data: token, isLoading } = useSiteToken('t4a')
 * if (!isLoading && token) {
 *   // Используем токен в запросах
 * }
 */
export function useSiteToken(siteName, options = {}) {
  return useQuery({
    queryKey: ['siteToken', siteName],
    enabled: Boolean(siteName) && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // Кеш на 5 минут
    cacheTime: 10 * 60 * 1000, // Храним в памяти 10 минут
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    queryFn: async () => {
      console.log('🔑 [useSiteToken] → Получаем токен для сайта:', siteName)
      
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        throw new Error('Отсутствует access_token пользователя')
      }

      // Пробуем получить админский токен (содержит user_id)
      let response = await fetch(`${API_URL}/user/admin-token/${siteName}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }).catch(() => null)

      // Fallback на site-token если admin-token недоступен
      if (!response || !response.ok) {
        console.log('🔄 [useSiteToken] → Fallback на site-token')
        response = await fetch(`${API_URL}/user/site-token/${siteName}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const tokenData = await response.json()
      
      // Нормализуем токен в единый формат
      const normalizedToken = typeof tokenData === 'string'
        ? tokenData
        : (tokenData.token || tokenData.access_token || tokenData.site_token || tokenData.admin_token || null)

      if (!normalizedToken) {
        throw new Error('Не удалось извлечь токен из ответа')
      }

      console.log('✅ [useSiteToken] ← Токен получен для:', siteName)
      
      // Пытаемся прочитать payload для логирования
      try {
        const payloadPart = normalizedToken.split('.')[1]
        const json = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')))
        console.log('🧾 [useSiteToken] Claims:', { 
          user_id: json.user_id, 
          site_name: json.site_name, 
          exp: new Date(json.exp * 1000).toLocaleString() 
        })
      } catch (e) {
        // Игнорируем ошибки парсинга
      }

      return normalizedToken
    },
    ...options,
  })
}

/**
 * Хелпер для получения токена с более удобным API
 * Возвращает { token, isLoading, error } вместо { data, isLoading, error }
 */
export function useSiteTokenString(siteName, options = {}) {
  const { data: token, isLoading, error, refetch } = useSiteToken(siteName, options)
  return { token, isLoading, error, refetch }
}

