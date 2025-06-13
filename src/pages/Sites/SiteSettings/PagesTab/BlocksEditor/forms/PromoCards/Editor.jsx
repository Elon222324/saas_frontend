import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { promoSchema } from './promoSchema'
import { promoDataSchema } from './promoDataSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import PromoItemsEditor from './ItemsEditor'
import PromoAppearance from './Appearance'
import PromoCardsPreview from './PromoCardsPreview'
import { Tabs, Tab } from '@/components/ui/tabs'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function PromoEditor({ block, slug, onChange }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id
  const [activeTab, setActiveTab] = useState('data')

  const [dataState, setDataState] = useState(block?.data || {})
  const [settingsState, setSettingsState] = useState(block?.settings || {})

  useEffect(() => {
    setDataState(block?.data || {})
    setSettingsState(block?.settings || {})
  }, [block])

  const [showToast, setShowToast] = useState(false)

  const {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast: savedAppearance,
    showSaveButton: showAppearanceButton,
    uiDefaults,
  } = useBlockAppearance({
    schema: promoSchema,
    data: settingsState,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange: (update) => {
      setSettingsState(update)
      onChange(prev => ({ ...prev, settings: typeof update === 'function' ? update(prev.settings || {}) : update }))
    },
  })

  const {
    handleFieldChange: handleTextFieldChange,
    handleSaveData,
    showSavedToast: savedData,
    showSaveButton: showDataButton,
  } = useBlockData({
    schema: promoDataSchema,
    data: dataState,
    block_id,
    slug,
    site_name,
    setData,
    onChange: (update) => {
      setDataState(update)
      onChange(prev => ({ ...prev, data: typeof update === 'function' ? update(prev.data || {}) : update }))
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

      <Tabs value={activeTab} onChange={setActiveTab} className="mb-4">
        <Tab value="data">Данные</Tab>
        <Tab value="appearance">Дизайн</Tab>
      </Tabs>

      {activeTab === 'data' && (
        <PromoItemsEditor
          schema={promoDataSchema}
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
            ⚙️ Настройка фона карточек, рамок и текста
          </div>
          <PromoAppearance
            schema={promoSchema}
            settings={settingsState}
            onChange={handleFieldChange}
            fieldTypes={fieldTypes}
            onSaveAppearance={() => handleSaveAppearance(settingsState)}
            uiDefaults={uiDefaults}
          />
        </>
      )}

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
