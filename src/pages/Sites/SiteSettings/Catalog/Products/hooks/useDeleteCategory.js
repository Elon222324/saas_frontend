import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useDeleteCategory(siteName) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        `${API_URL}/products/${siteName}/categories/delete/${id}`,
        { method: 'DELETE', credentials: 'include' },
      )
      if (!res.ok) throw new Error('Ошибка удаления категории')
    },
    onSuccess: () => {
      // автоматически обновляем дерево
      qc.invalidateQueries({ queryKey: ['categories', siteName] })
    },
  })
}
