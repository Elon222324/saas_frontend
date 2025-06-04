import { useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { headerSchema } from '@/config/blockSchemas/Header/headerSchema'
import { headerDataSchema } from '@/config/blockSchemas/Header/headerDataSchema'
import { fieldTypes } from '@/config/fieldTypes'

import HeaderItemsEditor from './ItemsEditor'
import HeaderAppearance from './Appearance'
import HeaderPreview from '@/preview/blocks/HeaderPreview'

import { useBlockAppearance } from '@/components/BlockForms/hooks/useBlockAppearance'
import { useBlockData } from '@/components/BlockForms/hooks/useBlockData'

export default function HeaderEditor({ block, slug, onChange }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id

  const [dataState, setDataState] = useState(block?.data || {})
  const [settingsState, setSettingsState] = useState(block?.settings || {})

  const {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast: savedAppearance,
    resetButton: resetAppearance,
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
    onChange: (newSettings) => {
      setSettingsState(newSettings)
      onChange((prevBlockState) => ({
        ...prevBlockState,
        settings: newSettings,
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
    schema: headerDataSchema,
    data: dataState,
    block_id,
    slug,
    site_name,
    setData,
    onChange: (newData) => {
      console.log('HeaderEditor: onChange вызван с newData:', newData)
      setDataState(newData)
      onChange((prevBlockState) => ({
        ...prevBlockState,
        data: newData,
      }))
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
        showButton={showDataButton}
        resetButton={resetData}
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
        showButton={showAppearanceButton || settingsState?.custom_appearance === false}
        resetButton={resetAppearance}
        uiDefaults={uiDefaults}
      />

      <div className="text-sm text-gray-500 italic pl-1 pt-4 border-t">
        👁️ Живой предпросмотр блока
      </div>

      <div className="border rounded p-4 bg-white shadow-inner">
        <HeaderPreview
          settings={settingsState}
          data={dataState}
          commonSettings={siteData?.common || {}}
          navigation={navigation}
        />
      </div>
    </div>
  )
}