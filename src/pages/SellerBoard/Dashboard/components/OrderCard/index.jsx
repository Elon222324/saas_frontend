import { useEffect, useState } from 'react'
import { OrderCardDesktop } from './Desktop'
import { OrderCardTablet } from './Tablet'
import { OrderCardMobile } from './Mobile'

export function OrderCard({ order }) {
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

  switch (device) {
    case 'mobile':
      return <OrderCardMobile order={order} />
    case 'tablet':
      return <OrderCardTablet order={order} />
    default:
      return <OrderCardDesktop order={order} />
  }
}

