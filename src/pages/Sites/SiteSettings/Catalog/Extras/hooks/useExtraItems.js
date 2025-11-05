import { useQuery } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../context/SiteSettingsContext'

export function useExtraItems(siteName, groupId, options = {}) {
  const { siteToken } = useSiteSettings()

  return useQuery({
    queryKey: ['extraItems', siteName, groupId, siteToken],
    enabled: Boolean(siteToken) && (options?.enabled ?? true),
    queryFn: async () => {
      // Убираем суффикс _app для нового API
      const siteNameForApi = siteName.replace('_app', '')
      const baseUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/extras/items/`
      const newApiUrl = groupId ? `${baseUrl}?group_id=${groupId}` : baseUrl

      console.log('🔑 [useExtraItems] → запрашиваю новый API:', newApiUrl)

      // Используем ТОЛЬКО админский токен сайта из контекста
      if (!siteToken) {
        console.error('❌ [useExtraItems] Админский токен сайта отсутствует')
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

      console.log('🔑 [useExtraItems] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useExtraItems] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Не удалось получить элементы добавок: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      console.log('✅ [useExtraItems] ← получено элементов:', data?.length || 0)

      return data
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
