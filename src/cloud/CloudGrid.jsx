import { useState } from 'react'
import CloudFileCard from './CloudFileCard'
import ImagePreviewModal from './ImagePreviewModal'
import { Search } from 'lucide-react'

export default function CloudGrid({ files, selected, onSelect }) {
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
          <button
            key={file.id}
            onClick={() => onSelect(file)}
            className={`flex flex-col items-center border rounded overflow-hidden shadow hover:shadow-md transition bg-white relative group ${
              selected?.id === file.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="w-full h-[120px] bg-gray-50 flex items-center justify-center relative">
              <img
                src={file.url}
                alt={file.filename}
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreview(i)
                }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition"
              >
                <Search size={16} />
              </button>
            </div>
            <div className="px-2 py-1 w-full text-xs text-center text-gray-700 truncate border-t">
              {file.filename}
            </div>
          </button>
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