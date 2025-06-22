import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useProducts(siteName, options = {}) {
  return useQuery({
    queryKey: ['products', siteName],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/products/${siteName}/all`,
        { credentials: 'include' },
      )
      if (!res.ok) throw new Error('Не удалось получить товары')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
