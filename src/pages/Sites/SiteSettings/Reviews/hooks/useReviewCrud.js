import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSiteSettings } from '../../../../../context/SiteSettingsContext'

export function useReviewCrud(siteName) {
  const { siteToken } = useSiteSettings()
  const queryClient = useQueryClient()

  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'
  const siteNameForApi = siteName.replace(containerSuffix, '')
  const baseApiUrl = `https://${siteNameForApi}.${import.meta.env.VITE_BASE_DOMAIN}/site-api/api/admin/reviews`

  // Получить детали отзыва
  const getReview = useMutation({
    mutationFn: async (reviewId) => {
      if (!siteToken) throw new Error('Токен сайта не получен')

      const res = await fetch(`${baseApiUrl}/${reviewId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`Не удалось получить отзыв: ${res.status}`)
      }

      return await res.json()
    },
  })

  // Обновить статус отзыва
  const updateReviewStatus = useMutation({
    mutationFn: async ({ reviewId, status, comment }) => {
      if (!siteToken) throw new Error('Токен сайта не получен')

      const body = {}
      if (status) body.status = status
      if (comment) body.comment = comment

      const res = await fetch(`${baseApiUrl}/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        throw new Error(`Не удалось обновить отзыв: ${res.status}`)
      }

      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })

  // Удалить отзыв
  const deleteReview = useMutation({
    mutationFn: async (reviewId) => {
      if (!siteToken) throw new Error('Токен сайта не получен')

      const res = await fetch(`${baseApiUrl}/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
        },
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`Не удалось удалить отзыв: ${res.status}`)
      }

      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })

  return {
    getReview,
    updateReviewStatus,
    deleteReview,
  }
}

