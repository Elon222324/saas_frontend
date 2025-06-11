import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { reviewsSchema } from './reviewsSchema'
import { reviewsDataSchema } from './reviewsDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import ReviewsItemsEditor from './ItemsEditor'
import ReviewsAppearance from './Appearance'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function ReviewsEditor({ block, slug, onChange }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id

  const [dataState, setDataState] = useState(block?.data || {})
  const [settingsState, setSettingsState] = useState(block?.settings || {})

  useEffect(() => {
    setDataState(block?.data || {})
    setSettingsState(block?.settings || {})
  }, [block])

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
    data: settingsState,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange: (update) => {
      setSettingsState(update)
      onChange(prev => ({ ...prev, settings: typeof update === 'function' ? update(prev.settings || {}) : update }))
    },
  })

  const {
    handleFieldChange: handleDataChange,
    handleSaveData,
    showSavedToast: savedData,
    resetButton: resetData,
    showSaveButton: showDataButton,
  } = useBlockData({
    schema: reviewsDataSchema,
    data: dataState,
    block_id,
    slug,
    site_name,
    setData,
    onChange: (update) => {
      setDataState(update)
      onChange(prev => ({ ...prev, data: typeof update === 'function' ? update(prev.data || {}) : update }))
    },
  })

  return (
    <div className="space-y-6 relative">
      {showToast && (
        <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 rounded shadow text-sm transition-opacity duration-300">
          ✅ Порядок сохранён
        </div>
      )}
      {(showSavedToast || savedData) && (
        <div className="text-green-600 text-sm font-medium">
          ✅ {showSavedToast ? 'Внешний вид' : 'Содержимое'} сохранено
        </div>
      )}

      <div className="text-sm text-gray-500 italic pl-1">
        ⚙️ Настройка карточек отзывов: фон, текст, рамка, звёзды
      </div>

      <ReviewsItemsEditor
        schema={reviewsDataSchema}
        data={dataState}
        onTextChange={handleDataChange}
        onSaveData={() => handleSaveData(dataState)}
        showButton={showDataButton}
        resetButton={resetData}
        uiDefaults={uiDefaults}
      />

      <ReviewsAppearance
        schema={reviewsSchema}
        settings={settingsState}
        onChange={handleFieldChange}
        fieldTypes={fieldTypes}
        onSaveAppearance={() => handleSaveAppearance(settingsState)}
        showButton={showSaveButton || settingsState?.custom_appearance === false}
        resetButton={resetButton}
        uiDefaults={uiDefaults}
      />
    </div>
  )
}
