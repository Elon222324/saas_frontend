// Встроенный звуковой файл в формате Data URL (мини mp3 звук)
const NOTIFICATION_SOUND_DATA_URL = 'data:audio/mp3;base64,//NExAAAAAANIAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NExD4AAANIAAAAAA==';

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

// Функция для воспроизведения звука уведомления (совместима с Safari)
export const playNotificationSound = () => {
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

