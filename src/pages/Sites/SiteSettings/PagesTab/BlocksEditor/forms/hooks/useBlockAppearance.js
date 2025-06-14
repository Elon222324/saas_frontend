import { useState, useEffect } from 'react'
import { initBlockAppearanceFromCommon } from '@blocks/forms/utils/initBlockAppearanceFromCommon'

export function useBlockAppearance({ schema, data, block_id, slug, siteData, site_name, setData, onChange, onChangeBlock }) {
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

    console.log('[🎯 useBlockAppearance] initialAppearance set:', values)
    console.log('[🎯 useBlockAppearance] current data at init:', data)

    setInitialAppearance(values)
    setReadyToCheck(false)
  }, [block_id])

  useEffect(() => {
    if (!Object.keys(initialAppearance).length) return
    const changed = schema.some(field => {
      if (field.visible === false) return false
      if (data[field.key] === undefined) return false
      return data[field.key] !== initialAppearance[field.key]
    })

    console.log('[🟨 useBlockAppearance] comparison result =', changed)
    console.log('→ current data:', data)
    console.log('→ initialAppearance:', initialAppearance)

    setReadyToCheck(changed)
  }, [data, initialAppearance, schema])

  const handleFieldChange = (key, value) => {
    onChange(prev => {
      const updated = { ...prev, [key]: value }

      // Только если есть реальные отличия — шлём наружу
      if (onChangeBlock && block_id && initialAppearance) {
        const diff = {}
        for (const field of schema) {
          if (field.visible === false) continue
          const k = field.key
          const val = updated[k]
          if (val !== initialAppearance[k]) {
            diff[k] = val
          }
        }

        if (Object.keys(diff).length > 0) {
          onChangeBlock(block_id, { settings: updated })
        }
      }

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
  console.log('[🔘 showSaveButton]', { readyToCheck, hasChanged: hasAppearanceChanged() })
  if (showSaveButton) {
    console.log('🚨 showSaveButton = TRUE')
  }

  return {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast,
    showSaveButton,
    uiDefaults,
  }
}
