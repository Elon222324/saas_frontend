import { Plus, Folder, Tag, Search, X } from 'lucide-react'
import { useState } from 'react';

export default function CategoryToolbar({ tab, onTabChange, onAddClick, search, setSearch }) {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const commonTabStyles =
    'flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
  const activeTabStyles = 'bg-blue-100 text-blue-700'
  const inactiveTabStyles = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'

  const handleToggleSearch = () => {
    setShowSearchInput(prev => !prev);
    // If hiding, clear the search
    if (showSearchInput) {
      setSearch('');
    }
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          className={`${commonTabStyles} ${tab === 'categories' ? activeTabStyles : inactiveTabStyles}`}
          onClick={() => onTabChange('categories')}
        >
          <Folder size={14} className="mr-1.5" />
          Категории
        </button>
        <button
          className={`${commonTabStyles} ${tab === 'labels' ? activeTabStyles : inactiveTabStyles}`}
          onClick={() => onTabChange('labels')}
        >
          <Tag size={14} className="mr-1.5" />
          Метки
        </button>
      </div>

      {/* Actions (for categories) */}
      {tab === 'categories' && (
        <div className="flex flex-col gap-3 mt-4"> {/* Changed to flex-col and added gap */}
          <div className="flex items-center justify-between"> {/* Row for Add button and Search icon */}
            <button
              onClick={onAddClick}
              className="flex-shrink-0 flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus size={14} /> Добавить категорию
            </button>

            {/* Search toggle button */}
            <button
              onClick={handleToggleSearch}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={showSearchInput ? "Скрыть поиск" : "Показать поиск"}
            >
              <Search size={20} />
            </button>
          </div>

          {/* Search Input Field (conditionally rendered) */}
          <div
            className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
              showSearchInput ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Поиск категорий..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border-gray-300 pl-8 pr-8 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                autoFocus={showSearchInput} // Auto-focus only when shown
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
      )}
    </>
  )
}