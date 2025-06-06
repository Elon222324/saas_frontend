import { Trash2, Pencil } from 'lucide-react'

export default function CloudFileCard({ file, isSelected, onSelect }) {
  const fallback = 'https://placehold.co/150x100?text=Image+Not+Found'

  return (
    <div
      onClick={() => onSelect(file)}
      className={`relative border rounded p-2 cursor-pointer hover:border-blue-500 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <img
        src={file.url}
        alt={file.name}
        onError={(e) => {
          e.target.onerror = null
          e.target.src = fallback
        }}
        className="w-full h-24 object-cover rounded"
      />
      <p className="mt-1 text-sm truncate">{file.name}</p>
      <div className="absolute top-1 right-1 flex gap-1 opacity-0 hover:opacity-100">
        <button className="bg-white rounded p-1 shadow">
          <Trash2 size={14} />
        </button>
        <button className="bg-white rounded p-1 shadow">
          <Pencil size={14} />
        </button>
      </div>
    </div>
  )
}
