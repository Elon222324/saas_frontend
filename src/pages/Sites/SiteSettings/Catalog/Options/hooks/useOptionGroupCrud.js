import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useOptionGroupCrud(siteName) {
  const qc = useQueryClient()

  const add = useMutation({
    mutationFn: async ({ name, slug }) => {
      const res = await fetch(`${API_URL}/options/${siteName}/groups`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      })
      if (!res.ok) throw new Error('Ошибка создания группы')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['options', siteName] }),
  })

  const update = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await fetch(`${API_URL}/options/${siteName}/groups/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Ошибка обновления группы')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['options', siteName] }),
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/options/${siteName}/groups/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Ошибка удаления группы')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['options', siteName] }),
  })

  return { add, update, remove }
}
