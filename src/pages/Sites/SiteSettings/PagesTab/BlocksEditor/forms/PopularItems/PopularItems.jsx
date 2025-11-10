import pizzaImg from '/images/8.webp'
import { getImageVariants } from '@/utils/imageVariants'
import { useMemo } from 'react'

export const PopularItems = ({ settings = {}, data = {}, commonSettings = {}, products = [] }) => {
  const backgroundColor = settings.bg_color ?? commonSettings.background?.card ?? '#FFFFFF'
  const borderColor = settings.border_color ?? commonSettings.text?.primary ?? '#212121'
  const titleColor = settings.title_color ?? commonSettings.text?.primary ?? '#212121'
  const priceColor = settings.price_color ?? commonSettings.text?.secondary ?? '#666666'

  const shadowMap = {
    none: 'shadow-none',
    low: 'shadow-sm',
    medium: 'shadow',
    high: 'shadow-lg',
  }
  const cardShadow = shadowMap[settings.card_shadow ?? 'low'] || 'shadow-sm'

  const radius = settings.card_radius ?? 12
  const spacingX = settings.spacing_x ?? 16
  const fontSizeTitle = settings.font_size_title ?? 16
  const fontSizePrice = settings.font_size_price ?? 14
  const paddingTop = settings.padding_top ?? 32
  const paddingBottom = settings.padding_bottom ?? 40

  const imageSizeMap = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  }
  const imageSize = imageSizeMap[settings.image_size ?? 'medium'] || 'w-24 h-24'

  const productsMap = useMemo(() => {
    if (!Array.isArray(products)) return new Map()
    return new Map(products.map(p => [p.id, p]))
  }, [products])

  const items = useMemo(() => {
    if (!Array.isArray(data?.items)) return []

    return data.items
      .map(item => {
        const product = productsMap.get(item?.product_id)
        if (!product) return null
        
        return {
          id: product.id,
          name: product.title || product.name || 'Товар без названия',
          price: product.variants?.[0]?.price ? `${product.variants[0].price} ₽` : (product.price ? `${product.price} ₽` : ''),
          img_url: product.image_url || product.img_url || pizzaImg,
        }
      })
      .filter(Boolean)
  }, [data?.items, productsMap])

  const baseUrl = import.meta.env.VITE_LIBRARY_ASSETS_URL || ''

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
              src={(() => {
                const fullPath = item.img_url
                  ? item.img_url.startsWith('http')
                    ? item.img_url
                    : (item.img_url.startsWith('/') ? baseUrl + item.img_url : item.img_url)
                  : pizzaImg;
                const { small } = getImageVariants(fullPath);
                return small || fullPath;
              })()}
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
