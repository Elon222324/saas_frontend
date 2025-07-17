import { useState, useEffect, useCallback, useRef } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { getImageVariants } from '@/utils/imageVariants'

export default function useCloudStorage() {
  const { site_name } = useSiteSettings()
  const API_URL = import.meta.env.VITE_API_URL

  const [groups, setGroups] = useState([])
  const [files, setFiles] = useState([])
  const [selected, setSelected] = useState(null)
  const [used, setUsed] = useState(0)
  const [limit, setLimit] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const uploadInputRef = useRef(null)

  const fetchData = useCallback(async () => {
    if (!site_name) return
    try {
      const res = await fetch(`${API_URL}/images/categories/?site_name=${site_name}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to load categories')
      const data = await res.json()

      const grouped = {}
      const allFiles = []

      for (const cat of data) {
        const parent = cat.is_system ? 'СИСТЕМНЫЕ' : 'ТОВАРЫ'
        if (!grouped[parent]) grouped[parent] = []
        // Название берется из `name`, описание - как запасной вариант
        grouped[parent].push({ id: cat.id, title: cat.name || cat.description, code: cat.code })

        if (cat.images) {
          cat.images.forEach((img) => {
            const base = `${import.meta.env.VITE_LIBRARY_ASSETS_URL || ''}${img.url}`
            const variants = getImageVariants(base)

            allFiles.push({
              ...img,
              category: cat.id,
              base_url: base,
              ...variants,
            })
          })
        }
      }
      setGroups(
        Object.entries(grouped).map(([title, children]) => ({ title, children }))
      )
      setFiles(allFiles)
    } catch (err) {
      console.error('Failed to fetch site files', err)
    }
  }, [API_URL, site_name])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  /**
   * Обновлено: Принимает объект `categoryData` для соответствия схеме CategoryCreate на бэкенде.
   * @param {object} categoryData - например, { name: 'Новая категория', description: '...' }
   */
  const createCategory = async (categoryData) => {
    try {
      const res = await fetch(`${API_URL}/images/categories/?site_name=${site_name}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(categoryData),
      })
      if (res.ok) await fetchData()
    } catch (err) {
      console.error('Failed to create category', err)
    }
  }

  /**
   * Обновлено: Принимает опциональные метаданные и корректно формирует URL.
   * @param {FileList} filesList - Список файлов для загрузки.
   * @param {number} categoryId - ID категории.
   * @param {object} metadata - Опционально, { alt_text: '...', description: '...' }.
   */
  const uploadFiles = async (filesList, categoryId, metadata = {}) => {
    setIsUploading(true)
    
    // Находим строковый код категории, который требует бэкенд
    const categoryCode = groups.flatMap(g => g.children).find(c => c.id === categoryId)?.code
    if (!categoryCode) {
        console.error("Не удалось найти код категории для ID:", categoryId);
        setIsUploading(false);
        return;
    }

    for (const file of filesList) {
      const formData = new FormData()
      formData.append('file', file)

      // Добавляем опциональные метаданные, если они есть
      if (metadata.alt_text) {
        formData.append('alt_text', metadata.alt_text)
      }
      if (metadata.description) {
        formData.append('description', metadata.description)
      }

      try {
        const res = await fetch(
          `${API_URL}/images/?site_name=${site_name}&category_id=${categoryId}&category=${categoryCode}`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: formData,
          }
        )
        if (res.ok) {
          const img = await res.json()
          setFiles((prev) => [
            ...prev,
            {
              ...img,
              category: categoryId,
              url: `${import.meta.env.VITE_LIBRARY_ASSETS_URL || ''}${img.medium_url || img.url}`,
              big_url: `${import.meta.env.VITE_LIBRARY_ASSETS_URL || ''}${img.big_url || img.url}`,
            },
          ])
        }
      } catch (err) {
        console.error('Upload failed', err)
      }
    }
    await fetchData()
    setIsUploading(false)
  }

  const deleteImage = async (id) => {
    try {
      const res = await fetch(`${API_URL}/images/${id}?site_name=${site_name}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      if (res.ok) setFiles((prev) => prev.filter((f) => f.id !== id))
    } catch (err) {
      console.error('Failed to delete image', err)
    }
  }

  const updateImage = async (id, payload) => {
    try {
      const res = await fetch(`${API_URL}/images/${id}?site_name=${site_name}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...payload } : f)))
    } catch (err) {
      console.error('Failed to update image', err)
    }
  }

  const handleUploadClick = (categoryId) => {
    if (uploadInputRef.current) {
      uploadInputRef.current.dataset.categoryId = categoryId
      uploadInputRef.current.click()
    }
  }

  const handleInputChange = (e) => {
    const categoryId = uploadInputRef.current?.dataset.categoryId
    if (!categoryId) return
    const list = Array.from(e.target.files || [])
    uploadFiles(list, parseInt(categoryId, 10)) // Убедимся, что ID - это число
    e.target.value = ''
  }

  return {
    groups,
    files,
    selected,
    setSelected,
    used,
    limit,
    isUploading,
    handleUploadClick,
    uploadInputRef,
    handleInputChange,
    createCategory,
    deleteImage,
    updateImage,
    refetch: fetchData,
  }
}