// src/pages/Sites/SiteSettings/Products/hooks/useProductCrud.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../../context/SiteSettingsContext'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useProductCrud(siteName) {
  const qc = useQueryClient()
  const { siteToken } = useSiteSettings()

  // Убираем суффикс _app для нового API
  const siteNameForApi = siteName.replace('_app', '')
  const baseApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/admin/products/`

  /* CREATE ------------------------------------------------------------------ */
  const add = useMutation({
    mutationFn: async (payload) => {
      console.log('🔑 [useProductCrud] → создаю товар:', baseApiUrl)
      console.log('🔑 [useProductCrud] → данные:', payload)
      
      // Используем ТОЛЬКО админский токен сайта из контекста
      if (!siteToken) {
        console.error('❌ [useProductCrud] Админский токен сайта отсутствует (create)')
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
      
      console.log('🔑 [useProductCrud] ← статус ответа:', res.status, res.statusText)
      
      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useProductCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 409) {
          console.error('❌ [useProductCrud] Конфликт (409) - товар с таким slug уже существует')
          throw new Error('Товар с таким slug уже существует')
        }
        if (res.status === 400) {
          const errorData = await res.json().catch(() => null)
          console.error('❌ [useProductCrud] Ошибка валидации (400):', errorData)
          throw new Error(errorData?.detail || 'Неверные данные запроса')
        }
        throw new Error(`Ошибка создания товара: ${res.status} ${res.statusText}`)
      }
      
      const result = await res.json()
      console.log('✅ [useProductCrud] ← создан товар:', result)
      return result
    },
    onSuccess: () => {
      console.log('✅ [useProductCrud] add ✓ invalidate cache')
      qc.invalidateQueries({ queryKey: ['products', siteName] })
    },
  })

  /* UPDATE ------------------------------------------------------------------ */
  const update = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const updateUrl = `${baseApiUrl}${id}`
      console.log('🔑 [useProductCrud] → обновляю товар:', updateUrl)
      console.log('🔑 [useProductCrud] → данные:', payload)
      
      // Используем ТОЛЬКО админский токен сайта из контекста
      if (!siteToken) {
        console.error('❌ [useProductCrud] Админский токен сайта отсутствует (update)')
        throw new Error('Токен сайта не получен')
      }
      
      const res = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      
      console.log('🔑 [useProductCrud] ← статус ответа:', res.status, res.statusText)
      
      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useProductCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 404) {
          console.error('❌ [useProductCrud] Товар не найден (404)')
          throw new Error('Товар не найден')
        }
        if (res.status === 409) {
          console.error('❌ [useProductCrud] Конфликт (409) - товар с таким slug уже существует')
          throw new Error('Товар с таким slug уже существует')
        }
        if (res.status === 400) {
          const errorData = await res.json().catch(() => null)
          console.error('❌ [useProductCrud] Ошибка валидации (400):', errorData)
          throw new Error(errorData?.detail || 'Неверные данные запроса')
        }
        throw new Error(`Ошибка обновления товара: ${res.status} ${res.statusText}`)
      }
      
      const result = await res.json()
      console.log('✅ [useProductCrud] ← обновлен товар:', result)
      return result
    },
    onSuccess: () => {
      console.log('✅ [useProductCrud] update ✓ invalidate cache')
      qc.invalidateQueries({ queryKey: ['products', siteName] })
    },
  })

  /* DELETE ------------------------------------------------------------------ */
  const remove = useMutation({
    mutationFn: async (id) => {
      const deleteUrl = `${baseApiUrl}${id}`
      console.log('🔑 [useProductCrud] → удаляю товар:', deleteUrl)
      
      // Используем ТОЛЬКО админский токен сайта из контекста
      if (!siteToken) {
        console.error('❌ [useProductCrud] Админский токен сайта отсутствует (delete)')
        throw new Error('Токен сайта не получен')
      }
      
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
        },
        credentials: 'include',
      })
      
      console.log('🔑 [useProductCrud] ← статус ответа:', res.status, res.statusText)
      
      if (!res.ok) {
        if (res.status === 401) {
          console.error('❌ [useProductCrud] Ошибка аутентификации (401)')
          throw new Error('Ошибка аутентификации. Проверьте токен.')
        }
        if (res.status === 404) {
          console.error('❌ [useProductCrud] Товар не найден (404)')
          throw new Error('Товар не найден')
        }
        throw new Error(`Ошибка удаления товара: ${res.status} ${res.statusText}`)
      }
      
      console.log('✅ [useProductCrud] ← товар удален')
    },
    onSuccess: () => {
      console.log('✅ [useProductCrud] delete ✓ invalidate cache')
      qc.invalidateQueries({ queryKey: ['products', siteName] })
    },
  })

  /* экспортируем все три операции */
  return { add, update, remove }
}
