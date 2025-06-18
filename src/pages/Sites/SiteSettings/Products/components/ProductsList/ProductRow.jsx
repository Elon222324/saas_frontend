import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MoreVertical, Edit2, Trash2, GripVertical } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

// преобразуем внутренний/относительный путь в публичный URL
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
  dragHandleProps,
  draggableProps,
  innerRef,
  onToggleStatus,
}) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

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
      <td className="max-w-[240px] truncate px-2 py-1 text-sm">
        {product.title}
        {product.slug && (
          <div className="text-xs text-gray-500">{product.slug}</div>
        )}
      </td>
      <td className="px-2 py-1 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Switch
            checked={Boolean(product.active)}
            onCheckedChange={(val) => onToggleStatus(product.id, { active: val })}
          />
          {product.is_available !== undefined && (
            <Switch
              checked={Boolean(product.is_available)}
              onCheckedChange={(val) =>
                onToggleStatus(product.id, { is_available: val })
              }
            />
          )}
        </div>
      </td>
      <td className="px-2 py-1 whitespace-nowrap text-sm">
        {product.price}₽{' '}
        {product.old_price && (
          <s className="text-gray-400">{product.old_price}₽</s>
        )}
      </td>
      <td className="px-2 py-1 text-sm">
        {product.labels?.map((lb) => (
          <span
            key={lb}
            className="mr-1 rounded bg-blue-100 px-1 text-xs text-blue-800"
          >
            {lb}
          </span>
        ))}
      </td>
      <td className="px-2 py-1 text-sm">{categoryName || '—'}</td>
      <td className="px-2 py-1 text-sm whitespace-nowrap">
        {product.weight || '—'}
      </td>
      <td className="relative px-2 py-1 text-right">
        <button
          className="rounded p-1 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
          onClick={() => setOpen((v) => !v)}
        >
          <MoreVertical size={16} />
        </button>
        {open && (
          <div
            ref={menuRef}
            className="absolute right-0 z-10 mt-1 w-28 rounded border bg-white py-1 shadow-md"
          >
            <button
              onClick={() => {
                setOpen(false)
                onEdit(product)
              }}
              className="flex w-full items-center gap-1 px-2 py-1 text-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <Edit2 size={14} /> Редактировать
            </button>
            <button
              onClick={() => {
                setOpen(false)
                onDelete(product.id)
              }}
              className="flex w-full items-center gap-1 px-2 py-1 text-sm hover:bg-gray-100 focus:ring-2 focus:ring-red-500"
            >
              <Trash2 size={14} /> Удалить
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}
