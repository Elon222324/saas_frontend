import { useState, useEffect } from 'react'

export const useFullscreen = (containerRef) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Отслеживаем изменение полноэкранного режима
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Входим в полноэкран
        await containerRef.current?.requestFullscreen()
      } else {
        // Выходим из полноэкрана
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Ошибка полноэкрана:', err)
    }
  }

  return { isFullscreen, toggleFullscreen }
}

