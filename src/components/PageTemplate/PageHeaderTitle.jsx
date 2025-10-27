import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * PageHeaderTitle - Универсальный компонент заголовка для всех страниц админки
 * Используется для сохранения единства дизайна (иконка + название + описание)
 * 
 * @param {string} title - Заголовок страницы (обязательно)
 * @param {string} subtitle - Подзаголовок/описание (опционально)
 * @param {React.Component} icon - Icon component из lucide-react (опционально)
 * @param {function} onRefresh - Callback для кнопки обновления (опционально)
 */
export default function PageHeaderTitle({
  title,
  subtitle,
  icon: IconComponent,
  onRefresh,
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {IconComponent && (
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <IconComponent className="h-8 w-8 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
      </div>
      {onRefresh && (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onRefresh} 
            title="Обновить"
            className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <RefreshCcw size={18} />
          </Button>
        </div>
      )}
    </div>
  )
}
