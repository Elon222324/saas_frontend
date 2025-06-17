export default function BulkActionsBar({ count, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded border bg-gray-50 px-2 py-1">
      <span className="text-sm">Выбрано: {count}</span>
      <button
        onClick={onDelete}
        className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
      >
        Удалить выбранное
      </button>
    </div>
  )
}
