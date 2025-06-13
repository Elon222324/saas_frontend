import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { footerSchema } from './footerSchema'
import { createFooterDataSchema } from './footerDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import FooterItemsEditor from './ItemsEditor'
import FooterAppearance from './Appearance'
import { Tabs, Tab } from '@/components/ui/tabs'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function FooterEditor({ block, data, onChange, slug }) {
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
    showSavedToast,
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

  return (
    <div className="space-y-6 relative">
      {(showSavedToast || savedData) && (
        <div className="text-green-600 text-sm font-medium">
          ✅ {showSavedToast ? 'Внешний вид' : 'Содержимое'} сохранено
        </div>
      )}

      <Tabs value={activeTab} onChange={setActiveTab} className="mb-4">
        <Tab value="data">Данные</Tab>
        <Tab value="appearance">Дизайн</Tab>
      </Tabs>

      {activeTab === 'data' && (
        <FooterItemsEditor
          schema={createFooterDataSchema(settingsState?.show_social_icons)}
          data={dataState}
          onTextChange={handleDataChange}
          onSaveData={() => handleSaveData(dataState)}
          uiDefaults={uiDefaults}
        />
      )}

      {activeTab === 'appearance' && (
        <>
          <div className="text-sm text-gray-500 italic pl-1">
            ⚙️ Настройка подвала: цвета фона, текста и линии
          </div>
          <FooterAppearance
            schema={footerSchema}
            settings={settingsState}
            onChange={handleFieldChange}
            fieldTypes={fieldTypes}
            onSaveAppearance={() => handleSaveAppearance(settingsState)}
            uiDefaults={uiDefaults}
          />
        </>
      )}

      {(showDataButton || showSaveButton) && null}
    </div>
  )
}
