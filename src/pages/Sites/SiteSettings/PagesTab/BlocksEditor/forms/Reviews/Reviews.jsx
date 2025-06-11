import { useRef, useEffect, useState } from 'react'
import pizzaImg from '/images/6.webp'
import { defaultReviews } from './reviewsDataSchema'

export const Reviews = ({ settings = {}, data = {}, commonSettings = {} }) => {
  const isCustom = settings?.custom_appearance === true

  const source = isCustom
    ? settings
    : {
        section_bg_color: commonSettings.background?.muted,
        text_color: commonSettings.text?.primary,
        subtle_text_color: commonSettings.text?.secondary,
        card_bg_color: commonSettings.background?.card,
        card_border_color: commonSettings.layout?.border_color || '#E5E7EB',
        rating_color: commonSettings.icon?.rating,
        primary_color: commonSettings.text?.accent,
        show_modal_button: true,
        slider_enabled: true,
        avatar_size: 'medium',
        card_shadow: 'low',
        transition_effect: 'slide',
      }

  const sectionBg = source?.section_bg_color || '#F9FAFB'
  const textColor = source?.text_color || '#212121'
  const subtleTextColor = source?.subtle_text_color || '#6B7280'
  const cardBg = source?.card_bg_color || '#FFFFFF'
  const cardBorder = source?.card_border_color || '#E5E7EB'
  const ratingColor = source?.rating_color || '#FACC15'
  const primaryColor = source?.primary_color || '#1976D2'

  const avatarSize = source?.avatar_size === 'small' ? 32 : source?.avatar_size === 'large' ? 56 : 40
  const boxShadow =
    source?.card_shadow === 'high'
      ? '0 8px 20px rgba(0,0,0,0.2)'
      : source?.card_shadow === 'medium'
      ? '0 4px 12px rgba(0,0,0,0.1)'
      : source?.card_shadow === 'low'
      ? '0 2px 6px rgba(0,0,0,0.05)'
      : 'none'

  const rawReviews = Array.isArray(data.reviews)
    ? data.reviews
    : defaultReviews.map((rev, idx) => ({
        ...rev,
        name: data[`review${idx + 1}_name`] ?? rev.name,
        text: data[`review${idx + 1}_text`] ?? rev.text,
        rating: data[`review${idx + 1}_rating`] ?? rev.rating,
        img_url: data[`review${idx + 1}_img`] ?? rev.img_url,
      }))

  const reviews = rawReviews

  const sectionRef = useRef(null)
  const scrollRef = useRef(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const imgs = sectionRef.current?.querySelectorAll('img[data-src]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.removeAttribute('data-src')
          observer.unobserve(img)
        }
      })
    }, { threshold: 0.1 })

    imgs?.forEach((img) => observer.observe(img))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!source?.slider_enabled) return
    const slider = scrollRef.current
    if (!slider) return

    let isDown = false
    let startX, scrollLeft

    const handle = (e) => {
      if (e.type === 'mousedown') {
        isDown = true
        slider.classList.add('cursor-grabbing')
        startX = e.pageX - slider.offsetLeft
        scrollLeft = slider.scrollLeft
      }
      if (e.type === 'mousemove' && isDown) {
        e.preventDefault()
        const x = e.pageX - slider.offsetLeft
        slider.scrollLeft = scrollLeft - (x - startX) * 1.5
      }
      if (e.type === 'mouseup' || e.type === 'mouseleave') {
        isDown = false
        slider.classList.remove('cursor-grabbing')
      }
    }

    slider.addEventListener('mousedown', handle)
    slider.addEventListener('mousemove', handle)
    slider.addEventListener('mouseup', handle)
    slider.addEventListener('mouseleave', handle)

    return () => {
      slider.removeEventListener('mousedown', handle)
      slider.removeEventListener('mousemove', handle)
      slider.removeEventListener('mouseup', handle)
      slider.removeEventListener('mouseleave', handle)
    }
  }, [source?.slider_enabled])

  const ReviewModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-4">
        <div className="mb-2">Форма отзыва в разработке</div>
        <button onClick={onClose} className="text-blue-600 hover:underline text-sm">Закрыть</button>
      </div>
    </div>
  )

  const Stars = ({ count, color = '#FACC15', size = 16 }) => (
    <div className="flex gap-[2px]">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className="shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          style={{
            color: i < count ? color : '#D1D5DB',
            width: size,
            height: size,
          }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.783.57-1.838-.196-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ))}
    </div>
  )

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 rounded-xl"
      style={{ backgroundColor: sectionBg, color: textColor }}
    >
      <div className="mx-auto px-4" style={{ maxWidth: 'var(--max-width)' }}>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold">🗨️ Отзывы клиентов</span>
            <span className="text-sm hidden sm:inline" style={{ color: subtleTextColor }}>
              ⭐ Нас рекомендуют
            </span>
          </div>
          {source.show_modal_button && (
            <button
              className="text-sm font-medium transition hover:underline"
              style={{ color: primaryColor }}
              onClick={() => setShowModal(true)}
            >
              Оставить отзыв →
            </button>
          )}
        </div>

        <div
          ref={scrollRef}
          className={`flex gap-4 py-4 ${source.slider_enabled ? 'overflow-x-auto overflow-y-visible cursor-grab scrollbar-hide' : 'flex-wrap'}`}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="min-w-[280px] max-w-sm flex-shrink-0 px-5 py-4 transition"
              style={{
                backgroundColor: cardBg,
                color: textColor,
                borderRadius: '16px',
                border: `1px solid ${cardBorder}`,
                boxShadow,
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  data-src={review.img_url || pizzaImg}
                  alt={review.name}
                  className="object-cover rounded-full border"
                  style={{ width: avatarSize, height: avatarSize }}
                />
                <div>
                  <div className="font-semibold">{review.name}</div>
                  <Stars count={review.rating} color={ratingColor} />
                </div>
              </div>
              <p className="text-sm leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {showModal && <ReviewModal onClose={() => setShowModal(false)} />}
    </section>
  )
}

export default Reviews