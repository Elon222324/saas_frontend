import { Users as UsersIcon, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UsersHeader({ onRefresh }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <UsersIcon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Клиенты
          </h1>
          <p className="text-gray-500 text-sm mt-1">Поиск клиентов, просмотр профиля и заказов</p>
        </div>
      </div>
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
    </div>
  )
}


