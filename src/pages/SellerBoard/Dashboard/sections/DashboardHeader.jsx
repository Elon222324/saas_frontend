import { RefreshCw, Maximize2, Minimize2 } from 'lucide-react'

export function DashboardHeader({ isFullscreen, isRefreshing, siteToken, onToggleFullscreen, onRefresh }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <h2 className="text-xl font-bold text-white">📋 Заказы</h2>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFullscreen}
          className="transition-colors text-gray-300 hover:text-white cursor-pointer"
          title={isFullscreen ? 'Выход из полноэкрана' : 'Полноэкран'}
        >
          {isFullscreen ? <Minimize2 size={28} strokeWidth={2} /> : <Maximize2 size={28} strokeWidth={2} />}
        </button>
        <button
          onClick={onRefresh}
          disabled={isRefreshing || !siteToken}
          className={`transition-colors hover:text-white ${
            isRefreshing || !siteToken
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:text-white cursor-pointer'
          }`}
          title="Обновить данные заказов"
        >
          <RefreshCw size={28} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

