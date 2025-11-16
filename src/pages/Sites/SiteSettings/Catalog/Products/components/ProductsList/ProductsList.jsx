import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useProducts } from '../../hooks/useProducts'
import { useProductCrud } from '../../hooks/useProductCrud'
import { useCategories } from '../../hooks/useCategories'
import { useLabels } from '../../hooks/useLabels'
import { useOptionGroups } from '../../../Options/hooks/useOptionGroups'
import { useExtraGroups } from '../../../Extras/hooks/useExtraGroups'

import AddProductModal from '../AddProductModal/AddProductModal.jsx'
import EditProductModal from '../EditProductModal/EditProductModal.jsx'
import Toolbar from './Toolbar'
import BulkActionsBar from './BulkActionsBar'
import ProductTable from './ProductTable'
import Pagination from './Pagination'
import FiltersPanel from './FiltersPanel'
import useProductsList from './useProductsList'

export default function ProductsList({ category, labels, noLabel }) {
  const { domain } = useParams()
  const containerSuffix = import.meta.env.VITE_CONTAINER_SUFFIX || '_app'
  const siteName = `${domain}${containerSuffix}`

  const { data: all = [], isFetching, isError, refetch } = useProducts(siteName)
  const { add, update, remove } = useProductCrud(siteName)
  const { data: tree = [] } = useCategories(siteName)
  const { data: labelsList = [] } = useLabels(siteName)
  const { data: optionGroups = [] } = useOptionGroups(siteName)
  const { data: extraGroups = [] } = useExtraGroups(siteName)

  const [ordered, setOrdered] = useState([])

  useEffect(() => {
    setOrdered(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(all)) {
        return all
      }
      return prev
    })
  }, [all])

  const categoryMap = useMemo(() => {
    const map = {}
    const walk = (nodes) => {
      nodes.forEach((n) => {
        map[n.id] = n.name
        if (n.children?.length) walk(n.children)
      })
    }
    walk(tree)
    return map
  }, [tree])

  const categoryOptions = useMemo(() => {
    const list = []
    const walk = (nodes, prefix = '') => {
      nodes.forEach((n) => {
        const path = prefix ? `${prefix} / ${n.name}` : n.name
        list.push({ id: n.id, path })
        if (n.children?.length) walk(n.children, path)
      })
    }
    walk(tree)
    return list
  }, [tree])

  const labelsMap = useMemo(() => {
    const map = {}
    labelsList.forEach((l) => {
      map[l.id] = l
    })
    return map
  }, [labelsList])

  const list = useProductsList({
    products: ordered,
    category,
    labels,
    noLabel,
    categories: tree,
    removeFn: remove.mutateAsync,
    optionGroups,
  })

  const [showAdd, setShowAdd] = useState(false)
  const [edit, setEdit] = useState({ open: false, product: null })
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = () => {
    return list.filters.status !== 'all' || 
           list.filters.availability !== 'all' || 
           list.filters.priceFrom !== '' || 
           list.filters.priceTo !== '' ||
           list.filters.weightFrom !== '' ||
           list.filters.weightTo !== '' ||
           list.filters.selectedLabels?.length > 0 ||
           list.filters.selectedCategory !== '' ||
           list.filters.selectedOptions?.length > 0 ||
           list.filters.selectedExtras?.length > 0 ||
           list.filters.sortBy !== 'order'
  }

  const resetFilters = () => {
    list.setFilters({
      status: 'all',
      availability: 'all',
      priceFrom: '',
      priceTo: '',
      weightFrom: '',
      weightTo: '',
      selectedLabels: [],
      selectedCategory: '',
      selectedOptions: [],
      selectedExtras: [],
      sortBy: 'order'
    })
  }

  const handleReorder = async (from, to) => {
    let updated = []
    setOrdered(prev => {
      const start = (list.page - 1) * list.pageSize
      const arr = Array.from(prev)
      const [moved] = arr.splice(start + from, 1)
      arr.splice(start + to, 0, moved)
      updated = arr.map((p, idx) => ({ ...p, order: idx + 1 }))
      return updated
    })
    for (const p of updated) {
       
      await update.mutateAsync({ id: p.id, order: p.order })
    }
  }

  const handleToggleStatus = async (id, changes) => {
    setOrdered(prev => prev.map(p => (p.id === id ? { ...p, ...changes } : p)))
    await update.mutateAsync({ id, ...changes })
  }

  const handleInlineUpdate = async (id, changes) => {
    setOrdered(prev => prev.map(p => (p.id === id ? { ...p, ...changes } : p)))
    await update.mutateAsync({ id, ...changes })
  }

  const handleBulkStatus = async (changes) => {
    const ids = Array.from(list.selected)
    setOrdered(prev =>
      prev.map(p => (ids.includes(p.id) ? { ...p, ...changes } : p)),
    )
    for (const id of ids) {
       
      await update.mutateAsync({ id, ...changes })
    }
    list.clearSelected()
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-600">Не удалось загрузить товары</p>
        <button
          onClick={() => refetch()}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {list.selected.size ? (
        <BulkActionsBar
          count={list.selected.size}
          onDelete={list.deleteSelected}
          onActivate={() => handleBulkStatus({ active: true })}
          onDeactivate={() => handleBulkStatus({ active: false })}
        />
      ) : (
        <Toolbar 
          onAdd={() => setShowAdd(true)} 
          search={list.search} 
          onSearch={list.setSearch} 
          disabledAdd={!Object.keys(categoryMap).length}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          hasActiveFilters={hasActiveFilters()}
        />
      )}

      {showFilters && (
        <FiltersPanel
          filters={list.filters}
          onFiltersChange={list.setFilters}
          onClose={() => setShowFilters(false)}
          onReset={resetFilters}
          categoryOptions={categoryOptions}
          labelsList={labelsList}
          optionGroups={optionGroups}
          extraGroups={extraGroups}
        />
      )}

      {(hasActiveFilters() || list.search) && (
        <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded px-3 py-2">
          Найдено товаров: <span className="font-semibold">{list.filtered.length}</span>
          {list.filtered.length === 0 && ' — попробуйте изменить параметры фильтрации'}
        </div>
      )}

      <ProductTable
        isFetching={isFetching}
        filtered={list.filtered}
        pageItems={list.pageItems}
        selected={list.selected}
        toggleSelect={list.toggleSelect}
        toggleSelectAll={list.toggleSelectAll}
        onEdit={prod => setEdit({ open: true, product: prod })}
        onDelete={id => remove.mutateAsync(id)}
        onAdd={() => setShowAdd(true)}
        categoryMap={categoryMap}
        categoryOptions={categoryOptions}
        labelsMap={labelsMap}
        labelsList={labelsList}
        onReorder={handleReorder}
        onToggleStatus={handleToggleStatus}
        onInlineUpdate={handleInlineUpdate}
        isFilteringByLabel={!!noLabel || (labels?.length > 0)}
      />

      <Pagination page={list.page} totalPages={list.totalPages} setPage={list.setPage} />

      <AddProductModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async payload => {
          await add.mutateAsync(payload)
          setShowAdd(false)
        }}
        categoryId={category}
      />
      <EditProductModal
        open={edit.open}
        product={edit.product}
        onClose={() => setEdit({ open: false, product: null })}
        onSave={async payload => {
          await update.mutateAsync(payload)
          setEdit({ open: false, product: null })
        }}
      />
    </div>
  )
}
