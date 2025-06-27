import { useState } from 'react'
import BaseModal from './BaseModal'
import { useLibraryCrud } from '../hooks/useLibraryCrud'

export default function ImageUploadModal({ isOpen, onClose, categoryId }) {
  const { uploadImage } = useLibraryCrud()
  const [file, setFile] = useState(null)
  const [altText, setAltText] = useState('')
  const [description, setDescription] = useState('')
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleClose = () => {
    setFile(null)
    setAltText('')
    setDescription('')
    setPreview(null)
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !categoryId) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('category_id', categoryId)
    formData.append('alt_text', altText)
    formData.append('description', description)

    await uploadImage.mutateAsync(formData)
    handleClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Загрузить изображение"
    >
      <form onSubmit={handleSubmit} className="space-y-4 px-1 py-2 text-sm">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Файл изображения</label>
            <label className="relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
              {preview ? (
                <img src={preview} alt="Превью" className="object-contain w-full h-full" />
              ) : (
                <span className="text-gray-400">Нажмите для выбора файла</span>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0"
                required
              />
            </label>
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
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            disabled={uploadImage.isPending}
          >
            Загрузить
          </button>
        </div>
      </form>
    </BaseModal>
  )
}
