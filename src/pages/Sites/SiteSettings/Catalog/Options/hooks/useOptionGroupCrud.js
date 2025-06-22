import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useOptionGroupCrud(siteName) {
  const qc = useQueryClient()

  const add = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_URL}/options/${siteName}/groups`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Ошибка создания группы опций')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['optionGroups', siteName] }),
  })

  const update = useMutation({
    mutationFn: async ({ id, ...rest }) => {
      const res = await fetch(`${API_URL}/options/${siteName}/groups/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      })
      if (!res.ok) throw new Error('Ошибка обновления группы опций')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['optionGroups', siteName] }),
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/options/${siteName}/groups/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Ошибка удаления группы опций')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['optionGroups', siteName] }),
  })

  return { add, update, remove }
}
