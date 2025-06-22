import { useState } from 'react'
import { Edit2, Trash2, Plus } from 'lucide-react'

export default function OptionRow({
  group,
  checked,
  onCheck,
  onEdit,
  onDelete,
  onAddValue,
  onEditValue,
  onDeleteValue,
  innerRef,
  draggableProps,
  dragHandleProps,
}) {
  const [editName, setEditName] = useState(false)
  const [nameVal, setNameVal] = useState('')
  const [editSlug, setEditSlug] = useState(false)
  const [slugVal, setSlugVal] = useState('')
  const [expanded, setExpanded] = useState(false)

  const saveName = async () => {
    const val = nameVal.trim()
    setEditName(false)
    if (val && val !== group.name) await onEdit(group.id, { name: val })
  }

  const saveSlug = async () => {
    const val = slugVal.trim()
    setEditSlug(false)
    if (val && val !== group.slug) await onEdit(group.id, { slug: val })
  }

  return (
    <>
      <tr
        ref={innerRef}
        {...draggableProps}
        className="hover:bg-gray-50 focus-within:bg-gray-50"
      >
        <td className="px-2 py-1" {...dragHandleProps}>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onCheck(group.id)}
            className="focus:ring-blue-500"
          />
        </td>
        <td className="px-2 py-1" onDoubleClick={() => { setNameVal(group.name); setEditName(true) }}>
          {editName ? (
            <input
              autoFocus
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveName()
                if (e.key === 'Escape') setEditName(false)
              }}
              className="w-full rounded border px-1 text-sm focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            group.name
          )}
        </td>
        <td className="px-2 py-1" onDoubleClick={() => { setSlugVal(group.slug); setEditSlug(true) }}>
          {editSlug ? (
            <input
              autoFocus
              value={slugVal}
              onChange={(e) => setSlugVal(e.target.value)}
              onBlur={saveSlug}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveSlug()
                if (e.key === 'Escape') setEditSlug(false)
              }}
              className="w-full rounded border px-1 text-sm focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            group.slug
          )}
        </td>
        <td className="px-2 py-1 text-right space-x-2">
          <button
            onClick={() => setExpanded((p) => !p)}
            className="rounded p-1 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
            title={expanded ? 'Скрыть значения' : 'Показать значения'}
          >
            {expanded ? '-' : '+'}
          </button>
          <button
            onClick={() => onEdit(group)}
            className="rounded p-1 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
            title="Редактировать"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(group.id)}
            className="rounded p-1 hover:bg-gray-100 focus:ring-2 focus:ring-red-500"
            title="Удалить"
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td />
          <td colSpan={3} className="space-y-2 px-2 py-2">
            <div className="flex flex-wrap gap-2">
              {group.values.map((v) => (
                <span
                  key={v.id}
                  className="flex items-center gap-1 rounded border px-2 py-1 text-sm"
                >
                  <span
                    onDoubleClick={() => onEditValue(v)}
                    className="cursor-text"
                  >
                    {v.value}
                  </span>
                  <button
                    onClick={() => onDeleteValue(v.id)}
                    className="rounded p-0.5 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={() => onAddValue(group.id)}
              className="mt-2 flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              <Plus size={14} /> Добавить значение
            </button>
          </td>
        </tr>
      )}
    </>
  )
}
