import { useState, useMemo } from 'react'
import { X, Search } from 'lucide-react'
import { createPortal } from 'react-dom'

export default function ProductsSelector({
  products = [],
  selectedIds = [],
  maxItems = 6,
  onSelect,
}) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const modalRoot = typeof document !== 'undefined' ? document.body : null

  const filteredProducts = useMemo(() => {
    if (!search) return products
    const query = search.toLowerCase()
    return products.filter(p =>
      (p.title || p.name)?.toLowerCase().includes(query) ||
      p.id?.toString().includes(query)
    )
  }, [products, search])

  const selectedProducts = useMemo(() => {
    return selectedIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean)
  }, [selectedIds, products])

  const handleToggle = (productId) => {
    const newIds = selectedIds.includes(productId)
      ? selectedIds.filter(id => id !== productId)
      : selectedIds.length < maxItems
        ? [...selectedIds, productId]
        : selectedIds

    onSelect(newIds)
  }

  const handleRemove = (productId) => {
    onSelect(selectedIds.filter(id => id !== productId))
  }

  const isSelected = (productId) => selectedIds.includes(productId)
  const isFull = selectedIds.length >= maxItems

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Выберите товары ({selectedIds.length}/{maxItems})
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск товара по названию или ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Товары не найдены
            </div>
          ) : (
            <div className="divide-y">
              {filteredProducts.map((product) => (
                <label
                  key={product.id}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                    isSelected(product.id)
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  } ${isFull && !isSelected(product.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected(product.id)}
                    onChange={() => handleToggle(product.id)}
                    disabled={isFull && !isSelected(product.id)}
                    className="w-4 h-4 rounded"
                  />

                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded overflow-hidden">
                    {product.image_url || product.img_url ? (
                      <img
                        src={product.image_url || product.img_url}
                        alt={product.title || product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full hidden items-center justify-center text-gray-400 text-xs">
                      —
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.title || product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.variants?.[0]?.price ? `${product.variants[0].price} ₽` : 'Цена не указана'}
                    </p>
                  </div>

                  {isSelected(product.id) && (
                    <div className="flex-shrink-0 text-blue-600 font-medium text-sm">
                      ✓
                    </div>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Выбранные товары ({selectedIds.length}/{maxItems})
        </label>
        {selectedProducts.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center text-sm text-gray-500">
            Товары не выбраны
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded overflow-hidden">
                  {product.image_url || product.img_url ? (
                    <img
                      src={product.image_url || product.img_url}
                      alt={product.title || product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full hidden items-center justify-center text-gray-400 text-xs">
                    —
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.title || product.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {product.variants?.[0]?.price ? `${product.variants[0].price} ₽` : 'Цена не указана'}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(product.id)}
                  className="flex-shrink-0 p-1 hover:bg-white rounded transition-colors"
                  title="Удалить"
                >
                  <X size={18} className="text-gray-500 hover:text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedIds.length < maxItems && (
        <button
          onClick={() => setShowModal(true)}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          + Добавить товар
        </button>
      )}

      {showModal && modalRoot ? createPortal(modalContent, modalRoot) : null}
    </div>
  )
}

