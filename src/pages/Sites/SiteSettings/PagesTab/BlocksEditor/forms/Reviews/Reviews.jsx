import { Star } from 'lucide-react'

export const Reviews = ({ settings = {}, data = {}, commonSettings = {} }) => {
  const isCustom = settings?.custom_appearance === true

  const source = isCustom
    ? settings
    : {
        section_bg_color: commonSettings.background?.surface,
        text_color: commonSettings.text?.primary,
        subtle_text_color: commonSettings.text?.secondary,
        card_bg_color: commonSettings.background?.card,
        card_border_color: commonSettings.text?.secondary,
        rating_color: commonSettings.icon?.rating,
        primary_color: commonSettings.text?.accent,
        avatar_size: 'medium',
        card_shadow: 'low',
        show_modal_button: true,
      }

  const {
    section_bg_color = '#F9FAFB',
    text_color = '#212121',
    subtle_text_color = '#64748B',
    card_bg_color = '#FFFFFF',
    card_border_color = '#E5E7EB',
    rating_color = '#FACC15',
    primary_color = '#1976D2',
    avatar_size = 'medium',
    card_shadow = 'low',
    show_modal_button = true,
  } = source

  const shadowMap = { none: '', low: 'shadow-sm', medium: 'shadow-md', high: 'shadow-lg' }
  const avatarMap = { small: 32, medium: 40, large: 48 }
  const avatarSize = avatarMap[avatar_size] || 40

  const baseUrl = import.meta.env.VITE_LIBRARY_ASSETS_URL || ''

  const defaultReviews = [
    { id: 1, name: 'Алексей', text: 'Отличный сервис!', rating: 5, avatar: '/images/1.png' },
    { id: 2, name: 'Мария', text: 'Очень вкусно!', rating: 4, avatar: '/images/2.webp' },
    { id: 3, name: 'Иван', text: 'Буду заказывать ещё', rating: 5, avatar: '/images/3.webp' },
  ]

  const reviews = Array.isArray(data.reviews) ? data.reviews : defaultReviews

  return (
    <div className="w-full" style={{ backgroundColor: section_bg_color }}>
      <div className="flex overflow-x-auto no-scrollbar gap-4 p-4">
        {reviews.map(r => (
          <div
            key={r.id}
            className={`flex-shrink-0 border rounded-lg p-4 ${shadowMap[card_shadow]}`}
            style={{ backgroundColor: card_bg_color, borderColor: card_border_color }}
          >
            <div className="flex items-center mb-2 gap-2">
              <img
                src={r.avatar.startsWith('/') ? baseUrl + r.avatar : r.avatar}
                alt={r.name}
                className="rounded-full object-cover"
                style={{ width: avatarSize, height: avatarSize }}
              />
              <div style={{ color: text_color }} className="font-semibold text-sm">
                {r.name}
              </div>
            </div>
            <div className="flex items-center gap-0.5 mb-2" style={{ color: rating_color }}>
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} size={14} color={rating_color} fill={rating_color} />
              ))}
            </div>
            <div className="text-sm" style={{ color: subtle_text_color }}>
              {r.text}
            </div>
          </div>
        ))}
      </div>
      {show_modal_button && (
        <div className="text-center pb-4">
          <button
            className="px-4 py-2 rounded text-sm"
            style={{ backgroundColor: primary_color, color: '#FFFFFF' }}
          >
            Оставить отзыв
          </button>
        </div>
      )}
    </div>
  )
}

export default Reviews
