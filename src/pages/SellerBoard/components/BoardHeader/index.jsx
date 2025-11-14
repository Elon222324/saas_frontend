import { useEffect, useState } from 'react'
import { BoardHeaderDesktop } from './Desktop'
import { BoardHeaderTablet } from './Tablet'
import { BoardHeaderMobile } from './Mobile'

export function BoardHeader({ title, icon, siteName, accentColor, borderColor = 'border-green-400' }) {
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
      return <BoardHeaderMobile title={title} icon={icon} siteName={siteName} accentColor={accentColor} borderColor={borderColor} />
    case 'tablet':
      return <BoardHeaderTablet title={title} icon={icon} siteName={siteName} accentColor={accentColor} borderColor={borderColor} />
    default:
      return <BoardHeaderDesktop title={title} icon={icon} siteName={siteName} accentColor={accentColor} borderColor={borderColor} />
  }
}

