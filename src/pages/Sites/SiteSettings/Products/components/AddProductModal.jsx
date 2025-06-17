import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import slugify from 'slugify'
import { fieldTypes } from '@/components/fields/fieldTypes'

import { useCategories } from '../hooks/useCategories'

const modalRoot =
  document.getElementById('modal-root') ||
  (() => {
    const el = document.createElement('div')
    el.id = 'modal-root'
    document.body.appendChild(el)
    return el
  })()

export default function AddProductModal({ open, onClose, onSave, categoryId }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: tree = [] } = useCategories(siteName)

  // ────────────────────────────────────────────────────────────
  //   Helpers
  // ────────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const list = []
    const walk = (nodes, prefix = '') =>
      nodes.forEach((n) => {
        const path = prefix ? `${prefix} / ${n.name}` : n.name
        list.push({ id: n.id, path })
        if (n.children?.length) walk(n.children, path)
      })
    walk(tree)
    return list
  }, [tree])

  // ────────────────────────────────────────────────────────────
  //   Local state
  // ────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [weight, setWeight] = useState('')
  const [category, setCategory] = useState('')
  const [active, setActive] = useState(true)
  const [msg, setMsg] = useState(null)

  // reset on modal toggle
  useEffect(() => {
    if (!open) {
      setTitle('')
      setPrice('')
      setImageUrl('')
      setDescription('')
      setWeight('')
      setCategory('')
      setActive(true)
      setMsg(null)
    } else {
      setCategory(categoryId ?? '')
    }
  }, [open, categoryId])

  if (!open) return null

  // ────────────────────────────────────────────────────────────
  //   Submit with auto‑suffix slug if 409
  // ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const t = title.trim()
    const p = parseFloat(price)
    const cId = category
    const w = weight.trim()

    if (!t || isNaN(p) || !cId) return

    const baseSlug = slugify(t, { lower: true, strict: true })

    const commonPayload = {
      title: t,
      price: p,
      image_url: imageUrl || undefined,
      description: description.trim() || undefined,
      weight: w || undefined,
      category_id: String(cId),
      active,
    }

    let attempt = 0
    const maxAttempts = 10
    while (attempt < maxAttempts) {
      const currentSlug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`
      try {
        await Promise.resolve(onSave({ ...commonPayload, slug: currentSlug }))
        setMsg({ text: `Товар добавлен (slug: ${currentSlug})`, type: 'success' })
        return
      } catch (err) {
        if (err?.status === 409) {
          attempt += 1
          continue
        }
        setMsg({ text: 'Не удалось сохранить товар', type: 'error' })
        return
      }
    }
    setMsg({ text: 'Не удалось уникализировать slug', type: 'error' })
  }

  // ────────────────────────────────────────────────────────────
  //   UI helpers
  // ────────────────────────────────────────────────────────────
  const ImageField = fieldTypes.image || (() => null)

  // ────────────────────────────────────────────────────────────
  //   UI
  // ────────────────────────────────────────────────────────────
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 rounded bg-white p-4 shadow-xl">
        <h3 className="mb-2 text-lg font-medium">Новый товар</h3>

        <label className="mb-1 block text-sm">Название</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название"
          className="mb-1 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
        />
        {msg && (
          <p className={`mb-2 text-sm ${msg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{msg.text}</p>
        )}

        <label className="mb-1 block text-sm">Цена</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mb-2 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
        />

        <ImageField
          key="image_url"
          label="Основное фото"
          value={imageUrl}
          onChange={setImageUrl}
          category="products"
        />

        <label className="mb-1 block text-sm">Краткое описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
        />

        <label className="mb-1 block text-sm">Вес/объём</label>
        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mb-2 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
        />

        <label className="mb-1 block text-sm">Категория</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-2 w-full rounded border px-2 py-1 focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Выберите категорию
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.path}
            </option>
          ))}
        </select>

        <label className="mb-1 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="focus:ring-blue-500"
          />
          Активен
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded px-3 py-1 text-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            Отмена
          </button>
          <button
            disabled={!title.trim() || !price || !category}
            onClick={handleSave}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
