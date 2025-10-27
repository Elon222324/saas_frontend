import { useState } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function ModalFooter({
  ticket,
  isUpdating,
  onStatusChange,
  onResolve,
  onClose,
}) {
  const [showResolveForm, setShowResolveForm] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState('')

  if (!ticket) return null

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      alert('Пожалуйста, заполните заметки разрешения')
      return
    }
    try {
      await onResolve(resolutionNotes)
      setShowResolveForm(false)
      setResolutionNotes('')
    } catch (e) {
      console.error('Error resolving ticket:', e)
    }
  }

  const handleQuickClose = async () => {
    if (window.confirm('Вы уверены, что хотите закрыть этот тикет?')) {
      try {
        await onClose()
      } catch (e) {
        console.error('Error closing ticket:', e)
      }
    }
  }

  const canChangeStatus =
    ticket.status !== 'closed' && ticket.status !== 'resolved'

  return (
    <div className="border-t pt-4 space-y-3">
      {/* Resolve Form */}
      {showResolveForm && ticket.status !== 'resolved' && (
        <div className="bg-green-50 border border-green-200 rounded p-4 space-y-3">
          <div>
            <label
              htmlFor="resolution_notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Заметки разрешения (минимум 1, максимум 1000 символов)
            </label>
            <textarea
              id="resolution_notes"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Опишите, как было решено обращение..."
              maxLength={1000}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isUpdating}
            />
            <p className="text-xs text-gray-500 mt-1">
              {resolutionNotes.length} / 1000 символов
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleResolve}
              disabled={!resolutionNotes.trim() || isUpdating}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              {isUpdating ? 'Сохранение...' : 'Разрешить тикет'}
            </button>
            <button
              onClick={() => {
                setShowResolveForm(false)
                setResolutionNotes('')
              }}
              disabled={isUpdating}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Status Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {ticket.status !== 'in_progress' && canChangeStatus && (
          <button
            onClick={() => onStatusChange('in_progress')}
            disabled={isUpdating}
            className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            В работе
          </button>
        )}

        {ticket.status !== 'resolved' && canChangeStatus && (
          <button
            onClick={() => setShowResolveForm(true)}
            disabled={isUpdating || showResolveForm}
            className="px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-1"
          >
            <CheckCircle size={14} /> Решить
          </button>
        )}

        {ticket.status !== 'new' && canChangeStatus && (
          <button
            onClick={() => onStatusChange('new')}
            disabled={isUpdating}
            className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            Новый
          </button>
        )}

        {ticket.status !== 'closed' && (
          <button
            onClick={handleQuickClose}
            disabled={isUpdating}
            className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-1"
          >
            <XCircle size={14} /> Закрыть
          </button>
        )}
      </div>
    </div>
  )
}
