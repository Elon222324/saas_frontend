import { useState } from 'react'
import { X } from 'lucide-react'
import { useLabelCrud } from '../../hooks/useLabelCrud'

export default function LabelFormModal({ isOpen, onClose, siteName, label }) {
  const [name, setName] = useState(label?.name || '')
  const [bgColor, setBgColor] = useState(label?.bg_color || '#E0E0E0')
  const [textColor, setTextColor] = useState(label?.text_color || '#000000')
  const [isActive, setIsActive] = useState(label?.is_active ?? true)
  const [sortOrder, setSortOrder] = useState(label?.sort_order || 0)

  const { add, update } = useLabelCrud(siteName)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Название метки не может быть пустым.')
      return
    }

    const payload = {
      name: name.trim(),
      bg_color: bgColor,
      text_color: textColor,
      is_active: isActive,
      sort_order: parseInt(sortOrder, 10) || 0,
    }

    if (label) {
      update.mutate(
        { id: label.id, ...payload },
        {
          onSuccess: () => onClose(),
          onError: (err) => alert(`Ошибка обновления: ${err.message}`),
        },
      )
    } else {
      add.mutate(payload, {
        onSuccess: () => onClose(),
        onError: (err) => alert(`Ошибка создания: ${err.message}`),
      })
    }
  }

  if (!isOpen) return null

  const isMutating = add.isPending || update.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          {label ? 'Редактировать метку' : 'Добавить метку'}
        </h2>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Закрыть"
        >
          <X size={24} />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Название метки</label>
            <input
              type="text"
              id="name"
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isMutating}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bgColor" className="mb-1 block text-sm font-medium text-gray-700">Цвет фона</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="bgColor"
                className="h-10 w-10 rounded-md border-none p-0"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                disabled={isMutating}
              />
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-300 p-2 text-sm"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                aria-label="Цвет фона HEX"
                disabled={isMutating}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="textColor" className="mb-1 block text-sm font-medium text-gray-700">Цвет текста</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="textColor"
                className="h-10 w-10 rounded-md border-none p-0"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                disabled={isMutating}
              />
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-300 p-2 text-sm"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                aria-label="Цвет текста HEX"
                disabled={isMutating}
              />
            </div>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isActive"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isMutating}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Активно</label>
          </div>
          <div className="mb-6">
            <label htmlFor="sortOrder" className="mb-1 block text-sm font-medium text-gray-700">Порядок сортировки</label>
            <input
              type="number"
              id="sortOrder"
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              disabled={isMutating}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              disabled={isMutating}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isMutating}
            >
              {label ? 'Сохранить изменения' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
