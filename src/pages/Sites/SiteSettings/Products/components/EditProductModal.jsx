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

export default function EditProductModal({ open, onClose, onSave, product }) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    if (open && product) {
      setTitle(product.title || '')
      setPrice(String(product.price ?? ''))
    }
  }, [open, product])

  if (!open || !product) return null

  const handleSave = () => {
    const t = title.trim()
    const p = parseFloat(price)
    if (!t || isNaN(p)) return
    onSave({ id: product.id, title: t, price: p })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 rounded bg-white p-4 shadow-xl">
        <h3 className="mb-2 text-lg font-medium">Редактировать товар</h3>

        <label className="mb-1 block text-sm">Название</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
        />

        <label className="mb-1 block text-sm">Цена</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mb-4 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded px-3 py-1 text-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            Отмена
          </button>
          <button
            disabled={!title.trim() || !price}
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
