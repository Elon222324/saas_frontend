import { useState, useEffect } from 'react'
import CloudFileCard from './CloudFileCard'
import ImagePreviewModal from './ImagePreviewModal'
import { Search, Trash2, Pencil } from 'lucide-react'

export default function CloudGrid({ files, selected, onSelect, onDelete, onEdit, onCloseModal }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [files])

  const handlePreview = (index) => {
    setPreviewIndex(index)
    setIsPreviewOpen(true)
  }

  const handleSelect = (file) => {
    const relativeUrl = file.url?.startsWith('/')
      ? file.url
      : new URL(file.url, window.location.origin).pathname

    onSelect?.({ ...file, url: relativeUrl })
    setIsPreviewOpen(false)
    onCloseModal?.()
  }

  return (
    <>
      <div className="relative grid grid-cols-3 gap-4 p-4 min-h-[200px] transition-opacity duration-300">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="w-10 h-10 border-4 border-blue-300 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {files.map((file, i) => (
          <div
            key={`${file.category}-${file.filename}-${i}`}
            className={`relative group transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${
              selected?.id === file.id ? 'ring-2 ring-blue-500 rounded' : ''
            }`}
          >
            <CloudFileCard
              file={{ ...file, url: file.medium_url || file.url }}
              selected={selected}
              onSelect={(f) => handleSelect(f)}
            />
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreview(i)
                }}
                className="bg-white rounded-full p-1 shadow"
              >
                <Search size={16} />
              </button>
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(file)
                  }}
                  className="bg-white rounded-full p-1 shadow"
                >
                  <Pencil size={16} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(file.id)
                  }}
                  className="bg-white rounded-full p-1 shadow"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        files={files}
        initialIndex={previewIndex}
        onSelect={handleSelect}
      />
    </>
  )
}
