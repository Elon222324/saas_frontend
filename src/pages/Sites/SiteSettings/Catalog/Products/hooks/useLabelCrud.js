// FILE: src/pages/Sites/SiteSettings/Products/hooks/useLabelCrud.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../context/SiteSettingsContext'

export function useLabelCrud(siteName) {
  const qc = useQueryClient()
  const { siteToken } = useSiteSettings()

  // Убираем суффикс _app для нового API
  const siteNameForApi = siteName.replace('_app', '')
  const baseApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/labels/`

  /* CREATE ------------------------------------------------------------------ */
  const add = useMutation({
    mutationFn: async (labelData) => {
      console.log('🔑 [useLabelCrud] → создаю метку:', baseApiUrl)
      console.log('🔑 [useLabelCrud] → данные:', labelData)

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token
      if (!adminToken) {
        console.error('❌ [useLabelCrud] Админский токен сайта отсутствует (create)')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(baseApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(labelData),
      })

      console.log('🔑 [useLabelCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useLabelCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `Ошибка создания метки: ${res.status} ${res.statusText}`)
      }

      const result = await res.json()
      console.log('✅ [useLabelCrud] ← создана метка:', result)
      return result
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels', siteName] }),
  })

  /* UPDATE ------------------------------------------------------------------ */
  const update = useMutation({
    mutationFn: async ({ id, ...labelData }) => {
      const updateUrl = `${baseApiUrl}${id}`
      console.log('🔑 [useLabelCrud] → обновляю метку:', updateUrl)
      console.log('🔑 [useLabelCrud] → данные:', labelData)

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token
      if (!adminToken) {
        console.error('❌ [useLabelCrud] Админский токен сайта отсутствует (update)')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(labelData),
      })

      console.log('🔑 [useLabelCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useLabelCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 404) {
          console.error('❌ [useLabelCrud] Метка не найдена (404)')
          throw new Error('Метка не найдена')
        }
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `Ошибка обновления метки: ${res.status} ${res.statusText}`)
      }

      const result = await res.json()
      console.log('✅ [useLabelCrud] ← обновлена метка:', result)
      return result
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['labels', siteName] })
    },
  })

  /* DELETE ------------------------------------------------------------------ */
  const remove = useMutation({
    mutationFn: async (id) => {
      const deleteUrl = `${baseApiUrl}${id}`
      console.log('🔑 [useLabelCrud] → удаляю метку:', deleteUrl)

      // Используем ТОЛЬКО админский токен сайта из контекста
      const adminToken = siteToken?.token
      if (!adminToken) {
        console.error('❌ [useLabelCrud] Админский токен сайта отсутствует (delete)')
        throw new Error('Токен сайта не получен')
      }

      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        credentials: 'include',
      })

      console.log('🔑 [useLabelCrud] ← статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useLabelCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 404) {
          console.error('❌ [useLabelCrud] Метка не найдена (404)')
          throw new Error('Метка не найдена')
        }
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `Ошибка удаления метки: ${res.status} ${res.statusText}`)
      }

      console.log('✅ [useLabelCrud] ← метка удалена')
      return res.json().catch(() => null)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels', siteName] }),
  })

  /* FETCH ALL LABELS -------------------------------------------------------- */
  const getLabels = async () => {
    console.log('🔑 [useLabelCrud] → запрашиваю метки:', baseApiUrl)

    // Используем ТОЛЬКО админский токен сайта из контекста
    const adminToken = siteToken?.token
    if (!adminToken) {
      console.error('❌ [useLabelCrud] Админский токен сайта отсутствует (fetch)')
      throw new Error('Токен сайта не получен')
    }

    const res = await fetch(baseApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    console.log('🔑 [useLabelCrud] ← статус ответа:', res.status, res.statusText)

    if (!res.ok) {
      if (res.status === 401) {
        console.error('❌ [useLabelCrud] Ошибка аутентификации (401)')
        throw new Error('Ошибка аутентификации. Проверьте токен.')
      }
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Ошибка загрузки меток: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    console.log('✅ [useLabelCrud] ← получено меток:', data?.length || 0)
    return data
  }

  return { add, update, remove, getLabels }
}