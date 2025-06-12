import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { deliverySchema } from './deliverySchema'
import { deliveryDataSchema } from './deliveryDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import DeliveryItemsEditor from './ItemsEditor'
import DeliveryAppearance from './Appearance'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function DeliveryEditor({
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
    schema: deliverySchema,
    data: settingsState,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange: (update) => {
      setSettingsState(prev => (typeof update === 'function' ? update(prev) : update))
      onChange(prev => ({
        ...prev,
        settings: typeof update === 'function' ? update(prev.settings || {}) : update,
      }))
    },
  })

  const {
    handleFieldChange: handleTextFieldChange,
    handleSaveData,
    showSavedToast: savedData,
    resetButton: resetData,
    showSaveButton: showDataButton,
  } = useBlockData({
    schema: deliveryDataSchema,
    data: dataState,
    block_id,
    slug,
    site_name,
    setData,
    onChange: (update) => {
      setDataState(prev => (typeof update === 'function' ? update(prev) : update))
      onChange(prev => ({
        ...prev,
        data: typeof update === 'function' ? update(prev.data || {}) : update,
      }))
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

      <DeliveryItemsEditor
        schema={deliveryDataSchema}
        data={dataState}
        onTextChange={handleTextFieldChange}
        onSaveData={() => handleSaveData(dataState)}
        showButton={showDataButton}
        resetButton={resetData}
        uiDefaults={uiDefaults}
      />

      <div className="text-sm text-gray-500 italic pl-1">
        ⚙️ Настройка блока доставки: фон, карточки, тени, цвета текста
      </div>

      <DeliveryAppearance
        schema={deliverySchema}
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
