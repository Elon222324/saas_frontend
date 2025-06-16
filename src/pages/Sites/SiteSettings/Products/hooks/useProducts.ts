// FILE: src/pages/Sites/SiteSettings/Products/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query'
import { getProducts, ProductFilters } from '@/services/products'
import type { Paginated, Product } from '@/types/products'

export const useProducts = (site: string, filters: ProductFilters) => {
  return useQuery<Paginated<Product>>({
    queryKey: ['products', site, filters],
    queryFn: () => getProducts(site, filters),
    keepPreviousData: true,
  })
}
