import { Plus, Filter } from 'lucide-react'

export default function Toolbar({ 
  onAdd, 
  search, 
  onSearch, 
  disabledAdd,
  showFilters,
  onToggleFilters,
  hasActiveFilters
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onAdd}
        disabled={disabledAdd}
        className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
      >
        <Plus size={16} /> Добавить товар
      </button>
      <button 
        onClick={onToggleFilters}
        className={`flex items-center gap-1 rounded border px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 transition-colors ${
          showFilters || hasActiveFilters
            ? 'bg-blue-50 border-blue-500 text-blue-700' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Filter size={16} />
        Фильтры
        {hasActiveFilters && (
          <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
            !
          </span>
        )}
      </button>
      <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="ml-auto w-48 rounded border px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
