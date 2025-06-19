import { useState, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Folder, Tag } from 'lucide-react'

import { useCategories } from '../../hooks/useCategories'
import { useKeyboardTreeNav } from '../../hooks/useKeyboardTreeNav'
import { useCategoryCrud } from './useCategoryCrud'

import CategoryItem from './CategoryItem'
import AddCategoryModal from '../AddCategoryModal'
import EditCategoryModal from '../EditCategoryModal'
import LabelsList from '../Labels/LabelsList'
import CategoryToolbar from './CategoryToolbar'

import { filterTree, highlight } from './TreeUtils'

export default function CategoryList({ selected, onSelect, tab, setTab }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: tree = [], isFetching, refetch } = useCategories(siteName)
  const { add: addCat, update: updateCat, remove: deleteCat } = useCategoryCrud(siteName, refetch)

  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState(new Set())
  const [showAdd, setShowAdd] = useState(false)
  const [editState, setEditState] = useState({ open: false, category: null })

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
    <div ref={containerRef} className="relative h-full space-y-4 focus:outline-none" tabIndex={0}>
      <CategoryToolbar
        tab={tab}
        onTabChange={setTab}
        onAddClick={() => setShowAdd(true)}
        search={search}
        setSearch={setSearch}
      />

      <div className="overflow-y-auto">
        {tab === 'categories' ? (
          <nav className="space-y-1 pt-1">
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
          <LabelsList siteName={siteName} selected={selected} onSelect={onSelect} />
        )}
      </div>

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
