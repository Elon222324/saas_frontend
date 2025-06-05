import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { quickInfoSchema } from './quickInfoSchema'
import { quickInfoDataSchema } from './quickInfoDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import QuickInfoItemsEditor from './ItemsEditor'
import QuickInfoAppearance from './Appearance'
import QuickInfoPreview from './QuickInfoPreview'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function QuickInfoEditor({ block, slug, onChange }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id
  const [dataState, setDataState] = useState(block?.data || {})
  const [settingsState, setSettingsState] = useState(block?.settings || {})
  const [showToast, setShowToast] = useState(false)

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
    schema: quickInfoSchema,
    data: settingsState,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange: (update) => {
      setSettingsState(update)
      onChange(prev => {
        const resolved =
          typeof update === 'function' ? update(prev.settings || {}) : update
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
    schema: quickInfoDataSchema,
    data: dataState,
    block_id,
    slug,
    site_name,
    setData,
    onChange: (update) => {
      setDataState(update)
      onChange(prev => {
        const resolved =
          typeof update === 'function' ? update(prev.data || {}) : update
        return {
          ...prev,
          ...resolved,
          data: resolved,
        }
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
        ⚙️ Настройка фона и цветов текста для блока с условиями доставки
      </div>

      <QuickInfoItemsEditor
        settings={settingsState}
        siteName={site_name}
        siteData={siteData}
        setData={setData}
        onChange={onChange}
        setShowToast={setShowToast}
      />

      <QuickInfoAppearance
        schema={quickInfoSchema}
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
        <QuickInfoPreview
          settings={settingsState}
          data={dataState}
          commonSettings={siteData?.common || {}}
        />
      </div>
    </div>
  )
}
