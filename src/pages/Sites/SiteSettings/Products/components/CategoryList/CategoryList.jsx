import { useState, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Folder, Tag } from 'lucide-react'

import { useCategories } from '../../hooks/useCategories'
import { useKeyboardTreeNav } from '../../hooks/useKeyboardTreeNav'
import { useCategoryCrud } from './useCategoryCrud'

import CategoryItem from './CategoryItem'
import AddCategoryModal from '../AddCategoryModal'
import EditCategoryModal from '../EditCategoryModal'
import LabelsList from '../Labels/LabelsList'

import { filterTree, highlight } from './TreeUtils'

export default function CategoryList({ selected, onSelect }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: tree = [], isFetching, refetch } = useCategories(siteName)
  const { add: addCat, update: updateCat, remove: deleteCat } = useCategoryCrud(siteName, refetch)

  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState(new Set())
  const [showAdd, setShowAdd] = useState(false)
  const [editState, setEditState] = useState({ open: false, category: null })
  const [tab, setTab] = useState('categories')

  const containerRef = useRef(null)
  useKeyboardTreeNav(containerRef, collapsed)

  const categories = useMemo(() => {
    const total = tree.reduce((s, n) => s + (n.count ?? 0), 0)
    return [{ id: 'all', name: 'Все товары', count: total }, ...tree]
  }, [tree])

  const flatParents = useMemo(() => {
    const list = []
    const walk = (nodes, prefix = '') =>
      nodes.forEach(n => {
        const path = prefix ? `${prefix} / ${n.name}` : n.name
        list.push({ id: n.id, path })
        if (n.children?.length) walk(n.children, path)
      })
    walk(tree)
    return list
  }, [tree])

  const filtered = useMemo(
    () => filterTree(categories, search.trim().toLowerCase()),
    [categories, search],
  )

  const toggle = (id) =>
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div ref={containerRef} className="relative h-full space-y-3 overflow-y-auto focus:outline-none" tabIndex={0}>
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          className={`rounded px-2 py-1 text-sm ${tab === 'categories' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setTab('categories')}
        >Категории</button>
        <button
          className={`rounded px-2 py-1 text-sm ${tab === 'labels' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setTab('labels')}
        >Метки</button>
      </div>

      {/* Header */}
      {tab === 'categories' && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Категории товаров</span>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={14} /> Добавить
          </button>
        </div>
      )}

      {/* Search */}
      {tab === 'categories' && (
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
        />
      )}

      {/* Content */}
      {tab === 'categories' ? (
        <nav>
          {filtered.map(c => (
            <CategoryItem
              key={c.id}
              cat={c}
              depth={0}
              collapsed={collapsed}
              toggle={toggle}
              highlight={txt => highlight(txt, search)}
              selected={selected}
              onSelect={onSelect}
              onEdit={cat => setEditState({ open: true, category: cat })}
              onDelete={id => deleteCat.mutateAsync(id)}
              FolderIcon={Folder}
              TagIcon={Tag}
            />
          ))}
        </nav>
      ) : (
        <LabelsList siteName={siteName} />
      )}

      <AddCategoryModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async payload => {
          await addCat.mutateAsync(payload)
          setShowAdd(false)
        }}
        parents={flatParents}
      />

      <EditCategoryModal
        open={editState.open}
        category={editState.category}
        onClose={() => setEditState({ open: false, category: null })}
        onSave={async payload => {
          await updateCat.mutateAsync(payload)
          setEditState({ open: false, category: null })
        }}
        parents={flatParents}
      />

      {isFetching && (
        <div className="absolute inset-x-0 bottom-2 text-center text-xs text-gray-500">
          Загрузка…
        </div>
      )}
    </div>
  )
}
