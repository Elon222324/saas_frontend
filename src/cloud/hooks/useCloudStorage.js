import { useState, useEffect, useCallback, useRef } from 'react'
import { useSiteSettings } from '@/context/SiteSettingsContext'

export default function useCloudStorage() {
  const { site_name } = useSiteSettings()
  const API_URL = import.meta.env.VITE_API_URL

  const [groups, setGroups] = useState([])
  const [files, setFiles] = useState([])
  const [selected, setSelected] = useState(null)
  const [used, setUsed] = useState(0)
  const [limit, setLimit] = useState(0)

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
        const parent = cat.category_type === 'products' ? 'ТОВАРЫ' : 'СИСТЕМНЫЕ'
        if (!grouped[parent]) grouped[parent] = []
        grouped[parent].push({ id: cat.id, title: cat.description || cat.name })
        if (cat.images) {
          cat.images.forEach((img) => {
            allFiles.push({
              ...img,
              category: cat.id,
              url: API_URL + img.url,
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

  const createCategory = async (name) => {
    try {
      const res = await fetch(`${API_URL}/images/categories/?site_name=${site_name}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ name }),
      })
      if (res.ok) await fetchData()
    } catch (err) {
      console.error('Failed to create category', err)
    }
  }

  const uploadFiles = async (filesList, categoryId) => {
    for (const file of filesList) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await fetch(
          `${API_URL}/images/?site_name=${site_name}&category_id=${categoryId}&category=${categoryId}`,
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
            { ...img, category: categoryId, url: API_URL + img.url },
          ])
        }
      } catch (err) {
        console.error('Upload failed', err)
      }
    }
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
    uploadFiles(list, categoryId)
    e.target.value = ''
  }

  return {
    groups,
    files,
    selected,
    setSelected,
    used,
    limit,
    handleUploadClick,
    uploadInputRef,
    handleInputChange,
    createCategory,
    deleteImage,
    updateImage,
    refetch: fetchData,
  }
}
