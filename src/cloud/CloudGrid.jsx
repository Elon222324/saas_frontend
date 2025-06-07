import { useState } from 'react'
import CloudFileCard from './CloudFileCard'
import ImagePreviewModal from './ImagePreviewModal'
import { Search, Trash2, Pencil } from 'lucide-react'

export default function CloudGrid({ files, selected, onSelect, onDelete, onEdit }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)

  const handlePreview = (index) => {
    setPreviewIndex(index)
    setIsPreviewOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-4">
        {files.map((file, i) => (
          <div
            key={file.id}
            className={`relative group ${
              selected?.id === file.id ? 'ring-2 ring-blue-500 rounded' : ''
            }`}
          >
            <CloudFileCard
              file={file}
              selected={selected}
              onSelect={onSelect}
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
        onSelect={onSelect}
      />
    </>
  )
}
