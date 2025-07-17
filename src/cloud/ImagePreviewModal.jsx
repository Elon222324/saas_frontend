import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react'

export default function ImagePreviewModal({ isOpen, files = [], initialIndex = 0, onClose, onSelect }) {
  const [index, setIndex] = useState(initialIndex)
  const [showInfo, setShowInfo] = useState(false)
  const [loading, setLoading] = useState(true)
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

  const prev = () => {
    setLoading(true)
    setIndex((i) => (i - 1 + files.length) % files.length)
  }
  const next = () => {
    setLoading(true)
    setIndex((i) => (i + 1) % files.length)
  }

  const file = files[index]
  if (!file) return null

  const formatSize = (bytes) => {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const getLabel = (type) => {
    switch (type) {
      case 'small': return 'Мобильное превью'
      case 'medium': return 'Изображение для сетки'
      case 'big': return 'Изображение для страницы товара'
      default: return type
    }
  }

  const getRelativeUrl = (url) => {
    try {
      const u = new URL(url, import.meta.env.VITE_LIBRARY_ASSETS_URL || window.location.origin)
      return u.pathname + u.search
    } catch {
      return url
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-70" />

      <div className="relative z-10 bg-white rounded-lg shadow max-w-[90vw] w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          {files.length > 1 && (
            <span className="text-xs text-gray-500">{index + 1} / {files.length}</span>
          )}
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {files.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full z-20"
              style={{ touchAction: 'manipulation' }}
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full z-20"
              style={{ touchAction: 'manipulation' }}
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 overflow-auto relative">
          <div className="absolute top-4 left-4 z-10">
            <div
              className="text-white bg-black/50 rounded-full p-1 cursor-pointer relative group"
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
            >
              <Info size={20} />
              {showInfo && (
                <div className="absolute left-full top-1 ml-2 bg-black/80 text-white text-xs p-3 rounded w-max space-y-1 whitespace-nowrap">
                  <div>{getLabel('small')}: {formatSize(file.small_size_bytes)} — {file.small_width}×{file.small_height}</div>
                  <div>{getLabel('medium')}: {formatSize(file.medium_size_bytes)} — {file.medium_width}×{file.medium_height}</div>
                  <div>{getLabel('big')}: {formatSize(file.big_size_bytes)} — {file.big_width}×{file.big_height}</div>
                </div>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600 text-center break-all mb-4 mt-6">
            <div className="font-medium">{file.filename}</div>
          </div>

          <div className="max-w-full max-h-[60vh] flex items-center justify-center">
            {loading && (
              <div className="w-20 h-20 border-4 border-blue-300 border-t-transparent rounded-full animate-spin" />
            )}
            <img
              src={file.big || file.url}
              alt={file.name || file.filename}
              onLoad={() => setLoading(false)}
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = fallback
                setLoading(false)
              }}
              className={`max-w-[80vw] max-h-[60vh] object-contain rounded transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
            />
          </div>
        </div>

        <div className="py-3 text-center border-t">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              const relativeUrl = getRelativeUrl(file.url)
              onSelect?.({ ...file, url: relativeUrl })
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
