import { useState } from 'react'
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import ReviewItem from './ReviewItem'

export default function ReviewsList({
  reviews,
  isLoading,
  onDelete,
  onStatusChange,
  onDetails,
  isDeleting,
  isUpdating,
  filters,
  onFiltersChange,
  pagination,
  onPaginationChange,
}) {
  const [showFilters, setShowFilters] = useState(false)

  const handleStatusFilterChange = (status) => {
    onFiltersChange({
      ...filters,
      status: filters.status === status ? null : status,
      offset: 0,
    })
  }

  const handleNextPage = () => {
    onPaginationChange({
      ...pagination,
      offset: (pagination.offset || 0) + (pagination.limit || 50),
    })
  }

  const handlePrevPage = () => {
    const newOffset = Math.max(0, (pagination.offset || 0) - (pagination.limit || 50))
    onPaginationChange({
      ...pagination,
      offset: newOffset,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Загрузка отзывов...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Фильтры */}
      <div className="bg-white border rounded-lg p-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold"
        >
          <Filter size={18} />
          Фильтры
        </button>

        {showFilters && (
          <div className="mt-4 flex gap-4 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.status === 'pending'}
                onChange={() => handleStatusFilterChange('pending')}
                className="rounded"
              />
              <span className="text-sm">На модерации</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.status === 'approved'}
                onChange={() => handleStatusFilterChange('approved')}
                className="rounded"
              />
              <span className="text-sm">Одобренные</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.status === 'rejected'}
                onChange={() => handleStatusFilterChange('rejected')}
                className="rounded"
              />
              <span className="text-sm">Отклоненные</span>
            </label>
          </div>
        )}
      </div>

      {/* Список отзывов */}
      {reviews && reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onDetails={onDetails}
              isDeleting={isDeleting}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-8 text-center text-gray-500">
          <p className="mb-2">Отзывов не найдено</p>
          <p className="text-sm">Попробуйте изменить фильтры</p>
        </div>
      )}

      {/* Пагинация */}
      {reviews && reviews.length > 0 && (
        <div className="flex items-center justify-between bg-white border rounded-lg p-4">
          <button
            onClick={handlePrevPage}
            disabled={!pagination.offset || pagination.offset === 0}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
            Назад
          </button>

          <span className="text-sm text-gray-600">
            Показано: {(pagination.offset || 0) + 1} - {(pagination.offset || 0) + (reviews.length || 0)}
          </span>

          <button
            onClick={handleNextPage}
            disabled={!reviews || reviews.length < (pagination.limit || 50)}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Далее
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

