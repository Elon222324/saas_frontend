import { useEffect, useState } from 'react'
import { getImageVariants } from '@/utils/imageVariants'

/**
 * Получает токен пользователя из localStorage
 * @returns {string | null} access_token или null
 */
const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

export default function useTemplateGallery() {
  const [groups, setGroups] = useState([])
  const [files, setFiles] = useState([])

  useEffect(() => {
    async function fetchLibrary() {
      try {
        const accessToken = getAccessToken()
        
        if (!accessToken) {
          console.error('📦 [useTemplateGallery] Ошибка: отсутствует access_token')
          throw new Error('Отсутствует access_token пользователя')
        }

        console.log('📦 [useTemplateGallery] → Запрос к:', `${import.meta.env.VITE_API_URL}/cloud/library`)

        const res = await fetch(`${import.meta.env.VITE_API_URL}/cloud/library`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        console.log('📦 [useTemplateGallery] ← Статус ответа:', res.status, res.statusText)

        if (!res.ok) {
          console.error('📦 [useTemplateGallery] ❌ Ошибка HTTP:', res.status)
          if (res.status === 401) {
            throw new Error('Токен истек или недействителен. Требуется повторная авторизация.')
          }
          throw new Error('Не удалось загрузить библиотеку')
        }

        const data = await res.json()
        const base = import.meta.env.VITE_LIBRARY_ASSETS_URL || ''

        console.log('[📦 useTemplateGallery] Загружены категории:', data)

        const grouped = {}

        for (const group of data) {
          const parent = group.category_type === 'products' ? 'ТОВАРЫ' : 'СИСТЕМНЫЕ'
          if (!grouped[parent]) grouped[parent] = []
          grouped[parent].push({
            id: group.code,
            title: group.description || group.name,
            code: group.code,
          })
        }

        const mergedGroups = Object.entries(grouped).map(([title, children]) => ({
          title,
          children,
        }))

        console.log('[🧭 useTemplateGallery] Группы:', mergedGroups)
        setGroups(mergedGroups)

        const allFiles = data.flatMap((group) =>
          group.images.map((img) => {
            const full = `${base}${img.url}`
            const variants = getImageVariants(full)
            return {
              ...img,
              category: group.code,
              base_url: full,
              ...variants,
            }
          })
        )

        console.log('[🖼️ useTemplateGallery] Файлы:', allFiles)
        setFiles(allFiles)
      } catch (err) {
        console.error('[❌ useTemplateGallery] Ошибка загрузки:', err)
      }
    }

    fetchLibrary()
  }, [])

  return { groups, files }
}
