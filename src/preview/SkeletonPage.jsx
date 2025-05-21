import { Header } from './blocks/Header'
import { TopBanner } from './blocks/TopBanner'
import { QuickInfo } from './blocks/QuickInfo'
import { PromoCards } from './blocks/PromoCards'
import { PopularItems } from './blocks/PopularItems'
import { MenuTabs } from './blocks/MenuTabs'
import { ProductGrid } from './blocks/ProductGrid'
import { ReviewsPreview } from './blocks/ReviewsPreview'
import { DeliveryInfo } from './blocks/DeliveryInfo'
import { AboutCompany } from './blocks/AboutCompany'
import { Footer } from './blocks/Footer'
import { Navigation } from './blocks/Navigation'

export const SkeletonPage = ({ settings }) => {
  const currentPage = settings.pages?.find((p) => p.slug === 'index')
  if (!currentPage) return <div>Страница не найдена</div>

  const blocks = (settings.blocks?.[currentPage.slug] || [])
    .filter((b) => b.active)
    .sort((a, b) => a.order - b.order)

  const renderBlock = (block) => {
    const props = { key: block.id, settings: block.settings }

    switch (block.type) {
      case 'header':
        return <Header {...props} />
      case 'navigation':
        return <Navigation {...props} navigation={settings.navigation} />
      case 'banner':
        return <TopBanner {...props} />
      case 'info':
        return <QuickInfo {...props} />
      case 'promo':
        return <PromoCards {...props} />
      case 'products':
        return <PopularItems {...props} />
      case 'tabs':
        return <MenuTabs {...props} />
      case 'product_grid':
        return <ProductGrid {...props} />
      case 'reviews':
        return <ReviewsPreview {...props} />
      case 'text':
        return <AboutCompany {...props} />
      case 'footer':
        return <Footer {...props} />
      default:
        return (
          <div
            key={block.id}
            className="h-24 bg-red-100 border border-red-300 my-4 flex items-center justify-center text-sm text-red-600"
          >
            Неизвестный блок: {block.type}
          </div>
        )
    }
  }

  return <>{blocks.map(renderBlock)}</>
}
