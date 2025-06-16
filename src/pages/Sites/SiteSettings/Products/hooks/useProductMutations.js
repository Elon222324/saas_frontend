// FILE: src/pages/Sites/SiteSettings/Products/hooks/useProductMutations.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addCategory,
  updateCategory,
  deleteCategory,
  addProduct,
  updateProduct,
  deleteProduct,
} from '@/services/products'

export function useProductMutations(site) {
  const qc = useQueryClient()

  const invalidate = () => {
    qc.invalidateQueries(['categories', site])
    qc.invalidateQueries(['products', site])
  }

  const addCat = useMutation({
    mutationFn: (dto) => addCategory(site, dto),
    onSuccess: invalidate,
  })

  const updateCat = useMutation({
    mutationFn: ({ id, dto }) => updateCategory(site, id, dto),
    onSuccess: invalidate,
  })

  const deleteCatM = useMutation({
    mutationFn: (id) => deleteCategory(site, id),
    onSuccess: invalidate,
  })

  const addProd = useMutation({
    mutationFn: (dto) => addProduct(site, dto),
    onSuccess: invalidate,
  })

  const updateProd = useMutation({
    mutationFn: ({ id, dto }) => updateProduct(site, id, dto),
    onSuccess: invalidate,
  })

  const deleteProdM = useMutation({
    mutationFn: (id) => deleteProduct(site, id),
    onSuccess: invalidate,
  })

  return {
    addCategory: addCat.mutateAsync,
    updateCategory: updateCat.mutateAsync,
    deleteCategory: deleteCatM.mutateAsync,
    addProduct: addProd.mutateAsync,
    updateProduct: updateProd.mutateAsync,
    deleteProduct: deleteProdM.mutateAsync,
  }
}
