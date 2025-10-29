import { ModalHeader } from './components/ModalHeader.jsx'
import { ModalFooter } from './components/ModalFooter.jsx'
import { Button } from '@/components/ui/button'

/**
 * Универсальный шаблон модального окна
 * 
 * @param {Object} props
 * @param {string} props.title - Заголовок модалки
 * @param {string} [props.subtitle] - Подзаголовок (опционально)
 * @param {React.ElementType|React.ReactNode} [props.icon] - Иконка (компонент из lucide-react или любой React элемент)
 * @param {string} [props.iconBgColor] - Цвет фона иконки (например, 'bg-blue-50')
 * @param {string} [props.iconColor] - Цвет иконки (например, 'text-blue-600')
 * @param {Function} props.onClose - Функция закрытия модалки
 * @param {React.ReactNode} props.children - Контент модалки
 * @param {React.ReactNode} [props.footer] - Кастомный футер (если не передан, используется стандартный)
 * @param {boolean} [props.showFooter] - Показывать ли футер (по умолчанию true)
 * @param {boolean} [props.showCloseButton] - Показывать ли кнопку закрытия в конце footer (по умолчанию true, работает только с кастомным footer)
 * @param {string} [props.closeButtonText] - Текст кнопки закрытия (по умолчанию 'Закрыть')
 * @param {string} [props.maxWidth] - Максимальная ширина (по умолчанию 'max-w-4xl')
 * @param {string} [props.modalClassName] - Дополнительные классы для контейнера модалки
 * @param {string} [props.overlayClassName] - Дополнительные классы для оверлея
 */
export default function ModalTemplate({
  title,
  subtitle,
  icon,
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  onClose,
  children,
  footer,
  showFooter = true,
  showCloseButton = true,
  closeButtonText = 'Закрыть',
  maxWidth = 'max-w-4xl',
  modalClassName = '',
  overlayClassName = '',
}) {
  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${overlayClassName}`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-300 ${modalClassName}`}>
        <ModalHeader 
          title={title}
          subtitle={subtitle}
          icon={icon}
          iconBgColor={iconBgColor}
          iconColor={iconColor}
          onClose={onClose}
        />

        <div className="overflow-y-auto flex-1 min-h-0">
          {children}
        </div>

        {showFooter && (
          footer ? (
            <>
              {footer}
              {showCloseButton && (
                <div className="px-8 py-4 border-t border-gray-100 bg-white">
                  <div className="flex justify-end">
                    <Button 
                      onClick={onClose}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition-colors"
                    >
                      {closeButtonText}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ModalFooter onClose={onClose} closeButtonText={closeButtonText} />
          )
        )}
      </div>
    </div>
  )
}

