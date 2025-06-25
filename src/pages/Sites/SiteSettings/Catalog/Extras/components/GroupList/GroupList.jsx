import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { useExtraGroups } from '../../hooks/useExtraGroups'
import { useExtraGroupCrud } from '../../hooks/useExtraGroupCrud'

import AddGroupModal from '../AddGroupModal'
import EditGroupModal from '../EditGroupModal'

export default function GroupList({ selected, onSelect }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: groups = [], isFetching } = useExtraGroups(siteName)
  const { add, update, remove } = useExtraGroupCrud(siteName)

  const [showAdd, setShowAdd] = useState(false)
  const [editState, setEditState] = useState({ open: false, group: null })

  return (
    <div className="relative h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-lg font-semibold text-gray-800">Группы добавок</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center rounded-full bg-blue-600 p-2 text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Добавить группу"
        >
          <Plus size={18} />
        </button>
      </div>
      <nav className="h-[calc(100%-80px)] space-y-1 overflow-y-auto px-2 pb-4">
        {groups.map((g) => (
          <div
            key={g.id}
            className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer transition-colors ${
              selected === g.id 
              ? 'bg-blue-100 font-semibold text-blue-800' 
              : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onSelect(g.id)}
          >
            <span>{g.name}</span>
            <span className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button 
                className="text-gray-500 hover:text-blue-600"
                aria-label={`Редактировать ${g.name}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setEditState({ open: true, group: g })
                }}
              >
                <Pencil size={14} />
              </button>
              <button
                className="text-gray-500 hover:text-red-600"
                aria-label={`Удалить ${g.name}`}
                onClick={async (e) => {
                  e.stopPropagation()
                  if (window.confirm(`Вы уверены, что хотите удалить группу «${g.name}»?`)) {
                    await remove.mutateAsync(g.id)
                  }
                }}
              >
                <Trash2 size={14} />
              </button>
            </span>
          </div>
        ))}
      </nav>

      <AddGroupModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async (payload) => {
          await add.mutateAsync(payload)
          setShowAdd(false)
        }}
      />

      <EditGroupModal
        open={editState.open}
        group={editState.group}
        onClose={() => setEditState({ open: false, group: null })}
        onSave={async (payload) => {
          await update.mutateAsync(payload)
          setEditState({ open: false, group: null })
        }}
      />

      {isFetching && (
        <div className="absolute inset-x-0 bottom-2 text-center text-xs text-gray-400">Загрузка…</div>
      )}
    </div>
  )
}
