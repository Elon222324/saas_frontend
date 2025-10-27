import { X } from 'lucide-react'

export default function ModalHeader({ ticket, onClose }) {
  if (!ticket) return null

  return (
    <div className="flex items-start justify-between pb-4 border-b">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Тикет #{ticket.id.slice(0, 8)}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Создано: {new Date(ticket.created_at).toLocaleString('ru-RU')}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={24} />
      </button>
    </div>
  )
}
