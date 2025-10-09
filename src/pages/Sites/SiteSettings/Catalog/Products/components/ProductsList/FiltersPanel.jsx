import { X } from 'lucide-react'

export default function FiltersPanel({ 
  filters, 
  onFiltersChange, 
  onClose,
  onReset,
  categoryOptions = [],
  labelsList = [],
  optionGroups = [],
  extraGroups = []
}) {
  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key, itemId) => {
    const current = filters[key] || []
    const numId = Number(itemId)
    const updated = current.includes(numId)
      ? current.filter(id => id !== numId)
      : [...current, numId]
    updateFilter(key, updated)
  }

  const hasActiveFilters = () => {
    return filters.status !== 'all' || 
           filters.availability !== 'all' || 
           filters.priceFrom !== '' || 
           filters.priceTo !== '' ||
           filters.weightFrom !== '' ||
           filters.weightTo !== '' ||
           filters.selectedLabels?.length > 0 ||
           filters.selectedCategory !== '' ||
           filters.selectedOptions?.length > 0 ||
           filters.selectedExtras?.length > 0 ||
           filters.sortBy !== 'order'
  }

  return (
    <div className="bg-gray-50 border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Фильтры</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters() && (
            <button
              onClick={onReset}
              className="text-xs text-blue-600 hover:text-blue-700 underline"
            >
              Сбросить все
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Основные фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Статус */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>
          </div>

          {/* Наличие */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Наличие
            </label>
            <select
              value={filters.availability}
              onChange={(e) => updateFilter('availability', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все</option>
              <option value="available">В наличии</option>
              <option value="unavailable">Нет в наличии</option>
            </select>
          </div>

          {/* Сортировка */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Сортировка
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="order">По порядку</option>
              <option value="title_asc">По названию (А-Я)</option>
              <option value="title_desc">По названию (Я-А)</option>
              <option value="price_asc">По цене (возр.)</option>
              <option value="price_desc">По цене (убыв.)</option>
              <option value="created_desc">Новые первые</option>
              <option value="created_asc">Старые первые</option>
            </select>
          </div>
        </div>

        {/* Диапазоны: цена и вес */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Цена */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.priceFrom}
                onChange={(e) => updateFilter('priceFrom', e.target.value)}
                placeholder="От"
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.priceTo}
                onChange={(e) => updateFilter('priceTo', e.target.value)}
                placeholder="До"
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Вес */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Вес (г)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="1"
                value={filters.weightFrom}
                onChange={(e) => updateFilter('weightFrom', e.target.value)}
                placeholder="От"
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                min="0"
                step="1"
                value={filters.weightTo}
                onChange={(e) => updateFilter('weightTo', e.target.value)}
                placeholder="До"
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Категория */}
        {categoryOptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              value={filters.selectedCategory}
              onChange={(e) => updateFilter('selectedCategory', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Все категории</option>
              {categoryOptions.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.path}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Метки */}
        {labelsList.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Метки
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded bg-white">
              {labelsList.map(label => (
                <label
                  key={label.id}
                  className="inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(filters.selectedLabels || []).includes(Number(label.id))}
                    onChange={() => toggleArrayFilter('selectedLabels', label.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{label.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Опции */}
        {optionGroups.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Опции
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded bg-white">
              {optionGroups.map(group => (
                <label
                  key={group.id}
                  className="inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(filters.selectedOptions || []).includes(Number(group.id))}
                    onChange={() => toggleArrayFilter('selectedOptions', group.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{group.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Дополнения */}
        {extraGroups.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дополнения
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded bg-white">
              {extraGroups.map(group => (
                <label
                  key={group.id}
                  className="inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(filters.selectedExtras || []).includes(Number(group.id))}
                    onChange={() => toggleArrayFilter('selectedExtras', group.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{group.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Счетчик активных фильтров */}
      {hasActiveFilters() && (
        <div className="mt-3 text-xs text-gray-600">
          Применено фильтров: {[
            filters.status !== 'all',
            filters.availability !== 'all',
            filters.priceFrom !== '',
            filters.priceTo !== '',
            filters.weightFrom !== '',
            filters.weightTo !== '',
            filters.selectedLabels?.length > 0,
            filters.selectedCategory !== '',
            filters.selectedOptions?.length > 0,
            filters.selectedExtras?.length > 0,
            filters.sortBy !== 'order'
          ].filter(Boolean).length}
        </div>
      )}
    </div>
  )
}

