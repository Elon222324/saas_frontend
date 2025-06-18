// FILE: src/pages/Sites/SiteSettings/Products/components/Labels/LabelsList.jsx
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { useLabels } from '../../hooks/useLabels'
import { useLabelCrud } from './useLabelCrud'
import AddLabelModal from './AddLabelModal'
import EditLabelModal from './EditLabelModal'

export default function LabelsList({ siteName }) {
  const { data: labels = [], isFetching } = useLabels(siteName)
  const { add: addLabel, update: updateLabel, remove: deleteLabel } =
    useLabelCrud(siteName)

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

      {labels.length === 0 && !isFetching ? (
        <div className="rounded border border-dashed p-4 text-center">
          <p className="mb-2 text-sm text-gray-600">Вы ещё не добавили ни одной метки</p>
          <button
            onClick={() => setShowAdd(true)}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Добавить первую метку
          </button>
        </div>
      ) : (
        labels.map(label => (
          <div
            key={label.id}
            className={`flex items-center justify-between rounded border px-2 py-1 text-sm ${!label.is_active ? 'opacity-50' : ''}`}
            style={{ borderColor: label.color }}
          >
            <span className="flex items-center gap-2">
              <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: label.color }} />
              {label.name}
            </span>
            <span className="flex gap-1">
              <Pencil
                size={14}
                className="cursor-pointer hover:text-blue-600"
                onClick={() => setEditState({ open: true, label })}
              />
              <Trash2
                size={14}
                className="cursor-pointer hover:text-red-600"
                onClick={() =>
                  window.confirm(`Удалить «${label.name}»?`) && deleteLabel.mutateAsync(label.id)
                }
              />
            </span>
          </div>
        ))
      )}

      <AddLabelModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async payload => {
          await addLabel.mutateAsync(payload)
          setShowAdd(false)
        }}
      />

      <EditLabelModal
        open={editState.open}
        label={editState.label}
        onClose={() => setEditState({ open: false, label: null })}
        onSave={async payload => {
          await updateLabel.mutateAsync(payload)
          setEditState({ open: false, label: null })
        }}
      />

      {isFetching && (
        <div className="text-center text-xs text-gray-500">Загрузка…</div>
      )}
    </div>
  )
}
