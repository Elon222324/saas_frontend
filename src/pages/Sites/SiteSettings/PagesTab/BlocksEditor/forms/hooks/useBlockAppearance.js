import { useState, useEffect } from 'react'
import { initBlockAppearanceFromCommon } from '@blocks/forms/utils/initBlockAppearanceFromCommon'

export function useBlockAppearance({ schema, data, block_id, slug, siteData, site_name, setData, onChange }) {
  const [initialAppearance, setInitialAppearance] = useState({})
  const [readyToCheck, setReadyToCheck] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [resetButton, setResetButton] = useState(false)

  const uiDefaults = {}
  for (const field of siteData?.ui_schema || []) {
    if (field.key) {
      const keys = field.key.split(',').map(k => k.trim())
      for (const key of keys) {
        uiDefaults[key] = field.hasOwnProperty('value') ? field.value : (field.default ?? '')
      }
    }
  }

  // авто-синхронизация синонимов
  if (uiDefaults.background_color && !uiDefaults.bg_color) {
    uiDefaults.bg_color = uiDefaults.background_color
  }
  if (uiDefaults.bg_color && !uiDefaults.background_color) {
    uiDefaults.background_color = uiDefaults.bg_color
  }

  const normalize = (val) => (val !== undefined ? val : '')

  useEffect(() => {
    if (!data?.custom_appearance) {
      setInitialAppearance({})
      setReadyToCheck(false)
      return
    }

    const values = {}
    for (const field of schema) {
      if (field.visible_if?.custom_appearance) {
        values[field.key] = normalize(data[field.key])
      }
    }

    setInitialAppearance(values)
    setReadyToCheck(false)

    const changed = schema.some(field => {
      if (!field.visible_if?.custom_appearance) return false
      const current = normalize(data[field.key])
      const initVal = normalize(values[field.key])
      return current !== initVal
    })
    setReadyToCheck(changed)
  }, [block_id])

  const handleFieldChange = (key, value) => {
    if (key === 'custom_appearance' && value === false) {
      const defaults = initBlockAppearanceFromCommon(siteData?.ui_schema || [], schema)
      const updated = {
        ...defaults,
        custom_appearance: false,
      }
      console.log('✅ updating appearance with defaults (OFF):', updated)
      handleSaveAppearance(updated)
      onChange(prev => ({ ...prev, ...updated }))
      return
    }

    if (key === 'custom_appearance' && value === true) {
      const values = {}
      for (const field of schema) {
        if (field.visible_if?.custom_appearance) {
          values[field.key] = data[field.key] !== undefined ? data[field.key] : uiDefaults[field.key]
        }
      }
      const updated = {
        ...values,
        custom_appearance: true,
      }
      console.log('✅ updating appearance with defaults (ON):', updated)
      onChange(prev => ({ ...prev, ...updated }))
      return
    }

    onChange(prev => {
      const updated = { ...prev, [key]: value }

      if (prev.custom_appearance) {
        const changed = schema.some(field => {
          if (!field.visible_if?.custom_appearance) return false
          const newVal = normalize(updated[field.key])
          const initVal = normalize(initialAppearance[field.key])
          return newVal !== initVal
        })
        requestAnimationFrame(() => setReadyToCheck(changed))
      }

      return updated
    })
  }

  const hasAppearanceChanged = () => {
    if (!readyToCheck || !data?.custom_appearance) return false
    return schema.some(field => {
      if (!field.visible_if?.custom_appearance) return false
      const current = normalize(data[field.key])
      const initVal = normalize(initialAppearance[field.key])
      return current !== initVal
    })
  }

  const handleSaveAppearance = async (settings) => {
    try {
      const filteredSettings = {}
      for (const field of schema) {
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

  const showSaveButton = data?.custom_appearance ? (readyToCheck && hasAppearanceChanged()) : false
  console.log('[🔥 uiDefaults]', uiDefaults)

  return {
    handleFieldChange,
    handleSaveAppearance,
    showSavedToast,
    resetButton,
    showSaveButton,
    uiDefaults,
  }
}
