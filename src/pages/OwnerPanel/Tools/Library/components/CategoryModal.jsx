import { useState, useEffect } from 'react'
import BaseModal from './BaseModal'
import { useLibraryCrud } from '../hooks/useLibraryCrud'
import slugify from 'slugify'

export default function CategoryModal({ isOpen, onClose, categoryToEdit }) {
  const { addCategory, updateCategory } = useLibraryCrud()
  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    category_type: 'library',
    display_order: 0,
  })

  const isEditing = !!categoryToEdit
  const isLoading = addCategory.isPending || updateCategory.isPending

  useEffect(() => {
    if (isEditing) {
      setForm({
        code: categoryToEdit.code || '',
        name: categoryToEdit.name || '',
        description: categoryToEdit.description || '',
        category_type: categoryToEdit.category_type || 'library',
        display_order: categoryToEdit.display_order ?? 0,
      })
    } else {
      setForm({
        code: '',
        name: '',
        description: '',
        category_type: 'library',
        display_order: 0,
      })
    }
  }, [categoryToEdit, isOpen])

  const handleChange = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return

    const payload = {
      ...form,
      name,
      code: form.code.trim() || slugify(name, { lower: true, strict: true }),
      description: form.description?.trim(),
      display_order: parseInt(form.display_order, 10) || 0,
    }

    try {
      if (isEditing) {
        await updateCategory.mutateAsync({ id: categoryToEdit.id, ...payload })
      } else {
        await addCategory.mutateAsync(payload)
      }
      onClose()
    } catch (error) {
      console.error('Ошибка при сохранении категории:', error)
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Редактировать категорию' : 'Создать новую категорию'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 px-1 py-2 text-sm">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="mb-1 block font-medium text-gray-700">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700">Код</label>
            <input
              type="text"
              placeholder="Автогенерация при пустом"
              value={form.code}
              onChange={(e) => handleChange('code', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm text-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700">Тип категории</label>
            <input
              type="text"
              value={form.category_type}
              onChange={(e) => handleChange('category_type', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-700">Порядок отображения</label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) => handleChange('display_order', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isEditing ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}
