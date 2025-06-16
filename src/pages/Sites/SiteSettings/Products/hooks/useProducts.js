// FILE: src/pages/Sites/SiteSettings/Products/hooks/useProducts.js
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/services/products'

export function useProducts(site, filters) {
  return useQuery({
    queryKey: ['products', site, filters],
    queryFn: () => getProducts(site, filters),
    enabled: !!site,
  })
}
