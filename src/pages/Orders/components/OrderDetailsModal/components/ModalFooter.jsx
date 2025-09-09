import { Button } from '@/components/ui/button'

export function ModalFooter({ onClose }) {
  return (
    <div className="px-8 py-6 border-t border-gray-100 bg-white">
      <div className="flex justify-end">
        <Button 
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition-colors"
        >
          Закрыть
        </Button>
      </div>
    </div>
  )
}
