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

export default function EditItemModal({ open, onClose, onSave, item }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && item) {
      setName(item.name || '')
      setPrice(item.price?.toString() || '')
      setLoading(false)
    }
  }, [open, item])

  if (!open || !item) return null

  const handleSave = async () => {
    const n = name.trim()
    const p = parseFloat(price)
    if (!n || isNaN(p)) return
    setLoading(true)
    try {
      await onSave({ id: item.id, group_id: item.group_id, name: n, price: p })
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 rounded bg-white p-4 shadow-xl">
        <h3 className="mb-2 text-lg font-medium">Редактировать добавку</h3>

        <label className="mb-1 block text-sm">Название</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <label className="mb-1 block text-sm">Цена</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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
            disabled={!name.trim() || price === '' || loading}
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
