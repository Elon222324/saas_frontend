import { Star, Trash2, Check, X, Eye } from 'lucide-react'

export default function ReviewItem({
  review,
  onDelete,
  onStatusChange,
  onDetails,
  isDeleting,
  isUpdating,
}) {
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'На модерации' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Одобрен' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Отклонен' },
    }
    const style = statusMap[status] || statusMap.pending
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    )
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={16}
            className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <p className="font-semibold text-gray-900">
                {review.user?.first_name} {review.user?.last_name}
              </p>
              <p className="text-sm text-gray-600">{review.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {renderStars(review.rating)}
            <span className="text-sm text-gray-600 font-medium">
              Товар #{review.product_id}
            </span>
          </div>
        </div>
        <div>{getStatusBadge(review.status)}</div>
      </div>

      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{review.comment}</p>

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="text-xs text-gray-500">
          {new Date(review.created_at).toLocaleDateString('ru-RU')}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onDetails(review)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Посмотреть детали"
            disabled={isUpdating}
          >
            <Eye size={18} />
          </button>

          {review.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(review.id, 'approved')}
                className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Одобрить"
                disabled={isUpdating}
              >
                <Check size={18} />
              </button>

              <button
                onClick={() => onStatusChange(review.id, 'rejected')}
                className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                title="Отклонить"
                disabled={isUpdating}
              >
                <X size={18} />
              </button>
            </>
          )}

          <button
            onClick={() => onDelete(review.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Удалить"
            disabled={isDeleting}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

