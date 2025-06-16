// FILE: src/pages/Sites/SiteSettings/Products/hooks/useProductMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addCategory,
  updateCategory,
  deleteCategory,
  addProduct,
  updateProduct,
  deleteProduct,
} from '@/services/products'
import type { CategoryDTO, ProductDTO } from '@/types/products'

export const useProductMutations = (site: string) => {
  const qc = useQueryClient()

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['categories', site] })
    qc.invalidateQueries({ queryKey: ['products', site] })
  }

  const addCat = useMutation({
    mutationFn: (data: CategoryDTO) => addCategory(site, data),
    onSuccess: invalidate,
  })
  const updateCat = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoryDTO> }) =>
      updateCategory(site, id, data),
    onSuccess: invalidate,
  })
  const deleteCat = useMutation({
    mutationFn: (id: number) => deleteCategory(site, id),
    onSuccess: invalidate,
  })

  const addProd = useMutation({
    mutationFn: (data: ProductDTO) => addProduct(site, data),
    onSuccess: invalidate,
  })
  const updateProd = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductDTO> }) =>
      updateProduct(site, id, data),
    onSuccess: invalidate,
  })
  const deleteProd = useMutation({
    mutationFn: (id: number) => deleteProduct(site, id),
    onSuccess: invalidate,
  })

  return {
    addCategory: addCat.mutateAsync,
    updateCategory: updateCat.mutateAsync,
    deleteCategory: deleteCat.mutateAsync,
    addProduct: addProd.mutateAsync,
    updateProduct: updateProd.mutateAsync,
    deleteProduct: deleteProd.mutateAsync,
  }
}
