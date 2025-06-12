import { useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { tabsSchema } from './tabsSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import TabsItemsEditor from './ItemsEditor'
import TabsAppearance from './Appearance'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'

export default function TabsEditor({ block, data, onChange, slug }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id
  const [showToast, setShowToast] = useState(false)

  const {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast,
    showSaveButton,
    uiDefaults,
  } = useBlockAppearance({
    schema: tabsSchema,
    data,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange,
  })

  return (
    <div className="space-y-6 relative">
      {showToast && (
        <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 rounded shadow text-sm transition-opacity duration-300">
          ✅ Порядок сохранён
        </div>
      )}
      {showSavedToast && (
        <div className="text-green-600 text-sm font-medium">✅ Внешний вид сохранён</div>
      )}

      <div className="text-sm text-gray-500 italic pl-1">
        ⚙️ Настройка фона и цвета кнопок вкладок
      </div>

      <TabsItemsEditor
        settings={data}
        siteName={site_name}
        siteData={siteData}
        setData={setData}
        onChange={onChange}
        setShowToast={setShowToast}
      />

      <TabsAppearance
        schema={tabsSchema}
        settings={data}
        onChange={handleFieldChange}
        fieldTypes={fieldTypes}
        onSaveAppearance={handleSaveAppearance}
        uiDefaults={uiDefaults}
      />

      {showSaveButton && (
        <button
          onClick={() => handleSaveAppearance(data)}
          className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition text-sm"
        >
          💾 Сохранить
        </button>
      )}
    </div>
  )
}
