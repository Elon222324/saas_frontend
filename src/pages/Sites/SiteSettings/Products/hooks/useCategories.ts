// FILE: src/pages/Sites/SiteSettings/Products/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/services/products'
import type { Category } from '@/types/products'

export const useCategories = (site: string) => {
  return useQuery<Category[]>({
    queryKey: ['categories', site],
    queryFn: () => getCategories(site),
  })
}
