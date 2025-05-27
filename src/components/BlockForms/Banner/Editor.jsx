import { useEffect, useState } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { bannerSchema } from '@/config/blockSchemas/bannerSchema'
import { fieldTypes } from '@/config/fieldTypes'
import BannerItemsEditor from './ItemsEditor'
import BannerAppearance from './Appearance'
import { initBlockAppearanceFromCommon } from '@/components/BlockForms/utils/initBlockAppearanceFromCommon'

export default function BannerEditor({ block, data, onChange, slug }) {
  const { data: siteData, site_name, setData } = useSiteSettings()
  const block_id = block?.real_id
  const [initialAppearance, setInitialAppearance] = useState({})
  const [showSavedToast, setShowSavedToast] = useState(false)

  useEffect(() => {
    console.log('🧩 BannerEditor получил data:', data)
    console.log('🧩 custom_appearance:', data?.custom_appearance)
    if (data?.custom_appearance && Object.keys(initialAppearance).length === 0) {
      const values = {}
      for (const field of bannerSchema) {
        if (field.visible_if?.custom_appearance === true && data[field.key] !== undefined) {
          values[field.key] = data[field.key]
        }
      }
      setInitialAppearance(values)
    }
  }, [data])

  const handleFieldChange = (key, value) => {
    if (key === 'custom_appearance' && value === true) {
      const initialValues = initBlockAppearanceFromCommon(bannerSchema, siteData?.common)
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
    return bannerSchema.some(field => {
      if (field.visible_if?.custom_appearance !== true) return false
      const key = field.key
      return data[key] !== initialAppearance[key]
    })
  }

  const handleSaveAppearance = async (settings) => {
    try {
      const filteredSettings = {}
      for (const field of bannerSchema) {
        if (field.visible_if?.custom_appearance === true && settings[field.key] !== undefined) {
          filteredSettings[field.key] = settings[field.key]
        }
      }

      filteredSettings.custom_appearance = settings.custom_appearance

      console.log('📦 settings перед отправкой:', settings)
      console.log('📦 filteredSettings:', filteredSettings)

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
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText)
      }

      setInitialAppearance(filteredSettings)
      setShowSavedToast(true)
      setTimeout(() => setShowSavedToast(false), 2000)

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

  return (
    <div className="space-y-6 relative">
      {showSavedToast && (
        <div className="text-green-600 text-sm font-medium">✅ Внешний вид сохранён</div>
      )}

      <div className="text-sm text-gray-500 italic pl-1">
        ⚙️ Здесь можно настроить градиент, цвета текста и кнопки баннера
      </div>

      <BannerItemsEditor />

      <BannerAppearance
        schema={bannerSchema}
        settings={data}
        onChange={handleFieldChange}
        fieldTypes={fieldTypes}
        onSaveAppearance={handleSaveAppearance}
        showButton={hasAppearanceChanged()}
      />
    </div>
  )
}
