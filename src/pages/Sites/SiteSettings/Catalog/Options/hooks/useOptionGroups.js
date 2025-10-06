import { useQuery } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../context/SiteSettingsContext'

export function useOptionGroups(siteName, options = {}) {
  const { siteToken } = useSiteSettings()

  return useQuery({
    queryKey: ['optionGroups', siteName, siteToken?.token],
    enabled: Boolean(siteToken?.token) && (options?.enabled ?? true),
    queryFn: async () => {
      // Убираем суффикс _app для нового API
      const siteNameForApi = siteName.replace('_app', '')
      const newApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/options/groups/`

      console.log('🔑 [useOptionGroups] → запрашиваю новый API:', newApiUrl)

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token
      if (!adminToken) {
        console.error('❌ [useOptionGroups] Админский токен сайта отсутствует')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(newApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('🔑 [useOptionGroups] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useOptionGroups] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Не удалось получить группы опций: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      console.log('✅ [useOptionGroups] ← получено групп:', data?.length || 0)

      return data
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
