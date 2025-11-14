import { OrderBoard } from '../components'

export function DashboardContent({ 
  tokenLoading, 
  tokenError, 
  siteToken, 
  error, 
  orders, 
  siteNameForToken,
  onRefetch 
}) {
  // Загрузка токена
  if (tokenLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">⏳ Загрузка токена...</div>
      </div>
    )
  }

  // Ошибка при получении токена
  if (tokenError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-400">❌ Ошибка: {tokenError}</div>
      </div>
    )
  }

  // Токен не получен
  if (!siteToken) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">⚠️ Токен сайта не получен</div>
      </div>
    )
  }

  // Ошибка при загрузке заказов
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-400 rounded p-4 text-red-300">
          <p className="font-bold mb-2">❌ Ошибка загрузки заказов</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={onRefetch}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
          >
            Повторить
          </button>
        </div>
      </div>
    )
  }

  // Основной контент
  return <OrderBoard orders={orders} siteName={siteNameForToken} siteToken={siteToken} />
}

