import { useState } from 'react'

export function TabletActionButton({ order, siteName, siteToken, onOrderStatusChanged }) {
  const [isLoading, setIsLoading] = useState(false)

  // Определяем следующий статус и текст кнопки в зависимости от текущего статуса
  // Видимые колонки: new → preparing → delivering → (невидимо: completed)
  const getActionConfig = () => {
    const status = String(order.status || '').toLowerCase()
    
    const statusMap = {
      'new': {
        buttonText: '▶️ ВЗЯТЬ В РАБОТУ',
        nextStatus: 'preparing',
        actionLabel: 'взять в работу'
      },
      'confirmed': {
        // Если somehow попадёт в confirmed, переводим в preparing
        buttonText: '▶️ НАЧАТЬ',
        nextStatus: 'preparing',
        actionLabel: 'начать готовку'
      },
      'preparing': {
        buttonText: '✅ ГОТОВО К ВЫДАЧЕ',
        nextStatus: 'delivering',
        actionLabel: 'подготовить к выдаче'
      },
      'delivering': {
        buttonText: '🤝 ЗАБРАЛИ',
        nextStatus: 'completed',
        actionLabel: 'завершить'
      },
      'completed': {
        buttonText: '✅ ЗАВЕРШЕНО',
        nextStatus: null,
        actionLabel: null,
        disabled: true
      },
      'canceled': {
        buttonText: '❌ ОТМЕНЕНО',
        nextStatus: null,
        actionLabel: null,
        disabled: true
      }
    }
    
    return statusMap[status] || statusMap.new
  }

  const config = getActionConfig()

  const handleUpdateStatus = async () => {
    if (!order?.id || !config.nextStatus) return
    
    setIsLoading(true)
    try {
      if (!siteToken || !siteName) {
        alert('❌ Отсутствуют необходимые данные авторизации')
        return
      }

      const baseDomain = import.meta.env.VITE_BASE_DOMAIN
      const url = `https://${siteName}.${baseDomain}/site-api/admin/orders/${order.id}/status`
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${siteToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: config.nextStatus })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }))
        throw error
      }

      console.log(`✅ Статус изменён на "${config.nextStatus}"`)
      
      // Уведомляем родительский компонент об изменении
      if (onOrderStatusChanged) {
        onOrderStatusChanged(order.id)
      }
    } catch (error) {
      console.error('❌ Ошибка при смене статуса:', error)
      alert(`Не удалось ${config.actionLabel}: ${error.message || 'неизвестная ошибка'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = config.disabled || isLoading || !config.nextStatus

  // Определяем цвет кнопки в зависимости от статуса
  const getButtonColor = () => {
    const status = String(order.status || '').toLowerCase()
    
    if (isDisabled) {
      return 'bg-gray-600 text-gray-300 cursor-not-allowed'
    }

    // new → Синий (Play)
    if (status === 'new') {
      return 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:scale-105 active:scale-100'
    }

    // preparing → Зеленый (Чекбокс)
    if (status === 'preparing') {
      return 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white hover:scale-105 active:scale-100'
    }

    // delivering → Серый/Контурная (Рукопожатие)
    if (status === 'delivering') {
      return 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white border border-gray-500 hover:scale-105 active:scale-100'
    }

    // По умолчанию синий
    return 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:scale-105 active:scale-100'
  }

  return (
    <div className="px-2 py-1.5 border-t border-black/20">
      <button 
        onClick={handleUpdateStatus}
        disabled={isDisabled}
        className={`w-full font-bold text-xs py-2 rounded transition transform ${getButtonColor()}`}
      >
        {isLoading ? '⏳ ЗАГРУЗКА...' : config.buttonText}
      </button>
    </div>
  )
}

