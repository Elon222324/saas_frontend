// ValueList.jsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { useOptionValues } from '../../hooks/useOptionValues'
import { useOptionValueCrud } from '../../hooks/useOptionValueCrud'

import AddValueModal from '../AddValueModal'
import EditValueModal from '../EditValueModal'

// Принимаем новый проп `isPricing`
export default function ValueList({ groupId, isPricing }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: values = [], isFetching } = useOptionValues(siteName, groupId)
  const { add, update, remove } = useOptionValueCrud(siteName)

  const [showAdd, setShowAdd] = useState(false)
  const [editState, setEditState] = useState({ open: false, value: null })

  if (!groupId) {
    return <div className="p-4 text-gray-500">Выберите группу</div>
  }

  return (
    <div className="relative h-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Значения</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="rounded bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700"
        >
          <Plus size={16} />
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 text-left">Значение</th>
            <th className="px-2 py-1 text-left">Порядок</th>
            {/* Условно отображаем заголовок столбца */}
            {isPricing && <th className="px-2 py-1 text-left">Надбавка</th>}
            <th className="px-2 py-1 text-right w-16"></th>
          </tr>
        </thead>
        <tbody>
          {values.map((v) => (
            <tr key={v.id} className="border-b hover:bg-gray-50">
              <td className="px-2 py-1">{v.value}</td>
              <td className="px-2 py-1">{v.order}</td>
              {/* Условно отображаем ячейку с надбавкой */}
              {isPricing && (
                <td className="px-2 py-1">{v.price_diff ? `+${v.price_diff}₽` : '—'}</td>
              )}
              <td className="px-2 py-1 text-right">
                <span className="flex gap-1 justify-end">
                  <Pencil
                    size={14}
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => setEditState({ open: true, value: v })}
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

      <AddValueModal
        open={showAdd}
        groupId={groupId}
        isPricing={isPricing} // Передаем флаг в модальное окно
        onClose={() => setShowAdd(false)}
        onSave={async (payload) => {
          await add.mutateAsync(payload)
          setShowAdd(false)
        }}
      />

      <EditValueModal
        open={editState.open}
        valueItem={editState.value}
        isPricing={isPricing} // Передаем флаг в модальное окно
        onClose={() => setEditState({ open: false, value: null })}
        onSave={async (payload) => {
          await update.mutateAsync(payload)
          setEditState({ open: false, value: null })
        }}
      />

      {isFetching && (
        <div className="absolute inset-x-0 bottom-2 text-center text-xs text-gray-500">Загрузка…</div>
      )}
    </div>
  )
}
