import { useEffect, useState } from 'react'

export default function CloudSidebar({
  active,
  onSelectCategory,
  groups,
  onAddCategory,
  onSearchChange,
}) {
  const [openGroups, setOpenGroups] = useState({})

  useEffect(() => {
    const initial = {}
    for (const group of groups) {
      initial[group.title] = true // раскрываем по умолчанию
    }
    setOpenGroups(initial)
  }, [groups])

  const toggleGroup = (title) => {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <div className="w-52 border-r p-4 space-y-4 overflow-y-auto max-h-[28rem]">
      <input
        type="text"
        placeholder="Поиск"
        className="w-full border rounded px-2 py-1 text-sm"
        onChange={(e) => onSearchChange?.(e.target.value)}
      />

      {groups.map((group) => (
        <div key={group.title} className="space-y-1">
          <button
            onClick={() => toggleGroup(group.title)}
            className="flex items-center justify-between w-full text-xs text-gray-500 mt-4 mb-1 uppercase tracking-wide"
          >
            <span>{group.title}</span>
            <span className="text-[10px]">{openGroups[group.title] ? '−' : '+'}</span>
          </button>

          {openGroups[group.title] && group.children && (
            <div className="space-y-1">
              {group.children.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSelectCategory?.(sub.id)}
                  className={`text-left block w-full text-sm px-2 py-1 rounded hover:bg-gray-100 ${
                    active === sub.id ? 'bg-gray-200 font-semibold' : ''
                  }`}
                >
                  {sub.title}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {onAddCategory && (
        <button
          onClick={() => {
            const name = window.prompt('Название категории')
            if (name) onAddCategory(name)
          }}
          className="text-sm text-blue-600 hover:underline mt-4"
        >
          + Добавить категорию
        </button>
      )}
    </div>
  )
}
