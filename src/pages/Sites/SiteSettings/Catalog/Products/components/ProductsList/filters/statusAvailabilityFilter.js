import { isProductAvailable } from '../modules/utils'

export function applyStatusFilter(list, { status }) {
  if (status === 'active') return list.filter((p) => p.active === true)
  if (status === 'inactive') return list.filter((p) => p.active === false)
  return list
}

export function applyAvailabilityFilter(list, { availability }) {
  if (availability === 'available') return list.filter((p) => isProductAvailable(p))
  if (availability === 'unavailable') return list.filter((p) => !isProductAvailable(p))
  return list
}


