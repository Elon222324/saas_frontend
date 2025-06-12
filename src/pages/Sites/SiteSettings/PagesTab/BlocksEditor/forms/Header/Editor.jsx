import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { headerSchema } from './headerSchema'
import { headerDataSchema } from './headerDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'

import HeaderItemsEditor from './ItemsEditor'
import HeaderAppearance from './Appearance'

import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function HeaderEditor({ block, slug, onChange }) {
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
    showSaveButton: showAppearanceButton,
    uiDefaults,
  } = useBlockAppearance({
    schema: headerSchema,
    data: settingsState,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange: (update) => {
      setSettingsState(update)
      onChange(prevBlockState => {
        const resolved =
          typeof update === 'function'
            ? update(prevBlockState.settings || {})
            : update
        return {
          ...prevBlockState,
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
    showSaveButton: showDataButton,
  } = useBlockData({
    schema: headerDataSchema,
    data: dataState,
    block_id,
    slug,
    site_name,
    setData,
    onChange: (update) => {
      setDataState(update)
      onChange(prevBlockState => {
        const resolved =
          typeof update === 'function'
            ? update(prevBlockState.data || {})
            : update
        return {
          ...prevBlockState,
          ...resolved,
          data: resolved,
        }
      })
    },
  })

  const navigation = siteData?.navigation?.filter(n => n.block_id === block_id && n.visible) || []

  return (
    <div className="space-y-6 relative">
      {(savedAppearance || savedData) && (
        <div className="text-green-600 text-sm font-medium">
          ✅ {savedAppearance ? 'Внешний вид' : 'Содержимое'} сохранено
        </div>
      )}

      <HeaderItemsEditor
        schema={headerDataSchema}
        data={dataState}
        settings={settingsState}
        onTextChange={handleTextFieldChange}
        onColorChange={handleFieldChange}
        fieldTypes={fieldTypes}
        onSaveData={() => handleSaveData(dataState)}
      />

      <div className="text-sm text-gray-500 italic pl-1 pt-4 border-t">
        🎨 Редактирование внешнего вида блока
      </div>

      <HeaderAppearance
        schema={headerSchema}
        settings={settingsState}
        onChange={handleFieldChange}
        fieldTypes={fieldTypes}
        onSaveAppearance={() => handleSaveAppearance(settingsState)}
        uiDefaults={uiDefaults}
      />

      {(showDataButton || showAppearanceButton) && (
        <button
          onClick={() => {
            if (showDataButton) handleSaveData(dataState)
            if (showAppearanceButton) handleSaveAppearance(settingsState)
          }}
          className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition text-sm"
        >
          💾 Сохранить
        </button>
      )}

    </div>
  )
}