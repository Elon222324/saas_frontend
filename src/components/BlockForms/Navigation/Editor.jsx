import { useEffect, useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { navigationSchema } from '@/config/blockSchemas/navigationSchema'
import { fieldTypes } from '@/config/fieldTypes'
import NavigationItemsEditor from './ItemsEditor'
import NavigationAppearance from './Appearance'
import { initBlockAppearanceFromCommon } from '@/components/BlockForms/utils/initBlockAppearanceFromCommon'

export default function NavigationEditor({ block, data, onChange, slug }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id
  const [items, setItems] = useState([])
  const [initialAppearance, setInitialAppearance] = useState({})
  const [readyToCheck, setReadyToCheck] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [resetButton, setResetButton] = useState(false)

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

  useEffect(() => {
    if (!data?.custom_appearance) {
      setInitialAppearance({})
      setReadyToCheck(false)
      return
    }

    const values = {}
    const uiDefaults = {}
    for (const field of siteData?.ui_schema || []) {
      if (field.key) {
        uiDefaults[field.key] = field.hasOwnProperty('value') ? field.value : (field.default ?? '')
      }
    }

    for (const field of navigationSchema) {
      if (field.visible_if?.custom_appearance) {
        values[field.key] = data[field.key] !== undefined ? data[field.key] : uiDefaults[field.key]
      }
    }

    setInitialAppearance(values)

    requestAnimationFrame(() => {
      const isChanged = navigationSchema.some(field => {
        if (!field.visible_if?.custom_appearance) return false
        return data[field.key] !== values[field.key]
      })
      setReadyToCheck(isChanged)
    })
  }, [block?.real_id])

  const handleFieldChange = (key, value) => {
    if (key === 'custom_appearance' && value === false) {
      const defaults = initBlockAppearanceFromCommon(siteData?.ui_schema || [], navigationSchema)
      const updated = {
        ...defaults,
        custom_appearance: false,
      }
      handleSaveAppearance(updated)
      onChange(prev => ({ ...prev, ...updated }))
      return
    }

    onChange(prev => {
      const updated = { ...prev, [key]: value }

      if (prev.custom_appearance) {
        const changed = navigationSchema.some(field => {
          if (!field.visible_if?.custom_appearance) return false
          return updated[field.key] !== initialAppearance[field.key]
        })
        requestAnimationFrame(() => setReadyToCheck(changed))
      }

      return updated
    })
  }

  const hasAppearanceChanged = () => {
    if (!readyToCheck || !data?.custom_appearance) return false
    return navigationSchema.some(field => {
      if (!field.visible_if?.custom_appearance) return false
      return data[field.key] !== initialAppearance[field.key]
    })
  }

  const handleSaveAppearance = async (settings) => {
    try {
      const filteredSettings = {}
      for (const field of navigationSchema) {
        if (field.visible_if?.custom_appearance) {
          filteredSettings[field.key] = settings[field.key]
        }
      }

      filteredSettings.custom_appearance = settings.custom_appearance

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/blocks/update-settings/${site_name}/${slug}/${block_id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({ settings: filteredSettings }),
        }
      )
      if (!res.ok) throw new Error(await res.text())

      setInitialAppearance(filteredSettings)
      setReadyToCheck(false)
      setShowSavedToast(true)
      setResetButton(true)
      setTimeout(() => {
        setShowSavedToast(false)
        setResetButton(false)
      }, 2000)

      if (setData) {
        setData(prev => {
          const updatedBlocks = { ...prev.blocks }
          const pageBlocks = updatedBlocks[slug]?.map(b =>
            b.real_id === block_id ? { ...b, settings: { ...filteredSettings } } : b
          )
          return {
            ...prev,
            blocks: {
              ...updatedBlocks,
              [slug]: pageBlocks,
            },
          }
        })
      }
    } catch (err) {
      console.error('❌ Ошибка сохранения внешнего вида:', err)
      alert('Не удалось сохранить внешний вид блока')
    }
  }

  const showSaveButton = readyToCheck && data?.custom_appearance && hasAppearanceChanged()

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
      />
    </div>
  )
}
