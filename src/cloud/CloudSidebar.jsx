// src/cloud/CloudSidebar.jsx

import { useEffect, useState } from 'react'

export default function CloudSidebar({ active, onSelectCategory, groups }) {
  const [openGroups, setOpenGroups] = useState({})

  useEffect(() => {
    setOpenGroups(
      Object.fromEntries(groups.map(g => [g.title, g.title === 'Системные']))
    )
  }, [groups])

  const toggleGroup = (title) => {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <div className="w-52 border-r p-4 space-y-4">
      <input
        type="text"
        placeholder="Поиск"
        className="w-full border rounded px-2 py-1 text-sm"
      />

      {groups.map(group => (
        <div key={group.title} className="space-y-1">
          <button
            onClick={() => toggleGroup(group.title)}
            className="flex items-center justify-between w-full text-xs text-gray-500 mt-4 mb-1 uppercase tracking-wide"
          >
            <span>{group.title}</span>
            <span className="text-[10px]">{openGroups[group.title] ? '−' : '+'}</span>
          </button>

          {openGroups[group.title] && (
            <div className="space-y-1">
              {group.categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`block w-full text-left px-2 py-1 rounded text-sm ${
                    active === cat ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      <button className="text-blue-600 text-sm mt-4">➕ Создать категорию</button>
    </div>
  )
}
