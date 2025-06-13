import { useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { productGridSchema } from './productGridSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import ProductGridItemsEditor from './ItemsEditor'
import ProductGridAppearance from './Appearance'
import { Tabs, Tab } from '@/components/ui/tabs'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'

export default function ProductGridEditor({ block, data, onChange, slug }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id
  const [activeTab, setActiveTab] = useState('data')
  const [showToast, setShowToast] = useState(false)

  const {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast,
    showSaveButton,
    uiDefaults,
  } = useBlockAppearance({
    schema: productGridSchema,
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

      <Tabs value={activeTab} onChange={setActiveTab} className="mb-4">
        <Tab value="data">Данные</Tab>
        <Tab value="appearance">Дизайн</Tab>
      </Tabs>

      {activeTab === 'data' && (
        <ProductGridItemsEditor
          settings={data}
          siteName={site_name}
          siteData={siteData}
          setData={setData}
          onChange={onChange}
          setShowToast={setShowToast}
        />
      )}

      {activeTab === 'appearance' && (
        <>
          <div className="text-sm text-gray-500 italic pl-1">
            ⚙️ Настройка карточек товаров: фон, кнопка, текст
          </div>
          <ProductGridAppearance
            schema={productGridSchema}
            settings={data}
            onChange={handleFieldChange}
            fieldTypes={fieldTypes}
            onSaveAppearance={handleSaveAppearance}
            uiDefaults={uiDefaults}
          />
        </>
      )}

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
