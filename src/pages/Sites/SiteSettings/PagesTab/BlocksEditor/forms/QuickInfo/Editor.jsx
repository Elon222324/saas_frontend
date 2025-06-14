import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { quickInfoSchema } from './quickInfoSchema'
import {
  quickInfoDataSchema,
  createQuickInfoDataSchema,
} from './quickInfoDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import QuickInfoItemsEditor from './ItemsEditor'
import QuickInfoAppearance from './Appearance'
import { Tabs, Tab } from '@/components/ui/tabs'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function QuickInfoEditor({ block, slug, onChange }) {
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
    showSaveButton: showDataButton,
  } = useBlockData({
    schema: createQuickInfoDataSchema(settingsState?.grid_cols || 4),
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
        <QuickInfoItemsEditor
          schema={createQuickInfoDataSchema(settingsState?.grid_cols || 4)}
          data={dataState}
          settings={settingsState}
          onTextChange={handleTextFieldChange}
          onSaveData={() => handleSaveData(dataState)}
          uiDefaults={uiDefaults}
        />
      )}

      {activeTab === 'appearance' && (
        <>
          <div className="text-sm text-gray-500 italic pl-1">
            ⚙️ Настройка фона и цветов текста для блока с условиями доставки
          </div>
          <QuickInfoAppearance
            schema={quickInfoSchema}
            settings={settingsState}
            onChange={handleFieldChange}
            fieldTypes={fieldTypes}
            onSaveAppearance={() => handleSaveAppearance(settingsState)}
            uiDefaults={uiDefaults}
          />
        </>
      )}

      {/* Global save button now handles persistence */}
    </div>
  )
}
