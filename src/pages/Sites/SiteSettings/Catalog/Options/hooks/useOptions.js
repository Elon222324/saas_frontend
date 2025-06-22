import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useOptions(siteName, options = {}) {
  return useQuery({
    queryKey: ['options', siteName],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/options/${siteName}/groups`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Не удалось получить опции')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
