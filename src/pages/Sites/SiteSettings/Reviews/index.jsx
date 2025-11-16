import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import ReviewsList from './components/ReviewsList'
import ReviewDetailsModal from './components/ReviewDetailsModal'
import { useReviews } from './hooks/useReviews'
import { useReviewCrud } from './hooks/useReviewCrud'

export default function Reviews() {
  const { domain } = useParams()
  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'
  const siteName = `${domain}${containerSuffix}`

  const [filters, setFilters] = useState({ status: null, limit: 50, offset: 0 })
  const [selectedReview, setSelectedReview] = useState(null)

  // API запросы
  const { data: reviews, isLoading, error } = useReviews(siteName, filters)
  const { updateReviewStatus, deleteReview } = useReviewCrud(siteName)

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      await updateReviewStatus.mutateAsync({
        reviewId,
        status: newStatus,
      })
      // Обновляем выбранный отзыв если он открыт
      if (selectedReview?.id === reviewId) {
        setSelectedReview((prev) => ({
          ...prev,
          status: newStatus,
        }))
      }
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err)
    }
  }

  const handleDelete = async (reviewId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      try {
        await deleteReview.mutateAsync(reviewId)
      } catch (err) {
        console.error('Ошибка при удалении:', err)
      }
    }
  }

  const handleApprove = async (reviewId) => {
    await handleStatusChange(reviewId, 'approved')
  }

  const handleReject = async (reviewId, reason) => {
    await handleStatusChange(reviewId, 'rejected')
  }

  const handleDetailsClick = (review) => {
    setSelectedReview(review)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Управление отзывами</h1>
        <p className="text-gray-600 mt-2">
          Модерируйте отзывы пользователей о ваших товарах
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-red-900">Ошибка загрузки</p>
            <p className="text-red-700 text-sm">{error.message}</p>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <ReviewsList
        reviews={reviews}
        isLoading={isLoading}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onDetails={handleDetailsClick}
        isDeleting={deleteReview.isPending}
        isUpdating={updateReviewStatus.isPending}
        filters={filters}
        onFiltersChange={setFilters}
        pagination={filters}
        onPaginationChange={(newPagination) => {
          setFilters((prev) => ({
            ...prev,
            ...newPagination,
          }))
        }}
      />

      {/* Review Details Modal */}
      <ReviewDetailsModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        isUpdating={updateReviewStatus.isPending}
      />
    </div>
  )
}

