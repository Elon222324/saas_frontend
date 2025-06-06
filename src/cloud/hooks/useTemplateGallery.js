import { useEffect, useState } from 'react'

export default function useTemplateGallery() {
  const [groups, setGroups] = useState([])
  const [files, setFiles] = useState([])

  useEffect(() => {
    async function fetchLibrary() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cloud/library`)
        const data = await res.json()
        const base = import.meta.env.VITE_LIBRARY_ASSETS_URL

        const grouped = {}

        for (const group of data) {
          const parent = group.category_type === 'products' ? 'ТОВАРЫ' : 'СИСТЕМНЫЕ'
          if (!grouped[parent]) grouped[parent] = []
          grouped[parent].push({
            title: group.description || group.name,
            categories: [group.name],
          })
        }

        const mergedGroups = Object.entries(grouped).map(([title, children]) => ({
          title,
          children,
        }))
        setGroups(mergedGroups)

        const allFiles = data.flatMap(group =>
          group.images.map(img => ({
            ...img,
            category: group.name,
            url: base + img.url,
          }))
        )
        setFiles(allFiles)
      } catch (err) {
        console.error('Failed to load library', err)
      }
    }

    fetchLibrary()
  }, [])

  return { groups, files }
}
