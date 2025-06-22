import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useOptions } from '../../hooks/useOptions'
import { useOptionGroupCrud } from '../../hooks/useOptionGroupCrud'
import { useOptionValueCrud } from '../../hooks/useOptionValueCrud'

import AddOptionGroupModal from '../AddOptionGroupModal'
import EditOptionGroupModal from '../EditOptionGroupModal'
import OptionValueModal from '../OptionValueModal'
import Toolbar from './Toolbar'
import BulkActionsBar from './BulkActionsBar'
import OptionTable from './OptionTable'
import Pagination from './Pagination'
import useOptionsList from './useOptionsList'

export default function OptionsList() {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: all = [], isFetching, isError, refetch } = useOptions(siteName)
  const { add, update, remove } = useOptionGroupCrud(siteName)
  const { add: addVal, update: updateVal, remove: deleteVal } = useOptionValueCrud(siteName)

  const [ordered, setOrdered] = useState([])

  useEffect(() => {
    setOrdered(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(all)) {
        return all
      }
      return prev
    })
  }, [all])

  const list = useOptionsList({ options: ordered, removeFn: remove.mutateAsync })

  const [showAdd, setShowAdd] = useState(false)
  const [edit, setEdit] = useState({ open: false, group: null })
  const [valueModal, setValueModal] = useState({ open: false, groupId: null, value: null })

  const handleReorder = async (from, to) => {
    let updated = []
    setOrdered(prev => {
      const start = (list.page - 1) * list.pageSize
      const arr = Array.from(prev)
      const [moved] = arr.splice(start + from, 1)
      arr.splice(start + to, 0, moved)
      updated = arr.map((p, idx) => ({ ...p, order: idx + 1 }))
      return updated
    })
    for (const g of updated) {
      // eslint-disable-next-line no-await-in-loop
      await update.mutateAsync({ id: g.id, order: g.order })
    }
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-600">Не удалось загрузить опции</p>
        <button
          onClick={() => refetch()}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {list.selected.size ? (
        <BulkActionsBar count={list.selected.size} onDelete={list.deleteSelected} />
      ) : (
        <Toolbar onAdd={() => setShowAdd(true)} search={list.search} onSearch={list.setSearch} />
      )}

      <OptionTable
        isFetching={isFetching}
        filtered={list.filtered}
        pageItems={list.pageItems}
        selected={list.selected}
        toggleSelect={list.toggleSelect}
        toggleSelectAll={list.toggleSelectAll}
        onEdit={(g) => setEdit({ open: true, group: g })}
        onDelete={(id) => remove.mutateAsync(id)}
        onAddValue={(gid) => setValueModal({ open: true, groupId: gid, value: null })}
        onEditValue={(val) => setValueModal({ open: true, groupId: val.group_id, value: val })}
        onDeleteValue={(id) => deleteVal.mutateAsync(id)}
        onReorder={handleReorder}
      />

      <Pagination page={list.page} totalPages={list.totalPages} setPage={list.setPage} />

      <AddOptionGroupModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={async payload => {
          await add.mutateAsync(payload)
          setShowAdd(false)
        }}
      />
      <EditOptionGroupModal
        open={edit.open}
        group={edit.group}
        onClose={() => setEdit({ open: false, group: null })}
        onSave={async payload => {
          await update.mutateAsync(payload)
          setEdit({ open: false, group: null })
        }}
      />
      <OptionValueModal
        open={valueModal.open}
        value={valueModal.value}
        onClose={() => setValueModal({ open: false, groupId: null, value: null })}
        onSave={async (val) => {
          if (valueModal.value) {
            await updateVal.mutateAsync({ id: valueModal.value.id, value: val })
          } else {
            await addVal.mutateAsync({ group_id: valueModal.groupId, value: val })
          }
          setValueModal({ open: false, groupId: null, value: null })
        }}
      />
    </div>
  )
}
