import { useEffect, useState } from 'react'

export function useBlockData({ schema, data, block_id, slug, site_name, setData, onChange }) {
  const [initialData, setInitialData] = useState({})
  const [readyToCheck, setReadyToCheck] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [resetButton, setResetButton] = useState(false)

  useEffect(() => {
    const values = {}
    for (const field of schema) {
      values[field.key] = data?.[field.key] !== undefined
        ? data[field.key]
        : field.default ?? ''
    }

    setInitialData(values)

    requestAnimationFrame(() => {
      const isChanged = schema.some(field =>
        data?.[field.key] !== values[field.key]
      )
      setReadyToCheck(isChanged)
    })
  }, [block_id])

  const handleFieldChange = (key, value) => {
    onChange(prev => {
      const updated = { ...prev, [key]: value }

      const changed = schema.some(field => updated[field.key] !== initialData[field.key])
      requestAnimationFrame(() => setReadyToCheck(changed))

      return updated
    })
  }

  const hasDataChanged = () => {
    if (!readyToCheck) return false
    return schema.some(field => data?.[field.key] !== initialData[field.key])
  }

  const handleSaveData = async (updatedData) => {
    try {
      const filtered = {}
      for (const field of schema) {
        filtered[field.key] = updatedData[field.key]
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/blocks/update-data/${site_name}/${slug}/${block_id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({ data: filtered }),
        }
      )
      if (!res.ok) throw new Error(await res.text())

      setInitialData(filtered)
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
      console.error('❌ Ошибка сохранения содержимого блока:', err)
      alert('Не удалось сохранить содержимое блока')
    }
  }

  const showSaveButton = readyToCheck && hasDataChanged()

  return {
    handleFieldChange,
    handleSaveData,
    showSavedToast,
    resetButton,
    showSaveButton,
  }
}
