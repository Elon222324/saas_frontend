import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useExtraItems(siteName, groupId, options = {}) {
  return useQuery({
    queryKey: ['extraItems', siteName, groupId],
    queryFn: async () => {
      const url = groupId
        ? `${API_URL}/extras/${siteName}/items?group_id=${groupId}`
        : `${API_URL}/extras/${siteName}/items`
      const res = await fetch(url, { credentials: 'include' })
      if (!res.ok) throw new Error('Не удалось получить элементы добавок')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
