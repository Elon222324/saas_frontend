import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { useLabels } from '../../hooks/useLabels'
import { useLabelCrud } from '../../hooks/useLabelCrud'
import AddLabelModal from './AddLabelModal'
import EditLabelModal from './EditLabelModal'

export default function LabelsList({ siteName }) {
  const { data: labels = [], isFetching, refetch } = useLabels(siteName)
  const { add: addLabel, update: updateLabel, remove: deleteLabel } = useLabelCrud(siteName)

  const [showAdd, setShowAdd] = useState(false)
  const [editState, setEditState] = useState({ open: false, label: null })

  return (
    <div className="space-y-2">
      <header className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Метки товаров</h3>
        <button
          className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={14} /> Добавить
        </button>
      </header>

      {isFetching ? (
        <p className="text-sm text-gray-500">Загрузка…</p>
      ) : labels.length ? (
        labels.map((label) => (
          <div
            key={label.id}
            className={`flex items-center justify-between rounded border px-2 py-1 text-sm ${!label.is_active ? 'opacity-50' : ''}`}
            style={{ borderColor: label.color || '#ccc' }}
          >
            <span className="flex items-center gap-2">
              <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: label.color || '#ccc' }} />
              {label.name}
            </span>
            <span className="flex gap-1">
              <Pencil size={14} className="cursor-pointer hover:text-blue-600" onClick={() => setEditState({ open: true, label })} />
              <Trash2
                size={14}
                className="cursor-pointer hover:text-red-600"
                onClick={() => {
                  if (window.confirm(`Удалить метку «${label.name}»?`)) {
                    deleteLabel.mutateAsync(label.id)
                  }
                }}
              />
            </span>
          </div>
        ))
      ) : (
        <div className="rounded border border-dashed p-4 text-center text-sm text-gray-500">
          Вы ещё не добавили ни одной метки
          <div className="mt-2">
            <button
              onClick={() => setShowAdd(true)}
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Добавить первую метку
            </button>
          </div>
        </div>
      )}

      <AddLabelModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async (payload) => {
          await addLabel.mutateAsync(payload)
          setShowAdd(false)
          refetch()
        }}
      />

      <EditLabelModal
        open={editState.open}
        label={editState.label}
        onClose={() => setEditState({ open: false, label: null })}
        onSave={async (payload) => {
          await updateLabel.mutateAsync(payload)
          setEditState({ open: false, label: null })
          refetch()
        }}
      />
    </div>
  )
}
