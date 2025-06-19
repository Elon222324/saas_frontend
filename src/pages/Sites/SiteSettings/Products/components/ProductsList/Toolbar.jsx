import { Plus } from 'lucide-react'

export default function Toolbar({ onAdd, search, onSearch, disabledAdd }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onAdd}
        disabled={disabledAdd}
        className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
      >
        <Plus size={16} /> Добавить товар
      </button>
      <button className="rounded border px-3 py-1 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500">
        Фильтры
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
