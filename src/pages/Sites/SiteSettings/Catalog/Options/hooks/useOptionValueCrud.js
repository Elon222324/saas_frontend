import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useOptionValueCrud(siteName) {
  const qc = useQueryClient()

  const add = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_URL}/options/${siteName}/values`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Ошибка создания значения опции')
      return res.json()
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['optionValues', siteName, vars.group_id] }),
  })

  const update = useMutation({
    mutationFn: async ({ id, group_id, ...rest }) => {
      const res = await fetch(`${API_URL}/options/${siteName}/values/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      })
      if (!res.ok) throw new Error('Ошибка обновления значения опции')
      return res.json().catch(() => null)
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['optionValues', siteName, vars.group_id] }),
  })

  const remove = useMutation({
    mutationFn: async ({ id, group_id }) => {
      const res = await fetch(`${API_URL}/options/${siteName}/values/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Ошибка удаления значения опции')
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ['optionValues', siteName, vars.group_id] }),
  })

  return { add, update, remove }
}
