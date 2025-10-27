import { useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * Получает токен пользователя из localStorage
 * @returns {string | null} access_token или null
 */
const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

export function useLibraryCrud() {
  const qc = useQueryClient()

  // --- Логика для категорий ---
  const addCategory = useMutation({
    mutationFn: async (payload) => {
      const accessToken = getAccessToken()
      
      if (!accessToken) {
        console.error('📚 [addCategory] Ошибка: отсутствует access_token')
        throw new Error('Отсутствует access_token пользователя')
      }

      console.log('📚 [addCategory] → Создание категории:', `${API_URL}/cloud/library/categories`)

      const res = await fetch(`${API_URL}/cloud/library/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      console.log('📚 [addCategory] ← Статус ответа:', res.status)

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
        }
        throw new Error('Ошибка создания категории')
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-categories'] })
    },
  })

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const accessToken = getAccessToken()
      
      if (!accessToken) {
        console.error('📚 [updateCategory] Ошибка: отсутствует access_token')
        throw new Error('Отсутствует access_token пользователя')
      }

      console.log('📚 [updateCategory] → Обновление категории:', `${API_URL}/cloud/library/categories/${id}`)

      const res = await fetch(`${API_URL}/cloud/library/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      console.log('📚 [updateCategory] ← Статус ответа:', res.status)

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
        }
        throw new Error('Ошибка обновления категории')
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-categories'] })
    },
  })

  const deleteCategory = useMutation({
    mutationFn: async (id) => {
      const accessToken = getAccessToken()
      
      if (!accessToken) {
        console.error('📚 [deleteCategory] Ошибка: отсутствует access_token')
        throw new Error('Отсутствует access_token пользователя')
      }

      console.log('📚 [deleteCategory] → Удаление категории:', `${API_URL}/cloud/library/categories/${id}`)

      const res = await fetch(`${API_URL}/cloud/library/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('📚 [deleteCategory] ← Статус ответа:', res.status)

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
        }
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

  // --- Логика для изображений ---

  const uploadImage = useMutation({
    mutationFn: async (formData) => {
      const accessToken = getAccessToken()
      
      if (!accessToken) {
        console.error('📚 [uploadImage] Ошибка: отсутствует access_token')
        throw new Error('Отсутствует access_token пользователя')
      }

      console.log('📚 [uploadImage] → Загрузка изображения:', `${API_URL}/cloud/library/upload`)

      const res = await fetch(`${API_URL}/cloud/library/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          // Для FormData заголовок 'Content-Type' не указывается
        },
        credentials: 'include',
        body: formData,
      })

      console.log('📚 [uploadImage] ← Статус ответа:', res.status)

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
        }
        throw new Error('Ошибка загрузки изображения')
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-categories'] })
    },
  })

  const updateImage = useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const accessToken = getAccessToken()
      
      if (!accessToken) {
        console.error('📚 [updateImage] Ошибка: отсутствует access_token')
        throw new Error('Отсутствует access_token пользователя')
      }

      console.log('📚 [updateImage] → Обновление изображения:', `${API_URL}/cloud/library/images/${id}`)

      const res = await fetch(`${API_URL}/cloud/library/images/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      console.log('📚 [updateImage] ← Статус ответа:', res.status)

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
        }
        throw new Error('Ошибка обновления деталей изображения')
      }
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library-categories'] })
    },
  })

  const deleteImage = useMutation({
    mutationFn: async (id) => {
      const accessToken = getAccessToken()
      
      if (!accessToken) {
        console.error('📚 [deleteImage] Ошибка: отсутствует access_token')
        throw new Error('Отсутствует access_token пользователя')
      }

      console.log('📚 [deleteImage] → Удаление изображения:', `${API_URL}/cloud/library/images/${id}`)

      const res = await fetch(`${API_URL}/cloud/library/images/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('📚 [deleteImage] ← Статус ответа:', res.status)

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
        }
        throw new Error('Ошибка удаления изображения')
      }
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