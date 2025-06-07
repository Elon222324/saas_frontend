import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

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

      <div className="relative z-10 bg-white rounded-lg shadow max-w-[800px] w-full h-[600px] flex flex-col overflow-hidden">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black z-10">
          <X size={24} />
        </button>

        {files.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1 rounded-full"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1 rounded-full"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        <div className="flex-1 flex items-center justify-center px-4">
          <img
            src={file.url}
            alt={file.name || file.filename}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = fallback
            }}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="py-4 text-center border-t">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              onSelect?.(file)
              onClose?.()
            }}
          >
            Выбрать
          </button>
        </div>
      </div>
    </Dialog>
  )
}