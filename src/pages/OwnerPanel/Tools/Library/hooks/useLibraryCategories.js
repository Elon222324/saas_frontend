import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * Получает токен пользователя из localStorage
 * @returns {string | null} access_token или null
 */
const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

export function useLibraryCategories() {
  return useQuery({
    queryKey: ['library-categories'],
    queryFn: async () => {
      const accessToken = getAccessToken()
      
      if (!accessToken) {
        console.error('📚 [useLibraryCategories] Ошибка: отсутствует access_token')
        throw new Error('Отсутствует access_token пользователя')
      }

      console.log('📚 [useLibraryCategories] → Запрос к:', `${API_URL}/cloud/library`)

      const res = await fetch(`${API_URL}/cloud/library`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('📚 [useLibraryCategories] ← Статус ответа:', res.status, res.statusText)

      if (!res.ok) {
        console.error('📚 [useLibraryCategories] ❌ Ошибка HTTP:', res.status)
        if (res.status === 401) {
          throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
        }
        throw new Error('Не удалось загрузить библиотеку')
      }
      
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })
}
