import { CheckCircle, CheckSquare, Clock, Truck } from 'lucide-react'
import Sidebar from '@/components/PageTemplate/Sidebar'

const STATUS_OPTIONS = [
  { value: 'new', label: 'Новый', icon: CheckCircle, color: 'text-blue-600' },
  { value: 'confirmed', label: 'Подтвержден', icon: CheckSquare, color: 'text-indigo-600' },
  { value: 'preparing', label: 'Готовится', icon: Clock, color: 'text-amber-600' },
  { value: 'delivering', label: 'Доставка', icon: Truck, color: 'text-teal-600' },
  { value: 'completed', label: 'Завершен', icon: CheckCircle, color: 'text-green-600' },
]

export default function OrdersSidebar({
  selectedStatuses = [],
  onToggleStatus,
  datePreset = 'today',
  onChangeDatePreset,
  dateFrom,
  dateTo,
  onChangeDateFrom,
  onChangeDateTo,
  onApply,
  statusCounts = {},
}) {
  return (
    <Sidebar
      showStatusFilter={true}
      statusOptions={STATUS_OPTIONS}
      selectedStatuses={selectedStatuses}
      onToggleStatus={onToggleStatus}
      statusCounts={statusCounts}
      statusLabel="Статусы заказов"
      
      showDateFilter={true}
      datePreset={datePreset}
      onChangeDatePreset={onChangeDatePreset}
      dateFrom={dateFrom}
      dateTo={dateTo}
      onChangeDateFrom={onChangeDateFrom}
      onChangeDateTo={onChangeDateTo}
      dateLabel="Период"
      
      onApply={onApply}
      applyButtonLabel="Применить фильтры"
    />
  )
}


