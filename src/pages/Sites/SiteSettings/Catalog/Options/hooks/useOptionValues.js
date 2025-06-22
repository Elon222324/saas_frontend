import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useOptionValues(siteName, groupId, options = {}) {
  return useQuery({
    queryKey: ['optionValues', siteName, groupId],
    queryFn: async () => {
      const url = groupId ? `${API_URL}/options/${siteName}/values?group_id=${groupId}` : `${API_URL}/options/${siteName}/values`
      const res = await fetch(url, { credentials: 'include' })
      if (!res.ok) throw new Error('Не удалось получить значения опций')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
