// FILE: src/pages/Sites/SiteSettings/Products/components/Labels/LabelsList.jsx
// (Рекомендуемое имя файла для этого компонента в сайдбаре: LabelsListSidebar.jsx)

import { useState } from 'react'
import { Plus, Pencil, Trash, X } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query' // Удаляем useMutation отсюда, теперь он в хуке

import { useLabelCrud } from '../../hooks/useLabelCrud' // Импортируем новый хук

// --- Компонент модального окна для добавления/редактирования метки ---
// Это тот же компонент, что и раньше, но теперь он использует хук useLabelCrud
function LabelFormModal({ isOpen, onClose, siteName, labelToEdit, queryClient }) {
  const [name, setName] = useState(labelToEdit?.name || '')
  const [bgColor, setBgColor] = useState(labelToEdit?.bg_color || '#E0E0E0')
  const [textColor, setTextColor] = useState(labelToEdit?.text_color || '#000000')
  const [isActive, setIsActive] = useState(labelToEdit?.is_active ?? true)
  const [sortOrder, setSortOrder] = useState(labelToEdit?.sort_order || 0)

  const { add, update } = useLabelCrud(siteName) // Используем хук CRUD

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Название метки не может быть пустым.')
      return
    }

    const labelData = {
      name: name.trim(),
      bg_color: bgColor,
      text_color: textColor,
      is_active: isActive,
      sort_order: parseInt(sortOrder, 10) || 0
    }

    if (labelToEdit) {
      update.mutate({ id: labelToEdit.id, ...labelData }, { // Передаем id и данные
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          alert(`Ошибка обновления: ${error.message}`);
        }
      });
    } else {
      add.mutate(labelData, {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          alert(`Ошибка создания: ${error.message}`);
        }
      });
    }
  }

  if (!isOpen) return null

  const isMutating = add.isPending || update.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          {labelToEdit ? 'Редактировать метку' : 'Добавить метку'}
        </h2>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Закрыть"
        >
          <X size={24} />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Название метки</label>
            <input
              type="text"
              id="name"
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isMutating}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bgColor" className="mb-1 block text-sm font-medium text-gray-700">Цвет фона</label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    id="bgColor"
                    className="h-10 w-10 rounded-md border-none p-0"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    disabled={isMutating}
                />
                <input
                    type="text"
                    className="flex-1 rounded-md border border-gray-300 p-2 text-sm"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    aria-label="Цвет фона HEX"
                    disabled={isMutating}
                />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="textColor" className="mb-1 block text-sm font-medium text-gray-700">Цвет текста</label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    id="textColor"
                    className="h-10 w-10 rounded-md border-none p-0"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    disabled={isMutating}
                />
                <input
                    type="text"
                    className="flex-1 rounded-md border border-gray-300 p-2 text-sm"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    aria-label="Цвет текста HEX"
                    disabled={isMutating}
                />
            </div>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isActive"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isMutating}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Активно</label>
          </div>
          <div className="mb-6">
            <label htmlFor="sortOrder" className="mb-1 block text-sm font-medium text-gray-700">Порядок сортировки</label>
            <input
              type="number"
              id="sortOrder"
              className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              disabled={isMutating}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              disabled={isMutating}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isMutating}
            >
              {labelToEdit ? 'Сохранить изменения' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- Основной компонент списка меток для сайдбара ---
export default function LabelsList({ siteName }) {
  const queryClient = useQueryClient() // Still need queryClient for invalidateQueries manually if needed by parent
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [labelToEdit, setLabelToEdit] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { getLabels, remove } = useLabelCrud(siteName) // Используем хук CRUD

  const {
    data: labels,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['labels', siteName],
    queryFn: getLabels, // Теперь вызываем getLabels из хука
  })

  const handleDelete = (id, name) => {
    if (window.confirm(`Вы уверены, что хотите удалить метку "${name}"? Это действие необратимо.`)) {
      remove.mutate(id, {
        onError: (err) => alert(`Ошибка удаления: ${err.message}`),
      });
    }
  }

  const handleEdit = (label) => {
    setLabelToEdit(label)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setLabelToEdit(null) // Сбросить, чтобы добавить новую метку
    setIsModalOpen(true)
  }

  const filteredLabels = labels?.filter(label =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) return <div className="p-4 text-gray-500">Загрузка меток...</div>
  if (isError) return <div className="p-4 text-red-500">Ошибка загрузки меток: {error.message}</div>

  return (
    <div className="space-y-4 p-2">
      <header className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Метки товаров</h3>
        <button
          className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          onClick={handleAdd}
        >
          <Plus size={14} /> Добавить
        </button>
      </header>

      {/* Поиск */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск метки..."
          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredLabels && filteredLabels.length > 0 ? (
        <div className="space-y-2">
          {filteredLabels.map((label) => (
            <div
              key={label.id}
              className="flex items-center justify-between rounded border px-2 py-2 text-sm"
              style={{
                borderColor: label.bg_color,
                borderLeft: `4px solid ${label.bg_color}`,
                backgroundColor: label.bg_color + '1A',
              }}
            >
              <span className="flex items-center gap-2" style={{ color: label.text_color }}>
                <span
                  className="block h-3 w-3 rounded-full"
                  style={{ backgroundColor: label.bg_color }}
                  title={`Фон: ${label.bg_color}`}
                />
                {label.name}
                {/* Опционально: Количество товаров - требуется дополнительный API-запрос или включение в getLabels */}
                {/* <span className="ml-2 text-xs text-gray-500">(N товаров)</span> */}
              </span>
              <div className="flex items-center gap-2">
                <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                        label.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                    {label.is_active ? 'Активно' : 'Неактивно'}
                </span>
                <button
                  onClick={() => handleEdit(label)}
                  className="rounded-md p-1 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
                  title="Редактировать"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(label.id, label.name)}
                  className="rounded-md p-1 text-red-600 hover:bg-red-100 hover:text-red-800"
                  title="Удалить"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Нет меток. Нажмите "Добавить", чтобы создать новую.</div>
      )}

      <LabelFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        siteName={siteName}
        labelToEdit={labelToEdit}
        queryClient={queryClient} // Передаем queryClient в модальное окно
      />
    </div>
  )
}