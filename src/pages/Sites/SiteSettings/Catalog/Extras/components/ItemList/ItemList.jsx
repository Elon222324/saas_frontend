import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { useExtraItems } from '../../hooks/useExtraItems'
import { useExtraItemCrud } from '../../hooks/useExtraItemCrud'

import AddItemModal from '../AddItemModal'
import EditItemModal from '../EditItemModal'

export default function ItemList({ groupId }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: items = [], isFetching } = useExtraItems(siteName, groupId)
  const { add, update, remove } = useExtraItemCrud(siteName)

  const [showAdd, setShowAdd] = useState(false)
  const [editState, setEditState] = useState({ open: false, item: null })

  if (!groupId) {
    return <div className="p-4 text-gray-500">Выберите группу</div>
  }

  return (
    <div className="relative h-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Добавки</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="rounded bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700"
        >
          <Plus size={16} />
        </button>
      </div>

      <table className="w-full border text-sm">
        <tbody>
          {items.map((v) => (
            <tr key={v.id} className="border-b hover:bg-gray-50">
              <td className="px-2 py-1">{v.name}</td>
              <td className="px-2 py-1 w-24 text-right">{v.price}</td>
              <td className="w-16 px-2 py-1 text-right">
                <span className="flex gap-1 justify-end">
                  <Pencil
                    size={14}
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => setEditState({ open: true, item: v })}
                  />
                  <Trash2
                    size={14}
                    className="cursor-pointer hover:text-red-600"
                    onClick={async () => {
                      if (window.confirm('Удалить значение?')) {
                        await remove.mutateAsync({ id: v.id, group_id: groupId })
                      }
                    }}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddItemModal
        open={showAdd}
        groupId={groupId}
        onClose={() => setShowAdd(false)}
        onSave={async (payload) => {
          await add.mutateAsync(payload)
          setShowAdd(false)
        }}
      />

      <EditItemModal
        open={editState.open}
        item={editState.item}
        onClose={() => setEditState({ open: false, item: null })}
        onSave={async (payload) => {
          await update.mutateAsync(payload)
          setEditState({ open: false, item: null })
        }}
      />

      {isFetching && (
        <div className="absolute inset-x-0 bottom-2 text-center text-xs text-gray-500">Загрузка…</div>
      )}
    </div>
  )
}
