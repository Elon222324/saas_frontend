// src/pages/Sites/SiteSettings/Products/hooks/useProducts.js
import { useQuery } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../context/SiteSettingsContext'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useProducts(siteName, options = {}) {
  const { siteToken } = useSiteSettings()
  
  return useQuery({
    queryKey: ['products', siteName, siteToken?.token],
    enabled: Boolean(siteToken?.token) && (options?.enabled ?? true),
    /** -------------  здесь основной fetch ------------- **/
    queryFn: async () => {
      // Убираем суффикс _app для нового API
      const siteNameForApi = siteName.replace('_app', '')
      const newApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/products/`
      
      console.log('🔑 [useProducts] → запрашиваю новый API:', newApiUrl)
      console.log('🔑 [useProducts] → используем админский JWT токен для аутентификации')

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token
      if (!adminToken) {
        console.error('❌ [useProducts] Админский токен сайта отсутствует')
        throw new Error('Токен сайта не получен')
      }

      // Пытаемся прочитать клеймы токена (base64url) для проверки user_id и site_name
      try {
        const payloadPart = adminToken.split('.')[1]
        const json = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')))
        console.log('🧾 [useProducts] Claims:', { user_id: json.user_id, site_name: json.site_name, exp: json.exp })
      } catch {}

      const res = await fetch(newApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('🔑 [useProducts] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useProducts] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Не удалось получить товары: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      console.log('✅ [useProducts] ← получено товаров:', data?.length || 0)

      return data
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
