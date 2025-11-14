import { useState, useRef, useEffect } from 'react'

export function OrderMenuDropdown({ order, onCancelClick }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Закрываем меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-300 hover:text-white text-lg cursor-pointer transition"
        title="Меню"
      >
        ⋮
      </button>

      {isOpen && (
        <div className="absolute right-0 top-6 bg-gray-900 border border-gray-700 rounded shadow-lg z-50 min-w-48">
          <button
            onClick={() => {
              alert('🖨️ Печать чека - на будущее')
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition flex items-center gap-2"
          >
            🖨️ Печать чека
          </button>

          <button
            onClick={() => {
              alert('✏️ Изменить - на будущее')
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition flex items-center gap-2 border-t border-gray-700"
          >
            ✏️ Изменить
          </button>

          <button
            onClick={() => {
              setIsOpen(false)
              onCancelClick?.()
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition flex items-center gap-2 border-t border-gray-700"
          >
            🗑️ Отменить заказ
          </button>
        </div>
      )}
    </div>
  )
}

