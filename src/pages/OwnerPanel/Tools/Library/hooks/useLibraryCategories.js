import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useLibraryCategories() {
  return useQuery({
    queryKey: ['library-categories'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/cloud/library`)
      if (!res.ok) throw new Error('Не удалось загрузить библиотеку')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })
}
