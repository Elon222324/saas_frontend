import { Button } from '@/components/ui/button'
import { Eye, Phone, Mail, Calendar } from 'lucide-react'
import { getCustomerName, formatDate } from '../utils/formatting'

export default function CustomerItem({ customer, onDetails }) {
  const customerId = customer?.id ?? customer?.customer_id ?? customer?.uuid ?? customer?.pk
  const fullName = getCustomerName(customer)
  const phone = customer?.phone || customer?.phone_number || customer?.mobile || customer?.customer_phone
  const email = customer?.email || customer?.mail || customer?.customer_email
  const createdAt = customer?.created_at || customer?.createdAt || customer?.created || customer?.date_joined

  return (
    <div className="p-6 hover:bg-blue-50/40 transition-colors">
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
            onClick={() => onDetails(customerId)}
          >
            <Eye size={16} /> Детали
          </Button>
        </div>
      </div>
    </div>
  )
}
