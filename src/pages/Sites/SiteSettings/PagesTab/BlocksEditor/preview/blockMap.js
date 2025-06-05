import NavigationPreview from '@blocks/forms/Navigation/NavigationPreview'
import HeaderPreview from '@blocks/forms/Header/HeaderPreview'
import BannerPreview from '@blocks/forms/Banner/BannerPreview'
import QuickInfoPreview from '@blocks/forms/QuickInfo/QuickInfoPreview'
import PromoCardsPreview from '@blocks/forms/PromoCards/PromoCardsPreview'

export const previewBlocks = {
  navigation: NavigationPreview,
  header: HeaderPreview, // ✅
  banner: BannerPreview,
  info: QuickInfoPreview,
  promo: PromoCardsPreview,
}

// Добавляй сюда остальные блоки по мере добавления
