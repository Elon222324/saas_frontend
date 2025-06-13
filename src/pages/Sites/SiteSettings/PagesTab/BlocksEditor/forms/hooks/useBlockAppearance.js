import { useState, useEffect } from 'react'
import { initBlockAppearanceFromCommon } from '@blocks/forms/utils/initBlockAppearanceFromCommon'

export function useBlockAppearance({ schema, data, block_id, slug, siteData, site_name, setData, onChange }) {
  const [initialAppearance, setInitialAppearance] = useState({})
  const [readyToCheck, setReadyToCheck] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)

  const uiDefaults = {}
  for (const field of siteData?.ui_schema || []) {
    if (field.key) {
      const keys = field.key.split(',').map(k => k.trim())
      for (const key of keys) {
        uiDefaults[key] = field.hasOwnProperty('value') ? field.value : (field.default ?? '')
      }
    }
  }

  if (uiDefaults.background_color && !uiDefaults.bg_color) {
    uiDefaults.bg_color = uiDefaults.background_color
  }
  if (uiDefaults.bg_color && !uiDefaults.background_color) {
    uiDefaults.background_color = uiDefaults.bg_color
  }

  useEffect(() => {
    const values = {}
    for (const field of schema) {
      if (field.visible === false) continue
      values[field.key] = data[field.key] !== undefined ? data[field.key] : uiDefaults[field.key]
    }

    setInitialAppearance(values)

    requestAnimationFrame(() => {
      const isChanged = schema.some(field => {
        if (field.visible === false) return false
        return data[field.key] !== values[field.key]
      })
      setReadyToCheck(isChanged)
    })
  }, [block_id])

  const handleFieldChange = (key, value) => {
    onChange(prev => {
      const updated = { ...prev, [key]: value }
      const changed = schema.some(field => {
        if (field.visible === false) return false
        return updated[field.key] !== initialAppearance[field.key]
      })
      requestAnimationFrame(() => setReadyToCheck(changed))
      return updated
    })
  }

  const hasAppearanceChanged = () => {
    return readyToCheck && schema.some(field => {
      if (field.visible === false) return false
      return data[field.key] !== initialAppearance[field.key]
    })
  }

  const handleSaveAppearance = async (settings) => {
    try {
      const filteredSettings = {}
      for (const field of schema) {
        if (field.visible === false) continue
        filteredSettings[field.key] = settings[field.key]
      }

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

  const showSaveButton = readyToCheck && hasAppearanceChanged()

  return {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast,
    showSaveButton,
    uiDefaults,
  }
}
