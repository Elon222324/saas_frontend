import { useState } from 'react'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function ServiceCard({ title, description, icon: Icon, onUpdate, isLoading = false }) {
  const [status, setStatus] = useState(null) // null, 'success', 'error'
  const [message, setMessage] = useState('')

  const handleUpdate = async () => {
    try {
      setStatus(null)
      setMessage('')
      const result = await onUpdate()
      setStatus('success')
      setMessage(result.message || 'Обновление успешно запущено')
      
      // Автоматически скрыть сообщение через 5 секунд
      setTimeout(() => {
        setStatus(null)
        setMessage('')
      }, 5000)
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Icon size={24} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>

      {/* Status message */}
      {status && (
        <div
          className={`mb-4 p-3 rounded-md flex items-center gap-2 text-sm ${
            status === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle size={16} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={16} className="flex-shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Action button */}
      <button
        onClick={handleUpdate}
        disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader size={16} className="animate-spin" />
            Обновление...
          </>
        ) : (
          'Обновить'
        )}
      </button>
    </div>
  )
}

