import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useLabelCrud(siteName) {
  const qc = useQueryClient()

  const add = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_URL}/products/${siteName}/labels/add`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Ошибка создания метки')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels', siteName] }),
  })

  const update = useMutation({
    mutationFn: async ({ id, ...rest }) => {
      const res = await fetch(`${API_URL}/products/${siteName}/labels/update/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      })
      if (!res.ok) throw new Error('Ошибка обновления метки')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels', siteName] }),
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/products/${siteName}/labels/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Ошибка удаления метки')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labels', siteName] }),
  })

  return { add, update, remove }
}
