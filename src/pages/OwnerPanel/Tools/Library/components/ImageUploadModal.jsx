import { useState, useEffect } from 'react'
import BaseModal from './BaseModal'
import { useLibraryCrud } from '../hooks/useLibraryCrud'

export default function ImageUploadModal({ isOpen, onClose, categoryId }) {
  const { uploadImage } = useLibraryCrud()

  // 1. Изменяем состояние для хранения нескольких файлов
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [altText, setAltText] = useState('')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // Функция для очистки состояния при закрытии модального окна
  const handleClose = () => {
    setFiles([])
    setPreviews([])
    setAltText('')
    setDescription('')
    setIsUploading(false)
    onClose()
  }

  // Освобождаем память от созданных URL при размонтировании
  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url))
  }, [previews])


  // 3. Обновляем логику для обработки нескольких файлов
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length) {
      setFiles(selectedFiles)
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
      setPreviews(newPreviews)
    }
  }

  // 4. Реализуем параллельную загрузку всех файлов
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (files.length === 0 || !categoryId) return

    setIsUploading(true)

    const uploadPromises = files.map(file => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category_id', categoryId)
      // Применяем один и тот же alt и описание ко всем файлам
      formData.append('alt_text', altText)
      formData.append('description', description)
      return uploadImage.mutateAsync(formData)
    })

    try {
      await Promise.all(uploadPromises)
      handleClose()
    } catch (error) {
      console.error("Ошибка при загрузке одного или нескольких файлов:", error)
      alert("Не удалось загрузить один или несколько файлов. Проверьте консоль для деталей.")
      setIsUploading(false)
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Массовая загрузка изображений"
    >
      <form onSubmit={handleSubmit} className="space-y-4 px-1 py-2 text-sm">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Файлы изображений</label>
            <label className="relative flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 min-h-[10rem] cursor-pointer">
              {previews.length > 0 ? (
                // 5. Отображаем превью для всех выбранных изображений
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {previews.map((src, index) => (
                    <div key={index} className="relative aspect-square">
                        <img src={src} alt={`Превью ${index + 1}`} className="object-contain w-full h-full rounded-md" />
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-center text-gray-400">Нажмите для выбора одного или нескольких файлов</span>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0"
                required
                multiple // 2. Добавляем атрибут 'multiple' в input
              />
            </label>
            {files.length > 0 && <p className="text-xs text-gray-500 mt-2">Выбрано файлов: {files.length}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Категория</label>
            <input
              type="text"
              value={categoryId || ''}
              disabled
              className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-600 shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="img-alt" className="block mb-1 font-medium text-gray-700">Alt текст (для SEO)</label>
            <input
              id="img-alt"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            <p className="text-xs text-gray-500 mt-1">Этот текст будет применен ко всем загружаемым изображениям.</p>
          </div>

          <div>
            <label htmlFor="img-desc" className="block mb-1 font-medium text-gray-700">Описание</label>
            <textarea
              id="img-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
             <p className="text-xs text-gray-500 mt-1">Это описание будет применено ко всем загружаемым изображениям.</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            disabled={isUploading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? `Загрузка... (${files.length})` : 'Загрузить все'}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}