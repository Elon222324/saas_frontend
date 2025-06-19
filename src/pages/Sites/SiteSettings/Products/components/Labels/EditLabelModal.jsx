import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ColorInput from '@/components/fields/ColorInput'
import ToggleInput from '@/components/fields/ToggleInput'
import NumberInput from '@/components/fields/NumberInput'

const modalRoot =
  document.getElementById('modal-root') ||
  (() => {
    const el = document.createElement('div')
    el.id = 'modal-root'
    document.body.appendChild(el)
    return el
  })()

export default function EditLabelModal({ open, onClose, onSave, label }) {
  const [name, setName] = useState('')
  const [bgColor, setBgColor] = useState('#E0E0E0')
  const [textColor, setTextColor] = useState('#000000')
  const [active, setActive] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && label) {
      setName(label.name || '')
      setBgColor(label.bg_color || '#E0E0E0')
      setTextColor(label.text_color || '#000000')
      setActive(Boolean(label.is_active))
      setSortOrder(label.sort_order ?? 0)
      setLoading(false)
    }
  }, [open, label])

  if (!open || !label) return null

  const handleSave = async () => {
    const val = name.trim()
    if (!val) return
    setLoading(true)
    try {
      await onSave({
        id: label.id,
        name: val,
        bg_color: bgColor,
        text_color: textColor,
        is_active: active,
        sort_order: Number(sortOrder) || 0,
      })
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 rounded bg-white p-4 shadow-xl space-y-3">
        <h3 className="text-lg font-medium">Редактировать метку</h3>
        <label className="block space-y-1 text-sm">
          <span>Название</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </label>
        <ColorInput label="Цвет фона" value={bgColor} onChange={setBgColor} />
        <ColorInput label="Цвет текста" value={textColor} onChange={setTextColor} />
        <ToggleInput label="Активно" value={active} onChange={setActive} />
        <NumberInput label="Порядок сортировки" value={sortOrder} onChange={setSortOrder} />
        <div className="flex justify-end gap-2 pt-2">
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
