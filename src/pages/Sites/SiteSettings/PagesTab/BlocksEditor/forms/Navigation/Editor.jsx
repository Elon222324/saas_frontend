import { useEffect, useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { navigationSchema } from './navigationSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import NavigationItemsEditor from './ItemsEditor'
import NavigationAppearance from './Appearance'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'

export default function NavigationEditor({
  block,
  data,
  onChange,
  slug,
  onFloatingChange,
  onSaveHandlers,
}) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id
  const [items, setItems] = useState([])
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (!block?.real_id) return
    const navItems = siteData?.navigation?.filter(item => item.block_id === block.real_id) || []
    const sorted = [...navItems].sort((a, b) => a.order - b.order)
    setItems(sorted)
    const isDifferent = JSON.stringify(data.items || []) !== JSON.stringify(sorted)
    if (isDifferent && sorted.length > 0) {
      onChange(prev => ({ ...prev, items: sorted }))
    }
  }, [block?.real_id, siteData?.navigation])

  const {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast,
    resetButton,
    showSaveButton,
    uiDefaults,
  } = useBlockAppearance({
    schema: navigationSchema,
    data,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange,
  })

  useEffect(() => {
    onFloatingChange?.(showSaveButton)
  }, [onFloatingChange, showSaveButton])

  useEffect(() => {
    onSaveHandlers?.({
      handleSaveData: null,
      handleSaveAppearance: () => handleSaveAppearance(data),
    })
  }, [onSaveHandlers, handleSaveAppearance, data])

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
        📁 Навигация: редактирование пунктов и внешнего вида блока
      </div>

      <NavigationItemsEditor
        items={items}
        siteName={site_name}
        siteData={siteData}
        setData={setData}
        setItems={setItems}
        onChange={onChange}
        setShowToast={setShowToast}
      />

      <NavigationAppearance
        schema={navigationSchema}
        settings={data}
        onChange={handleFieldChange}
        fieldTypes={fieldTypes}
        onSaveAppearance={handleSaveAppearance}
        showButton={showSaveButton || data?.custom_appearance === false}
        resetButton={resetButton}
        uiDefaults={uiDefaults}
      />
    </div>
  )
}
