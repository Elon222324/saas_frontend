import { ArrowRight } from 'lucide-react'
import pizzaImg from '/images/1.png'

export const TopBanner = ({ settings = {}, data = {}, commonSettings = {} }) => {
  const isCustom = settings?.custom_appearance === true
  const source = isCustom ? settings : commonSettings

  const reverse = source?.reverse_layout === true
  const layout = source?.layout_variant || 'wide'
  const hoverEffect = source?.hover_effect !== false
  const imgStyle = source?.img_style || 'default'

  const titleText = data?.title_text || 'Дарим подарки'
  const subtitleText = data?.subtitle_text || 'Выбирай на свой вкус из нашего ассортимента!'
  const buttonText = data?.button_text || 'Подробнее'

  const rawImagePath = data?.image_url || ''
  const baseUrl = import.meta.env.VITE_LIBRARY_ASSETS_URL || ''
  const imageUrl = rawImagePath.startsWith('/sites') ? baseUrl + rawImagePath : pizzaImg

  const getGradient = () => {
    if (isCustom) {
      const from = source?.bg_gradient_from || '#1976D2'
      const to = source?.bg_gradient_to || '#90CAF9'
      return `linear-gradient(to right, ${from}, ${to})`
    }
    const from = source?.background?.gradient_from || '#1976D2'
    const to = source?.background?.gradient_to || '#90CAF9'
    return `linear-gradient(to right, ${from}, ${to})`
  }

  const style = {
    backgroundImage: getGradient(),
    '--text-color': isCustom ? source?.text_color : source?.text?.primary || '#212121',
    '--button-bg-color': isCustom ? source?.button_bg_color : source?.button?.bg || '#1976D2',
    '--button-text-color': isCustom ? source?.button_text_color : source?.button?.text || '#FFFFFF',
    '--button-hover-color': isCustom ? source?.button_hover_color : source?.button?.hover_bg || '#1259A8',
  }

  const imageClass = `relative z-10 w-[280px] lg:w-[320px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition duration-300 ${hoverEffect ? 'hover:scale-110' : ''} ${imgStyle === 'glow' ? 'animate-pulse-slow' : ''}`

  return (
    <div className={`w-full py-2 sm:py-3 ${layout === 'narrow' ? 'max-w-4xl mx-auto' : ''}`}>
      <div
        className="relative overflow-hidden mx-auto max-w-7xl rounded-3xl transition-shadow duration-300 hover:shadow-2xl"
        style={style}
      >
        {/* 📱 Мобильная версия */}
        <div className="flex md:hidden items-center gap-4 px-4 py-4">
          <img
            src={imageUrl}
            alt="Banner"
            className="w-[90px] h-[90px] object-contain transition duration-300 hover:scale-110"
          />
          <div className="flex flex-col justify-center text-[var(--text-color)]">
            <h2 className="text-lg font-extrabold">{titleText}</h2>
            <p className="text-sm text-white/90 leading-tight">
              {subtitleText}
            </p>
            <button className="mt-2 group inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs shadow transition bg-[var(--button-bg-color)] text-[var(--button-text-color)] hover:bg-[var(--button-hover-color)]">
              {buttonText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 💻 Десктопная версия */}
        <div className="hidden md:flex items-center justify-between px-10 lg:px-16 py-8 gap-8">
          {!reverse && (
            <div className="w-1/2 text-left space-y-4 z-10 text-[var(--text-color)]">
              <h2 className="text-sm md:text-base font-semibold drop-shadow transition duration-300 hover:scale-105">
                {titleText}
              </h2>
              <p className="text-xs md:text-sm text-white/90 transition duration-300 hover:scale-105">
                {subtitleText}
              </p>
              <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm shadow transition duration-300 hover:scale-105 bg-[var(--button-bg-color)] text-[var(--button-text-color)] hover:bg-[var(--button-hover-color)]">
                {buttonText}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}
          <div className="relative w-1/2 flex justify-center">
            <div className="absolute w-60 h-60 bg-white/20 rounded-full blur-2xl z-0 animate-pulse-slow" />
            <img
              src={imageUrl}
              alt="Banner"
              className={imageClass}
            />
          </div>
          {reverse && (
            <div className="w-1/2 text-left space-y-4 z-10 text-[var(--text-color)]">
              <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow transition duration-300 hover:scale-105">
                {titleText}
              </h2>
              <p className="text-lg md:text-xl text-white/90 transition duration-300 hover:scale-105">
                {subtitleText}
              </p>
              <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm shadow transition duration-300 hover:scale-105 bg-[var(--button-bg-color)] text-[var(--button-text-color)] hover:bg-[var(--button-hover-color)]">
                {buttonText}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
