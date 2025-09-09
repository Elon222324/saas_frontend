import OrderItem from './OrderItem'
import { Loader2, AlertCircle, Package, MousePointer } from 'lucide-react'

export default function OrderList({ orders, loading, error, onDetails, onPrevPage, onNextPage, canPrev, canNext }) {
  const hasOrders = Array.isArray(orders) && orders.length > 0
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Список заказов</h2>
            {hasOrders && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {orders.length} заказов
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {hasOrders && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MousePointer className="h-4 w-4" />
                <span>Кликните на заказ для просмотра деталей</span>
              </div>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Загрузка...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {error ? (
          <div className="p-8 text-center h-full flex items-center justify-center">
            <div>
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <div className="text-red-600 font-medium mb-2">Ошибка загрузки</div>
              <div className="text-gray-500 text-sm">{error}</div>
            </div>
          </div>
        ) : !hasOrders ? (
          <div className="p-8 text-center h-full flex items-center justify-center">
            <div>
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <div className="text-gray-500 font-medium mb-2">Заказов не найдено</div>
              <div className="text-gray-400 text-sm">Попробуйте изменить параметры поиска</div>
            </div>
          </div>
        ) : (
          <>
            {/* Orders list with scroll */}
            <div className="overflow-y-auto h-full">
              <div className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <OrderItem 
                    key={o.id || o.order_id || JSON.stringify(o)} 
                    order={o} 
                    onDetails={onDetails} 
                  />
                ))}
              </div>
            </div>

            {/* Pagination - fixed at bottom */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Показано {orders.length} заказов
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    disabled={!canPrev} 
                    onClick={onPrevPage} 
                    className={`px-4 py-2 rounded-xl border font-medium transition-all duration-200 ${
                      canPrev 
                        ? 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800' 
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    ← Назад
                  </button>
                  <button 
                    disabled={!canNext} 
                    onClick={onNextPage} 
                    className={`px-4 py-2 rounded-xl border font-medium transition-all duration-200 ${
                      canNext 
                        ? 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800' 
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Вперед →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


