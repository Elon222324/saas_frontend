import { AlertCircle, Flag, Tag } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'new', label: 'Новый', icon: AlertCircle, color: 'text-blue-600' },
  { value: 'in_progress', label: 'В работе', icon: Flag, color: 'text-yellow-600' },
  { value: 'resolved', label: 'Решен', icon: AlertCircle, color: 'text-green-600' },
  { value: 'closed', label: 'Закрыт', icon: Tag, color: 'text-gray-600' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Низкий', icon: Flag, color: 'text-gray-500' },
  { value: 'normal', label: 'Обычный', icon: Flag, color: 'text-blue-500' },
  { value: 'high', label: 'Высокий', icon: Flag, color: 'text-orange-500' },
  { value: 'urgent', label: 'Срочный', icon: Flag, color: 'text-red-500' },
]

const CATEGORY_OPTIONS = [
  { value: 'wrong_item', label: 'Неправильный товар', icon: Tag, color: 'text-blue-600' },
  { value: 'late_delivery', label: 'Задержка доставки', icon: Tag, color: 'text-amber-600' },
  { value: 'damaged_item', label: 'Поврежденный товар', icon: Tag, color: 'text-red-600' },
  { value: 'missing_item', label: 'Отсутствует товар', icon: Tag, color: 'text-orange-600' },
  { value: 'other', label: 'Другое', icon: Tag, color: 'text-gray-600' },
]

export default function TicketsSidebar({
  selectedStatuses = [],
  onToggleStatus = () => {},
  selectedPriorities = [],
  onTogglePriority = () => {},
  selectedCategories = [],
  onToggleCategory = () => {},
  onApply = () => {},
  statusCounts = {},
}) {
  return (
    <aside className="space-y-6">
      {/* Status filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Статусы</h3>
        </div>
        <div className="space-y-3">
          {STATUS_OPTIONS.map((opt) => {
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
                  onChange={() => onToggleStatus(opt.value)}
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

      {/* Priority filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flag className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Приоритет</h3>
        </div>
        <div className="space-y-3">
          {PRIORITY_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isSelected = selectedPriorities.includes(opt.value)
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
                  onChange={() => onTogglePriority(opt.value)}
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
              </label>
            )
          })}
        </div>
      </div>

      {/* Category filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Категория</h3>
        </div>
        <div className="space-y-3">
          {CATEGORY_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isSelected = selectedCategories.includes(opt.value)
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
                  onChange={() => onToggleCategory(opt.value)}
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
              </label>
            )
          })}
        </div>
      </div>

      {/* Apply button */}
      <button 
        onClick={onApply} 
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl px-6 py-4 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
      >
        Применить фильтры
      </button>
    </aside>
  )
}
