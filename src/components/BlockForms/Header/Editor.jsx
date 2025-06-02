// src/components/BlockForms/Header/HeaderEditor.jsx

import { useSiteSettings } from '@/context/SiteSettingsContext'
import { headerSchema } from '@/config/blockSchemas/Header/headerSchema'
import { headerDataSchema } from '@/config/blockSchemas/Header/headerDataSchema'
import { fieldTypes } from '@/config/fieldTypes'

import HeaderItemsEditor from './ItemsEditor'
import HeaderAppearance from './Appearance'

import { useBlockAppearance } from '@/components/BlockForms/hooks/useBlockAppearance'
import { useBlockData } from '@/components/BlockForms/hooks/useBlockData'

export default function HeaderEditor({ block, data, onChange, slug }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id

  // Appearance (settings_json)
  const {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast: savedAppearance,
    resetButton: resetAppearance,
    showSaveButton: showAppearanceButton,
    uiDefaults,
  } = useBlockAppearance({
    schema: headerSchema,
    data: data,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange,
  })

  // Data (data_json)
  const {
    handleFieldChange: handleDataChange,
    handleSaveData,
    showSavedToast: savedData,
    resetButton: resetData,
    showSaveButton: showDataButton,
  } = useBlockData({
    schema: headerDataSchema,
    data: block?.data || {},
    block_id,
    slug,
    site_name,
    setData,
    onChange,
  })

  return (
    <div className="space-y-6 relative">
      {(savedAppearance || savedData) && (
        <div className="text-green-600 text-sm font-medium">
          ✅ {savedAppearance ? 'Внешний вид' : 'Содержимое'} сохранено
        </div>
      )}

      <div className="text-sm text-gray-500 italic pl-1">
        🧩 Шапка: редактирование содержимого блока
      </div>

      <HeaderItemsEditor
        schema={headerDataSchema}
        data={block?.data || {}}
        onChange={handleDataChange}
        fieldTypes={fieldTypes}
        onSaveData={handleSaveData}
        showButton={showDataButton}
        resetButton={resetData}
      />

      <div className="text-sm text-gray-500 italic pl-1 pt-4 border-t">
        🎨 Редактирование внешнего вида блока
      </div>

      <HeaderAppearance
        schema={headerSchema}
        settings={data}
        onChange={handleFieldChange}
        fieldTypes={fieldTypes}
        onSaveAppearance={handleSaveAppearance}
        showButton={showAppearanceButton || data?.custom_appearance === false}
        resetButton={resetAppearance}
        uiDefaults={uiDefaults}
      />
    </div>
  )
}
