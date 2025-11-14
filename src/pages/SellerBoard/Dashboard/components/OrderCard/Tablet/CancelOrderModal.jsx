import { useState } from 'react'

const CANCEL_REASONS = [
  { id: 'customer_changed_mind', label: 'Клиент передумал / Не пришел' },
  { id: 'no_ingredients', label: 'Нет ингредиентов (Закончился матча)' },
  { id: 'incorrect_order', label: 'Некорректный заказ / Спам' },
  { id: 'other', label: 'Другое' }
]

export function CancelOrderModal({ order, siteName, siteToken, onClose, onCanceled }) {
  const [selectedReason, setSelectedReason] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirmCancel = async () => {
    if (!selectedReason) {
      alert('⚠️ Пожалуйста, выберите причину отмены')
      return
    }

    setIsLoading(true)
    try {
      if (!siteToken || !siteName) {
        alert('❌ Отсутствуют необходимые данные авторизации')
        setIsLoading(false)
        return
      }

      const baseDomain = import.meta.env.VITE_BASE_DOMAIN
      const url = `https://${siteName}.${baseDomain}/site-api/admin/orders/${order.id}/status`
      
      console.log('📤 Отправляю запрос отмены:', { url, body: { status: 'canceled' } })

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'canceled' })
      })

      console.log('📥 Ответ:', response.status, response.statusText)
      const responseData = await response.json().catch(() => null)
      console.log('📋 Данные ответа:', responseData)

      if (!response.ok) {
        console.error('❌ Ошибка от сервера:', responseData)
        throw responseData || { message: `HTTP ${response.status}: ${response.statusText}` }
      }

      console.log(`✅ Заказ #${order.order_number} отменён`)
      onCanceled?.()
    } catch (error) {
      console.error('❌ Полная ошибка:', error)
      const errorMsg = error?.detail || error?.message || JSON.stringify(error) || 'неизвестная ошибка'
      alert(`Не удалось отменить заказ: ${errorMsg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-96 w-full mx-4">
        {/* Заголовок */}
        <h2 className="text-white font-bold text-lg mb-4">
          Отмена заказа #{order.order_number}
        </h2>

        {/* Текст с описанием */}
        <p className="text-gray-400 text-sm mb-4">
          Укажите причину отмены:
        </p>

        {/* Выбор причины */}
        <div className="space-y-2 mb-6">
          {CANCEL_REASONS.map((reason) => (
            <label key={reason.id} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer transition">
              <input
                type="radio"
                name="cancel_reason"
                value={reason.id}
                checked={selectedReason === reason.id}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="cursor-pointer"
              />
              <span className="text-gray-300 text-sm">{reason.label}</span>
            </label>
          ))}
        </div>

        {/* Кнопки */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition disabled:opacity-50"
          >
            ❌ Отмена
          </button>
          <button
            onClick={handleConfirmCancel}
            disabled={isLoading || !selectedReason}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            {isLoading ? '⏳ Отмена...' : '🗑️ Отменить'}
          </button>
        </div>
      </div>
    </div>
  )
}

