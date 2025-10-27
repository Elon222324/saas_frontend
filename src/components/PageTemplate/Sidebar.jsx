import { Filter, Calendar, CheckCircle, Clock, Truck, CheckSquare } from 'lucide-react'

const DEFAULT_STATUS_OPTIONS = [
  { value: 'new', label: 'Новый', icon: CheckCircle, color: 'text-blue-600' },
  { value: 'confirmed', label: 'Подтвержден', icon: CheckSquare, color: 'text-indigo-600' },
  { value: 'preparing', label: 'Готовится', icon: Clock, color: 'text-amber-600' },
  { value: 'delivering', label: 'Доставка', icon: Truck, color: 'text-teal-600' },
  { value: 'completed', label: 'Завершен', icon: CheckCircle, color: 'text-green-600' },
]

const DATE_PRESETS = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'За неделю' },
  { value: 'range', label: 'Диапазон' },
]

/**
 * Universal Sidebar component for filters
 * Can be used for orders, customers, etc.
 */
export default function Sidebar({
  // Status filters
  showStatusFilter = true,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  selectedStatuses = [],
  onToggleStatus,
  statusCounts = {},
  statusLabel = 'Статусы заказов',
  
  // Date filters
  showDateFilter = true,
  datePreset = 'today',
  onChangeDatePreset,
  dateFrom,
  dateTo,
  onChangeDateFrom,
  onChangeDateTo,
  dateLabel = 'Период',
  
  // Apply button
  onApply,
  applyButtonLabel = 'Применить фильтры',
}) {
  return (
    <aside className="space-y-6">
      {/* Status filters */}
      {showStatusFilter && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">{statusLabel}</h3>
          </div>
          <div className="space-y-3">
            {statusOptions.map((opt) => {
              const Icon = opt.icon
              const isSelected = selectedStatuses.includes(opt.value)
              const count = statusCounts[opt.value] || 0
              return (
                <label 
                  key={opt.value} 
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleStatus?.(opt.value)}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <Icon className={`h-5 w-5 ${opt.color}`} />
                  <span className={`font-medium flex-1 ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                    {opt.label}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    count > 0 
                      ? 'bg-gray-100 text-gray-700' 
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    {count}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Date filters */}
      {showDateFilter && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">{dateLabel}</h3>
          </div>
          <div className="space-y-3">
            {DATE_PRESETS.map((preset) => (
              <label 
                key={preset.value}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  datePreset === preset.value 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50'
                }`}
              >
                <input
                  type="radio"
                  name="datePreset"
                  value={preset.value}
                  checked={datePreset === preset.value}
                  onChange={(e) => onChangeDatePreset?.(e.target.value)}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                  datePreset === preset.value 
                    ? 'border-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {datePreset === preset.value && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <span className={`font-medium ${datePreset === preset.value ? 'text-blue-900' : 'text-gray-700'}`}>
                  {preset.label}
                </span>
              </label>
            ))}

            {datePreset === 'range' && (
              <div className="space-y-3 mt-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">От</label>
                  <input 
                    type="date" 
                    value={dateFrom || ''} 
                    onChange={(e) => onChangeDateFrom?.(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">До</label>
                  <input 
                    type="date" 
                    value={dateTo || ''} 
                    onChange={(e) => onChangeDateTo?.(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apply button */}
      {onApply && (
        <button 
          onClick={onApply} 
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl px-6 py-4 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
        >
          {applyButtonLabel}
        </button>
      )}
    </aside>
  )
}
