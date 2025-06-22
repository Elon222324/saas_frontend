export default function BulkActionsBar({ count, onDelete }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded border bg-gray-50 px-2 py-1">
      <span className="text-sm">Выбрано: {count}</span>
      <div className="ml-auto flex gap-2">
        <button
          onClick={onDelete}
          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
        >
          Удалить выбранное
        </button>
      </div>
    </div>
  )
}
