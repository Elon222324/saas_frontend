import { X, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ModalHeader({ orderId, onClose }) {
  return (
    <div className="px-8 py-6 border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-gray-900 tracking-tight">Заказ #{orderId}</h2>
            <p className="text-sm text-gray-500 mt-1">Детальная информация о заказе</p>
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
