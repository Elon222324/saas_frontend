import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useExtraGroupCrud(siteName) {
  const qc = useQueryClient()

  const add = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_URL}/extras/${siteName}/groups`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Ошибка создания группы добавок')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['extraGroups', siteName] }),
  })

  const update = useMutation({
    mutationFn: async ({ id, ...rest }) => {
      const res = await fetch(`${API_URL}/extras/${siteName}/groups/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      })
      if (!res.ok) throw new Error('Ошибка обновления группы добавок')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['extraGroups', siteName] }),
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/extras/${siteName}/groups/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Ошибка удаления группы добавок')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['extraGroups', siteName] }),
  })

  return { add, update, remove }
}
