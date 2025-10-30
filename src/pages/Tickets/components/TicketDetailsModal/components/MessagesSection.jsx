import { useState } from 'react'
import { Send } from 'lucide-react'

export default function MessagesSection({ ticket, isUpdating, onAddResponse }) {
  const [message, setMessage] = useState('')
  const [newStatus, setNewStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    try {
      await onAddResponse(message, newStatus || null)
      setMessage('')
      setNewStatus('')
    } catch (e) {
      console.error('❌ [MessagesSection] Error adding response:', e)
    }
  }

  if (!ticket) {
    return null
  }

  // Combine initial message with messages array
  const allMessages = []
  if (ticket.message) {
    allMessages.push({
      id: 'initial',
      message: ticket.message,
      is_admin: false,
      created_at: ticket.created_at,
    })
  }
  if (ticket.messages && Array.isArray(ticket.messages)) {
    allMessages.push(...ticket.messages)
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Сообщения</h3>

      {/* Messages List */}
      <div className="flex-1 bg-gray-50 rounded-lg p-4 space-y-3 overflow-y-auto max-h-[50vh]">
        {allMessages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">Нет сообщений</p>
        ) : (
          allMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.is_admin
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-900">
                  {msg.is_admin ? '👨‍💼 Администратор' : '👤 Пользователь'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleString('ru-RU', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <p className="text-sm text-gray-800 break-words">{msg.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Response Form */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t mt-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Ваш ответ
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите ответ..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isUpdating}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Изменить статус
            </label>
            <select
              id="status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isUpdating}
            >
              <option value="">Оставить текущий</option>
              <option value="new">Новый</option>
              <option value="in_progress">В работе</option>
              <option value="resolved">Решен</option>
              <option value="closed">Закрыт</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!message.trim() || isUpdating}
            className="self-end h-10 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
          >
            <Send size={16} /> Отправить
          </button>
        </div>
      </form>
    </div>
  )
}
