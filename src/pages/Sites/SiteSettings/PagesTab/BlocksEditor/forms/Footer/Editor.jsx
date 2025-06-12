import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { footerSchema } from './footerSchema'
import { createFooterDataSchema } from './footerDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import FooterItemsEditor from './ItemsEditor'
import FooterAppearance from './Appearance'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function FooterEditor({
  block,
  data,
  onChange,
  slug,
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
    showSavedToast,
    resetButton,
    showSaveButton,
    uiDefaults,
  } = useBlockAppearance({
    schema: footerSchema,
    data: settingsState,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange: update => {
      setSettingsState(update)
      onChange(prev => ({
        ...prev,
        settings: typeof update === 'function' ? update(prev.settings || {}) : update,
      }))
    },
  })

  const {
    handleFieldChange: handleDataChange,
    handleSaveData,
    showSavedToast: savedData,
    resetButton: resetData,
    showSaveButton: showDataButton,
  } = useBlockData({
    schema: createFooterDataSchema(settingsState?.show_social_icons),
    data: dataState,
    block_id,
    slug,
    site_name,
    setData,
    onChange: update => {
      setDataState(update)
      onChange(prev => ({
        ...prev,
        data: typeof update === 'function' ? update(prev.data || {}) : update,
      }))
    },
  })

  useEffect(() => {
    onFloatingChange?.(showSaveButton || showDataButton)
  }, [onFloatingChange, showSaveButton, showDataButton])

  useEffect(() => {
    onSaveHandlers?.({
      handleSaveData: () => handleSaveData(dataState),
      handleSaveAppearance: () => handleSaveAppearance(settingsState),
    })
  }, [onSaveHandlers, handleSaveData, handleSaveAppearance, dataState, settingsState])

  return (
    <div className="space-y-6 relative">
      {(showSavedToast || savedData) && (
        <div className="text-green-600 text-sm font-medium">
          ✅ {showSavedToast ? 'Внешний вид' : 'Содержимое'} сохранено
        </div>
      )}

      <div className="text-sm text-gray-500 italic pl-1">
        ⚙️ Настройка подвала: цвета фона, текста и линии
      </div>

      <FooterItemsEditor
        schema={createFooterDataSchema(settingsState?.show_social_icons)}
        data={dataState}
        onTextChange={handleDataChange}
        onSaveData={() => handleSaveData(dataState)}
        showButton={showDataButton}
        resetButton={resetData}
        uiDefaults={uiDefaults}
      />

      <FooterAppearance
        schema={footerSchema}
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
