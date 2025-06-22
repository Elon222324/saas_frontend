import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useExtraGroups(siteName, options = {}) {
  return useQuery({
    queryKey: ['extraGroups', siteName],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/extras/${siteName}/groups`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Не удалось получить группы добавок')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
