import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const modalRoot =
  document.getElementById('modal-root') ||
  (() => {
    const el = document.createElement('div')
    el.id = 'modal-root'
    document.body.appendChild(el)
    return el
  })()

export default function AddLabelModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#000000')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)

  useEffect(() => {
    if (!open) {
      setName('')
      setColor('#000000')
      setDescription('')
      setActive(true)
    }
  }, [open])

  if (!open) return null

  const handleSave = () => {
    const val = name.trim()
    if (!val) return
    onSave({
      name: val,
      color,
      description: description.trim() || undefined,
      is_active: active,
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 rounded bg-white p-4 shadow-xl space-y-2">
        <h3 className="text-lg font-medium">Новая метка</h3>

        <label className="block text-sm">Название</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-sm">Цвет</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-8 w-full rounded border"
        />

        <label className="block text-sm">Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="focus:ring-blue-500"
          />
          Активна
        </label>

        <div className="flex justify-end gap-2 pt-1">
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
