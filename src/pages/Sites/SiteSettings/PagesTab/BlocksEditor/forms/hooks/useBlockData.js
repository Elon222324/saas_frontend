import { useEffect, useState } from 'react'

export function useBlockData({ schema, data, block_id, slug, site_name, setData, onChange }) {
  const [initialData, setInitialData] = useState({})
  const [readyToCheck, setReadyToCheck] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)
  const [resetButton, setResetButton] = useState(false)

  useEffect(() => {
    // При открытии редактора фиксируем текущее состояние данных
    // как исходное, чтобы кнопка "Сохранить" не отображалась
    // пока пользователь не внесет изменения
    setInitialData({ ...data })
    setReadyToCheck(false)
  }, [block_id])

  const handleFieldChange = (key, value) => {
    onChange((prev) => {
      const updated = { ...prev, [key]: value }

      const changed = schema.some(
        (field) => updated[field.key] !== initialData[field.key]
      )
      setReadyToCheck(changed)

      return updated
    })
  }

  const hasDataChanged = () => {
    return schema.some((field) => data?.[field.key] !== initialData[field.key])
  }

  const handleSaveData = async (updatedData = data) => {
    try {
      console.log('🧪 handleSaveData: входящие данные:', updatedData)

      const filtered = {}
      for (const field of schema) {
        filtered[field.key] = updatedData?.[field.key]
      }

      console.log('📤 Данные, которые пойдут в PATCH:', filtered)

      const url = `${import.meta.env.VITE_API_URL}/blocks/update-data/${site_name}/${slug}/${block_id}`
      console.log('👉 URL:', url)

      const res = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ data: filtered }),
      })

      console.log('📦 Ответ сервера:', res.status)

      if (!res.ok) {
        const errorText = await res.text()
        console.error('❌ PATCH ошибка:', errorText)
        throw new Error(errorText)
      }

      const responseJson = await res.json()
      console.log('✅ PATCH успешен. Ответ:', responseJson)

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

  useEffect(() => {
    console.log('🟡 Сравниваем data и initialData:', data, initialData)
    if (Object.keys(initialData).length === 0) {
      setReadyToCheck(false)
      return
    }
    const changed = schema.some(
      (field) => data?.[field.key] !== initialData[field.key]
    )
    setReadyToCheck(changed)
  }, [data, initialData])

  const showSaveButton = readyToCheck && hasDataChanged()

  return {
    handleFieldChange,
    handleSaveData,
    showSavedToast,
    resetButton,
    showSaveButton,
  }
}