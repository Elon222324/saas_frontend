// src/cloud/hooks/useTemplateGallery.js
import { useEffect, useState } from 'react'

export default function useTemplateGallery() {
  const [groups, setGroups] = useState([])
  const [files, setFiles] = useState([])

  useEffect(() => {
    async function fetchLibrary() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cloud/library`)
        const data = await res.json()

        if (data.groups) {
          setGroups(data.groups)
        }

        if (data.files) {
          const base = import.meta.env.VITE_LIBRARY_ASSETS_URL
          setFiles(
            data.files.map(img => ({
              ...img,
              url: base + img.url,
            }))
          )
        }
      } catch (err) {
        console.error('Failed to load library', err)
      }
    }

    fetchLibrary()
  }, [])

  return { groups, files }
}
