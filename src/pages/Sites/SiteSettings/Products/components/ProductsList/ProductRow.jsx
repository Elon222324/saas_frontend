import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Edit2, Trash2, GripVertical } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import slugify from 'slugify'

const toPublicUrl = (raw = '', siteName) => {
  if (!raw) return null
  if (/^https?:\/\//i.test(raw) && !raw.includes(`${siteName}:8001`)) return raw
  const base = import.meta.env.VITE_CLOUD_CDN || import.meta.env.VITE_ASSETS_URL || ''
  if (!base) return raw.startsWith('/') ? raw : `/${raw}`
  return `${base.replace(/\/$/, '')}/${raw.replace(/^\//, '')}`
}

export default function ProductRow({
  product,
  checked,
  onCheck,
  onEdit,
  onDelete,
  categoryName,
  categoryOptions,
  labelsMap,
  labelsList,
  dragHandleProps,
  draggableProps,
  innerRef,
  onToggleStatus,
  onInlineUpdate,
}) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const [editTitle, setEditTitle] = useState(false)
  const [titleVal, setTitleVal] = useState('')
  const [editPrice, setEditPrice] = useState(false)
  const [priceVal, setPriceVal] = useState('')
  const [editWeight, setEditWeight] = useState(false)
  const [weightVal, setWeightVal] = useState('')
  const [editCategory, setEditCategory] = useState(false)
  const [categoryVal, setCategoryVal] = useState('')
  const [editLabels, setEditLabels] = useState(false)
  const [labelsVal, setLabelsVal] = useState([])

  const getFullPayload = (changes = {}) => ({
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price,
    old_price: product.old_price,
    currency: product.currency,
    description: product.description,
    full_description: product.full_description,
    image_url: product.image_url,
    gallery: product.gallery,
    is_available: product.is_available,
    active: product.active,
    category_id: product.category_id,
    labels: product.labels,
    rating: product.rating,
    rating_count: product.rating_count,
    weight: product.weight,
    props: typeof product.props === 'string' ? {} : product.props,
    extras: Array.isArray(product.extras) ? product.extras : [],
    ...changes,
  })

  const saveTitle = async () => {
    const val = titleVal.trim()
    setEditTitle(false)
    if (val && val !== product.title) {
      await onInlineUpdate(product.id, getFullPayload({
        title: val,
        slug: slugify(val, { lower: true, strict: true }),
      }))
    }
  }

  const savePrice = async () => {
    const num = parseFloat(priceVal)
    setEditPrice(false)
    if (!Number.isNaN(num) && num !== product.price) {
      await onInlineUpdate(product.id, getFullPayload({ price: num }))
    }
  }

  const saveWeight = async () => {
    const val = weightVal.trim()
    setEditWeight(false)
    if (val !== product.weight) {
      await onInlineUpdate(product.id, getFullPayload({ weight: val }))
    }
  }

  const saveCategory = async () => {
    setEditCategory(false)
    if (categoryVal && categoryVal !== String(product.category_id)) {
      await onInlineUpdate(product.id, getFullPayload({ category_id: categoryVal }))
    }
  }

  const saveLabels = async () => {
    setEditLabels(false)
    const original = Array.isArray(product.labels) ? product.labels : []
    if (JSON.stringify(original) !== JSON.stringify(labelsVal)) {
      await onInlineUpdate(product.id, getFullPayload({ labels: labelsVal }))
    }
  }

  const imgSrc = toPublicUrl(product.image_url, siteName)

  return (
    <tr
      ref={innerRef}
      {...draggableProps}
      className="hover:bg-gray-50 focus-within:bg-gray-50"
    >
      <td className="px-2 py-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onCheck(product.id)}
          className="focus:ring-blue-500"
        />
      </td>
      <td className="px-2 py-1 cursor-grab" {...dragHandleProps}>
        <GripVertical size={16} className="text-gray-400" />
      </td>
      <td className="px-2 py-1">
        {imgSrc ? (
          <img src={imgSrc} alt="" className="h-10 w-10 rounded object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">—</div>
        )}
      </td>
      <td
        className="max-w-[240px] truncate px-2 py-1 text-sm"
        onDoubleClick={() => {
          setTitleVal(product.title)
          setEditTitle(true)
        }}
      >
        {editTitle ? (
          <input
            autoFocus
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle()
              if (e.key === 'Escape') setEditTitle(false)
            }}
            className="w-full rounded border px-1 text-sm focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <>
            {product.title}
            {product.slug && (
              <div className="text-xs text-gray-500">{product.slug}</div>
            )}
          </>
        )}
      </td>
      <td className="px-2 py-1 whitespace-nowrap">
        <Switch
          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
          checked={Boolean(product.active)}
          onCheckedChange={(val) => 
            onToggleStatus(product.id, getFullPayload({ active: val }))
          }
        />
      </td>
      <td className="px-2 py-1 whitespace-nowrap">
        <Switch
          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
          checked={Boolean(product.is_available)}
          onCheckedChange={(val) => 
            onToggleStatus(product.id, getFullPayload({ is_available: val }))
          }
        />
      </td>
      <td
        className="px-2 py-1 whitespace-nowrap text-sm"
        onDoubleClick={() => {
          setPriceVal(String(product.price))
          setEditPrice(true)
        }}
      >
        {editPrice ? (
          <input
            type="number"
            autoFocus
            value={priceVal}
            onChange={(e) => setPriceVal(e.target.value)}
            onBlur={savePrice}
            onKeyDown={(e) => {
              if (e.key === 'Enter') savePrice()
              if (e.key === 'Escape') setEditPrice(false)
            }}
            className="w-20 rounded border px-1 text-sm focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <>
            {product.price}₽{' '}
            {product.old_price && (
              <s className="text-gray-400">{product.old_price}₽</s>
            )}
          </>
        )}
      </td>
      <td
        className="px-2 py-1 text-sm"
        onDoubleClick={() => {
          setLabelsVal(Array.isArray(product.labels) ? product.labels.map(String) : [])
          setEditLabels(true)
        }}
      >
        {editLabels ? (
          <select
            multiple
            autoFocus
            value={labelsVal}
            onChange={(e) =>
              setLabelsVal(Array.from(e.target.selectedOptions).map((o) => o.value))
            }
            onBlur={saveLabels}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveLabels()
              if (e.key === 'Escape') setEditLabels(false)
            }}
            className="w-40 rounded border px-1 text-xs focus:ring-2 focus:ring-blue-500"
            size={Math.min(labelsList.length, 4) || 4}
          >
            {labelsList.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex flex-wrap gap-1 text-xs">
            {product.labels?.map((lb) => {
              const l = labelsMap[lb] || {}
              return (
                <span
                  key={lb}
                  className="rounded px-1"
                  style={{ backgroundColor: l.bg_color || '#e5e7eb', color: l.text_color || '#111827' }}
                >
                  {l.name || lb}
                </span>
              )
            })}
          </div>
        )}
      </td>
      <td
        className="px-2 py-1 text-sm"
        onDoubleClick={() => {
          setCategoryVal(String(product.category_id || ''))
          setEditCategory(true)
        }}
      >
        {editCategory ? (
          <select
            autoFocus
            value={categoryVal}
            onChange={(e) => setCategoryVal(e.target.value)}
            onBlur={saveCategory}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveCategory()
              if (e.key === 'Escape') setEditCategory(false)
            }}
            className="w-40 rounded border px-1 text-sm focus:ring-2 focus:ring-blue-500"
          >
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.path}
              </option>
            ))}
          </select>
        ) : (
          categoryName || '—'
        )}
      </td>
      <td
        className="px-2 py-1 text-sm whitespace-nowrap"
        onDoubleClick={() => {
          setWeightVal(product.weight || '')
          setEditWeight(true)
        }}
      >
        {editWeight ? (
          <input
            autoFocus
            value={weightVal}
            onChange={(e) => setWeightVal(e.target.value)}
            onBlur={saveWeight}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveWeight()
              if (e.key === 'Escape') setEditWeight(false)
            }}
            className="w-20 rounded border px-1 text-sm focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          product.weight || '—'
        )}
      </td>
      <td className="px-2 py-1 text-right space-x-2">
        <button
          onClick={() => onEdit(product)}
          className="rounded p-1 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
          title="Редактировать"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="rounded p-1 hover:bg-gray-100 focus:ring-2 focus:ring-red-500"
          title="Удалить"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  )
}
