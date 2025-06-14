import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { headerSchema } from './headerSchema'
import { headerDataSchema } from './headerDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'

import HeaderItemsEditor from './ItemsEditor'
import HeaderAppearance from './Appearance'

import { Tabs, Tab } from '@/components/ui/tabs'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function HeaderEditor({ block, slug, onChange }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id

  const [activeTab, setActiveTab] = useState('data')
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

  return (
    <div className="space-y-6 relative">
      {(savedAppearance || savedData) && (
        <div className="text-green-600 text-sm font-medium">
          ✅ {savedAppearance ? 'Внешний вид' : 'Содержимое'} сохранено
        </div>
      )}

      <Tabs value={activeTab} onChange={setActiveTab} className="mb-4">
        <Tab value="data">Данные</Tab>
        <Tab value="appearance">Дизайн</Tab>
      </Tabs>

      {activeTab === 'data' && (
        <HeaderItemsEditor
          schema={headerDataSchema}
          data={dataState}
          settings={settingsState}
          onTextChange={handleTextFieldChange}
          onColorChange={handleFieldChange}
          fieldTypes={fieldTypes}
          onSaveData={() => handleSaveData(dataState)}
        />
      )}

      {activeTab === 'appearance' && (
        <HeaderAppearance
          schema={headerSchema}
          settings={settingsState}
          onChange={handleFieldChange}
          fieldTypes={fieldTypes}
          onSaveAppearance={() => handleSaveAppearance(settingsState)}
          uiDefaults={uiDefaults}
        />
      )}

      {/* Removed per-block save button */}
    </div>
  )
}
