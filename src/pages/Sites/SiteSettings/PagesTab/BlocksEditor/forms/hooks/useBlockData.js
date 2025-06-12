import { useEffect, useState } from 'react'

export function useBlockData({ schema, data, block_id, slug, site_name, setData, onChange }) {
  const normalize = (val) => (val !== undefined ? val : '')

  const getValues = (source = {}) => {
    const values = {}
    for (const field of schema) {
      values[field.key] = normalize(source[field.key])
    }
    return values
  }

  const [initialData, setInitialData] = useState({})
  const [readyToCheck, setReadyToCheck] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [resetButton, setResetButton] = useState(false)
  const [justMounted, setJustMounted] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // ждём, пока все поля будут не пустыми
    const allFieldsReady = schema.every(f => {
      const val = data?.[f.key]
      return val !== undefined && val !== ''
    })

    if (!allFieldsReady) return

    const values = getValues(data)
    setInitialData(values)
    setReadyToCheck(false)
    setJustMounted(true)
    setInitialized(true)
  }, [block_id, data])

  useEffect(() => {
    if (!initialized || justMounted) {
      setJustMounted(false)
      return
    }

    const changed = schema.some((field) => {
      const current = normalize(data?.[field.key])
      const initVal = normalize(initialData[field.key])
      if (current !== initVal) {
        console.log(`[🧨 Изменено поле]: ${field.key}`)
        console.log('  └ current:', current)
        console.log('  └ initial:', initVal)
      }
      return current !== initVal
    })

    setReadyToCheck(changed)
  }, [data])

  const handleFieldChange = (key, value) => {
    onChange((prev) => {
      const updated = { ...prev, [key]: value }

      const changed = schema.some((field) => {
        const newVal = normalize(updated[field.key])
        const initVal = normalize(initialData[field.key])
        return newVal !== initVal
      })

      setReadyToCheck(changed)
      return updated
    })
  }

  const hasDataChanged = () => {
    return schema.some((field) => {
      const current = normalize(data?.[field.key])
      const initVal = normalize(initialData[field.key])
      return current !== initVal
    })
  }

  const handleSaveData = async (updatedData = data) => {
    try {
      const filtered = {}
      for (const field of schema) {
        filtered[field.key] = updatedData?.[field.key]
      }

      const url = `${import.meta.env.VITE_API_URL}/blocks/update-data/${site_name}/${slug}/${block_id}`

      const res = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ data: filtered }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText)
      }

      await res.json()

      setInitialData(filtered)
      setReadyToCheck(false)
      setShowSavedToast(true)
      setResetButton(true)

      setTimeout(() => {
        setShowSavedToast(false)
        setResetButton(false)
      }, 2000)

      if (setData) {
        setData((prev) => {
          const updatedBlocks = { ...prev.blocks }
          const pageBlocks = updatedBlocks[slug]?.map((b) =>
            b.real_id === block_id ? { ...b, data: { ...filtered } } : b
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
      console.error('❌ PATCH упал:', err)
      alert('Ошибка сохранения')
    }
  }

  const showSaveButton = readyToCheck

  return {
    handleFieldChange,
    handleSaveData,
    showSavedToast,
    resetButton,
    showSaveButton,
  }
}
