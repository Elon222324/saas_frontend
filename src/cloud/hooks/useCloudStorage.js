import { useState, useEffect, useCallback, useRef } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { getImageVariants } from '@/utils/imageVariants'

/**
 * Получает токен пользователя из localStorage
 * @returns {string | null} access_token или null
 */
const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

export default function useCloudStorage() {
  const { site_name } = useSiteSettings()
  const API_URL = import.meta.env.VITE_API_URL
  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'
  const siteNameForApi = site_name ? site_name.replace(containerSuffix, '') : null

  const [groups, setGroups] = useState([])
  const [files, setFiles] = useState([])
  const [selected, setSelected] = useState(null)
  const [used, setUsed] = useState(0)
  const [limit, setLimit] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const uploadInputRef = useRef(null)

  const fetchData = useCallback(async () => {
    if (!siteNameForApi) return
    try {
      const accessToken = getAccessToken()
      
      if (!accessToken) {
        console.error('☁️ [fetchData] Ошибка: отсутствует access_token')
        throw new Error('Отсутствует access_token пользователя')
      }

      console.log('☁️ [fetchData] → Запрос к:', `${API_URL}/images/categories/?site_name=${siteNameForApi}`)

      const res = await fetch(`${API_URL}/images/categories/?site_name=${siteNameForApi}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('☁️ [fetchData] ← Статус ответа:', res.status)

      if (!res.ok) {
        let errorBody = ''
        try { errorBody = await res.text() } catch {}
        console.error('❌ [fetchData] Тело ошибки:', errorBody)
        if (res.status === 401) {
          throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
        }
        throw new Error('Failed to load categories')
      }
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
      const accessToken = getAccessToken()
      
      if (!accessToken) {
        console.error('☁️ [createCategory] Ошибка: отсутствует access_token')
        throw new Error('Отсутствует access_token пользователя')
      }

      const endpoint = `${API_URL}/images/categories/?site_name=${siteNameForApi}`
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
      console.log('☁️ [createCategory] → Создание категории:', endpoint)
      console.log('☁️ [createCategory] → Заголовки:', headers)
      console.log('☁️ [createCategory] → Тело запроса:', categoryData)

      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(categoryData),
      })

      console.log('☁️ [createCategory] ← Статус ответа:', res.status)

      if (!res.ok) {
        let errorBody = ''
        try {
          errorBody = await res.text()
        } catch {}
        console.error('❌ [createCategory] Тело ошибки:', errorBody)
        if (res.status === 401) {
          throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
        }
        throw new Error('Failed to create category')
      }
      if (res.ok) await fetchData()
    } catch (err) {
      console.error('Failed to create category', err)
      throw err
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
        const accessToken = getAccessToken()
        
        if (!accessToken) {
          console.error('☁️ [uploadFiles] Ошибка: отсутствует access_token')
          throw new Error('Отсутствует access_token пользователя')
        }

        console.log('☁️ [uploadFiles] → Загрузка файла:', `${API_URL}/images/?site_name=${siteNameForApi}&category_id=${categoryId}&category=${categoryCode}`)

        const res = await fetch(
          `${API_URL}/images/?site_name=${siteNameForApi}&category_id=${categoryId}&category=${categoryCode}`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
          }
        )

        console.log('☁️ [uploadFiles] ← Статус ответа:', res.status)

        if (!res.ok) {
          let errorBody = ''
          try { errorBody = await res.text() } catch {}
          console.error('❌ [uploadFiles] Тело ошибки:', errorBody)
          if (res.status === 401) {
            throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
          }
          throw new Error('Upload failed')
        }
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
        throw err
      }
    }
    await fetchData()
    setIsUploading(false)
  }

  const deleteImage = async (id) => {
    try {
      const accessToken = getAccessToken()
      
      if (!accessToken) {
        console.error('☁️ [deleteImage] Ошибка: отсутствует access_token')
        throw new Error('Отсутствует access_token пользователя')
      }

      console.log('☁️ [deleteImage] → Удаление изображения:', `${API_URL}/images/${id}?site_name=${siteNameForApi}`)

      const res = await fetch(`${API_URL}/images/${id}?site_name=${siteNameForApi}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('☁️ [deleteImage] ← Статус ответа:', res.status)

      if (!res.ok) {
        let errorBody = ''
        try { errorBody = await res.text() } catch {}
        console.error('❌ [deleteImage] Тело ошибки:', errorBody)
        if (res.status === 401) {
          throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
        }
        throw new Error('Failed to delete image')
      }
      if (res.ok) setFiles((prev) => prev.filter((f) => f.id !== id))
    } catch (err) {
      console.error('Failed to delete image', err)
      throw err
    }
  }

  const updateImage = async (id, payload) => {
    try {
      const accessToken = getAccessToken()
      
      if (!accessToken) {
        console.error('☁️ [updateImage] Ошибка: отсутствует access_token')
        throw new Error('Отсутствует access_token пользователя')
      }

      console.log('☁️ [updateImage] → Обновление изображения:', `${API_URL}/images/${id}?site_name=${siteNameForApi}`)

      const res = await fetch(`${API_URL}/images/${id}?site_name=${siteNameForApi}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      console.log('☁️ [updateImage] ← Статус ответа:', res.status)

      if (!res.ok) {
        let errorBody = ''
        try { errorBody = await res.text() } catch {}
        console.error('❌ [updateImage] Тело ошибки:', errorBody)
        if (res.status === 401) {
          throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
        }
        throw new Error('Failed to update image')
      }
      if (res.ok) setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...payload } : f)))
    } catch (err) {
      console.error('Failed to update image', err)
      throw err
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