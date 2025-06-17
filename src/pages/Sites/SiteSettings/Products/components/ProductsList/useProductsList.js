import { useEffect, useMemo, useState } from 'react'

export default function useProductsList({ products = [], category, removeFn }) {
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300)
    return () => clearTimeout(t)
  }, [search])

  const filtered = useMemo(() => {
    let list = category ? products.filter(p => p.category_id === category) : products
    if (debounced) list = list.filter(p => p.title.toLowerCase().includes(debounced))
    return list
  }, [products, category, debounced])

  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    const ids = pageItems.map(p => p.id)
    setSelected(prev => {
      const next = new Set(prev)
      const allSelected = ids.every(id => next.has(id))
      if (allSelected) ids.forEach(id => next.delete(id))
      else ids.forEach(id => next.add(id))
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

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  return {
    search,
    setSearch,
    selected,
    toggleSelect,
    toggleSelectAll,
    deleteSelected,
    page,
    setPage,
    pageItems,
    filtered,
    totalPages,
    pageSize,
  }
}
