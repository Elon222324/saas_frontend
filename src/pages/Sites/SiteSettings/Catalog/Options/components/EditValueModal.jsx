// EditValueModal.jsx
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

// Принимаем новый проп `isPricing`
export default function EditValueModal({ open, onClose, onSave, valueItem, isPricing }) {
  const [value, setValue] = useState('')
  const [order, setOrder] = useState(0)
  const [priceDiff, setPriceDiff] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && valueItem) {
      setValue(valueItem.value || '')
      setOrder(valueItem.order || 0)
      setPriceDiff(valueItem.price_diff || 0)
      setLoading(false)
    }
  }, [open, valueItem])

  if (!open || !valueItem) return null

  const handleSave = async () => {
    const v = value.trim()
    if (!v) return
    setLoading(true)
    try {
      await onSave({
        id: valueItem.id,
        group_id: valueItem.group_id,
        value: v,
        order: order,
        // Если цена не влияет, отправляем сохраненное или нулевое значение
        price_diff: priceDiff,
      })
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 rounded bg-white p-4 shadow-xl">
        <h3 className="mb-2 text-lg font-medium">Редактировать значение</h3>

        <label className="mb-1 block text-sm">Значение</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mb-2 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <label className="mb-1 block text-sm">Порядок</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="mb-2 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        {/* Условно отображаем поле для надбавки к цене */}
        {isPricing && (
          <>
            <label className="mb-1 block text-sm">Надбавка к цене (₽)</label>
            <input
              type="number"
              value={priceDiff}
              onChange={(e) => setPriceDiff(Number(e.target.value))}
              className="mb-4 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
          >
            Отмена
          </button>
          <button
            disabled={!value.trim() || loading}
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
