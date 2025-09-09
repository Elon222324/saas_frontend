import { Package, Plus, Minus, ShoppingCart } from 'lucide-react'
import { formatPrice, getImageSrc } from '../utils.js'

export function OrderItems({ items, onUpdateItemQty }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Package className="h-5 w-5 text-gray-600" />
        </div>
        <h3 className="font-semibold text-lg text-gray-900">Состав заказа</h3>
      </div>
      
      {Array.isArray(items) && items.length > 0 ? (
        <div className="overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-200">
            <div className="col-span-6">Товар</div>
            <div className="col-span-2 text-right">Кол-во</div>
            <div className="col-span-2 text-right">Цена</div>
            <div className="col-span-2 text-right">Сумма</div>
          </div>
          <div className="divide-y divide-gray-100">
            {items.map((it, idx) => {
              const title = it.display_name || it.product_title || it.name || it.title || `Товар #${idx + 1}`
              const img = getImageSrc(it.image_url)
              const qty = it.quantity ?? it.qty ?? 1
              const isEven = idx % 2 === 0
              
              return (
                <div key={idx} className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors ${isEven ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="col-span-6 flex items-center gap-4 min-w-0">
                    {img ? (
                      <img src={img} alt="" className="h-12 w-12 rounded-lg object-cover flex-shrink-0 shadow-sm border border-gray-200" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 text-xs text-gray-500 flex items-center justify-center flex-shrink-0 border border-gray-200">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">{title}</div>
                      {it.sku && <div className="text-sm text-gray-500 mt-1">SKU: {it.sku}</div>}
                      {Array.isArray(it.extras) && it.extras.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                          Доп.опции: {it.extras.map((ex, i) => {
                            const label = ex.extra_name || ex.name || ex.title || ex.extra_title || `#${ex.extra_id || ex.id}`
                            const qty = ex.quantity ?? ex.qty ?? 1
                            const price = ex.extra_price ?? ex.price
                            const priceStr = typeof price !== 'undefined' ? ` (+${formatPrice(price)})` : ''
                            const qtyStr = qty > 1 ? ` × ${qty}` : ''
                            return (
                              <span key={i} className="inline-flex items-center gap-1 mr-2">
                                <span>{`${label}${qtyStr}${priceStr}`}</span>
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 text-right font-medium flex items-center justify-end gap-2">
                    <button 
                      className="p-1.5 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        onUpdateItemQty(it, Math.max(1, (qty - 1))) 
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[2rem] text-center">{qty}</span>
                    <button 
                      className="p-1.5 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        onUpdateItemQty(it, qty + 1) 
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="col-span-2 text-right text-gray-600 font-medium">{formatPrice(it.unit_price ?? it.price)}</div>
                  <div className="col-span-2 text-right font-semibold text-gray-900">{formatPrice(it.line_total ?? it.total_price ?? it.line_subtotal)}</div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <div className="text-sm">Нет данных по товарам</div>
        </div>
      )}
    </section>
  )
}
