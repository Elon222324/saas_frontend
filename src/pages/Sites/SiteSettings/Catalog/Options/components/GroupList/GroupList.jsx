import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { useOptionGroups } from '../../hooks/useOptionGroups'
import { useOptionGroupCrud } from '../../hooks/useOptionGroupCrud'

import AddGroupModal from '../AddGroupModal'
import EditGroupModal from '../EditGroupModal'

export default function GroupList({ selected, onSelect }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: groups = [], isFetching, refetch } = useOptionGroups(siteName)
  const { add, update, remove } = useOptionGroupCrud(siteName)

  const [showAdd, setShowAdd] = useState(false)
  const [editState, setEditState] = useState({ open: false, group: null })

  return (
    <div className="relative h-full space-y-4">
      <div className="flex items-center justify-between px-2 pt-1">
        <h3 className="font-medium">Группы опций</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="rounded bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700"
        >
          <Plus size={16} />
        </button>
      </div>
      <nav className="space-y-1 overflow-y-auto px-2">
        {groups.map((g) => (
          <div
            key={g.id}
            className={`group flex items-center justify-between rounded px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 ${selected === g.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            onClick={() => onSelect(g.id)}
          >
            <span>{g.name}</span>
            <span className="flex gap-1 opacity-0 group-hover:opacity-100">
              <Pencil
                size={14}
                className="cursor-pointer hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditState({ open: true, group: g })
                }}
              />
              <Trash2
                size={14}
                className="cursor-pointer hover:text-red-600"
                onClick={async (e) => {
                  e.stopPropagation()
                  if (window.confirm(`Удалить «${g.name}»?`)) {
                    await remove.mutateAsync(g.id)
                  }
                }}
              />
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
        <div className="absolute inset-x-0 bottom-2 text-center text-xs text-gray-500">Загрузка…</div>
      )}
    </div>
  )
}
