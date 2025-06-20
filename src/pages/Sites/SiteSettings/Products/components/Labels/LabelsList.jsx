import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useLabelCrud } from '../../hooks/useLabelCrud'
import LabelItem from './LabelItem'
import LabelFormModal from './LabelFormModal'
import LabelToolbar from './LabelToolbar'

export default function LabelsList({ siteName, selected, onSelect }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [labelToEdit, setLabelToEdit] = useState(null)
  const [search, setSearch] = useState('')

  const { getLabels, remove } = useLabelCrud(siteName)

  const { data: labels = [], isLoading, isError, error } = useQuery({
    queryKey: ['labels', siteName],
    queryFn: getLabels,
  })

  const handleDelete = (id, name) => {
    if (window.confirm(`Вы уверены, что хотите удалить метку "${name}"? Это действие необратимо.`)) {
      remove.mutate(id, { onError: (err) => alert(`Ошибка удаления: ${err.message}`) })
    }
  }

  const handleEdit = (label) => {
    setLabelToEdit(label)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setLabelToEdit(null)
    setIsModalOpen(true)
  }

  const filtered = labels.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))

  const list = [{ id: 'no_label', name: 'Без меток', bg_color: '#e5e7eb', text_color: '#111827', is_active: true, system: true }, ...filtered]

  if (isLoading) return <div className="p-4 text-gray-500">Загрузка меток...</div>
  if (isError) return <div className="p-4 text-red-500">Ошибка загрузки меток: {error.message}</div>

  return (
    <div className="space-y-4 p-2">
      <LabelToolbar onAddClick={handleAdd} search={search} setSearch={setSearch} />

      {list && list.length > 0 ? (
        <div className="space-y-2">
          {list.map((label) => (
            <LabelItem
              key={label.id}
              label={label}
              selected={selected}
              onSelect={(id) => onSelect(id === 'no_label' ? 'no_label' : Number(id))}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Нет меток. Нажмите \"Добавить\", чтобы создать новую.</div>
      )}

      <LabelFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        siteName={siteName}
        label={labelToEdit}
      />
    </div>
  )
}
