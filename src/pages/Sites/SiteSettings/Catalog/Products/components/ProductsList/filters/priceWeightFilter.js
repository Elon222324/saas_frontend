import { getProductPrice, getProductWeight } from '../modules/utils'

export function applyPriceFilter(list, { priceFrom, priceTo }) {
  let result = list
  if (priceFrom !== '') {
    const minPrice = parseFloat(priceFrom)
    if (!isNaN(minPrice)) result = result.filter((p) => getProductPrice(p) >= minPrice)
  }
  if (priceTo !== '') {
    const maxPrice = parseFloat(priceTo)
    if (!isNaN(maxPrice)) result = result.filter((p) => getProductPrice(p) <= maxPrice)
  }
  return result
}

export function applyWeightFilter(list, { weightFrom, weightTo }) {
  let result = list
  if (weightFrom !== '') {
    const minWeight = parseFloat(weightFrom)
    if (!isNaN(minWeight)) result = result.filter((p) => getProductWeight(p) >= minWeight)
  }
  if (weightTo !== '') {
    const maxWeight = parseFloat(weightTo)
    if (!isNaN(maxWeight)) result = result.filter((p) => getProductWeight(p) <= maxWeight)
  }
  return result
}


