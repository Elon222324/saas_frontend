import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { aboutSchema } from './aboutSchema'
import { aboutDataSchema } from './aboutDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import TextItemsEditor from './ItemsEditor'
import TextAppearance from './Appearance'
import { Tabs, Tab } from '@/components/ui/tabs'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function TextEditor({ block, slug, onChange }) {
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
    schema: aboutSchema,
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
        settings:
          typeof update === 'function' ? update(prev.settings || {}) : update,
      }))
    },
  })

  const {
    handleFieldChange: handleDataChange,
    handleSaveData,
    showSavedToast: savedData,
    showSaveButton: showDataButton,
  } = useBlockData({
    schema: aboutDataSchema,
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
        <TextItemsEditor
          schema={aboutDataSchema}
          data={dataState}
          onTextChange={handleDataChange}
          onSaveData={() => handleSaveData(dataState)}
          uiDefaults={uiDefaults}
        />
      )}

      {activeTab === 'appearance' && (
        <>
          <div className="text-sm text-gray-500 italic pl-1">
            ⚙️ Настройка текстового блока: фон, цвета заголовка и описания
          </div>
          <TextAppearance
            schema={aboutSchema}
            settings={settingsState}
            onChange={handleFieldChange}
            fieldTypes={fieldTypes}
            onSaveAppearance={() => handleSaveAppearance(settingsState)}
            uiDefaults={uiDefaults}
          />
        </>
      )}

      {/* Кнопка сохранения убрана, общий "Сохранить" находится вверху страницы */}
    </div>
  )
}
