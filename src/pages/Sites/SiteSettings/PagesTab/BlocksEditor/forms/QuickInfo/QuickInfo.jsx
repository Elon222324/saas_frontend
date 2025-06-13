import React from 'react'
import { defaultQuickInfoItems } from './quickInfoDataSchema'

export const QuickInfo = ({ settings = {}, data = {}, commonSettings = {} }) => {
  const bgColor = settings.bg_color ?? commonSettings.background?.surface ?? '#F3F4F6'
  const titleColor = settings.title_color ?? commonSettings.text?.secondary ?? '#6B7280'
  const descColor = settings.desc_color ?? commonSettings.text?.accent ?? '#1976D2'
  const gap = settings.gap ?? 24
  const cols = settings.grid_cols ?? 4
  const borderRadius = settings.border_radius ?? 12
  const fontSizeTitle = settings.font_size_title ?? 14
  const fontSizeDesc = settings.font_size_desc ?? 16
  const cardBg = settings.card_bg_color ?? '#FFFFFF'
  const cardBorder = settings.card_border_color ?? '#E5E7EB'
  const variant = settings.card_variant ?? 'flat'
  const showCards = settings.show_cards ?? true

  const defaultItems = defaultQuickInfoItems

  const items = []
  for (let i = 1; i <= cols; i++) {
    const titleKey = `title${i}`
    const descKey = `desc${i}`
    const defaults = defaultItems[i - 1] || {
      title: `Заголовок ${i}`,
      desc: `Описание ${i}`,
    }
    items.push({
      title: data?.[titleKey] ?? defaults.title,
      description: data?.[descKey] ?? defaults.desc,
    })
  }

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
