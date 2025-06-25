import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import slugify from 'slugify'

const modalRoot =
  document.getElementById('modal-root') ||
  (() => {
    const el = document.createElement('div')
    el.id = 'modal-root'
    document.body.appendChild(el)
    return el
  })()

export default function AddGroupModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [order, setOrder] = useState(0)
  const [isPricing, setIsPricing] = useState(true) // ✨ НОВОЕ СОСТОЯНИЕ
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setName('')
      setSlug('')
      setOrder(0)
      setIsPricing(true) // ✨ Сброс состояния
      setLoading(false)
    }
  }, [open])

  useEffect(() => {
    setSlug(slugify(name, { lower: true, strict: true }))
  }, [name])

  if (!open) return null

  const handleSave = async () => {
    const n = name.trim()
    const s = slug.trim()
    if (!n || !s) return
    setLoading(true)
    try {
      // ✨ ИЗМЕНЕНО: Отправляем поле is_pricing
      await onSave({ name: n, slug: s, order: order, is_pricing: isPricing })
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Новая группа опций</h3>

        <div className="space-y-4">
            <div>
                <label htmlFor="group-name" className="mb-1 block text-sm font-medium text-gray-600">Название</label>
                <input
                  id="group-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
            </div>

            <div>
                <label htmlFor="group-slug" className="mb-1 block text-sm font-medium text-gray-600">Slug</label>
                <input
                  id="group-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
            </div>
            
            <div>
                 <label htmlFor="group-order" className="mb-1 block text-sm font-medium text-gray-600">Порядок</label>
                <input
                  id="group-order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
            </div>
            
            {/* ✨ НОВЫЙ БЛОК: Чекбокс для is_pricing */}
            <div className="flex items-center">
                <input
                    id="is-pricing"
                    type="checkbox"
                    checked={isPricing}
                    onChange={(e) => setIsPricing(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                />
                <label htmlFor="is-pricing" className="ml-2 block text-sm text-gray-800">
                    Влияет на цену
                </label>
            </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Отмена
          </button>
          <button
            disabled={!name.trim() || !slug.trim() || loading}
            onClick={handleSave}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
