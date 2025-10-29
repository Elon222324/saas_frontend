import { Button } from '@/components/ui/button'

/**
 * Футер модального окна
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Функция закрытия модалки
 * @param {string} [props.closeButtonText] - Текст кнопки закрытия (по умолчанию 'Закрыть')
 * @param {string} [props.closeButtonClassName] - Дополнительные классы для кнопки закрытия
 */
export function ModalFooter({ 
  onClose, 
  closeButtonText = 'Закрыть',
  closeButtonClassName = ''
}) {
  return (
    <div className="px-8 py-6 border-t border-gray-100 bg-white">
      <div className="flex justify-end">
        <Button 
          onClick={onClose}
          className={`bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition-colors ${closeButtonClassName}`}
        >
          {closeButtonText}
        </Button>
      </div>
    </div>
  )
}

