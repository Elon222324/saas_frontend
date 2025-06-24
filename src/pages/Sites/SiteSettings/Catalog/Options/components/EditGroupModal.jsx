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
  const [slug, setSlug] = useState('')
  const [order, setOrder] = useState(0) // <-- ДОБАВЛЕНО
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && group) {
      setName(group.name || '')
      setSlug(group.slug || '')
      setOrder(group.order || 0) // <-- ДОБАВЛЕНО: предзаполнение
      setLoading(false)
    }
  }, [open, group])

  if (!open || !group) return null

  const handleSave = async () => {
    const n = name.trim()
    const s = slug.trim()
    if (!n || !s) return
    setLoading(true)
    try {
      // ИЗМЕНЕНО: Отправляем поле order
      await onSave({ id: group.id, name: n, slug: s, order: order })
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

        <label className="mb-1 block text-sm">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mb-2 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        {/* ДОБАВЛЕНО: Поле для редактирования порядка */}
        <label className="mb-1 block text-sm">Порядок</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
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
            disabled={!name.trim() || !slug.trim() || loading}
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
