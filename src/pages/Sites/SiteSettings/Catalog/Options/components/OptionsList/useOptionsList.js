import { useEffect, useMemo, useState } from 'react'

export default function useOptionsList({ options = [], removeFn }) {
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300)
    return () => clearTimeout(t)
  }, [search])

  const filtered = useMemo(() => {
    let list = options
    if (debounced) {
      list = list.filter(o => o.name.toLowerCase().includes(debounced))
    }
    return list
  }, [options, debounced])

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
    const ids = pageItems.map(o => o.id)
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

  const clearSelected = () => setSelected(new Set())

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
    clearSelected,
    page,
    setPage,
    pageItems,
    filtered,
    totalPages,
    pageSize,
  }
}
