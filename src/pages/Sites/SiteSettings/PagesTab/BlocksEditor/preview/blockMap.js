import NavigationPreview from '@blocks/forms/Navigation/NavigationPreview'
import HeaderPreview from '@blocks/forms/Header/HeaderPreview'
import BannerPreview from '@blocks/forms/Banner/BannerPreview'
import QuickInfoPreview from '@blocks/forms/QuickInfo/QuickInfoPreview'
import PromoCardsPreview from '@blocks/forms/PromoCards/PromoCardsPreview'
import PopularItemsPreview from '@blocks/forms/PopularItems/PopularItemsPreview'
import ReviewsPreview from '@blocks/forms/Reviews/ReviewsPreview'

export const previewBlocks = {
  navigation: NavigationPreview,
  header: HeaderPreview, // ✅
  banner: BannerPreview,
  info: QuickInfoPreview,
  promo: PromoCardsPreview,
  products: PopularItemsPreview,
  reviews: ReviewsPreview,
}

// Добавляй сюда остальные блоки по мере добавления
