import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../context/SiteSettingsContext'

export function useOptionGroupCrud(siteName) {
  const qc = useQueryClient()
  const { siteToken } = useSiteSettings()

  // Убираем суффикс _app для нового API
  const siteNameForApi = siteName.replace('_app', '')
  const baseApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/options/groups/`

  /* CREATE ------------------------------------------------------------------ */
  const add = useMutation({
    mutationFn: async (payload) => {
      console.log('🔑 [useOptionGroupCrud] → создаю группу:', baseApiUrl)
      console.log('🔑 [useOptionGroupCrud] → данные:', payload)

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token
      if (!adminToken) {
        console.error('❌ [useOptionGroupCrud] Админский токен сайта отсутствует (create)')
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

      console.log('🔑 [useOptionGroupCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useOptionGroupCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        throw new Error(`Ошибка создания группы опций: ${res.status} ${res.statusText}`)
      }

      const result = await res.json()
      console.log('✅ [useOptionGroupCrud] ← создана группа:', result)
      return result
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['optionGroups', siteName] }),
  })

  /* UPDATE ------------------------------------------------------------------ */
  const update = useMutation({
    mutationFn: async ({ id, ...rest }) => {
      const updateUrl = `${baseApiUrl}${id}`
      console.log('🔑 [useOptionGroupCrud] → обновляю группу:', updateUrl)
      console.log('🔑 [useOptionGroupCrud] → данные:', rest)

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token
      if (!adminToken) {
        console.error('❌ [useOptionGroupCrud] Админский токен сайта отсутствует (update)')
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

      console.log('🔑 [useOptionGroupCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useOptionGroupCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 404) {
          console.error('❌ [useOptionGroupCrud] Группа не найдена (404)')
          throw new Error('Группа не найдена')
        }
        throw new Error(`Ошибка обновления группы опций: ${res.status} ${res.statusText}`)
      }

      const result = await res.json()
      console.log('✅ [useOptionGroupCrud] ← обновлена группа:', result)
      return result
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['optionGroups', siteName] }),
  })

  /* DELETE ------------------------------------------------------------------ */
  const remove = useMutation({
    mutationFn: async (id) => {
      const deleteUrl = `${baseApiUrl}${id}`
      console.log('🔑 [useOptionGroupCrud] → удаляю группу:', deleteUrl)

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token
      if (!adminToken) {
        console.error('❌ [useOptionGroupCrud] Админский токен сайта отсутствует (delete)')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        credentials: 'include',
      })

      console.log('🔑 [useOptionGroupCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useOptionGroupCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 404) {
          console.error('❌ [useOptionGroupCrud] Группа не найдена (404)')
          throw new Error('Группа не найдена')
        }
        throw new Error(`Ошибка удаления группы опций: ${res.status} ${res.statusText}`)
      }

      console.log('✅ [useOptionGroupCrud] ← группа удалена')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['optionGroups', siteName] }),
  })

  /* экспортируем все три операции */
  return { add, update, remove }
}
