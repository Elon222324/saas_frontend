import { useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { reviewsSchema } from '@/config/blockSchemas/reviewsSchema'
import { fieldTypes } from '@/config/fieldTypes'
import ReviewsItemsEditor from './ItemsEditor'
import ReviewsAppearance from './Appearance'
import { useBlockAppearance } from '@/components/BlockForms/hooks/useBlockAppearance'

export default function ReviewsEditor({ block, data, onChange, slug }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id
  const [showToast, setShowToast] = useState(false)

  const {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast,
    resetButton,
    showSaveButton,
    uiDefaults,
  } = useBlockAppearance({
    schema: reviewsSchema,
    data,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange,
  })

  return (
    <div className="space-y-6 relative">
      {showToast && (
        <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 rounded shadow text-sm transition-opacity duration-300">
          ✅ Порядок сохранён
        </div>
      )}
      {showSavedToast && (
        <div className="text-green-600 text-sm font-medium">✅ Внешний вид сохранён</div>
      )}

      <div className="text-sm text-gray-500 italic pl-1">
        ⚙️ Настройка карточек отзывов: фон, текст, рамка, звёзды
      </div>

      <ReviewsItemsEditor
        settings={data}
        siteName={site_name}
        siteData={siteData}
        setData={setData}
        onChange={onChange}
        setShowToast={setShowToast}
      />

      <ReviewsAppearance
        schema={reviewsSchema}
        settings={data}
        onChange={handleFieldChange}
        fieldTypes={fieldTypes}
        onSaveAppearance={handleSaveAppearance}
        showButton={showSaveButton || data?.custom_appearance === false}
        resetButton={resetButton}
        uiDefaults={uiDefaults}
      />
    </div>
  )
}
