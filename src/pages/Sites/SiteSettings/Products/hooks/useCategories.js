// FILE: src/pages/Sites/SiteSettings/Products/hooks/useCategories.js
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/services/products'

export function useCategories(site) {
  return useQuery({
    queryKey: ['categories', site],
    queryFn: () => getCategories(site),
    enabled: !!site,
  })
}
