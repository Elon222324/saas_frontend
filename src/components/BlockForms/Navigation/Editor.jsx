import { useEffect, useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { navigationSchema } from '@/config/blockSchemas/navigationSchema'
import { fieldTypes } from '@/config/fieldTypes'
import NavigationItemsEditor from './ItemsEditor'
import NavigationAppearance from './Appearance'
import { initBlockAppearanceFromCommon } from '@/components/BlockForms/utils/initBlockAppearanceFromCommon'

export default function NavigationEditor({ block, data, onChange }) {
  const { data: siteData, setData, site_name } = useSiteSettings()
  const [items, setItems] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [initialAppearance, setInitialAppearance] = useState({})
  const [showSavedToast, setShowSavedToast] = useState(false)

  useEffect(() => {
    if (!block?.real_id) return
    const navItems = siteData?.navigation?.filter(item => item.block_id === block.real_id) || []
    const sorted = [...navItems].sort((a, b) => a.order - b.order)
    setItems(sorted)
    onChange({ ...data, block_id: block.real_id, items: sorted })
  }, [block?.real_id, siteData?.navigation])

  const handleFieldChange = (key, value) => {
    if (key === 'custom_appearance' && value === true) {
      const initialValues = initBlockAppearanceFromCommon(navigationSchema, siteData?.common)
      onChange(prev => {
        const next = { ...prev, custom_appearance: true, ...initialValues }
        setInitialAppearance(initialValues)
        return next
      })
    } else {
      onChange(prev => ({ ...prev, [key]: value }))
    }
  }

  const hasAppearanceChanged = () => {
    if (!data?.custom_appearance) return false
    return navigationSchema.some(field => {
      if (field.visible_if?.custom_appearance !== true) return false
      const key = field.key
      return data[key] !== initialAppearance[key]
    })
  }

  const handleSaveAppearance = async (settings) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blocks/save-settings/${block.real_id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ settings }),
      })
      if (!res.ok) throw new Error()
      const newState = {}
      for (const field of navigationSchema) {
        if (field.visible_if?.custom_appearance === true) {
          newState[field.key] = settings[field.key]
        }
      }
      setInitialAppearance(newState)
      setShowSavedToast(true)
      setTimeout(() => setShowSavedToast(false), 2000)
    } catch (err) {
      console.error('❌ Ошибка сохранения внешнего вида:', err)
      alert('Не удалось сохранить внешний вид блока')
    }
  }

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

      <div className="text-sm text-gray-500 pl-1 italic">
        Перетаскивайте для сортировки, используйте чекбоксы и ✏️ для редактирования.
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
        showButton={hasAppearanceChanged()}
      />
    </div>
  )
}
