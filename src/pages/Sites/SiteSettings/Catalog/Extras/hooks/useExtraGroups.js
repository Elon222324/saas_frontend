import { useQuery } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../context/SiteSettingsContext'

export function useExtraGroups(siteName, options = {}) {
  const { siteToken } = useSiteSettings()

  return useQuery({
    queryKey: ['extraGroups', siteName, siteToken],
    enabled: Boolean(siteToken) && (options?.enabled ?? true),
    queryFn: async () => {
      // Убираем суффикс _app для нового API
      const siteNameForApi = siteName.replace('_app', '')
      const newApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/extras/groups/`

      console.log('🔑 [useExtraGroups] → запрашиваю новый API:', newApiUrl)

      // Используем ТОЛЬКО админский токен сайта из контекста
      if (!siteToken) {
        console.error('❌ [useExtraGroups] Админский токен сайта отсутствует')
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

      console.log('🔑 [useExtraGroups] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useExtraGroups] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Не удалось получить группы добавок: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      console.log('✅ [useExtraGroups] ← получено групп:', data?.length || 0)

      return data
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
