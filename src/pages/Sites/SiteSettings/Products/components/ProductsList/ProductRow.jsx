import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit2, Trash2 } from 'lucide-react'

export default function ProductRow({
  product,
  checked,
  onCheck,
  onEdit,
  onDelete,
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <tr className="hover:bg-gray-50 focus-within:bg-gray-50">
      <td className="px-2 py-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onCheck(product.id)}
          className="focus:ring-blue-500"
        />
      </td>
      <td className="px-2 py-1">
        {product.image_url ? (
          <img src={product.image_url} alt="" className="h-10 w-10 object-cover rounded" />
        ) : (
          <div className="h-10 w-10 rounded bg-gray-200" />
        )}
      </td>
      <td className="px-2 py-1 text-sm">{product.title}</td>
      <td className="px-2 py-1 text-sm whitespace-nowrap">{product.price}₽</td>
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
              className="flex w-full items-center gap-1 px-2 py-1 text-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <Trash2 size={14} /> Удалить
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}
