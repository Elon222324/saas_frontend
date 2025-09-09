import { Activity, Clock, Edit, MessageSquare, CreditCard, Package, ShoppingCart } from 'lucide-react'
import { formatEvent } from '../constants.js'

export function EventsSection({ events, eventsLoading }) {
  const getEventIcon = (eventText) => {
    const text = eventText.toLowerCase()
    if (text.includes('статус изменён')) return <Package className="h-4 w-4 text-blue-500" />
    if (text.includes('оплаты изменён')) return <CreditCard className="h-4 w-4 text-green-500" />
    if (text.includes('обновление заказа')) return <Edit className="h-4 w-4 text-purple-500" />
    if (text.includes('количество товара изменено')) return <ShoppingCart className="h-4 w-4 text-orange-500" />
    if (text.includes('примечание')) return <MessageSquare className="h-4 w-4 text-orange-500" />
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  const formatEventText = (eventText) => {
    // Убираем временную метку из начала и делаем её менее заметной
    const timestampMatch = eventText.match(/^\[([^\]]+)\]\s*(.*)/)
    if (timestampMatch) {
      const [, timestamp, text] = timestampMatch
      return { timestamp, text }
    }
    return { timestamp: null, text: eventText }
  }

  return (
    <section className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Activity className="h-5 w-5 text-gray-600" />
        </div>
        <h3 className="font-semibold text-lg text-gray-900">События</h3>
      </div>
      
      {eventsLoading ? (
        <div className="flex items-center gap-3 text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
          <span className="text-sm">Загрузка событий...</span>
        </div>
      ) : (Array.isArray(events) && events.length > 0 ? (
        <div className="space-y-3">
          {events.map((ev, i) => {
            const eventText = formatEvent(ev)
            const { timestamp, text } = formatEventText(eventText)
            
            return (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-shrink-0 mt-0.5">
                  {getEventIcon(eventText)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 font-medium">{text}</div>
                  {timestamp && (
                    <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-4">
            <Activity className="h-6 w-6 text-gray-400" />
          </div>
          <div className="text-sm">Нет событий</div>
        </div>
      ))}
    </section>
  )
}
