import { useParams } from 'react-router-dom'
import { useMemo, useState, useRef } from 'react'
import { useSiteTokenString } from '@/hooks/useSiteToken'
import { useOrdersPolling } from './hooks/useOrdersPolling'
import { useNewOrdersNotification } from './hooks/useNewOrdersNotification'
import { useOrderStatusListener } from './hooks/useOrderStatusListener'
import { useFullscreen } from './hooks/useFullscreen'
import { cleanSiteName } from './utils/siteNameUtils'
import { DashboardHeader } from './sections/DashboardHeader'
import { DashboardContent } from './sections/DashboardContent'

export default function SellerBoardDashboard() {
  const { siteName } = useParams()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef(null)

  // Очищаем siteName от суффикса контейнера
  const siteNameForToken = useMemo(() => {
    return cleanSiteName(siteName)
  }, [siteName])

  // Получаем токен сайта
  const { token: siteToken, isLoading: tokenLoading, error: tokenError } = useSiteTokenString(
    siteNameForToken,
    { enabled: Boolean(siteNameForToken) }
  )

  // Загружаем заказы с автоматическим обновлением каждые 3 сек
  const { orders, error, refetch } = useOrdersPolling(
    siteNameForToken,
    siteToken,
    3000
  )

  // Пользовательские хуки
  useNewOrdersNotification(orders)
  useOrderStatusListener(refetch)
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-gray-800">
      <DashboardHeader
        isFullscreen={isFullscreen}
        isRefreshing={isRefreshing}
        siteToken={siteToken}
        onToggleFullscreen={toggleFullscreen}
        onRefresh={handleRefresh}
      />
      <DashboardContent
        tokenLoading={tokenLoading}
        tokenError={tokenError}
        siteToken={siteToken}
        error={error}
        orders={orders}
        siteNameForToken={siteNameForToken}
        onRefetch={refetch}
      />
    </div>
  )
}

