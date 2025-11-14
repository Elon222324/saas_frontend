/**
 * Хук для логики таймера - используется во всех версиях
 */
export function useTimerLogic(pickupTime) {
  const getTimeUntilPickup = () => {
    if (!pickupTime) return null
    const now = new Date()
    const pickupTimeDate = new Date(pickupTime)
    const diffMs = pickupTimeDate - now
    const minutes = Math.floor(diffMs / 60000)
    
    if (diffMs < 0) {
      const overdueMins = Math.abs(minutes)
      return {
        text: `ПРОСРОЧЕНО на ${overdueMins}м`,
        shortText: `+${overdueMins}м`,
        color: 'text-red-400',
        bgColor: 'bg-red-600',
        isPulsing: true
      }
    }
    
    const hours = Math.floor(minutes / 60)
    let displayText = ''
    
    if (hours > 0) {
      displayText = `через ${hours}ч ${minutes % 60}м`
    } else {
      displayText = `через ${minutes}м`
    }
    
    // Определяем цвет в зависимости от времени
    if (minutes > 5) {
      return {
        text: displayText,
        color: 'text-gray-300',
        bgColor: 'bg-transparent',
        isPulsing: false
      }
    } else if (minutes >= 2) {
      return {
        text: displayText,
        color: 'text-yellow-300',
        bgColor: 'bg-transparent',
        isPulsing: false
      }
    } else {
      return {
        text: displayText,
        color: 'text-red-300',
        bgColor: 'bg-transparent',
        isPulsing: true
      }
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  return {
    timeData: getTimeUntilPickup(),
    formattedTime: formatTime(pickupTime)
  }
}

