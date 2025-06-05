import pizzaImg from '/images/8.webp'

export const PopularItems = ({ settings = {}, data = {}, commonSettings = {} }) => {
  const isCustom = settings?.custom_appearance === true

  const source = isCustom
    ? settings
    : {
        bg_color: commonSettings.background?.card,
        border_color: commonSettings.text?.primary,
        title_color: commonSettings.text?.primary,
        price_color: commonSettings.text?.secondary,
        card_shadow: 'low',
        card_radius: 12,
        font_size_title: 16,
        font_size_price: 14,
        spacing_x: 16,
        image_size: 'medium',
        padding_top: 32,
        padding_bottom: 100,
      }

  const backgroundColor = source?.bg_color || '#FFFFFF'
  const borderColor = source?.border_color || '#212121'
  const titleColor = source?.title_color || '#212121'
  const priceColor = source?.price_color || '#666666'

  const shadowMap = {
    none: 'shadow-none',
    low: 'shadow-sm',
    medium: 'shadow',
    high: 'shadow-lg',
  }
  const cardShadow = shadowMap[source?.card_shadow] || 'shadow-sm'

  const radius = source?.card_radius || 12
  const spacingX = source?.spacing_x || 16
  const fontSizeTitle = source?.font_size_title || 16
  const fontSizePrice = source?.font_size_price || 14
  const paddingTop = source?.padding_top ?? 32
  const paddingBottom = source?.padding_bottom ?? 40

  const imageSizeMap = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  }
  const imageSize = imageSizeMap[source?.image_size] || 'w-24 h-24'

  const defaultItems = [
    { id: 1, name: 'Пепперони фреш', price: 'от 409 ₽' },
    { id: 2, name: '3 пиццы 30 см', price: '1 449 ₽' },
    { id: 3, name: '2 соуса', price: '75 ₽' },
  ]

  const items = data.items?.length ? data.items : defaultItems

  const cssVars = {
    '--padding-top': `${paddingTop}px`,
    '--padding-bottom': `${paddingBottom}px`,
  }

  const title = data.title || 'Часто заказывают'

  return (
    <div
      className="relative z-0 overflow-visible w-full"
      style={cssVars}
    >
      <h2
        className="text-lg font-bold mb-4"
        style={{ color: titleColor, fontSize: `${fontSizeTitle}px` }}
      >
        {title}
      </h2>
      <div className="flex overflow-x-auto no-scrollbar" style={{ gap: `${spacingX}px` }}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative z-10 flex w-[260px] flex-shrink-0 rounded-xl ${cardShadow}`}
            style={{ backgroundColor, borderRadius: `${radius}px` }}
          >
            <div
              className="absolute inset-0 pointer-events-none rounded-xl z-0"
              style={{
                outline: `1px solid ${borderColor}`,
                outlineOffset: '-1px',
                opacity: 0.2,
                borderRadius: `${radius}px`,
              }}
            />
            <img
              src={pizzaImg}
              alt={item.name}
              className={`${imageSize} object-cover`}
            />
            <div className="p-3 flex flex-col justify-center">
              <div
                className="font-semibold"
                style={{ color: titleColor, fontSize: `${fontSizeTitle}px` }}
              >
                {item.name}
              </div>
              <div
                className="mt-1 opacity-70"
                style={{ color: priceColor, fontSize: `${fontSizePrice}px` }}
              >
                {item.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
