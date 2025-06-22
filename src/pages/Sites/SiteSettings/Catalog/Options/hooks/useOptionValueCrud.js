import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useOptionValueCrud(siteName) {
  const qc = useQueryClient()

  const add = useMutation({
    mutationFn: async ({ group_id, value }) => {
      const res = await fetch(`${API_URL}/options/${siteName}/values`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id, value }),
      })
      if (!res.ok) throw new Error('Ошибка создания значения')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['options', siteName] }),
  })

  const update = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await fetch(`${API_URL}/options/${siteName}/values/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Ошибка обновления значения')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['options', siteName] }),
  })

  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/options/${siteName}/values/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Ошибка удаления значения')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['options', siteName] }),
  })

  return { add, update, remove }
}
