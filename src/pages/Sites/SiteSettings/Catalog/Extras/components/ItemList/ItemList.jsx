import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'

// Предполагается, что хуки находятся в ../../hooks/
import { useExtraItems } from '../../hooks/useExtraItems'
import { useExtraItemCrud } from '../../hooks/useExtraItemCrud'

import AddItemModal from '../AddItemModal'
import EditItemModal from '../EditItemModal'

// ВАША ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ URL ИЗОБРАЖЕНИЯ
const toPublicUrl = (raw = '', siteName) => {
  if (!raw) return null
  if (/^https?:\/\//i.test(raw) && !raw.includes(`${siteName}:8001`)) return raw
  const base = import.meta.env.VITE_CLOUD_CDN || import.meta.env.VITE_ASSETS_URL || ''
  if (!base) return raw.startsWith('/') ? raw : `/${raw}`
  return `${base.replace(/\/$/, '')}/${raw.replace(/^\//, '')}`
}


export default function ItemList({ groupId }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  // API уже отдает отсортированные данные, так как мы исправили бэкенд
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

      <table className="w-full border-collapse text-sm">
        {/* ИЗМЕНЕНО: Добавлены заголовки для новых колонок */}
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="px-2 py-1 font-medium">Фото</th>
            <th className="px-2 py-1 font-medium">Название</th>
            <th className="px-2 py-1 font-medium text-right">Цена</th>
            <th className="px-2 py-1 font-medium text-right">Порядок</th>
            <th className="w-16 px-2 py-1 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((v) => {
            const imgSrc = toPublicUrl(v.image_url, siteName)
            return (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                {/* ДОБАВЛЕНО: Колонка с изображением */}
                <td className="w-16 px-2 py-1">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={v.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                      Фото
                    </div>
                  )}
                </td>
                <td className="px-2 py-1">{v.name}</td>
                <td className="w-24 px-2 py-1 text-right">{v.price}</td>
                {/* ДОБАВЛЕНО: Колонка с порядком */}
                <td className="w-24 px-2 py-1 text-right">{v.order}</td>
                <td className="w-16 px-2 py-1 text-right">
                  <span className="flex items-center justify-end gap-2">
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
            )
          })}
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
        <div className="absolute inset-x-0 bottom-2 text-center text-xs text-gray-500">
          Загрузка…
        </div>
      )}
    </div>
  )
}
