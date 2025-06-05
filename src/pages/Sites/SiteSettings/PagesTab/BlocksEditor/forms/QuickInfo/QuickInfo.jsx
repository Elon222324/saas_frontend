import React from 'react'

export const QuickInfo = ({ settings = {}, data = {}, commonSettings = {} }) => {
  const isCustom = settings?.custom_appearance === true

  const defaultQuickInfoSettings = {
    gap: 24,
    grid_cols: 4,
    border_radius: 12,
    font_size_title: 14,
    font_size_desc: 16,
    card_bg_color: '#FFFFFF',
    card_border_color: '#E5E7EB',
    card_variant: 'flat',
    show_cards: true,
  }

  const source = isCustom
    ? settings
    : {
        ...defaultQuickInfoSettings,
        bg_color: commonSettings.background?.surface,
        title_color: commonSettings.text?.secondary,
        desc_color: commonSettings.text?.accent,
        text_color: commonSettings.text?.primary,
      }

  const bgColor = source?.bg_color || '#F3F4F6'
  const titleColor = source?.title_color || '#6B7280'
  const descColor = source?.desc_color || '#1976D2'
  const gap = source?.gap || 24
  const cols = source?.grid_cols || 4
  const borderRadius = source?.border_radius || 12
  const fontSizeTitle = source?.font_size_title || 14
  const fontSizeDesc = source?.font_size_desc || 16
  const cardBg = source?.card_bg_color || '#FFFFFF'
  const cardBorder = source?.card_border_color || '#E5E7EB'
  const variant = source?.card_variant || 'flat'
  const showCards = source?.show_cards !== false

  const defaultItems = [
    { title: 'Мин. заказ на доставку', description: 'от 500 руб.' },
    { title: 'Стоимость доставки', description: 'от 100 руб.' },
    { title: 'Время доставки', description: 'до 59 мин.' },
    { title: 'Скидка за самовывоз', description: '−10%' },
  ]

  const items = (() => {
    if (
      data?.title1 ||
      data?.desc1 ||
      data?.title2 ||
      data?.desc2 ||
      data?.title3 ||
      data?.desc3 ||
      data?.title4 ||
      data?.desc4
    ) {
      return [
        { title: data.title1, description: data.desc1 },
        { title: data.title2, description: data.desc2 },
        { title: data.title3, description: data.desc3 },
        { title: data.title4, description: data.desc4 },
      ]
    }
    return defaultItems
  })()

  const hexToRgba = (hex, alpha = 0.6) => {
    if (!hex || hex[0] !== '#' || (hex.length !== 7 && hex.length !== 4)) return hex
    let r, g, b
    if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16)
      g = parseInt(hex.slice(3, 5), 16)
      b = parseInt(hex.slice(5, 7), 16)
    } else {
      r = parseInt(hex[1] + hex[1], 16)
      g = parseInt(hex[2] + hex[2], 16)
      b = parseInt(hex[3] + hex[3], 16)
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return (
    <div
      className="hidden sm:grid w-full mt-4 mb-6 text-center px-2 py-3"
      style={{
        backgroundColor: hexToRgba(bgColor),
        borderRadius: `${borderRadius}px`,
        gap: `${gap}px`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={`space-y-1 px-2 py-2 ${
            !showCards
              ? ''
              : variant === 'border'
              ? 'border'
              : variant === 'hover-shadow'
              ? 'transition hover:shadow-md'
              : ''
          }`}
          style={{
            backgroundColor: showCards ? cardBg : 'transparent',
            borderColor: cardBorder,
            borderRadius: `${borderRadius}px`,
          }}
        >
          <div
            className="leading-tight"
            style={{ color: hexToRgba(titleColor, 0.6), fontSize: `${fontSizeTitle}px` }}
          >
            {item.title}
          </div>
          <div
            className="font-semibold"
            style={{ color: descColor, fontSize: `${fontSizeDesc}px` }}
          >
            {item.description}
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuickInfo
