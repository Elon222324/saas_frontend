import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useLibraryCrud() {
  const qc = useQueryClient()

  // --- Существующая логика для категорий (без изменений) ---
  const addCategory = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${API_URL}/cloud/library/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Ошибка создания категории')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-categories'] })
    },
  })

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await fetch(`${API_URL}/cloud/library/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Ошибка обновления категории')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-categories'] })
    },
  })

  const deleteCategory = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/cloud/library/categories/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        // Улучшенная обработка ошибок для получения деталей с бэкенда
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.detail || 'Ошибка удаления категории')
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-categories'] })
    },
  })

  // --- НОВАЯ ЛОГИКА ДЛЯ ИЗОБРАЖЕНИЙ ---

  const uploadImage = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(`${API_URL}/cloud/library/upload`, {
        method: 'POST',
        body: formData, // Для FormData заголовок 'Content-Type' не указывается
      })
      if (!res.ok) throw new Error('Ошибка загрузки изображения')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-categories'] })
    },
  })

  const updateImage = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await fetch(`${API_URL}/cloud/library/images/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Ошибка обновления деталей изображения')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-categories'] })
    },
  })

  const deleteImage = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/cloud/library/images/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Ошибка удаления изображения')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-categories'] })
    },
  })

  return {
    addCategory,
    updateCategory,
    deleteCategory,
    uploadImage,
    updateImage,
    deleteImage,
  }
}