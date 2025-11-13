import { useQuery } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../context/SiteSettingsContext'

export function useReviews(siteName, filters = {}, options = {}) {
  const { siteToken } = useSiteSettings()

  return useQuery({
    queryKey: ['reviews', siteName, siteToken, filters],
    enabled: Boolean(siteToken) && (options?.enabled ?? true),
    queryFn: async () => {
      const siteNameForApi = siteName.replace('_app', '')
      
      // Построение параметров запроса
      const queryParams = new URLSearchParams()
      
      if (filters.status) {
        queryParams.append('status', filters.status)
      }
      if (filters.limit) {
        queryParams.append('limit', filters.limit)
      } else {
        queryParams.append('limit', 50)
      }
      if (filters.offset) {
        queryParams.append('offset', filters.offset)
      } else {
        queryParams.append('offset', 0)
      }

      const newApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/api/admin/reviews?${queryParams.toString()}`
      
      console.log('📝 [useReviews] → запрашиваю API:', newApiUrl)

      if (!siteToken) {
        console.error('❌ [useReviews] Админский токен сайта отсутствует')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(newApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('📝 [useReviews] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useReviews] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Не удалось получить отзывы: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      console.log('✅ [useReviews] ← получено отзывов:', data?.length || 0)

      return Array.isArray(data) ? data : []
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

