// Shared utilities for products list filtering/sorting

export function flattenTree(tree = []) {
  const list = []
  const walk = (nodes) => {
    nodes.forEach((n) => {
      list.push(n)
      if (n.children?.length) walk(n.children)
    })
  }
  walk(tree)
  return list
}

export function getAllNestedCategoryIds(rootId, categories = []) {
  const ids = new Set()
  const walk = (id) => {
    const numericId = Number(id)
    if (Number.isNaN(numericId)) return
    ids.add(numericId)
    categories
      .filter((c) => Number(c.parent_id) === numericId)
      .forEach((c) => walk(c.id))
  }
  if (rootId !== undefined && rootId !== null && rootId !== '') walk(rootId)
  return ids
}

// Получить цену товара (из первого варианта или базовую)
export function getProductPrice(product) {
  if (product.variants && product.variants.length > 0 && product.variants[0].price) {
    return parseFloat(product.variants[0].price)
  }
  return product.price ? parseFloat(product.price) : 0
}

// Проверить наличие товара (хотя бы один вариант в наличии)
export function isProductAvailable(product) {
  if (!product.variants || product.variants.length === 0) return true
  return product.variants.some(v => v.is_available !== false)
}

// Получить вес товара (из первого варианта)
export function getProductWeight(product) {
  if (product.variants && product.variants.length > 0 && product.variants[0].weight) {
    return parseFloat(product.variants[0].weight)
  }
  return product.weight ? parseFloat(product.weight) : 0
}


