import { useState, useEffect } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { navigationSchema } from './navigationSchema'
import { fieldTypes } from '@/components/fields/fieldTypes'
import NavigationItemsEditor from './ItemsEditor'
import NavigationAppearance from './Appearance'
import { Tabs, Tab } from '@/components/ui/tabs'
import { useBlockAppearance } from '@blocks/forms/hooks/useBlockAppearance'
import { useBlockData } from '@blocks/forms/hooks/useBlockData'

export default function NavigationEditor({ block, slug, onChange }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id

  const [activeTab, setActiveTab] = useState('data')
  const [dataState, setDataState] = useState(block?.data || {})
  const [settingsState, setSettingsState] = useState(block?.settings || {})
  const [items, setItems] = useState([])

  useEffect(() => {
    setDataState(block?.data || {})
    setSettingsState(block?.settings || {})
  }, [block])

  useEffect(() => {
    if (!block_id) return
    const navItems = siteData?.navigation?.filter(item => item.block_id === block_id) || []
    const sorted = [...navItems].sort((a, b) => a.order - b.order)
    setItems(sorted)
    const isDifferent = JSON.stringify(dataState.items || []) !== JSON.stringify(sorted)
    if (isDifferent && sorted.length > 0) {
      const newData = { ...dataState, items: sorted }
      setDataState(newData)
      onChange(prev => ({ ...prev, data: newData }))
    }
  }, [block_id, siteData?.navigation])

  const {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast: savedAppearance,
    showSaveButton: showAppearanceButton,
    uiDefaults,
  } = useBlockAppearance({
    schema: navigationSchema,
    data: settingsState,
    block_id,
    slug,
    siteData,
    site_name,
    setData,
    onChange: (update) => {
      setSettingsState(update)
      onChange(prev => {
        const resolved = typeof update === 'function' ? update(prev.settings || {}) : update
        return { ...prev, settings: resolved }
      })
    },
  })

  const {
    handleFieldChange: handleTextFieldChange,
    handleSaveData,
    showSavedToast: savedData,
    showSaveButton: showDataButton,
  } = useBlockData({
    schema: [],
    data: dataState,
    block_id,
    slug,
    site_name,
    setData,
    onChange: (update) => {
      setDataState(update)
      onChange(prev => {
        const resolved = typeof update === 'function' ? update(prev.data || {}) : update
        return { ...prev, data: resolved }
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
        <>
          <div className="text-sm text-gray-500 italic pl-1">
            📁 Навигация: редактирование пунктов и внешнего вида блока
          </div>
          <NavigationItemsEditor
            items={items}
            siteName={site_name}
            siteData={siteData}
            setData={setData}
            setItems={setItems}
            onChange={handleTextFieldChange}
            setShowToast={() => {}}
          />
        </>
      )}

      {activeTab === 'appearance' && (
        <NavigationAppearance
          schema={navigationSchema}
          settings={settingsState}
          onChange={handleFieldChange}
          fieldTypes={fieldTypes}
          onSaveAppearance={() => handleSaveAppearance(settingsState)}
          uiDefaults={uiDefaults}
        />
      )}
    </div>
  )
}
