import { Plus } from 'lucide-react'

export default function Toolbar({ onAdd, search, onSearch }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onAdd}
        className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
      >
        <Plus size={16} /> Добавить группу
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
