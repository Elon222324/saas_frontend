import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Filter } from 'lucide-react'

import { useProducts } from '../../hooks/useProducts'
import { useProductCrud } from '../../hooks/useProductCrud'

import AddProductModal from '../AddProductModal'
import EditProductModal from '../EditProductModal'
import ProductRow from './ProductRow'

export default function ProductsList({ category }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: all = [], isFetching, isError, refetch } = useProducts(siteName)
  const { add, update, remove } = useProductCrud(siteName)

  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [page, setPage] = useState(1)
  const [showAdd, setShowAdd] = useState(false)
  const [edit, setEdit] = useState({ open: false, product: null })

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300)
    return () => clearTimeout(t)
  }, [search])

  const filtered = useMemo(() => {
    let list = category ? all.filter(p => p.category_id === category) : all
    if (debounced)
      list = list.filter(p => p.title.toLowerCase().includes(debounced))
    return list
  }, [all, category, debounced])

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

  const handleDeleteSelected = async () => {
    for (const id of selected) {
      // eslint-disable-next-line no-await-in-loop
      await remove.mutateAsync(id)
    }
    setSelected(new Set())
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

  const renderTable = () => {
    if (isFetching) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse border-t">
              <td className="px-2 py-3" colSpan={5}>
                <div className="h-4 w-full rounded bg-gray-200" />
              </td>
            </tr>
          ))}
        </tbody>
      )
    }

    if (!filtered.length) {
      return (
        <tbody>
          <tr>
            <td colSpan={5} className="py-6 text-center text-sm text-gray-500">
              Вы ещё не добавили ни одного товара
              <div className="mt-2">
                <button
                  onClick={() => setShowAdd(true)}
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                  Добавить первый товар
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <tbody>
        {pageItems.map(p => (
          <ProductRow
            key={p.id}
            product={p}
            checked={selected.has(p.id)}
            onCheck={toggleSelect}
            onEdit={prod => setEdit({ open: true, product: prod })}
            onDelete={id => remove.mutateAsync(id)}
          />
        ))}
      </tbody>
    )
  }

  return (
    <div className="space-y-4">
      {/* header */}
      {selected.size ? (
        <div className="flex items-center justify-between rounded border bg-gray-50 px-2 py-1">
          <span className="text-sm">Выбрано: {selected.size}</span>
          <button
            onClick={handleDeleteSelected}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
          >
            Удалить выбранное
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={16} /> Добавить товар
          </button>
          <button
            className="rounded border px-3 py-1 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500"
          >
            Фильтры
          </button>
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto w-48 rounded border px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* table */}
      <table className="w-full border text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-8 px-2 py-1">
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={pageItems.length > 0 && pageItems.every(p => selected.has(p.id))}
                className="focus:ring-blue-500"
              />
            </th>
            <th className="w-12 px-2 py-1">Фото</th>
            <th className="px-2 py-1">Название</th>
            <th className="px-2 py-1">Цена</th>
            <th className="px-2 py-1" />
          </tr>
        </thead>
        {renderTable()}
      </table>

      {/* pagination */}
      {filtered.length > pageSize && (
        <div className="flex justify-center gap-2 text-sm">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`rounded px-2 py-1 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 ${page === i + 1 ? 'bg-blue-600 text-white' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
          >
            &gt;
          </button>
        </div>
      )}

      {/* modals */}
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
