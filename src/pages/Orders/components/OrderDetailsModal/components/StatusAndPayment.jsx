import { CreditCard, Check, Edit3, AlertCircle, Clock, Truck, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from './Badge.jsx'
import { statusLabel, statusColor, paymentMethodLabel, paymentStatusLabel, paymentStatusColor } from '../constants.js'

export function StatusAndPayment({ 
  order, 
  newStatus, 
  setNewStatus, 
  newPaymentStatus, 
  setNewPaymentStatus, 
  saving, 
  onUpdateStatus, 
  onUpdatePaymentStatus,
  isStatusDirty,
  isPaymentStatusDirty,
}) {
  const status = order.status
  const paymentMethod = order.payment_method || order.paymentMethod || order.payment_type
  const paymentStatus = order.payment_status || order.paymentStatus

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'new': return <AlertCircle className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'preparing': return <Clock className="h-4 w-4" />
      case 'delivering': return <Truck className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-50 rounded-lg">
          <CreditCard className="h-5 w-5 text-gray-600" />
        </div>
        <h3 className="font-semibold text-lg text-gray-900">Статус и оплата</h3>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center mb-6">
        {status && (
          <Badge 
            label={statusLabel(status)} 
            colorClass={statusColor(status)}
            icon={getStatusIcon(status)}
          />
        )}
        {paymentMethod && (
          <Badge 
            label={paymentMethodLabel(paymentMethod)} 
            colorClass="bg-blue-50 text-blue-700 border border-blue-200" 
          />
        )}
        {paymentStatus && (
          <Badge 
            label={paymentStatusLabel(paymentStatus)} 
            colorClass={paymentStatusColor(paymentStatus)}
          />
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-3 items-center">
          <select 
            value={newStatus} 
            onChange={(e) => setNewStatus(e.target.value)} 
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {['new','confirmed','preparing','delivering','completed'].map(s => (
              <option key={s} value={s}>{statusLabel(s)}</option>
            ))}
          </select>
          <Button 
            onClick={onUpdateStatus} 
            disabled={saving || !isStatusDirty} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors"
          >
            <Check size={16} /> Обновить
          </Button>
        </div>
        <div className="flex gap-3 items-center">
          <select 
            value={newPaymentStatus} 
            onChange={(e) => setNewPaymentStatus(e.target.value)} 
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {['pending','paid','failed','refunded'].map(s => (
              <option key={s} value={s}>{paymentStatusLabel(s)}</option>
            ))}
          </select>
          <Button 
            onClick={onUpdatePaymentStatus} 
            disabled={saving || !isPaymentStatusDirty} 
            variant="outline" 
            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 px-4 py-2.5 rounded-lg transition-colors"
          >
            <Edit3 size={16} /> Обновить
          </Button>
        </div>
      </div>
    </section>
  )
}
