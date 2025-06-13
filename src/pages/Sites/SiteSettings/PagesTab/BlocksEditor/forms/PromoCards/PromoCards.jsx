import pizzaImg from '/images/9.webp'
import { useRef } from 'react'

export const PromoCards = ({ settings = {}, data = {}, commonSettings = {} }) => {
  const bg_color = settings.bg_color ?? commonSettings.background?.card ?? '#FFFFFF'
  const border_color = settings.border_color ?? commonSettings.text?.primary ?? '#212121'
  const title_color = settings.title_color ?? commonSettings.text?.primary ?? '#212121'
  const desc_color = settings.desc_color ?? commonSettings.text?.secondary ?? '#666666'
  const title_size = settings.title_size ?? 14
  const desc_size = settings.desc_size ?? 12
  const border_radius = settings.border_radius ?? 16
  const gap = settings.gap ?? 16
  const card_style = settings.card_style ?? 'flat'
  const hover_effect = settings.hover_effect ?? 'scale'
  const hover_shadow = settings.hover_shadow ?? 'medium'
  const block_padding_y = settings.block_padding_y ?? 24
  const card_width = settings.card_width ?? 192
  const card_padding = settings.card_padding ?? 6
  const cards_count = settings.cards_count ?? 6

  const defaultCards = [
    { id: 1, title: 'Горячая пицца', desc: 'Доставка за 30 минут', img_url: pizzaImg },
    { id: 2, title: '2 по цене 1', desc: 'Только сегодня', img_url: pizzaImg },
    { id: 3, title: 'Бесплатный напиток', desc: 'К каждому заказу', img_url: pizzaImg },
    { id: 4, title: 'Новинка', desc: 'Пицца с трюфелем', img_url: pizzaImg },
    { id: 5, title: 'Скидка -15%', desc: 'На комбо-наборы', img_url: pizzaImg },
    { id: 6, title: 'Супер сырная', desc: 'Премиум рецепт', img_url: pizzaImg },
  ]


  const rawCards = Array.isArray(data.cards)
    ? data.cards
    : defaultCards.map((card, idx) => ({
        ...card,
        title: data[`card${idx + 1}_title`] || card.title,
        desc: data[`card${idx + 1}_desc`] || card.desc,
        img_url: data[`card${idx + 1}_img`] || card.img_url,
      }))
  const cards = rawCards.slice(0, cards_count)

  const scrollRef = useRef(null)
  let isDown = false
  let startX
  let scrollLeft

  const handleMouseDown = (e) => {
    isDown = true
    scrollRef.current.classList.add('cursor-grabbing')
    startX = e.pageX - scrollRef.current.offsetLeft
    scrollLeft = scrollRef.current.scrollLeft
  }

  const handleMouseLeave = () => {
    isDown = false
    scrollRef.current.classList.remove('cursor-grabbing')
  }

  const handleMouseUp = () => {
    isDown = false
    scrollRef.current.classList.remove('cursor-grabbing')
  }

  const handleMouseMove = (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const cardBaseClass = {
    flat: 'shadow-none border-none',
    glass: 'bg-white/20 backdrop-blur-md border border-white/30',
    elevated: 'shadow-md border border-gray-200',
  }[card_style] || ''

  const hoverClass = {
    none: '',
    scale: 'hover:scale-105',
    glow: 'hover:shadow-[0_0_12px_rgba(0,0,0,0.4)]',
    border: 'hover:border-black',
  }[hover_effect] || ''

  const shadowLevel = {
    none: '',
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-xl',
  }[hover_shadow] || ''

  const baseUrl = import.meta.env.VITE_LIBRARY_ASSETS_URL || ''

  return (
    <div
      className="w-full mt-4 mb-6 overflow-visible"
      style={{ paddingTop: block_padding_y, paddingBottom: block_padding_y }}
    >
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex overflow-x-auto overflow-y-visible no-scrollbar px-2 cursor-grab select-none"
        style={{ gap: `${gap}px`, WebkitOverflowScrolling: 'touch' }}
      >
        {cards.map((card) => {
          const imageUrl = card.img_url
            ? card.img_url.startsWith('/')
              ? baseUrl + card.img_url
              : card.img_url
            : pizzaImg
          return (
          <div key={card.id} style={{ perspective: '1000px' }}>
            <div style={{ paddingTop: `${card_padding}px`, paddingBottom: `${card_padding}px` }}>
              <div
                className={`h-56 sm:h-64 flex-shrink-0 relative transition-all duration-300 transform-gpu will-change-transform rounded-xl ${cardBaseClass} ${hoverClass} ${shadowLevel}`}
                style={{
                  backgroundColor: bg_color,
                  borderRadius: `${border_radius}px`,
                  width: `${card_width}px`,
                }}
              >
                <div className="w-full h-[60%] flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={card.title}
                    className="w-full h-full object-contain p-4"
                    draggable={false}
                  />
                </div>
                <div className="px-3 py-3 text-center h-[40%]">
                  <div
                    className="font-semibold"
                    style={{ fontSize: `${title_size}px`, color: title_color }}
                  >
                    {card.title}
                  </div>
                  <div
                    className="opacity-70 mt-1"
                    style={{ fontSize: `${desc_size}px`, color: desc_color }}
                  >
                    {card.desc}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  )
}
