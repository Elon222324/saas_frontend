// src/pages/Sites/SiteSettings/Products/hooks/useCategoryCrud.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import slugify from 'slugify'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useCategoryCrud(siteName) {
  const qc = useQueryClient()

  /* CREATE ------------------------------------------------------------------ */
  const add = useMutation({
    mutationFn: async ({ name, parent_id }) => {
      const body = {
        code: slugify(name, { lower: true, locale: 'ru' }),
        name,
        parent_id,
      }
      const res = await fetch(
        `${API_URL}/products/${siteName}/categories/add`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      )
      if (!res.ok) throw new Error('Ошибка создания категории')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories', siteName] }),
  })

  /* UPDATE ------------------------------------------------------------------ */
  const update = useMutation({
    mutationFn: async ({ id, name, parent_id }) => {
      const body = {
        code: slugify(name, { lower: true, locale: 'ru' }),
        name,
        parent_id,
      }
      const res = await fetch(
        `${API_URL}/products/${siteName}/categories/update/${id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      )
      if (!res.ok) throw new Error('Ошибка обновления категории')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories', siteName] }),
  })

  /* DELETE ------------------------------------------------------------------ */
  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        `${API_URL}/products/${siteName}/categories/delete/${id}`,
        { method: 'DELETE', credentials: 'include' },
      )
      if (!res.ok) throw new Error('Ошибка удаления категории')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories', siteName] }),
  })

  /* экспортируем все три операции */
  return { add, update, remove }
}
