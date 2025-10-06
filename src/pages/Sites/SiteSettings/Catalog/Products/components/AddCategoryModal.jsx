import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import slugify from 'slugify'
import { fieldTypes } from '@/components/fields/fieldTypes'

const modalRoot =
  document.getElementById('modal-root') ??
  (() => {
    const el = document.createElement('div')
    el.id = 'modal-root'
    document.body.appendChild(el)
    return el
  })()

export default function AddCategoryModal({ open, onClose, onSave, parents }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parent, setParent] = useState(null)
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [loading, setLoading] = useState(false)
  const [autoSlug, setAutoSlug] = useState(true)

  const ImageField = fieldTypes.image || (() => null)
  const TextAreaField = fieldTypes.textarea || (() => null)

  useEffect(() => {
    if (!open) {
      setName('')
      setSlug('')
      setParent(null)
      setCode('')
      setDescription('')
      setImageUrl('')
      setDisplayOrder(0)
      setLoading(false)
      setAutoSlug(true)
    }
  }, [open])

  // Автоматическая генерация slug из name
  useEffect(() => {
    if (autoSlug && name) {
      setSlug(slugify(name, { lower: true, locale: 'ru' }))
    }
  }, [name, autoSlug])

  if (!open) return null

  const handleSave = async () => {
    const val = name.trim()
    const slugVal = slug.trim()
    
    if (!val || !slugVal) {
      alert('Название и slug обязательны')
      return
    }
    
    // Проверка валидности slug (только строчные буквы, цифры и дефисы)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugVal)) {
      alert('Slug может содержать только строчные буквы, цифры и дефисы. Не может начинаться или заканчиваться дефисом.')
      return
    }
    
    // Проверка длины code (макс 64 символа согласно API)
    if (code.trim() && code.trim().length > 64) {
      alert('Код не может быть длиннее 64 символов')
      return
    }
    
    setLoading(true)
    try {
      const payload = {
        slug: slugVal,
        name: val,
        parent_id: parent,
      }
      
      // Добавляем опциональные поля только если они заполнены
      if (code.trim()) payload.code = code.trim()
      if (description.trim()) payload.description = description.trim()
      if (imageUrl) payload.image_url = imageUrl
      payload.display_order = displayOrder
      
      await onSave(payload)
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[500px] max-h-[90vh] rounded bg-white p-4 shadow-xl flex flex-col">
        <h3 className="mb-4 text-lg font-medium">Новая категория</h3>

        <div className="overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Название *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название"
              className="w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Slug (URL) *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                setAutoSlug(false) // Отключаем автогенерацию при ручном вводе
              }}
              placeholder="например: pizza"
              className="w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Используется в URL. Только строчные буквы, цифры и дефисы.
              {autoSlug && ' (генерируется автоматически)'}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Код для интеграций</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Например: PIZZA"
              maxLength={64}
              className="w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">Опционально, макс 64 символа</p>
          </div>

          <div>
            <TextAreaField
              label="Описание"
              value={description}
              onChange={setDescription}
              placeholder="Описание категории"
              disabled={loading}
            />
          </div>

          <div>
            <ImageField
              label="Изображение категории"
              value={imageUrl}
              onChange={setImageUrl}
              category="categories"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Порядок сортировки</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">По умолчанию 0</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Родитель</label>
            <select
              value={parent ?? ''}
              onChange={(e) =>
                setParent(e.target.value === '' ? null : Number(e.target.value))
              }
              className="w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Без родителя</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.path}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
          >
            Отмена
          </button>
          <button
            disabled={!name.trim() || !slug.trim() || loading}
            onClick={handleSave}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
