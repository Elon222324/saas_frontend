import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { productsSchema } from './productsSchema'
import { createProductsDataSchema } from './productsDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import ProductsItemsEditor from './ItemsEditor'
import ProductsAppearance from './Appearance'
import PopularItemsPreview from './PopularItemsPreview'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function ProductsEditor({
  block,
  slug,
  onChange,
  onFloatingChange,
  onSaveHandlers,
}) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id
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
    schema: createProductsDataSchema(settingsState?.cards_count || 3),
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

  useEffect(() => {
    onFloatingChange?.(showAppearanceButton || showDataButton)
  }, [onFloatingChange, showAppearanceButton, showDataButton])

  useEffect(() => {
    onSaveHandlers?.({
      handleSaveData: () => handleSaveData(dataState),
      handleSaveAppearance: () => handleSaveAppearance(settingsState),
    })
  }, [onSaveHandlers, handleSaveData, handleSaveAppearance, dataState, settingsState])

  return (
    <div className="space-y-6 relative">
      {(savedAppearance || savedData) && (
        <div className="text-green-600 text-sm font-medium">
          ✅ {savedAppearance ? 'Внешний вид' : 'Содержимое'} сохранено
        </div>
      )}

      <div className="text-sm text-gray-500 italic pl-1">
        ⚙️ Настройка внешнего вида карточек товаров
      </div>

      <ProductsItemsEditor
        schema={createProductsDataSchema(settingsState?.cards_count || 3)}
        data={dataState}
        settings={settingsState}
        onTextChange={handleDataChange}
        onSaveData={() => handleSaveData(dataState)}
        showButton={showDataButton}
        resetButton={resetData}
        uiDefaults={uiDefaults}
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


    </div>
  )
}
