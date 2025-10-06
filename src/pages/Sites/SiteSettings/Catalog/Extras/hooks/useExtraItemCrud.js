import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../context/SiteSettingsContext'

export function useExtraItemCrud(siteName) {
  const qc = useQueryClient()
  const { siteToken } = useSiteSettings()

  // Убираем суффикс _app для нового API
  const siteNameForApi = siteName.replace('_app', '')
  const baseApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/extras/items/`

  /* CREATE ------------------------------------------------------------------ */
  const add = useMutation({
    mutationFn: async (payload) => {
      console.log('🔑 [useExtraItemCrud] → создаю элемент:', baseApiUrl)
      console.log('🔑 [useExtraItemCrud] → данные:', payload)

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token
      if (!adminToken) {
        console.error('❌ [useExtraItemCrud] Админский токен сайта отсутствует (create)')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(baseApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      console.log('🔑 [useExtraItemCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useExtraItemCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Ошибка создания элемента добавки: ${res.status} ${res.statusText}`)
      }

      const result = await res.json()
      console.log('✅ [useExtraItemCrud] ← создан элемент:', result)
      return result
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['extraItems', siteName, vars.group_id] }),
  })

  /* UPDATE ------------------------------------------------------------------ */
  const update = useMutation({
    mutationFn: async ({ id, group_id, ...rest }) => {
      const updateUrl = `${baseApiUrl}${id}`
      console.log('🔑 [useExtraItemCrud] → обновляю элемент:', updateUrl)
      console.log('🔑 [useExtraItemCrud] → данные:', rest)

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token
      if (!adminToken) {
        console.error('❌ [useExtraItemCrud] Админский токен сайта отсутствует (update)')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(rest),
      })

      console.log('🔑 [useExtraItemCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useExtraItemCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 404) {
          console.error('❌ [useExtraItemCrud] Элемент не найден (404)')
          throw new Error('Элемент не найден')
        }
        throw new Error(`Ошибка обновления элемента добавки: ${res.status} ${res.statusText}`)
      }

      const result = await res.json().catch(() => null)
      console.log('✅ [useExtraItemCrud] ← обновлен элемент:', result)
      return result
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['extraItems', siteName, vars.group_id] }),
  })

  /* DELETE ------------------------------------------------------------------ */
  const remove = useMutation({
    mutationFn: async ({ id, group_id }) => {
      const deleteUrl = `${baseApiUrl}${id}`
      console.log('🔑 [useExtraItemCrud] → удаляю элемент:', deleteUrl)

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token
      if (!adminToken) {
        console.error('❌ [useExtraItemCrud] Админский токен сайта отсутствует (delete)')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        credentials: 'include',
      })

      console.log('🔑 [useExtraItemCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useExtraItemCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 404) {
          console.error('❌ [useExtraItemCrud] Элемент не найден (404)')
          throw new Error('Элемент не найден')
        }
        throw new Error(`Ошибка удаления элемента добавки: ${res.status} ${res.statusText}`)
      }

      console.log('✅ [useExtraItemCrud] ← элемент удален')
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['extraItems', siteName, vars.group_id] }),
  })

  /* экспортируем все три операции */
  return { add, update, remove }
}
