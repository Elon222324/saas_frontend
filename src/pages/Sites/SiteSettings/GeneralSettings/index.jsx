import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { fieldTypes } from '@/components/fields/fieldTypes'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { themes } from '@/site_themes'

export default function GeneralSettings() {
  const { domain } = useParams()
  const { data, loading, site_name, refetch } = useSiteSettings()

  const [common, setCommon] = useState({})
  const [initial, setInitial] = useState({})
  const [hasInitialized, setHasInitialized] = useState(false)

  const baseDomain = import.meta.env.VITE_BASE_DOMAIN
  const API_URL = import.meta.env.VITE_API_URL
  const full_domain = `${domain}.${baseDomain}`

  const uiSchema = data?.ui_schema || []

  useEffect(() => {
    if (!data?.ui_schema?.length || hasInitialized) return

    const initialCommon = {}
    for (const field of data.ui_schema) {
      if (field.key) {
        initialCommon[field.key] =
          field.hasOwnProperty('value') ? field.value : (field.default ?? '')
      }
    }

    setCommon(initialCommon)
    setInitial(initialCommon)
    setHasInitialized(true)
  }, [data, hasInitialized])

  const getThemeDefaults = async (theme) => {
    try {
      const json = themes[theme]
      if (!json) throw new Error('Тема не найдена')
      return json
    } catch (err) {
      console.error(`Ошибка загрузки темы ${theme}:`, err)
      return {}
    }
  }

  const handleChange = async (key, value) => {
    if (key === 'style') {
      const knownThemes = Object.keys(themes)
      if (knownThemes.includes(value)) {
        const theme = await getThemeDefaults(value)
        if (theme?.common && theme?.blocks) {
          setCommon({
            ...theme.common,
            style: value,
          })
        }
      } else {
        setCommon((prev) => ({
          ...prev,
          style: value,
        }))
      }
    } else {
      setCommon(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleSave = async () => {
    try {
      const theme = await getThemeDefaults(common.style || 'light')
      const payload = {
        common: common,
        blocks: theme?.blocks || {}
      }

      const res = await fetch(
        `${API_URL}/schema/apply-theme/${site_name}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) throw new Error('Ошибка сохранения')
      alert('Общие настройки сохранены')
      await refetch()
      setInitial(common)
    } catch (err) {
      console.error(err)
      alert('Не удалось сохранить общие настройки')
    }
  }

  const isDirty = useMemo(() => {
    return JSON.stringify(common) !== JSON.stringify(initial)
  }, [common, initial])

  if (loading || !hasInitialized) return <div className="p-6">Загрузка...</div>

  const renderField = (field) => {
    if (field.visible_if) {
      const [[depKey, depVal]] = Object.entries(field.visible_if)
      if (common[depKey] !== depVal) return null
    }

    const FieldComponent = fieldTypes[field.type] || fieldTypes.text
    const value = common[field.key]

    return (
      <FieldComponent
        {...field}
        key={field.key}
        label={field.label}
        value={value}
        onChange={(val) => handleChange(field.key, val)}
      />
    )
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Общие настройки: {full_domain}</h1>
        <Link
          to={`/settings/${site_name}/pages`}
          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
        >
          ← Назад
        </Link>
      </div>

      <div className="flex items-center text-gray-500 text-sm mb-4">
        <Info size={16} className="mr-2" />
        Здесь можно настроить цвета, шрифты и другие параметры темы вашего сайта
      </div>

      <div className="space-y-4">
        {uiSchema.map(field => field.editable && renderField(field))}
      </div>

      <Button onClick={handleSave} disabled={!isDirty}>
        Сохранить
      </Button>
    </div>
  )
}