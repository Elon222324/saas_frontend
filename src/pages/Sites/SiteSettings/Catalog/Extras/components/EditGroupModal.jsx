import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const modalRoot =
  document.getElementById('modal-root') ||
  (() => {
    const el = document.createElement('div')
    el.id = 'modal-root'
    document.body.appendChild(el)
    return el
  })()

export default function EditGroupModal({ open, onClose, onSave, group }) {
  const [name, setName] = useState('')
  const [selectionType, setSelectionType] = useState('checkbox')
  const [minSel, setMinSel] = useState(0)
  const [maxSel, setMaxSel] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && group) {
      setName(group.name || '')
      setSelectionType(group.selection_type || 'checkbox')
      setMinSel(group.min_selection ?? 0)
      setMaxSel(group.max_selection ?? '')
      setLoading(false)
    }
  }, [open, group])

  if (!open || !group) return null

  const handleSave = async () => {
    const n = name.trim()
    if (!n) return
    setLoading(true)
    try {
      await onSave({
        id: group.id,
        name: n,
        selection_type: selectionType,
        min_selection: parseInt(minSel) || 0,
        max_selection: maxSel === '' ? null : parseInt(maxSel),
      })
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 rounded bg-white p-4 shadow-xl">
        <h3 className="mb-2 text-lg font-medium">Редактировать группу</h3>

        <label className="mb-1 block text-sm">Название</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <label className="mb-1 block text-sm">Тип выбора</label>
        <select
          value={selectionType}
          onChange={(e) => setSelectionType(e.target.value)}
          className="mb-2 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="checkbox">Множественный</option>
          <option value="radio">Один из списка</option>
        </select>

        <label className="mb-1 block text-sm">Мин. выбор</label>
        <input
          type="number"
          value={minSel}
          onChange={(e) => setMinSel(e.target.value)}
          className="mb-2 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <label className="mb-1 block text-sm">Макс. выбор</label>
        <input
          type="number"
          value={maxSel}
          onChange={(e) => setMaxSel(e.target.value)}
          className="mb-4 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
          >
            Отмена
          </button>
          <button
            disabled={!name.trim() || loading}
            onClick={handleSave}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
