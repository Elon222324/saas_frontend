import { getProductPrice } from '../modules/utils'

export function sortProducts(list, sortBy) {
  const sorted = [...list]
  switch (sortBy) {
    case 'title_asc':
      sorted.sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'ru'))
      break
    case 'title_desc':
      sorted.sort((a, b) => String(b.title || '').localeCompare(String(a.title || ''), 'ru'))
      break
    case 'price_asc':
      sorted.sort((a, b) => getProductPrice(a) - getProductPrice(b))
      break
    case 'price_desc':
      sorted.sort((a, b) => getProductPrice(b) - getProductPrice(a))
      break
    case 'created_asc':
      sorted.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
      break
    case 'created_desc':
      sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      break
    case 'order':
    default:
      // keep original order
      break
  }
  return sorted
}


