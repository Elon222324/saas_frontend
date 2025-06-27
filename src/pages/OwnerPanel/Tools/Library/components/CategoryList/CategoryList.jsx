import { useLibraryCategories } from '../../hooks/useLibraryCategories'
import { useLibraryCrud } from '../../hooks/useLibraryCrud'
import { useState } from 'react'
import { Plus, Trash, Pencil } from 'lucide-react'
import CategoryModal from '../CategoryModal'

export default function CategoryList({ selected, onSelect }) {
  const { data = [], isLoading } = useLibraryCategories()
  const { deleteCategory } = useLibraryCrud()

  // Состояния для управления модальным окном
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState(null)

  // Открывает модальное окно в режиме создания
  const handleOpenCreateModal = () => {
    setCategoryToEdit(null)
    setIsModalOpen(true)
  }

  // Открывает модальное окно в режиме редактирования
  const handleOpenEditModal = (e, category) => {
    e.stopPropagation() // Предотвращаем выбор категории при клике на кнопку
    setCategoryToEdit(category)
    setIsModalOpen(true)
  }

  // Обработчик удаления с улучшенной обработкой ошибок
  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      try {
        await deleteCategory.mutateAsync(id)
      } catch (error) {
        // Показываем пользователю детальную ошибку с бэкенда
        alert(`Не удалось удалить категорию: ${error.message}`)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Основная кнопка для добавления новой категории */}
      <button
        onClick={handleOpenCreateModal}
        className="flex items-center justify-center w-full gap-2 px-2 py-2 text-sm font-medium text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700"
      >
        <Plus size={16} />
        <span>Добавить категорию</span>
      </button>

      {/* Список категорий */}
      {isLoading ? (
        <div className="text-sm text-gray-500">Загрузка...</div>
      ) : (
        <ul className="space-y-1 text-sm">
          {data.map((cat) => (
            <li
              key={cat.id} // Используем ID как более надежный ключ
              onClick={() => onSelect(cat.code)}
              className={`group flex items-center justify-between rounded px-2 py-1.5 cursor-pointer hover:bg-purple-50 ${
                selected === cat.code
                  ? 'bg-purple-100 text-purple-600 font-semibold'
                  : ''
              }`}
            >
              <span className="truncate" title={cat.name}>{cat.name}</span>

              {/* Кнопки действий, появляются при наведении на родительский li */}
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleOpenEditModal(e, cat)}
                  className="text-gray-400 hover:text-blue-600"
                  title="Редактировать"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, cat.id)}
                  className="text-gray-400 hover:text-red-600"
                  title="Удалить"
                >
                  <Trash size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Компонент модального окна */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={categoryToEdit}
      />
    </div>
  )
}