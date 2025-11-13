import { useState } from 'react'
import { X, Star, MessageCircle } from 'lucide-react'

export default function ReviewDetailsModal({
  review,
  onClose,
  onApprove,
  onReject,
  isUpdating,
}) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  if (!review) return null

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={20}
            className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'На модерации' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Одобрен' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Отклонен' },
    }
    const style = statusMap[status] || statusMap.pending
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    )
  }

  const handleApprove = () => {
    onApprove(review.id)
  }

  const handleReject = () => {
    onReject(review.id, rejectReason)
    setShowRejectForm(false)
    setRejectReason('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <MessageCircle className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Детали отзыва</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Информация о пользователе */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Автор отзыва</h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Имя:</span> {review.user?.first_name} {review.user?.last_name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {review.user?.email}
              </p>
              {review.user?.phone && (
                <p className="text-gray-700">
                  <span className="font-medium">Телефон:</span> {review.user?.phone}
                </p>
              )}
            </div>
          </div>

          {/* Информация об отзыве */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Информация об отзыве</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Рейтинг:</span>
                {renderStars(review.rating)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">ID Товара:</span>
                <span className="text-gray-700">#{review.product_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Статус:</span>
                {getStatusBadge(review.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Дата создания:</span>
                <span className="text-gray-700">
                  {new Date(review.created_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Текст отзыва */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Текст отзыва</h3>
            <p className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
              {review.comment}
            </p>
          </div>

          {/* Форма отклонения */}
          {showRejectForm && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <label className="block mb-3">
                <span className="text-sm font-semibold text-gray-900 mb-2 block">
                  Причина отклонения (опционально)
                </span>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Укажите причину отклонения отзыва..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={3}
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isUpdating}
          >
            Закрыть
          </button>

          {review.status === 'pending' && (
            <>
              {!showRejectForm ? (
                <>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="px-4 py-2 text-orange-600 hover:bg-orange-50 border border-orange-200 rounded-lg transition-colors"
                    disabled={isUpdating}
                  >
                    Отклонить
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Обновление...' : 'Одобрить'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={isUpdating}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Обновление...' : 'Подтвердить отклонение'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

