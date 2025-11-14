import { useEffect, useState } from 'react'
import { OrderCardDesktop } from './Desktop'
import { OrderCardTablet } from './Tablet'
import { OrderCardMobile } from './Mobile'

export function OrderCard({ order, siteName, siteToken, onOrderStatusChanged }) {
  const [device, setDevice] = useState('desktop')


  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setDevice('mobile')
      } else if (width < 1024) {
        setDevice('tablet')
      } else {
        setDevice('desktop')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // TODO: Сейчас везде используется Tablet версия для настройки
  // После завершения подключить Mobile и Desktop
  return <OrderCardTablet order={order} siteName={siteName} siteToken={siteToken} onOrderStatusChanged={onOrderStatusChanged} />
}

