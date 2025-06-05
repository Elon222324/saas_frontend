// src/pages/Sites/SiteSettings/PagesTab/BlocksEditor/preview/BlockDetails.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { previewBlocks } from './blockMap'

// Импорты редакторов блоков
import NavigationEditor from '@blocks/forms/Navigation'
import HeaderEditor from '@blocks/forms/Header'
import BannerEditor from '@blocks/forms/Banner'
import QuickInfoEditor from '@blocks/forms/QuickInfo'
import PromoEditor from '@blocks/forms/PromoCards'
import ProductsEditor from '@blocks/forms/PopularItems'
import TabsEditor from '@blocks/forms/MenuTabs'
import ProductGridEditor from '@blocks/forms/ProductGrid'
import ReviewsEditor from '@blocks/forms/Reviews'
import DeliveryEditor from '@blocks/forms/Delivery'
import TextEditor from '@blocks/forms/Text'
import FooterEditor from '@blocks/forms/Footer'

export default function BlockDetails({ block, data, onSave }) {
  const [form, setForm] = useState({})
  const { slug } = useParams()
  const { site_name, data: siteData } = useSiteSettings()

  useEffect(() => {
    if (!block?.real_id) return

    const combinedSettings = { ...(data?.settings || data || {}), ...(block.settings || {}) }
    const combinedData = { ...(data?.data || {}), ...(block.data || {}) }

    setForm({
      ...combinedSettings,
      ...combinedData,
      data: { ...combinedData },
      settings: { ...combinedSettings },
      block_id: block.real_id,
      slug: block.slug,
      id: block.id,
      type: block.type,
      order: block.order,
      active: block.active,
      label: block.label,
    })
  }, [block, data])

  if (!block || !block.real_id) {
    return <p className="text-gray-500 text-sm">❗ Выберите блок для редактирования</p>
  }

  const renderPreview = () => {
    const PreviewComponent = previewBlocks[block.type]
    if (!PreviewComponent) {
      return (
        <div className="border rounded shadow-sm p-4 bg-gray-50 text-sm text-gray-500">
          Нет визуального preview для блока типа <strong>{block.type}</strong>
        </div>
      )
    }

    const previewProps = { settings: form.settings || form }

    if (block.type === 'navigation') {
      previewProps.settings = { ...(form.settings || {}) }
    }

    if (block.type === 'header') {
      previewProps.data = form.data || form
      previewProps.commonSettings = siteData?.common || {}
      previewProps.navigation =
        siteData?.navigation?.filter(n => n.block_id === block.real_id && n.visible) || []
    }

    if (['banner', 'info', 'promo'].includes(block.type)) {
      previewProps.data = form.data || form
      previewProps.commonSettings = siteData?.common || {}
    }

    return (
      <div>
        <PreviewComponent {...previewProps} />
      </div>
    )
  }

  const mergedBlock = { ...block, settings: form.settings, data: form.data }

  const sharedProps = {
    block: mergedBlock,
    data: form,
    onChange: setForm,
    slug,
    site_name,
  }

  const renderEditor = () => {
    switch (block.type) {
      case 'navigation':
        return <NavigationEditor {...sharedProps} />
      case 'header':
        return <HeaderEditor {...sharedProps} />
      case 'banner':
        return <BannerEditor {...sharedProps} />
      case 'info':
        return <QuickInfoEditor {...sharedProps} />
      case 'promo':
        return <PromoEditor {...sharedProps} />
      case 'products':
        return <ProductsEditor {...sharedProps} />
      case 'tabs':
        return <TabsEditor {...sharedProps} />
      case 'product_grid':
        return <ProductGridEditor {...sharedProps} />
      case 'reviews':
        return <ReviewsEditor {...sharedProps} />
      case 'delivery':
        return <DeliveryEditor {...sharedProps} />
      case 'text':
        return <TextEditor {...sharedProps} />
      case 'footer':
        return <FooterEditor {...sharedProps} />
      default:
        return (
          <p className="text-sm text-gray-500">
            Редактор блока "{block.type}" пока не реализован
          </p>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-white pt-2 pb-4">
        {renderPreview()}
      </div>
      <h2 className="text-lg font-semibold mt-4">
        Редактирование "{block.label || block.type}"
      </h2>
      <div className="space-y-4">{renderEditor()}</div>
    </div>
  )
}
