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
    headerBg: 'bg-orange-900/50 border-orange-400',
    canTransition: true,
  },
  [ORDER_STATUSES.CONFIRMED]: {
    title: 'Подтверждены',
    icon: '✅',
    color: 'blue',
    borderColor: 'border-blue-400',
    bgColor: 'bg-blue-900/30',
    headerBg: 'bg-blue-900/50 border-blue-400',
    canTransition: true,
  },
  [ORDER_STATUSES.PREPARING]: {
    title: 'Готовятся',
    icon: '👨‍🍳',
    color: 'purple',
    borderColor: 'border-purple-400',
    bgColor: 'bg-purple-900/30',
    headerBg: 'bg-purple-900/50 border-purple-400',
    canTransition: true,
  },
  [ORDER_STATUSES.DELIVERING]: {
    title: 'В пути',
    icon: '🚗',
    color: 'cyan',
    borderColor: 'border-cyan-400',
    bgColor: 'bg-cyan-900/30',
    headerBg: 'bg-cyan-900/50 border-cyan-400',
    canTransition: true,
  },
  [ORDER_STATUSES.COMPLETED]: {
    title: 'Завершены',
    icon: '🎉',
    color: 'green',
    borderColor: 'border-green-400',
    bgColor: 'bg-green-900/30',
    headerBg: 'bg-green-900/50 border-green-400',
    canTransition: false, // финальный статус
  },
  [ORDER_STATUSES.CANCELED]: {
    title: 'Отменены',
    icon: '❌',
    color: 'red',
    borderColor: 'border-red-400',
    bgColor: 'bg-red-900/30',
    headerBg: 'bg-red-900/50 border-red-400',
    canTransition: false, // финальный статус
  },
}

/**
 * Получить конфиг для статуса
 */
export function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG[ORDER_STATUSES.NEW]
}

/**
 * Проверить, может ли статус быть изменён
 */
export function canTransitionStatus(status) {
  const config = getStatusConfig(status)
  return config.canTransition
}

/**
 * Возвращает все статусы в порядке отображения на доске
 */
export function getOrderStatusesInOrder() {
  return [
    ORDER_STATUSES.NEW,
    ORDER_STATUSES.CONFIRMED,
    ORDER_STATUSES.PREPARING,
    ORDER_STATUSES.DELIVERING,
    ORDER_STATUSES.COMPLETED,
    ORDER_STATUSES.CANCELED,
  ]
}

