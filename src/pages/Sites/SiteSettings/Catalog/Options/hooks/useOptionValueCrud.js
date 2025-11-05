import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../context/SiteSettingsContext'

export function useOptionValueCrud(siteName) {
  const qc = useQueryClient()
  const { siteToken } = useSiteSettings()

  // Убираем суффикс _app для нового API
  const siteNameForApi = siteName.replace('_app', '')
  const baseApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/options/values/`

  /* CREATE ------------------------------------------------------------------ */
  const add = useMutation({
    mutationFn: async (payload) => {
      console.log('🔑 [useOptionValueCrud] → создаю значение:', baseApiUrl)
      console.log('🔑 [useOptionValueCrud] → данные:', payload)

      // Используем ТОЛЬКО админский токен сайта из контекста
      if (!siteToken) {
        console.error('❌ [useOptionValueCrud] Админский токен сайта отсутствует (create)')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(baseApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      console.log('🔑 [useOptionValueCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useOptionValueCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Ошибка создания значения опции: ${res.status} ${res.statusText}`)
      }

      const result = await res.json()
      console.log('✅ [useOptionValueCrud] ← создано значение:', result)
      return result
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['optionValues', siteName, vars.group_id] }),
  })

  /* UPDATE ------------------------------------------------------------------ */
  const update = useMutation({
    mutationFn: async ({ id, group_id, ...rest }) => {
      const updateUrl = `${baseApiUrl}${id}`
      console.log('🔑 [useOptionValueCrud] → обновляю значение:', updateUrl)
      console.log('🔑 [useOptionValueCrud] → данные:', rest)

      // Используем ТОЛЬКО админский токен сайта из контекста
      if (!siteToken) {
        console.error('❌ [useOptionValueCrud] Админский токен сайта отсутствует (update)')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(rest),
      })

      console.log('🔑 [useOptionValueCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useOptionValueCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 404) {
          console.error('❌ [useOptionValueCrud] Значение не найдено (404)')
          throw new Error('Значение не найдено')
        }
        throw new Error(`Ошибка обновления значения опции: ${res.status} ${res.statusText}`)
      }

      const result = await res.json().catch(() => null)
      console.log('✅ [useOptionValueCrud] ← обновлено значение:', result)
      return result
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['optionValues', siteName, vars.group_id] }),
  })

  /* DELETE ------------------------------------------------------------------ */
  const remove = useMutation({
    mutationFn: async ({ id, group_id }) => {
      const deleteUrl = `${baseApiUrl}${id}`
      console.log('🔑 [useOptionValueCrud] → удаляю значение:', deleteUrl)

      // Используем ТОЛЬКО админский токен сайта из контекста
      if (!siteToken) {
        console.error('❌ [useOptionValueCrud] Админский токен сайта отсутствует (delete)')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
        },
        credentials: 'include',
      })

      console.log('🔑 [useOptionValueCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useOptionValueCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 404) {
          console.error('❌ [useOptionValueCrud] Значение не найдено (404)')
          throw new Error('Значение не найдено')
        }
        throw new Error(`Ошибка удаления значения опции: ${res.status} ${res.statusText}`)
      }

      console.log('✅ [useOptionValueCrud] ← значение удалено')
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['optionValues', siteName, vars.group_id] }),
  })

  /* экспортируем все три операции */
  return { add, update, remove }
}
