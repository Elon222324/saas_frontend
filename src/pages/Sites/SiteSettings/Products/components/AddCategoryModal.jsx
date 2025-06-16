// FILE: src/pages/Sites/SiteSettings/Products/components/AddCategoryModal.jsx
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const modalRoot =
  document.getElementById('modal-root') ??
  (() => {
    const el = document.createElement('div')
    el.id = 'modal-root'
    document.body.appendChild(el)
    return el
  })()

export default function AddCategoryModal({ open, onClose, onSave, parents }) {
  const [name, setName] = useState('')
  const [parent, setParent] = useState(null)

  useEffect(() => {
    if (!open) {
      setName('')
      setParent(null)
    }
  }, [open])

  if (!open) return null

  const handleSave = () => {
    const val = name.trim()
    if (!val) return
    onSave({ name: val, parent_id: parent })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 rounded bg-white p-4 shadow-xl">
        <h3 className="mb-2 text-lg font-medium">Новая категория</h3>

        <label className="mb-1 block text-sm">Название</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите название"
          className="mb-4 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
        />

        <label className="mb-1 block text-sm">Родитель</label>
        <select
          value={parent ?? ''}
          onChange={(e) =>
            setParent(e.target.value === '' ? null : Number(e.target.value))
          }
          className="mb-4 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Без родителя</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.path}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded px-3 py-1 text-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            Отмена
          </button>
          <button
            disabled={!name.trim()}
            onClick={handleSave}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
