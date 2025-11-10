import { useSiteSettings } from '@/context/SiteSettingsContext'
import { useProducts } from '@/pages/Sites/SiteSettings/Catalog/Products/hooks/useProducts'
import { PreviewWrapper } from '@preview/PreviewWrapper'
import { PopularItems } from './PopularItems'

export default function PopularItemsPreview({ settings = {}, data = {}, commonSettings = {} }) {
  const { site_name } = useSiteSettings()
  const { data: products = [] } = useProducts(site_name)

  return (
    <PreviewWrapper>
      <div className="max-w-full mx-auto text-[13px] leading-tight">
        <PopularItems settings={settings} data={data} commonSettings={commonSettings} products={products} />
      </div>
    </PreviewWrapper>
  )
}
