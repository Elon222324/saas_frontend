import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { productsSchema } from './productsSchema'
import { productsDataSchema } from './productsDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import ProductsItemsEditor from './ItemsEditor'
import ProductsAppearance from './Appearance'
import PopularItemsPreview from './PopularItemsPreview'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function ProductsEditor({ block, slug, onChange }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id
  const [showToast, setShowToast] = useState(false)
  const [dataState, setDataState] = useState(block?.data || {})
  const [settingsState, setSettingsState] = useState(block?.settings || {})

  useEffect(() => {
    setDataState(block?.data || {})
    setSettingsState(block?.settings || {})
  }, [block])

  const {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast: savedAppearance,
    resetButton: resetAppearance,
    showSaveButton: showAppearanceButton,
    uiDefaults,
  } = useBlockAppearance({
    schema: productsSchema,
    data: settingsState,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange: (update) => {
      setSettingsState(update)
      onChange(prev => {
        const resolved = typeof update === 'function' ? update(prev.settings || {}) : update
        return { ...prev, ...resolved, settings: resolved }
      })
    },
  })

  const {
    handleFieldChange: handleDataChange,
    handleSaveData,
    showSavedToast: savedData,
    resetButton: resetData,
    showSaveButton: showDataButton,
  } = useBlockData({
    schema: productsDataSchema,
    data: dataState,
    block_id,
    slug,
    site_name,
    setData,
    onChange: (update) => {
      setDataState(update)
      onChange(prev => {
        const resolved = typeof update === 'function' ? update(prev.data || {}) : update
        return { ...prev, ...resolved, data: resolved }
      })
    },
  })

  return (
    <div className="space-y-6 relative">
      {showToast && (
        <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 rounded shadow text-sm transition-opacity duration-300">
          ✅ Порядок сохранён
        </div>
      )}
      {(savedAppearance || savedData) && (
        <div className="text-green-600 text-sm font-medium">
          ✅ {savedAppearance ? 'Внешний вид' : 'Содержимое'} сохранено
        </div>
      )}

      <div className="text-sm text-gray-500 italic pl-1">
        ⚙️ Настройка внешнего вида карточек товаров
      </div>

      <ProductsItemsEditor
        settings={settingsState}
        data={dataState}
        siteName={site_name}
        siteData={siteData}
        setData={setData}
        onChange={handleDataChange}
        setShowToast={setShowToast}
        onSaveData={() => handleSaveData(dataState)}
        showButton={showDataButton}
        resetButton={resetData}
      />

      <ProductsAppearance
        schema={productsSchema}
        settings={settingsState}
        onChange={handleFieldChange}
        fieldTypes={fieldTypes}
        onSaveAppearance={() => handleSaveAppearance(settingsState)}
        showButton={showAppearanceButton || settingsState?.custom_appearance === false}
        resetButton={resetAppearance}
        uiDefaults={uiDefaults}
      />

      <div className="text-sm text-gray-500 italic pl-1 pt-4 border-t">
        👁️ Живой предпросмотр блока
      </div>

      <div className="border rounded p-4 bg-white shadow-inner">
        <PopularItemsPreview
          settings={settingsState}
          data={dataState}
          commonSettings={siteData?.common || {}}
        />
      </div>
    </div>
  )
}
