import { useState } from 'react'
import { X } from 'lucide-react'

// Доступные типы блоков для добавления (исключаем системные блоки header и footer)
const AVAILABLE_BLOCK_TYPES = [
  { value: 'banner', label: '🖼️ Баннер' },
  { value: 'info', label: 'ℹ️ Быстрая информация' },
  { value: 'promo', label: '🎁 Промо карточки' },
  { value: 'promo_stories', label: '🎬 Промо истории' },
  { value: 'products', label: '🛍️ Популярные товары' },
  { value: 'tabs', label: '📑 Меню/Вкладки' },
  { value: 'product_grid', label: '📊 Сетка товаров' },
  { value: 'reviews', label: '⭐ Отзывы' },
  { value: 'delivery', label: '🚚 Доставка' },
  { value: 'text', label: '📝 О компании' },
  { value: 'navigation', label: '🔗 Навигация' },
]

export default function AddBlockModal({ open, onClose, onAddBlock, isLoading = false }) {
  const [selectedType, setSelectedType] = useState('')
  const [customLabel, setCustomLabel] = useState('')

  const handleAdd = async () => {
    if (!selectedType) {
      alert('Выберите тип блока')
      return
    }

    try {
      // Используем кастомное имя или название типа блока
      const label = customLabel.trim() || AVAILABLE_BLOCK_TYPES.find(b => b.value === selectedType)?.label || selectedType

      await onAddBlock({
        type: selectedType,
        label,
      })

      // Очищаем форму и закрываем модал
      setSelectedType('')
      setCustomLabel('')
      onClose()
    } catch (error) {
      console.error('Ошибка при добавлении блока:', error)
      alert('Не удалось добавить блок: ' + error.message)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[500px] rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Добавить новый блок</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Выбор типа блока */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Выберите тип блока:
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {AVAILABLE_BLOCK_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  disabled={isLoading}
                  className={`rounded-lg border-2 p-3 text-left transition ${
                    selectedType === type.value
                      ? 'border-blue-500 bg-blue-50 font-medium text-blue-700'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Кастомное имя (опционально) */}
          {selectedType && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Кастомное имя (опционально):
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={e => setCustomLabel(e.target.value)}
                placeholder="Оставьте пустым для использования названия типа"
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                По умолчанию: {AVAILABLE_BLOCK_TYPES.find(b => b.value === selectedType)?.label}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t bg-gray-50 p-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedType || isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Добавляю...' : 'Добавить блок'}
          </button>
        </div>
      </div>
    </div>
  )
}

