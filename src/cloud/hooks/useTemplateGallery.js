import { useEffect, useState } from 'react'
import { getImageVariants } from '@/utils/imageVariants'

export default function useTemplateGallery() {
  const [groups, setGroups] = useState([])
  const [files, setFiles] = useState([])

  useEffect(() => {
    async function fetchLibrary() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cloud/library`)
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
