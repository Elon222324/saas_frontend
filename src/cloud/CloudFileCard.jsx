import { useMemo, useEffect } from 'react'

export default function CloudFileCard({ file, selected, onSelect }) {
  const fallback = 'https://placehold.co/300x200?text=No+Image'

  const src = useMemo(() => {
    if (!file?.url) return fallback

    if (file.url.startsWith('http')) {
      return file.url
    }

    if (file.url.startsWith('/')) {
      return `${import.meta.env.VITE_LIBRARY_ASSETS_URL || ''}${file.url}`
    }

    return fallback
  }, [file])

  useEffect(() => {
    console.log('[🖼️ image src]', src)
  }, [src])

  return (
    <div
      onClick={() => onSelect?.(file)}
      className={`cursor-pointer flex flex-col items-center border rounded overflow-hidden shadow hover:shadow-md relative group ${
        selected?.url === file.url ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="w-full h-[150px] bg-gray-100 flex items-center justify-center">
        <img
          src={src}
          alt={file.name}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = fallback
          }}
        />
      </div>
      <div className="p-2 text-sm w-full text-center truncate">{file.name}</div>
    </div>
  )
}
