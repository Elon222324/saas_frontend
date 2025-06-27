import { useState } from 'react'
import { useLibraryCategories } from '../../hooks/useLibraryCategories'
import { useLibraryCrud } from '../../hooks/useLibraryCrud'
import ImageUploadModal from '../ImageUploadModal'
import ImageEditModal from '../ImageEditModal'
import { Plus, Pencil, Trash } from 'lucide-react'

const ASSETS_BASE_URL = import.meta.env.VITE_LIBRARY_ASSETS_URL || ''

export default function LibraryList({ categoryCode }) {
  const { data = [], isLoading, isError } = useLibraryCategories()
  const { deleteImage } = useLibraryCrud()

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [imageToEdit, setImageToEdit] = useState(null)

  const current = data.find((cat) => cat.code === categoryCode)
  const images = current?.images || []

  const handleOpenEditModal = (image) => {
    setImageToEdit(image)
    setIsEditModalOpen(true)
  }

  const handleDeleteImage = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это изображение? Это действие необратимо.')) {
      try {
        await deleteImage.mutateAsync(id)
      } catch (error) {
        alert(`Не удалось удалить изображение: ${error.message}`)
      }
    }
  }

  const toFullUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${ASSETS_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
  }

  if (!categoryCode) {
    return <div className="p-4 text-sm text-center text-gray-500">Выберите категорию слева</div>
  }

  if (isLoading) {
    return <div className="p-4 text-sm text-center text-gray-500">Загрузка изображений...</div>
  }

  if (isError) {
    return <div className="p-4 text-sm text-center text-red-600">Ошибка загрузки изображений</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold truncate" title={current?.name}>{current?.name}</h2>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700"
        >
          <Plus size={16} />
          <span>Добавить</span>
        </button>
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg bg-gray-50">
          <p className="mb-4 text-sm text-gray-500">В этой категории пока нет изображений</p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700"
          >
            <Plus size={16} />
            <span>Загрузить первое изображение</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative overflow-hidden bg-white border rounded-md shadow-sm group">
              <img
                src={toFullUrl(img.small_url)}
                alt={img.alt_text || ''}
                className="object-cover w-full h-32 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-2 text-xs text-gray-700 truncate" title={img.filename}>
                {img.filename}
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-4 transition-opacity bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleOpenEditModal(img)}
                  className="p-2 text-white bg-black rounded-full bg-opacity-40 hover:bg-opacity-60"
                  title="Редактировать"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="p-2 text-white bg-black rounded-full bg-opacity-40 hover:bg-opacity-60"
                  title="Удалить"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        categoryId={current?.id}
      />
      <ImageEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        imageToEdit={imageToEdit}
      />
    </div>
  )
}
