import { useState, useMemo, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import slugify from 'slugify'
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  Tag,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useCategories } from '../hooks/useCategories'
import AddCategoryModal from './AddCategoryModal'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function CategoryList({ selected, onSelect }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`
  const { data: tree = [], isFetching, refetch } = useCategories(siteName)

  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState(new Set())
  const [showModal, setShowModal] = useState(false)
  const containerRef = useRef(null)

  const categories = useMemo(() => {
    const total = tree.reduce((sum, n) => sum + (n.count ?? 0), 0)
    return [{ id: 'all', name: 'Все товары', count: total }, ...tree]
  }, [tree])

  const flatParents = useMemo(() => {
    const out = []
    const walk = (nodes, prefix = '') =>
      nodes.forEach((n) => {
        const path = prefix ? `${prefix} / ${n.name}` : n.name
        out.push({ id: n.id, path })
        if (n.children?.length) walk(n.children, path)
      })
    walk(tree)
    return out
  }, [tree])

  const filteredTree = useMemo(
    () => filterTree(categories, search.trim().toLowerCase()),
    [search, categories],
  )

  const toggle = (id) =>
    setCollapsed((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const items = el.querySelectorAll('[data-kb-item]')
    const handle = (e) => {
      const idx = Array.from(items).indexOf(document.activeElement)
      if (e.key === 'ArrowDown' && idx < items.length - 1) {
        e.preventDefault()
        items[idx + 1].focus()
      }
      if (e.key === 'ArrowUp' && idx > 0) {
        e.preventDefault()
        items[idx - 1].focus()
      }
      if (
        e.key === 'ArrowRight' &&
        document.activeElement.dataset.kbCollapse === 'true'
      ) {
        e.preventDefault()
        document.activeElement.click()
      }
      if (
        e.key === 'ArrowLeft' &&
        document.activeElement.dataset.kbExpand === 'true'
      ) {
        e.preventDefault()
        document.activeElement.click()
      }
    }
    el.addEventListener('keydown', handle)
    return () => el.removeEventListener('keydown', handle)
  }, [filteredTree, collapsed])

  const saveCategory = async ({ name, parent_id }) => {
    const body = {
        code: slugify(name, { lower: true, locale: 'ru' }),
        name, 
        parent_id,
     }
    await fetch(`${API_URL}/products/${siteName}/categories/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    })
    await refetch()
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full space-y-3 overflow-y-auto focus:outline-none"
      tabIndex={0}
    >
      <header className="flex items-center justify-between">
        <h2 className="font-semibold">Категории</h2>
        <button
          className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          Добавить
        </button>
      </header>

      <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded border px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
      />

      <nav>{filteredTree.map((c) => renderItem(c, 0))}</nav>

      <AddCategoryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={async (d) => {
          await saveCategory(d)
          setShowModal(false)
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

  function renderItem(cat, depth) {
    const hasChildren = cat.children?.length
    const isCollapsed = collapsed.has(cat.id)
    const isActive =
      (cat.id === 'all' && selected === null) || selected === cat.id

    return (
      <div key={cat.id}>
        <div
          data-kb-item
          data-kb-collapse={hasChildren && isCollapsed}
          data-kb-expand={hasChildren && !isCollapsed}
          tabIndex={0}
          className={`group flex items-center justify-between rounded px-2 py-1 text-sm cursor-pointer focus:ring-2 focus:ring-blue-500 ${
            isActive
              ? 'bg-blue-600 text-white'
              : cat.id === 'all'
              ? 'hover:bg-gray-100/70'
              : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: depth * 16 + 8 }}
          onClick={() => {
            if (hasChildren) toggle(cat.id)
            onSelect(cat.id === 'all' ? null : cat.id)
          }}
        >
          <div className="flex items-center gap-1">
            {hasChildren ? (
              <span className="mr-1">
                {isCollapsed ? (
                  <ChevronRight size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </span>
            ) : (
              <span className="mr-4" />
            )}

            {hasChildren ? (
              <Folder size={14} className="opacity-70" />
            ) : (
              <Tag size={14} className="opacity-70" />
            )}
            <span
              dangerouslySetInnerHTML={{
                __html: highlight(cat.name, search),
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            {cat.id !== 'all' && cat.count !== undefined && (
              <span
                className={`min-w-[1.5rem] rounded px-1.5 py-0.5 text-center text-xs ${
                  isActive
                    ? 'bg-white/20'
                    : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
                }`}
              >
                {cat.count}
              </span>
            )}
            {cat.id !== 'all' && (
              <span className="flex gap-1 opacity-0 group-hover:opacity-100">
                <Pencil
                  size={14}
                  className="cursor-pointer hover:text-blue-600"
                  onClick={(e) => e.stopPropagation()}
                />
                <Trash2
                  size={14}
                  className="cursor-pointer hover:text-red-600"
                  onClick={(e) => e.stopPropagation()}
                />
              </span>
            )}
          </div>
        </div>

        {hasChildren && (
          <div
            className={`overflow-hidden transition-[max-height] duration-200 ${
              isCollapsed ? 'max-h-0' : 'max-h-screen'
            }`}
          >
            {cat.children.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }
}

function filterTree(tree, q) {
  if (!q) return tree
  const walk = (nodes) =>
    nodes
      .map((n) => {
        if (n.id === 'all') return null
        const match = n.name.toLowerCase().includes(q)
        const kids = n.children ? walk(n.children) : []
        if (match || kids.length)
          return { ...n, children: kids.length ? kids : n.children }
        return null
      })
      .filter(Boolean)
  return [tree[0], ...walk(tree.slice(1))]
}

function highlight(text, q) {
  if (!q) return text
  return text.replace(
    new RegExp(`(${escapeRegExp(q)})`, 'gi'),
    '<mark class="bg-yellow-200 text-black">$1</mark>',
  )
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}