// FILE: src/pages/Sites/SiteSettings/Products/components/CategoryList/CategoryItem.jsx
import { ChevronRight, ChevronDown, Pencil, Trash2 } from 'lucide-react'

export default function CategoryItem({
  cat,
  depth,
  collapsed,
  toggle,
  onSelect,
  onEdit,
  onDelete,
  highlight,          // функция подсветки совпадений
  selected,           // id выбранной категории
  FolderIcon,
  TagIcon,
}) {
  const hasChildren  = Boolean(cat.children?.length)
  const isCollapsed  = collapsed.has(cat.id)
  const isActive     =
    (cat.id === 'all' && selected === null) || selected === cat.id

  // готовим HTML-строку с подсветкой или обычный текст
  const labelHtml = highlight ? highlight(cat.name) : cat.name

  return (
    <div>
      {/* ────────── строка категории ────────── */}
      <div
        data-kb-item
        data-kb-collapse={hasChildren && isCollapsed}
        data-kb-expand={hasChildren && !isCollapsed}
        tabIndex={0}
        style={{ paddingLeft: depth * 16 + 8 }}
        className={`group flex items-center justify-between rounded px-2 py-1 text-sm cursor-pointer focus:ring-2 focus:ring-blue-500
          ${isActive
            ? 'bg-blue-600 text-white'
            : cat.id === 'all'
            ? 'hover:bg-gray-100/70'
            : 'hover:bg-gray-100'}`}
        onClick={() => {
          if (hasChildren) toggle(cat.id)
          onSelect(cat.id === 'all' ? null : cat.id)
        }}
      >
        {/* — left side — */}
        <div className="flex items-center gap-1">
          {hasChildren ? (
            <span className="mr-1">
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            </span>
          ) : (
            <span className="mr-4" />
          )}

          {hasChildren
            ? <FolderIcon size={14} className="opacity-70" />
            : <TagIcon    size={14} className="opacity-70" />}

          <span dangerouslySetInnerHTML={{ __html: labelHtml }} />
        </div>

        {/* — right side — */}
        <div className="flex items-center gap-2">
          {cat.id !== 'all' && cat.count !== undefined && !!cat.count && (
            <span
              className={`min-w-[1.5rem] rounded px-1.5 py-0.5 text-center text-xs
                ${isActive
                  ? 'bg-white/20'
                  : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'}`}
            >
              {cat.count}
            </span>
          )}

          {cat.id !== 'all' && (
            <span className="flex gap-1 opacity-0 group-hover:opacity-100">
              <Pencil
                size={14}
                className="cursor-pointer hover:text-blue-600"
                onClick={(e) => { e.stopPropagation(); onEdit(cat) }}
              />
              <Trash2
                size={14}
                className="cursor-pointer hover:text-red-600"
                onClick={e => { e.stopPropagation(); window.confirm(`Удалить «${cat.name}»?`) && onDelete(cat.id) }}
              />
            </span>
          )}
        </div>
      </div>

      {/* ────────── дочерние элементы ────────── */}
      {hasChildren && (
        <div
          className={`overflow-hidden transition-[max-height] duration-200
            ${isCollapsed ? 'max-h-0' : 'max-h-screen'}`}
        >
          {cat.children.map(child => (
            <CategoryItem
              key={child.id}
              cat={child}
              depth={depth + 1}
              collapsed={collapsed}
              toggle={toggle}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              highlight={highlight}
              selected={selected}
              FolderIcon={FolderIcon}
              TagIcon={TagIcon}
            />
          ))}
        </div>
      )}
    </div>
  )
}
