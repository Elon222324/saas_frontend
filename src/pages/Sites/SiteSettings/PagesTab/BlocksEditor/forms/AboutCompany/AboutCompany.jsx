import React from 'react'

export const AboutCompany = ({ settings = {}, data = {}, commonSettings = {} }) => {
  const {
    background_color,
    text_color,
    subtle_text_color,
    padding_top,
    padding_bottom,
    title_font_size,
    desc_font_size,
    max_width,
    text_align,
  } = settings

  const bgColor = background_color ?? commonSettings.background?.base ?? '#FFFFFF'
  const textColor = text_color ?? commonSettings.text?.primary ?? '#212121'
  const subtleColor = subtle_text_color ?? commonSettings.text?.secondary ?? '#6B7280'
  const paddingTop = padding_top ?? 48
  const paddingBottom = padding_bottom ?? 48
  const titleFont = title_font_size ?? 24
  const descFont = desc_font_size ?? 16
  const maxWidth = max_width ?? 768
  const align = text_align ?? 'center'

  const title = data.title || 'О компании'
  const text = data.text || 'Мы доставляем горячую пиццу с любовью. Работаем с 10:00 до 23:00 каждый день.'

  return (
    <div
      className="w-full px-4"
      style={{
        backgroundColor: bgColor,
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        textAlign: align,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: maxWidth }}>
        <h2
          className="font-semibold mb-2"
          style={{ color: textColor, fontSize: `${titleFont}px` }}
        >
          {title}
        </h2>
        <p style={{ color: subtleColor, fontSize: `${descFont}px` }}>{text}</p>
      </div>
    </div>
  )
}

export default AboutCompany
