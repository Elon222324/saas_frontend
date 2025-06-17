import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useProductCrud(siteName) {
  const qc = useQueryClient()

  const add = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_URL}/products/${siteName}/add`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Ошибка создания товара')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products', siteName] }),
  })

  const update = useMutation({
    mutationFn: async ({ id, ...rest }) => {
      const res = await fetch(`${API_URL}/products/${siteName}/update/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      })
      if (!res.ok) throw new Error('Ошибка обновления товара')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products', siteName] }),
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/products/${siteName}/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Ошибка удаления товара')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products', siteName] }),
  })

  return { add, update, remove }
}
