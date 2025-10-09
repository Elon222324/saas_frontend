import { useEffect, useMemo, useState } from 'react'

function flattenTree(tree = []) {
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

function getAllNestedCategoryIds(rootId, categories = []) {
  const ids = new Set()
  const walk = (id) => {
    ids.add(id)
    categories
      .filter((c) => String(c.parent_id) === String(id))
      .forEach((c) => walk(c.id))
  }
  if (rootId) walk(rootId)
  return ids
}

// Получить цену товара (из первого варианта или базовую)
function getProductPrice(product) {
  if (product.variants && product.variants.length > 0 && product.variants[0].price) {
    return parseFloat(product.variants[0].price)
  }
  return product.price ? parseFloat(product.price) : 0
}

// Проверить наличие товара (хотя бы один вариант в наличии)
function isProductAvailable(product) {
  if (!product.variants || product.variants.length === 0) return true
  return product.variants.some(v => v.is_available !== false)
}

// Получить вес товара (из первого варианта)
function getProductWeight(product) {
  if (product.variants && product.variants.length > 0 && product.variants[0].weight) {
    return parseFloat(product.variants[0].weight)
  }
  return product.weight ? parseFloat(product.weight) : 0
}

// Проверить, есть ли у товара определенная опция (по ID группы опций)
function productHasOptionGroup(product, optionGroupId) {
  if (!product.variants || product.variants.length === 0) return false
  // Проверяем, есть ли хотя бы один вариант с опцией из этой группы
  return product.variants.some(variant => {
    if (!variant.option_value_ids || variant.option_value_ids.length === 0) return false
    // Нужно проверить, относятся ли какие-то из option_value_ids к нужной группе
    // Это будет проверено в основной логике фильтрации с использованием optionValueMap
    return variant.option_value_ids.length > 0
  })
}

// Проверить, есть ли у товара определенное дополнение (по ID группы дополнений)
function productHasExtraGroup(product, extraGroupId) {
  if (!product.extra_groups || product.extra_groups.length === 0) return false
  return product.extra_groups.some(eg => Number(eg.id) === Number(extraGroupId))
}

export default function useProductsList({ 
  products = [], 
  category, 
  labels, 
  noLabel = false, 
  categories = [], 
  removeFn,
  optionGroups = [],  // Для фильтрации по опциям
}) {
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [page, setPage] = useState(1)
  
  // Фильтры
  const [filters, setFilters] = useState({
    status: 'all',        // all, active, inactive
    availability: 'all',  // all, available, unavailable
    priceFrom: '',
    priceTo: '',
    weightFrom: '',
    weightTo: '',
    selectedLabels: [],   // массив ID меток
    selectedCategory: '', // ID категории (дополнительно к боковой панели)
    selectedOptions: [],  // массив ID групп опций
    selectedExtras: [],   // массив ID групп дополнений
    sortBy: 'order'       // order, title_asc, title_desc, price_asc, price_desc, created_asc, created_desc
  })

  const flatCategories = useMemo(() => flattenTree(categories), [categories])

  // Карта для быстрого поиска: option_value_id -> group_id
  const optionValueToGroupMap = useMemo(() => {
    const map = new Map()
    optionGroups.forEach(group => {
      if (group.values && Array.isArray(group.values)) {
        group.values.forEach(value => {
          map.set(Number(value.id), Number(group.id))
        })
      }
    })
    return map
  }, [optionGroups])

  // ─── Debounce поиска ─────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300)
    return () => clearTimeout(t)
  }, [search])

  // ─── Фильтрация ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = products

    // Фильтр по категории: приоритет у фильтра из панели, если не выбран - используем боковой
    const activeCategoryFilter = filters.selectedCategory || category
    if (activeCategoryFilter && flatCategories.length) {
      const allowedIds = getAllNestedCategoryIds(activeCategoryFilter, flatCategories)
      list = list.filter((p) => allowedIds.has(Number(p.category_id)))
    }

    // Фильтр по лейблам (из бокового меню)
    if (noLabel) {
      list = list.filter((p) => !Array.isArray(p.labels) || p.labels.length === 0)
    } else if (Array.isArray(labels) && labels.length) {
      const labelIds = labels.map((id) => Number(id))
      list = list.filter(
        (p) =>
          Array.isArray(p.labels) &&
          p.labels.some((lbl) => labelIds.includes(Number(lbl)))
      )
    }

    // Фильтр по меткам (дополнительный из панели фильтров)
    if (Array.isArray(filters.selectedLabels) && filters.selectedLabels.length > 0) {
      const labelIds = filters.selectedLabels.map((id) => Number(id))
      list = list.filter((p) =>
        Array.isArray(p.labels) &&
        p.labels.some((lbl) => labelIds.includes(Number(lbl)))
      )
    }

    // Фильтр по поиску
    if (debounced) {
      list = list.filter((p) => p.title.toLowerCase().includes(debounced))
    }

    // Фильтр по статусу
    if (filters.status === 'active') {
      list = list.filter((p) => p.active === true)
    } else if (filters.status === 'inactive') {
      list = list.filter((p) => p.active === false)
    }

    // Фильтр по наличию
    if (filters.availability === 'available') {
      list = list.filter((p) => isProductAvailable(p))
    } else if (filters.availability === 'unavailable') {
      list = list.filter((p) => !isProductAvailable(p))
    }

    // Фильтр по цене
    if (filters.priceFrom !== '') {
      const minPrice = parseFloat(filters.priceFrom)
      if (!isNaN(minPrice)) {
        list = list.filter((p) => getProductPrice(p) >= minPrice)
      }
    }
    if (filters.priceTo !== '') {
      const maxPrice = parseFloat(filters.priceTo)
      if (!isNaN(maxPrice)) {
        list = list.filter((p) => getProductPrice(p) <= maxPrice)
      }
    }

    // Фильтр по весу
    if (filters.weightFrom !== '') {
      const minWeight = parseFloat(filters.weightFrom)
      if (!isNaN(minWeight)) {
        list = list.filter((p) => getProductWeight(p) >= minWeight)
      }
    }
    if (filters.weightTo !== '') {
      const maxWeight = parseFloat(filters.weightTo)
      if (!isNaN(maxWeight)) {
        list = list.filter((p) => getProductWeight(p) <= maxWeight)
      }
    }

    // Фильтр по опциям
    if (Array.isArray(filters.selectedOptions) && filters.selectedOptions.length > 0) {
      const optionGroupIds = filters.selectedOptions.map(id => Number(id))
      list = list.filter((p) => {
        if (!p.variants || p.variants.length === 0) return false
        // Проверяем, есть ли хотя бы один вариант с опцией из выбранных групп
        return p.variants.some(variant => {
          if (!variant.option_value_ids || variant.option_value_ids.length === 0) return false
          // Проверяем, есть ли хотя бы одно значение опции из нужной группы
          return variant.option_value_ids.some(valueId => {
            const groupId = optionValueToGroupMap.get(Number(valueId))
            return groupId && optionGroupIds.includes(groupId)
          })
        })
      })
    }

    // Фильтр по дополнениям
    if (Array.isArray(filters.selectedExtras) && filters.selectedExtras.length > 0) {
      const extraGroupIds = filters.selectedExtras.map(id => Number(id))
      list = list.filter((p) => {
        if (!p.extra_groups || p.extra_groups.length === 0) return false
        return p.extra_groups.some(eg => extraGroupIds.includes(Number(eg.id)))
      })
    }

    // Сортировка
    const sorted = [...list]
    switch (filters.sortBy) {
      case 'title_asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title, 'ru'))
        break
      case 'title_desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title, 'ru'))
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
        // По умолчанию сортировка по order (уже должна быть в products)
        break
    }

    return sorted
  }, [products, category, labels, noLabel, debounced, flatCategories, filters, optionValueToGroupMap])

  // ─── Пагинация ───────────────────────────────────────────────
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  // ─── Работа с выделением ─────────────────────────────────────
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    const ids = pageItems.map((p) => p.id)
    setSelected((prev) => {
      const next = new Set(prev)
      const allSelected = ids.every((id) => next.has(id))
      if (allSelected) ids.forEach((id) => next.delete(id))
      else ids.forEach((id) => next.add(id))
      return next
    })
  }

  const deleteSelected = async () => {
    for (const id of selected) {
      // eslint-disable-next-line no-await-in-loop
      await removeFn(id)
    }
    setSelected(new Set())
  }

  const clearSelected = () => setSelected(new Set())

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setPage(1)
  }, [filters, debounced, category, labels, noLabel])

  return {
    search,
    setSearch,
    selected,
    toggleSelect,
    toggleSelectAll,
    deleteSelected,
    clearSelected,
    page,
    setPage,
    pageItems,
    filtered,
    totalPages,
    pageSize,
    filters,
    setFilters,
  }
}
