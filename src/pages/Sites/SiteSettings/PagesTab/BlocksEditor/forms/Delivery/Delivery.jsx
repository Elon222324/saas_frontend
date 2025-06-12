import mapImage from '/images/7.webp'

export const Delivery = ({ settings = {}, data = {}, commonSettings = {} }) => {
  const isCustom = settings?.custom_appearance === true
  const source = isCustom
    ? settings
    : {
        background_color: commonSettings.background?.base,
        text_color: commonSettings.text?.primary,
        desc_color: commonSettings.text?.secondary,
        icon_color: commonSettings.icon?.default,
        card_bg_color: commonSettings.background?.card,
        card_shadow: commonSettings.shadow?.default || 'medium',
        map_border_radius: 16,
        map_shadow: 'medium',
        section_spacing_top: 48,
        section_spacing_bottom: 48,
        font_size_title: 20,
        font_size_desc: 14,
      }

  const bg = source?.background_color || '#FFFFFF'
  const titleColor = source?.text_color || '#212121'
  const descColor = source?.desc_color || '#666666'
  const accentColor = source?.icon_color || '#1976D2'
  const cardBg = source?.card_bg_color || '#FFFFFF'
  const mapBorderRadius = source?.map_border_radius || 16
  const sectionPaddingTop = source?.section_spacing_top || 48
  const sectionPaddingBottom = source?.section_spacing_bottom || 48
  const fontSizeTitle = source?.font_size_title || 20
  const fontSizeDesc = source?.font_size_desc || 14

  const shadowMap = {
    none: 'shadow-none',
    low: 'shadow-sm',
    medium: 'shadow',
    high: 'shadow-lg',
  }
  const cardShadowClass = shadowMap[source?.card_shadow] || 'shadow'
  const mapShadowClass = shadowMap[source?.map_shadow] || 'shadow'

  const sectionTitle = data.section_title || 'Доставка и оплата в Анапе'
  const bannerTitle = data.banner_title || '60 МИНУТ ИЛИ ПИЦЦА БЕСПЛАТНО'
  const bannerLine1 =
    data.banner_line1 ||
    'Если не успеем доставить за 60 минут, вы получите извинительную пиццу. Её можно будет добавить в один из следующих заказов.'
  const bannerLine2 = data.banner_line2 || 'Все цены в меню указаны без учета скидок.'
  const minOrderValue = data.min_order_value || 'От 699₽'
  const minOrderDesc = data.min_order_desc || 'Минимальная сумма доставки'
  const maxCashValue = data.max_cash_value || '5 000₽'
  const maxCashDesc = data.max_cash_desc || 'Максимальная сумма при оплате наличными'
  const infoFooter =
    data.info_footer || 'Изображения продуктов могут отличаться от продуктов в заказе.'
  const mapTitle = data.map_title || 'ЗОНА ДОСТАВКИ ОГРАНИЧЕНА'

  const rawMap = data.map_image || mapImage
  const assetsBase = import.meta.env.VITE_LIBRARY_ASSETS_URL || ''
  const mapUrl = rawMap.startsWith('/') ? assetsBase + rawMap : rawMap

  return (
    <div
      className="w-full px-4 sm:px-6 lg:px-12"
      style={{ backgroundColor: bg, paddingTop: sectionPaddingTop, paddingBottom: sectionPaddingBottom }}
    >
      <h2 className="font-bold mb-8" style={{ color: titleColor, fontSize: `${fontSizeTitle}px` }}>
        {sectionTitle}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
        <div>
          <h3 className="font-semibold mb-2" style={{ color: accentColor, fontSize: `${fontSizeTitle}px` }}>
            {bannerTitle}
          </h3>
          <p className="mb-4" style={{ color: descColor, fontSize: `${fontSizeDesc}px` }}>
            {bannerLine1}
          </p>
          <p style={{ color: descColor, fontSize: `${fontSizeDesc}px` }}>{bannerLine2}</p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-semibold" style={{ color: accentColor, fontSize: `${fontSizeTitle}px` }}>
              {minOrderValue}
            </p>
            <p style={{ color: descColor, fontSize: `${fontSizeDesc}px` }}>{minOrderDesc}</p>
          </div>
          <div>
            <p className="font-semibold" style={{ color: accentColor, fontSize: `${fontSizeTitle}px` }}>
              {maxCashValue}
            </p>
            <p style={{ color: descColor, fontSize: `${fontSizeDesc}px` }}>{maxCashDesc}</p>
          </div>
          <div>
            <p style={{ color: descColor, fontSize: `${fontSizeDesc}px` }}>{infoFooter}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-center" style={{ color: accentColor, fontSize: `${fontSizeTitle}px` }}>
            {mapTitle}
          </h3>
          <div
            className={`w-full aspect-square overflow-hidden border ${mapShadowClass}`}
            style={{ backgroundColor: cardBg, borderRadius: mapBorderRadius }}
          >
            <img
              src={mapUrl}
              alt="Зона доставки"
              className="w-full h-full object-cover"
              style={{ borderRadius: mapBorderRadius }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Delivery
