/**
 * Константы статусов заказов
 * Согласно: docs/orders_api_admin.md (строки 319-328)
 */

export const ORDER_STATUSES = {
  NEW: 'new',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  DELIVERING: 'delivering',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
}

/**
 * Конфигурация для каждого статуса
 * Включает: название, иконку, цвета
 */
export const STATUS_CONFIG = {
  [ORDER_STATUSES.NEW]: {
    title: 'Новые',
    icon: '📥',
    color: 'orange',
    borderColor: 'border-orange-400',
    bgColor: 'bg-orange-900/30',
    headerBg: 'bg-gray-700/50 border-b-4 border-orange-400',
    canTransition: true,
  },
  [ORDER_STATUSES.CONFIRMED]: {
    title: 'Подтверждены',
    icon: '✅',
    color: 'blue',
    borderColor: 'border-blue-400',
    bgColor: 'bg-blue-900/30',
    headerBg: 'bg-gray-700/50 border-b-4 border-blue-400',
    canTransition: true,
  },
  [ORDER_STATUSES.PREPARING]: {
    title: 'Готовятся',
    icon: '👨‍🍳',
    color: 'purple',
    borderColor: 'border-purple-400',
    bgColor: 'bg-purple-900/30',
    headerBg: 'bg-gray-700/50 border-b-4 border-purple-400',
    canTransition: true,
  },
  [ORDER_STATUSES.DELIVERING]: {
    title: 'Готовы к выдаче',
    icon: '📦',
    color: 'cyan',
    borderColor: 'border-cyan-400',
    bgColor: 'bg-cyan-900/30',
    headerBg: 'bg-gray-700/50 border-b-4 border-cyan-400',
    canTransition: true,
  },
  [ORDER_STATUSES.COMPLETED]: {
    title: 'Завершены',
    icon: '🎉',
    color: 'green',
    borderColor: 'border-green-400',
    bgColor: 'bg-green-900/30',
    headerBg: 'bg-gray-700/50 border-b-4 border-green-400',
    canTransition: false, // финальный статус
  },
  [ORDER_STATUSES.CANCELED]: {
    title: 'Отменены',
    icon: '❌',
    color: 'red',
    borderColor: 'border-red-400',
    bgColor: 'bg-red-900/30',
    headerBg: 'bg-gray-700/50 border-b-4 border-red-400',
    canTransition: false, // финальный статус
  },
}

/**
 * Получить конфиг для статуса
 * Нормализует регистр (new, New, NEW -> new)
 */
export function getStatusConfig(status) {
  const normalized = String(status || '').toLowerCase()
  return STATUS_CONFIG[normalized] || STATUS_CONFIG[ORDER_STATUSES.NEW]
}

/**
 * Проверить, может ли статус быть изменён
 * Нормализует регистр перед проверкой
 */
export function canTransitionStatus(status) {
  const normalized = String(status || '').toLowerCase()
  const config = getStatusConfig(normalized)
  return config.canTransition
}

/**
 * Возвращает видимые статусы в порядке отображения на доске
 * Только 3 колонки: Новые, Готовятся, Готовы к Выдаче
 */
export function getOrderStatusesInOrder() {
  return [
    ORDER_STATUSES.NEW,
    ORDER_STATUSES.PREPARING,
    ORDER_STATUSES.DELIVERING,
    // Скрытые: CONFIRMED, COMPLETED, CANCELED (не отображаются на борде)
  ]
}

