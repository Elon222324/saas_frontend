import { Pencil, Trash } from 'lucide-react'

export default function LabelItem({ label, selected, onSelect, onEdit, onDelete }) {
  const isSelected = selected === label.id

  return (
    <div
      className={`flex items-center justify-between rounded border px-2 py-2 text-sm cursor-pointer ${isSelected ? 'bg-blue-100 border-blue-600' : ''}`}
      style={{
        borderColor: label.bg_color,
        borderLeft: `4px solid ${label.bg_color}`,
        backgroundColor: label.bg_color + '1A',
      }}
      onClick={() => onSelect(label.id)}
    >
      <span className="flex items-center gap-2" style={{ color: label.text_color }}>
        <span
          className="block h-3 w-3 rounded-full"
          style={{ backgroundColor: label.bg_color }}
          title={`Фон: ${label.bg_color}`}
        />
        {label.name}
      </span>
      {!label.system && (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <span
            className={`h-2 w-2 rounded-full ${label.is_active ? 'bg-green-600' : 'bg-red-600'}`}
            title={label.is_active ? 'Активна' : 'Неактивна'}
          />
          <button
            onClick={() => onEdit(label)}
            className="rounded-md p-1 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
            title="Редактировать"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(label.id, label.name)}
            className="rounded-md p-1 text-red-600 hover:bg-red-100 hover:text-red-800"
            title="Удалить"
          >
            <Trash size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
