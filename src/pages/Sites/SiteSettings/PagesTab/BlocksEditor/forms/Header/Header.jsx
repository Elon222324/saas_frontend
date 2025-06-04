// src/blocks/Header.jsx

import { LogIn, Star, CircleDollarSign, Menu, X } from 'lucide-react'
import { useState } from 'react'

export const Header = ({ settings = {}, data = {}, commonSettings = {}, navigation }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const visibleItems = navigation?.filter(item => item.visible) || []

  const isCustom = settings?.custom_appearance === true
  const source = isCustom ? settings : {
    text_color: commonSettings.text?.primary,
    primary_color: commonSettings.text?.accent,
    secondary_color: commonSettings.text?.secondary,
    rating_color: commonSettings.icon?.rating,
    button_bg_color: commonSettings.button?.bg,
    button_text_color: commonSettings.button?.text,
    button_hover_color: commonSettings.button?.hover_bg,
    background_color: commonSettings.background?.base,
  }

  const textColor = source?.text_color || '#212121'
  const primaryColor = source?.primary_color || '#1976D2'
  const secondaryColor = source?.secondary_color || '#90CAF9'
  const ratingColor = source?.rating_color || '#FACC15'
  const buttonBg = source?.button_bg_color || '#1976D2'
  const buttonText = source?.button_text_color || '#FFFFFF'
  const buttonHover = source?.button_hover_color || '#1565C0'
  const bgColor = source?.background_color || '#FFFFFF'

  const subtitle = data.subtitle || 'Описание'
  const city = data.city || 'Город'
  const deliveryTime = data.delivery_time || '33 мин'
  const ratingValue = data.rating_value || '4.82'
  const labelBeforeCity = data.label_before_city || 'Доставка'

  const showLogin = settings.show_login_button !== false
  const showBonus = settings.show_bonus_button !== false
  const showRating = settings.show_rating !== false

  return (
    <header className="w-full shadow-sm" style={{ backgroundColor: bgColor }}>
      <div
        className="max-w-screen-xl mx-auto grid grid-cols-[auto_1fr_auto] items-center px-8 py-2 text-[13px] gap-x-2"
      >
        <div className="flex flex-col items-start max-w-[100px]">
          <img
            src="/images/logo.webp"
            alt="Logo"
            className="w-[96px] h-auto object-contain"
          />
          <div
            className="mt-0.5 leading-snug hidden sm:block truncate"
            style={{ color: secondaryColor, fontSize: '10px' }}
          >
            {subtitle}
          </div>
        </div>

        <div className="flex flex-col gap-[2px] text-right pl-1">
          <div style={{ color: textColor, fontSize: '12px' }}>
            {labelBeforeCity} <span style={{ color: primaryColor }}>{city}</span>
          </div>
          <div className="flex items-center justify-end" style={{ color: secondaryColor, fontSize: '11.5px' }}>
            <span>{deliveryTime}</span>
            {showRating && (
              <>
                <span className="mx-1">•</span>
                <span>{ratingValue}</span>
                <Star
                  size={12}
                  className="ml-1"
                  style={{
                    color: ratingColor,
                    fill: ratingColor,
                  }}
                />
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 justify-self-end">
          {showBonus && (
            <button
              className="hidden md:flex items-center gap-1 text-xs font-medium transition"
              style={{ color: secondaryColor }}
              onMouseEnter={(e) => (e.currentTarget.style.color = primaryColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = secondaryColor)}
            >
              <CircleDollarSign size={14} className="translate-y-[1px]" />
              Бонусы
            </button>
          )}
          {showLogin && (
            <button
              className="hidden md:flex items-center gap-2 text-xs rounded-full px-3 py-1 transition"
              style={{ backgroundColor: buttonBg, color: buttonText }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = buttonHover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = buttonBg
              }}
            >
              <LogIn size={14} className="translate-y-[1px]" />
              Войти
            </button>
          )}

          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            style={{ color: textColor }}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-6 text-xl px-6"
            style={{ color: textColor }}
          >
            <button
              className="absolute top-4 right-4"
              onClick={() => setMobileOpen(false)}
            >
              <X size={32} />
            </button>
            {visibleItems.map((item) => (
              <a
                key={item.link}
                href={item.link}
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                {item.label}
              </a>
            ))}
            {showLogin && (
              <button
                className="px-4 py-2 rounded-full text-sm mt-6"
                style={{ backgroundColor: buttonBg, color: buttonText }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = buttonHover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = buttonBg
                }}
              >
                Войти
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}