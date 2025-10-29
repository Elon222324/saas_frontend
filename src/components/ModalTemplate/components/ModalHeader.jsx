import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isValidElement, createElement } from 'react'

/**
 * Шапка модального окна
 * 
 * @param {Object} props
 * @param {string} props.title - Заголовок
 * @param {string} [props.subtitle] - Подзаголовок (опционально)
 * @param {React.ElementType|React.ReactNode} [props.icon] - Иконка (компонент из lucide-react или React элемент)
 * @param {string} [props.iconBgColor] - Цвет фона иконки
 * @param {string} [props.iconColor] - Цвет иконки
 * @param {Function} props.onClose - Функция закрытия
 */
export function ModalHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  iconBgColor = 'bg-blue-50', 
  iconColor = 'text-blue-600',
  onClose 
}) {
  return (
    <div className="px-8 py-6 border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`p-3 ${iconBgColor} rounded-xl`}>
              {typeof Icon === 'function' ? (
                <Icon className={`h-6 w-6 ${iconColor}`} />
              ) : isValidElement(Icon) ? (
                Icon
              ) : Icon && typeof Icon === 'object' && '$$typeof' in Icon && Icon.render ? (
                createElement(Icon, { className: `h-6 w-6 ${iconColor}` })
              ) : (
                <div className={iconColor}>
                  {typeof Icon === 'string' || typeof Icon === 'number' ? Icon : null}
                </div>
              )}
            </div>
          )}
          <div>
            <h2 className="font-bold text-2xl text-gray-900 tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  )
}

