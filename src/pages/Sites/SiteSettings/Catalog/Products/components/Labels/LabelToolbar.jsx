import { Plus, Search, X } from 'lucide-react'
import { useState } from 'react'

export default function LabelToolbar({ onAddClick, search, setSearch }) {
  const [showSearchInput, setShowSearchInput] = useState(false)

  const handleToggleSearch = () => {
    setShowSearchInput((prev) => !prev)
    if (showSearchInput) setSearch('')
  }

  const handleClearSearch = () => setSearch('')

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onAddClick}
          className="flex-shrink-0 flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={14} /> Добавить метку
        </button>
        <button
          onClick={handleToggleSearch}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={showSearchInput ? 'Скрыть поиск' : 'Показать поиск'}
        >
          <Search size={20} />
        </button>
      </div>
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          showSearchInput ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder="Поиск меток..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border-gray-300 pl-8 pr-8 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            autoFocus={showSearchInput}
          />
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          {search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Очистить поиск"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
