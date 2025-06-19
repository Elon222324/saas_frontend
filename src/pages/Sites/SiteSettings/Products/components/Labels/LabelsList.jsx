import { useState, useEffect, useMemo } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useLabels } from '../../hooks/useLabels'
import { useLabelCrud } from '../../hooks/useLabelCrud'
import AddLabelModal from './AddLabelModal'
import EditLabelModal from './EditLabelModal'

export default function LabelsList({ siteName }) {
  const { data: raw = [], isFetching } = useLabels(siteName)
  const { add, update, remove } = useLabelCrud(siteName)

  const [labels, setLabels] = useState([])
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [edit, setEdit] = useState({ open: false, label: null })

  useEffect(() => {
    setLabels(raw)
  }, [raw])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return labels.filter(l => l.name.toLowerCase().includes(q))
  }, [labels, search])

  const handleToggle = async (id, val) => {
    setLabels(prev => prev.map(l => (l.id === id ? { ...l, is_active: val } : l)))
    await update.mutateAsync({ id, is_active: val })
  }

  const handleSortChange = async (id, val) => {
    setLabels(prev => prev.map(l => (l.id === id ? { ...l, sort_order: val } : l)))
    await update.mutateAsync({ id, sort_order: Number(val) || 0 })
  }

  return (
    <div className="space-y-3">
      <header className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Метки товаров</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-40 rounded border px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={14} /> Добавить метку
          </button>
        </div>
      </header>

      {isFetching ? (
        <p className="text-sm text-gray-500">Загрузка…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500">Нет меток. Нажмите "Добавить метку", чтобы создать новую.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1">Название</th>
              <th className="px-2 py-1">Цвет фона</th>
              <th className="px-2 py-1">Цвет текста</th>
              <th className="px-2 py-1">Активно</th>
              <th className="px-2 py-1">Сортировка</th>
              <th className="px-2 py-1" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="border-t">
                <td className="px-2 py-1">{l.name}</td>
                <td className="px-2 py-1">
                  <span className="inline-block h-4 w-4 rounded" style={{ backgroundColor: l.bg_color }} />
                  <span className="ml-2 font-mono text-xs">{l.bg_color}</span>
                </td>
                <td className="px-2 py-1">
                  <span className="inline-block h-4 w-4 rounded" style={{ backgroundColor: l.text_color }} />
                  <span className="ml-2 font-mono text-xs">{l.text_color}</span>
                </td>
                <td className="px-2 py-1 text-center">
                  <input
                    type="checkbox"
                    checked={l.is_active}
                    onChange={e => handleToggle(l.id, e.target.checked)}
                    className="focus:ring-blue-500"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    value={l.sort_order ?? 0}
                    onChange={e => handleSortChange(l.id, e.target.value)}
                    className="w-16 rounded border px-1 py-0.5"
                  />
                </td>
                <td className="px-2 py-1 text-right">
                  <button
                    onClick={() => setEdit({ open: true, label: l })}
                    className="mr-2 text-xs text-blue-600 hover:underline"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Удалить метку "${l.name}"?`)) remove.mutateAsync(l.id)
                    }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AddLabelModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async payload => {
          await add.mutateAsync(payload)
          setShowAdd(false)
        }}
      />

      <EditLabelModal
        open={edit.open}
        label={edit.label}
        onClose={() => setEdit({ open: false, label: null })}
        onSave={async payload => {
          await update.mutateAsync(payload)
          setEdit({ open: false, label: null })
        }}
      />
    </div>
  )
}
