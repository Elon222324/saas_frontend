// src/components/BlockDetails.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { previewBlocks } from '@/preview/blockMap'

// Импорты редакторов блоков
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
  const { site_name } = useSiteSettings() // Используем useSiteSettings для получения глобальных данных

  useEffect(() => {
    if (!block?.real_id) return // `data` из useSiteSettings не является зависимостью для инициализации form здесь.
                               // Мы используем `block` пропс, который уже содержит нужные данные.

    console.log('📦 BlockDetails: Исходный пропс "block" (полный объект блока):', block);
    // Инициализируем состояние формы, разворачивая вложенные объекты settings и data блока
    setForm({
      ...block.settings, // Разворачиваем настройки (alignment, padding_x, text_color и т.д.)
      ...block.data,     // Разворачиваем данные контента (city, subtitle, rating_value и т.д.)
      block_id: block.real_id, // Добавляем block_id
      slug: block.slug,        // Добавляем slug
      id: block.id,            // Добавляем остальные мета-данные блока
      type: block.type,
      order: block.order,
      active: block.active,
      label: block.label,
    })

    // Логируем инициализированное состояние формы
    console.log('📦 BlockDetails: Инициализированное состояние формы (form):', form);

  }, [block]) // Зависимость только от `block`, так как `form` формируется из его свойств.
              // `data` из useSiteSettings не влияет на инициализацию `form` здесь.

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
      <div>
        {/* В PreviewComponent передаем "form" как "settings".
            Теперь "form" - это плоский объект со всеми полями. */}
        <PreviewComponent settings={form} />
      </div>
    )
  }

  const sharedProps = {
    block,
    data: form, // Теперь 'data' для редакторов это плоский объект 'form'
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
      {renderPreview()}
      <h2 className="text-lg font-semibold mt-4">
        Редактирование "{block.label || block.type}"
      </h2>
      <div className="space-y-4">{renderEditor()}</div>
    </div>
  )
}