import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useExtraItemCrud(siteName) {
  const qc = useQueryClient()

  const add = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_URL}/extras/${siteName}/items`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Ошибка создания элемента добавки')
      return res.json()
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['extraItems', siteName, vars.group_id] }),
  })

  const update = useMutation({
    mutationFn: async ({ id, group_id, ...rest }) => {
      const res = await fetch(`${API_URL}/extras/${siteName}/items/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      })
      if (!res.ok) throw new Error('Ошибка обновления элемента добавки')
      return res.json().catch(() => null)
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['extraItems', siteName, vars.group_id] }),
  })

  const remove = useMutation({
    mutationFn: async ({ id, group_id }) => {
      const res = await fetch(`${API_URL}/extras/${siteName}/items/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Ошибка удаления элемента добавки')
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['extraItems', siteName, vars.group_id] }),
  })

  return { add, update, remove }
}
