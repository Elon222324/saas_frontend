import { useParams } from 'react-router-dom'
import { useMemo, useState, useEffect, useRef } from 'react'
import { RefreshCw } from 'lucide-react'
import { useSiteTokenString } from '@/hooks/useSiteToken'
import { OrderBoard } from './components'
import { useOrdersPolling } from './hooks/useOrdersPolling'

// Встроенный звуковой файл в формате Data URL (мини mp3 звук)
const NOTIFICATION_SOUND_DATA_URL = 'data:audio/mp3;base64,//NExAAAAAANIAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NExD4AAANIAAAAAA==';

// Функция для воспроизведения звука уведомления (совместима с Safari)
const playNotificationSound = () => {
  try {
    // Способ 1: Попытаемся использовать готовый mp3 если есть
    const audio = new Audio('/sounds/notification.mp3')
    audio.volume = 0.5
    audio.play().catch(() => {
      // Если файла нет, используем встроенный звук через Web Audio API
      playWebAudioSound()
    })
  } catch (e) {
    // Fallback на Web Audio API
    playWebAudioSound()
  }
}

// Альтернативный способ воспроизведения через Web Audio API (для Safari)
const playWebAudioSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const now = audioContext.currentTime
    
    // Первый осциллятор - низкий звук
    const osc1 = audioContext.createOscillator()
    const gain1 = audioContext.createGain()
    osc1.connect(gain1)
    gain1.connect(audioContext.destination)
    osc1.frequency.setValueAtTime(523, now) // До
    gain1.gain.setValueAtTime(0.4, now)
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.6)
    osc1.start(now)
    osc1.stop(now + 0.6)
    
    // Второй осциллятор - высокий звук (немного позже)
    const osc2 = audioContext.createOscillator()
    const gain2 = audioContext.createGain()
    osc2.connect(gain2)
    gain2.connect(audioContext.destination)
    osc2.frequency.setValueAtTime(784, now + 0.15) // Соль
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.setValueAtTime(0.4, now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6)
    osc2.start(now + 0.15)
    osc2.stop(now + 0.6)
  } catch (e) {
    console.log('Звук не доступен:', e.message)
  }
}

const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'

export default function SellerBoardDashboard() {
  const { siteName } = useParams()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const previousOrdersCountRef = useRef(0)

  // Очищаем siteName от суффикса контейнера
  const siteNameForToken = useMemo(() => {
    if (!siteName) return siteName
    return siteName.endsWith(containerSuffix) ? siteName.slice(0, -containerSuffix.length) : siteName
  }, [siteName])

  // Получаем токен сайта
  const { token: siteToken, isLoading: tokenLoading, error: tokenError } = useSiteTokenString(
    siteNameForToken,
    { enabled: Boolean(siteNameForToken) }
  )

  // Загружаем заказы с автоматическим обновлением каждые 3 сек
  const { orders, loading, error, refetch } = useOrdersPolling(
    siteNameForToken,
    siteToken,
    3000 // интервал обновления в миллисекундах
  )

  // Отслеживаем новые заказы и воспроизводим звук
  useEffect(() => {
    const currentOrdersCount = orders.length
    
    // Если это не первая загрузка и количество заказов увеличилось
    if (previousOrdersCountRef.current > 0 && currentOrdersCount > previousOrdersCountRef.current) {
      const newOrdersCount = currentOrdersCount - previousOrdersCountRef.current
      console.log(`🔔 Новых заказов: ${newOrdersCount}`)
      playNotificationSound()
    }
    
    previousOrdersCountRef.current = currentOrdersCount
  }, [orders])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }

  // Определяем, что показывать
  let content = null
  if (tokenLoading) {
    content = (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">⏳ Загрузка токена...</div>
      </div>
    )
  } else if (tokenError) {
    content = (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-400">❌ Ошибка: {tokenError}</div>
      </div>
    )
  } else if (!siteToken) {
    content = (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">⚠️ Токен сайта не получен</div>
      </div>
    )
  } else if (error) {
    content = (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-400 rounded p-4 text-red-300">
          <p className="font-bold mb-2">❌ Ошибка загрузки заказов</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={refetch}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
          >
            Повторить
          </button>
        </div>
      </div>
    )
  } else {
    content = <OrderBoard orders={orders} />
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">📋 Заказы</h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || !siteToken}
          className={`transition-colors hover:text-white ${
            isRefreshing || !siteToken
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:text-white cursor-pointer'
          }`}
          title="Обновить данные заказов"
        >
          <RefreshCw size={28} strokeWidth={2} />
        </button>
      </div>
      {content}
    </div>
  )
}

