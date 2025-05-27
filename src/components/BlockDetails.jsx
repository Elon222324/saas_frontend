// src/components/BlockDetails.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { previewBlocks } from '@/preview/blockMap'

import NavigationEditor from '@/components/BlockForms/Navigation'
import HeaderEditor from '@/components/BlockForms/Header'
import BannerEditor from '@/components/BlockForms/Banner'
import QuickInfoEditor from '@/components/BlockForms/QuickInfo'
import PromoEditor from '@/components/BlockForms/PromoCards'
import ProductsEditor from '@/components/BlockForms/PopularItems'
import TabsEditor from '@/components/BlockForms/MenuTabs'
import ProductGridEditor from '@/components/BlockForms/ProductGrid'
import ReviewsEditor from '@/components/BlockForms/Reviews'
import DeliveryEditor from '@/components/BlockForms/Delivery'
import TextEditor from '@/components/BlockForms/Text'
import FooterEditor from '@/components/BlockForms/Footer'

export default function BlockDetails({ block, data, onSave }) {
  const [form, setForm] = useState({})
  const { slug } = useParams()
  const { site_name } = useSiteSettings()

  useEffect(() => {
    if (!block?.real_id || !data) return
    console.log('📦 BlockDetails получил данные:', data)
    setForm({ ...data, block_id: block.real_id })
  }, [data, block?.real_id])

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

    return (
      <div className="border rounded shadow-sm p-4 bg-white space-y-2">
        <p className="text-sm text-gray-500">Предпросмотр блока:</p>
        <div className="border border-gray-200 rounded p-2 bg-gray-50">
          <PreviewComponent settings={form} />
        </div>
      </div>
    )
  }

  const sharedProps = {
    block,
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
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          Редактирование "{block.label || block.type}"
        </h2>
        {renderPreview()}
      </div>

      <div className="space-y-4">{renderEditor()}</div>
    </div>
  )
}
