import { Button } from '@/components/ui/button'
import { Eye, Phone, Mail, Calendar } from 'lucide-react'
import { getCustomerName, formatDate } from '../utils/formatting'

export default function CustomersList({ customers, offset, onPrev, onNext, onOpenDetails }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="divide-y">
        {customers.length === 0 ? (
          <div className="p-6 text-gray-500">Ничего не найдено</div>
        ) : (
          customers.map((c) => {
            const customerId = c?.id ?? c?.customer_id ?? c?.uuid ?? c?.pk
            const fullName = getCustomerName(c)
            const phone = c?.phone || c?.phone_number || c?.mobile || c?.customer_phone
            const email = c?.email || c?.mail || c?.customer_email
            const createdAt = c?.created_at || c?.createdAt || c?.created || c?.date_joined
            return (
              <div key={String(customerId || Math.random())} className="p-6 hover:bg-blue-50/40 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-lg font-bold text-gray-900">{fullName}</div>
                      {customerId && (
                        <span className="text-xs text-gray-500">ID: {String(customerId)}</span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-600">
                      {phone && (
                        <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{phone}</span></div>
                      )}
                      {email && (
                        <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{email}</span></div>
                      )}
                      {createdAt && (
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{formatDate(createdAt)}</span></div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-800 transition-colors"
                      onClick={() => onOpenDetails(customerId)}
                    >
                      <Eye size={16} /> Детали
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="p-4 flex items-center justify-between">
        <Button variant="outline" onClick={onPrev} disabled={offset === 0}>
          Назад
        </Button>
        <div className="text-sm text-gray-500">
          Показано: {customers.length} • Смещение: {offset}
        </div>
        <Button variant="outline" onClick={onNext}>
          Далее
        </Button>
      </div>
    </div>
  )
}


