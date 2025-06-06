import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { X, ChevronLeft, ChevronRight, Trash2, Pencil } from 'lucide-react'

export default function ImagePreviewModal({ isOpen, files = [], initialIndex = 0, onClose, onSelect }) {
  const [index, setIndex] = useState(initialIndex)
  const fallback = 'https://placehold.co/600x400?text=No+Image'

  useEffect(() => {
    setIndex(initialIndex)
  }, [initialIndex, isOpen])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen])

  const prev = () => setIndex((i) => (i - 1 + files.length) % files.length)
  const next = () => setIndex((i) => (i + 1) % files.length)

  const file = files[index]
  if (!file) return null

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-70" />
      <div className="relative z-10 flex flex-col items-center group">
        <button onClick={onClose} className="absolute top-2 right-2 text-white">
          <X size={24} />
        </button>
        <div className="absolute top-2 right-10 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button className="bg-white rounded p-1 shadow">
            <Trash2 size={16} />
          </button>
          <button className="bg-white rounded p-1 shadow">
            <Pencil size={16} />
          </button>
        </div>
        {files.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 text-white p-2">
              <ChevronLeft size={32} />
            </button>
            <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 text-white p-2">
              <ChevronRight size={32} />
            </button>
          </>
        )}
        <img
          src={file.url}
          alt={file.name || file.filename}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = fallback
          }}
          className="max-h-[80vh] max-w-[90vw] object-contain bg-white rounded"
        />
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            onSelect?.(file)
            onClose?.()
          }}
        >
          Выбрать
        </button>
      </div>
    </Dialog>
  )
}
