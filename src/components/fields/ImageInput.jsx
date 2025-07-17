import { useState } from 'react'
import CloudModal from '@/cloud/CloudModal'

export default function ImageInput({ label, value, onChange, category = 'logos' }) {
  const [isOpen, setIsOpen] = useState(false)

  // Превью: показываем small-версию, но не трогаем оригинальный value
  const previewSrc = value
    ? `${import.meta.env.VITE_LIBRARY_ASSETS_URL || ''}${value}_small.webp`
    : ''

  return (
    <div className="space-y-1">
      <span className="font-medium block">{label}</span>
      
      <div
        onClick={() => setIsOpen(true)}
        className="w-full border rounded px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-3"
      >
        {value ? (
          <>
            <img
              src={previewSrc}
              alt="preview"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = 'https://placehold.co/40x40?text=✖'
              }}
            />
            <span className="text-sm text-gray-600 truncate">{value}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400">Нажмите, чтобы выбрать изображение</span>
        )}
      </div>

      {isOpen && (
        <CloudModal
          isOpen={isOpen}
          category={category}
          onSelect={(url) => {
            if (url) onChange(url)  // сохраняем относительный URL
            setIsOpen(false)
          }}
        />
      )}
    </div>
  )
}