import { useState, useEffect, useRef } from 'react'
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
import AboutCompanyEditor from '@blocks/forms/AboutCompany'
import FooterEditor from '@blocks/forms/Footer'

export default function BlockDetails({ block, data, onSave, onBlockChange }) {
  const [form, setForm] = useState({})
  const [showPreview, setShowPreview] = useState(true)
  const { slug } = useParams()
  const { site_name, data: siteData } = useSiteSettings()
  const initialized = useRef(false)

  useEffect(() => {
    if (!block?.real_id) return

    let parsedSettings = {}
    let parsedData = {}

    try {
      parsedSettings = typeof block.settings === 'string' ? JSON.parse(block.settings) : block.settings || {}
    } catch (err) {
      console.warn('❌ Ошибка парсинга block.settings:', err)
    }

    try {
      parsedData = typeof block.data === 'string' ? JSON.parse(block.data) : block.data || {}
    } catch (err) {
      console.warn('❌ Ошибка парсинга block.data:', err)
    }

    const combinedSettings = {
      ...parsedSettings,
      ...(data?.settings || {}),
    }
    const combinedData = {
      ...parsedData,
      ...(data?.data || {}),
    }

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

    initialized.current = true
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
      previewProps.settings = { block_id: form.block_id, ...(form.settings || {}) }
    }

    if (block.type === 'header') {
      previewProps.data = form.data || form
      previewProps.commonSettings = siteData?.common || {}
      previewProps.navigation =
        siteData?.navigation?.filter(n => n.block_id === block.real_id && n.visible) || []
    }

    if (['banner', 'info', 'promo', 'products', 'reviews', 'delivery', 'footer', 'text'].includes(block.type)) {
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

  const handleChange = (update) => {
    setForm(prev => {
      const resolved =
        typeof update === 'function' ? update(prev) : { ...prev, ...update }

      if (initialized.current && onBlockChange && block?.real_id) {
        queueMicrotask(() => {
          onBlockChange(block.real_id, {
            settings: resolved.settings,
            data: resolved.data,
          })
        })
      }

      return resolved
    })
  }

  const sharedProps = {
    block: mergedBlock,
    data: form,
    onChange: handleChange,
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
        return <AboutCompanyEditor {...sharedProps} />
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
      {showPreview ? (
        <div className="sticky top-0 z-10 bg-white pt-2 pb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">🔍 Предпросмотр</div>
            <button
              onClick={() => setShowPreview(false)}
              className="text-xs text-blue-600 hover:underline"
            >
              ⬆ Скрыть
            </button>
          </div>
          {renderPreview()}
        </div>
      ) : (
        <div className="sticky top-0 z-10 bg-white pt-2 pb-2">
          <button
            onClick={() => setShowPreview(true)}
            className="text-xs text-blue-600 hover:underline"
          >
            ⬇ Показать превью
          </button>
        </div>
      )}
      <h2 className="text-lg font-semibold mt-4">
        Редактирование "{block.label || block.type}"
      </h2>
      <div className="space-y-4">{renderEditor()}</div>
    </div>
  )
}
