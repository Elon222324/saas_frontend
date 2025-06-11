import pizzaImg from '/images/9.webp'
import { useRef } from 'react'

export const PromoCards = ({ settings = {}, data = {}, commonSettings = {} }) => {
  const isCustom = settings?.custom_appearance === true

  const source = isCustom
    ? settings
    : {
        bg_color: commonSettings.background?.card,
        border_color: commonSettings.text?.primary,
        title_color: commonSettings.text?.primary,
        desc_color: commonSettings.text?.secondary,
        title_size: 14,
        desc_size: 12,
        border_radius: 16,
        gap: 16,
        card_style: 'flat',
        hover_effect: 'scale',
        hover_shadow: 'medium',
        block_padding_y: 24,
        card_width: 192,
        card_padding: 6,
      }

  const {
    bg_color = '#FFFFFF',
    border_color = '#212121',
    title_color = '#212121',
    desc_color = '#666666',
    title_size = 14,
    desc_size = 12,
    border_radius = 16,
    gap = 16,
    card_style = 'flat',
    hover_effect = 'scale',
    hover_shadow = 'medium',
    block_padding_y = 24,
    card_width = 192,
    card_padding = 6,
  } = source

  const defaultCards = [
    { id: 1, title: 'Горячая пицца', desc: 'Доставка за 30 минут', img_url: pizzaImg },
    { id: 2, title: '2 по цене 1', desc: 'Только сегодня', img_url: pizzaImg },
    { id: 3, title: 'Бесплатный напиток', desc: 'К каждому заказу', img_url: pizzaImg },
    { id: 4, title: 'Новинка', desc: 'Пицца с трюфелем', img_url: pizzaImg },
    { id: 5, title: 'Скидка -15%', desc: 'На комбо-наборы', img_url: pizzaImg },
    { id: 6, title: 'Супер сырная', desc: 'Премиум рецепт', img_url: pizzaImg },
  ]

  const cardCount = settings?.card_count || defaultCards.length

  const cards = Array.isArray(data.cards)
    ? data.cards.slice(0, cardCount)
    : defaultCards.slice(0, cardCount).map((card, idx) => ({
        ...card,
        title: data[`card${idx + 1}_title`] || card.title,
        desc: data[`card${idx + 1}_desc`] || card.desc,
        img_url: data[`card${idx + 1}_img`] || card.img_url,
      }))

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
        {cards.map((card) => (
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
                    src={card.img_url || pizzaImg}
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
        ))}
      </div>
    </div>
  )
}
