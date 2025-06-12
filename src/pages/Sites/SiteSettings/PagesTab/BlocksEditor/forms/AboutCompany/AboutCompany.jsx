import React from 'react'

export const AboutCompany = ({ settings = {}, data = {}, commonSettings = {} }) => {
  const isCustom = settings?.custom_appearance === true

  const source = isCustom
    ? settings
    : {
        background_color: commonSettings.background?.base,
        text_color: commonSettings.text?.primary,
        subtle_text_color: commonSettings.text?.secondary,
        padding_top: 48,
        padding_bottom: 48,
        title_font_size: 24,
        desc_font_size: 16,
        max_width: 768,
        text_align: 'center',
      }

  const {
    background_color = '#FFFFFF',
    text_color = '#212121',
    subtle_text_color = '#6B7280',
    padding_top = 48,
    padding_bottom = 48,
    title_font_size = 24,
    desc_font_size = 16,
    max_width = 768,
    text_align = 'center',
  } = source

  const title = data.title || 'О компании'
  const text = data.text || 'Мы доставляем горячую пиццу с любовью. Работаем с 10:00 до 23:00 каждый день.'

  return (
    <div
      className="w-full px-4"
      style={{
        backgroundColor: background_color,
        paddingTop: padding_top,
        paddingBottom: padding_bottom,
        textAlign: text_align,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: max_width }}>
        <h2
          className="font-semibold mb-2"
          style={{ color: text_color, fontSize: `${title_font_size}px` }}
        >
          {title}
        </h2>
        <p style={{ color: subtle_text_color, fontSize: `${desc_font_size}px` }}>{text}</p>
      </div>
    </div>
  )
}

export default AboutCompany
