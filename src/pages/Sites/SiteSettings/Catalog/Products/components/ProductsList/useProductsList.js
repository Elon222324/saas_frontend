import { useEffect, useMemo, useState } from 'react'
import { flattenTree } from './modules/utils'
import { applyCategoryFilter } from './filters/categoryFilter'
import { applySidebarLabelsFilter, applyPanelLabelsFilter } from './filters/labelsFilter'
import { applySearchFilter } from './filters/searchFilter'
import { applyStatusFilter, applyAvailabilityFilter } from './filters/statusAvailabilityFilter'
import { applyPriceFilter, applyWeightFilter } from './filters/priceWeightFilter'
import { buildOptionValueToGroupMap, applyOptionsFilter, applyExtrasFilter } from './filters/optionsExtrasFilter'
import { sortProducts } from './sorting/sortProducts'

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
  const optionValueToGroupMap = useMemo(() => buildOptionValueToGroupMap(optionGroups), [optionGroups])

  // ─── Debounce поиска ─────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300)
    return () => clearTimeout(t)
  }, [search])

  // ─── Фильтрация ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = products

    // Категории
    list = applyCategoryFilter(list, {
      selectedCategory: filters.selectedCategory,
      fallbackCategory: category,
      flatCategories,
    })

    // Лейблы (сайдбар) и метки (панель)
    list = applySidebarLabelsFilter(list, { labels, noLabel })
    list = applyPanelLabelsFilter(list, { selectedLabels: filters.selectedLabels })

    // Поиск
    list = applySearchFilter(list, { debounced })

    // Статус и наличие
    list = applyStatusFilter(list, { status: filters.status })
    list = applyAvailabilityFilter(list, { availability: filters.availability })

    // Цена и вес
    list = applyPriceFilter(list, { priceFrom: filters.priceFrom, priceTo: filters.priceTo })
    list = applyWeightFilter(list, { weightFrom: filters.weightFrom, weightTo: filters.weightTo })

    // Опции и дополнения
    list = applyOptionsFilter(list, { selectedOptions: filters.selectedOptions, optionValueToGroupMap })
    list = applyExtrasFilter(list, { selectedExtras: filters.selectedExtras })

    // Сортировка
    const sorted = sortProducts(list, filters.sortBy)

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
