import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useProducts } from '../../hooks/useProducts'
import { useProductCrud } from '../../hooks/useProductCrud'
import { useCategories } from '../../hooks/useCategories' // ✅ добавлен импорт

import AddProductModal from '../AddProductModal'
import EditProductModal from '../EditProductModal'
import Toolbar from './Toolbar'
import BulkActionsBar from './BulkActionsBar'
import ProductTable from './ProductTable'
import Pagination from './Pagination'
import useProductsList from './useProductsList'

export default function ProductsList({ category }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: all = [], isFetching, isError, refetch } = useProducts(siteName)
  const { add, update, remove } = useProductCrud(siteName)
  const { data: tree = [] } = useCategories(siteName)

  const [ordered, setOrdered] = useState([])
  useEffect(() => {
    setOrdered(all)
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

  const list = useProductsList({
    products: ordered,
    category,
    categories: tree,
    removeFn: remove.mutateAsync,
  })

  const [showAdd, setShowAdd] = useState(false)
  const [edit, setEdit] = useState({ open: false, product: null })

  const handleReorder = (from, to) => {
    setOrdered(prev => {
      const start = (list.page - 1) * list.pageSize
      const arr = Array.from(prev)
      const [moved] = arr.splice(start + from, 1)
      arr.splice(start + to, 0, moved)
      return arr.map((p, idx) => ({ ...p, order: idx + 1 }))
    })
  }

  const handleToggleStatus = async (id, changes) => {
    setOrdered(prev => prev.map(p => (p.id === id ? { ...p, ...changes } : p)))
    await update.mutateAsync({ id, ...changes })
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
        <BulkActionsBar count={list.selected.size} onDelete={list.deleteSelected} />
      ) : (
        <Toolbar onAdd={() => setShowAdd(true)} search={list.search} onSearch={list.setSearch} />
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
        onReorder={handleReorder}
        onToggleStatus={handleToggleStatus}
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

