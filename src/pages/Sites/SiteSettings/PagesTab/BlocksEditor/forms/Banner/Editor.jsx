import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { bannerSchema } from './bannerSchema'
import { bannerDataSchema } from './bannerDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'

import BannerItemsEditor from './ItemsEditor'
import BannerAppearance from './Appearance'
import BannerPreview from './BannerPreview'

import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function BannerEditor({
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
    schema: bannerSchema,
    data: settingsState,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange: (update) => {
      setSettingsState(prev => (typeof update === 'function' ? update(prev) : update))
      onChange(prev => {
        const resolved = typeof update === 'function' ? update(prev.settings || {}) : update
        return {
          ...prev,
          ...resolved,
          settings: resolved,
        }
      })
    },
  })

  const {
    handleFieldChange: handleTextFieldChange,
    handleSaveData,
    showSavedToast: savedData,
    resetButton: resetData,
    showSaveButton: showDataButton,
  } = useBlockData({
    schema: bannerDataSchema,
    data: dataState,
    block_id,
    slug,
    site_name,
    setData,
    onChange: (update) => {
      setDataState(prev => (typeof update === 'function' ? update(prev) : update))
      onChange(prev => {
        const resolved = typeof update === 'function' ? update(prev.data || {}) : update
        return {
          ...prev,
          ...resolved,
          data: resolved,
        }
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

      <BannerItemsEditor
        schema={bannerDataSchema}
        data={dataState}
        onTextChange={handleTextFieldChange}
        onSaveData={() => handleSaveData(dataState)}
        showButton={showDataButton}
        resetButton={resetData}
      />

      <div className="text-sm text-gray-500 italic pl-1 pt-4 border-t">
        🎨 Редактирование внешнего вида блока
      </div>

      <BannerAppearance
        schema={bannerSchema}
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
