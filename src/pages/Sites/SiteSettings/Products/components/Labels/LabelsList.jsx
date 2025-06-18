// FILE: src/pages/Sites/SiteSettings/Products/components/Labels/LabelsList.jsx
import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function LabelsList({ siteName }) {
  const [labels, setLabels] = useState([
    { id: 1, name: 'Хит', color: '#ef4444' },
    { id: 2, name: 'Новинка', color: '#10b981' },
  ])

  return (
    <div className="space-y-2">
      <header className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Метки товаров</h3>
        <button
          className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          onClick={() => alert('Добавить метку (в будущем)')}
        >
          <Plus size={14} /> Добавить
        </button>
      </header>

      {labels.map(label => (
        <div
          key={label.id}
          className="flex items-center justify-between rounded border px-2 py-1 text-sm"
          style={{ borderColor: label.color }}
        >
          <span className="flex items-center gap-2">
            <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: label.color }} />
            {label.name}
          </span>
          <button
            onClick={() => alert(`Настроить метку ${label.name}`)}
            className="text-xs text-blue-600 hover:underline"
          >
            Настроить
          </button>
        </div>
      ))}
    </div>
  )
}
