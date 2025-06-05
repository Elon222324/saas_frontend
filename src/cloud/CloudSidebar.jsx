export default function CloudSidebar({ categories, active, onSelectCategory }) {
  return (
    <div className="w-48 border-r p-4 space-y-4">
      <input
        type="text"
        placeholder="Поиск"
        className="w-full border rounded px-2 py-1"
      />
      <ul className="space-y-1 text-sm">
        {categories.map(cat => (
          <li key={cat}>
            <button
              onClick={() => onSelectCategory(cat)}
              className={`w-full text-left px-2 py-1 rounded ${active === cat ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
      <button className="text-blue-600 text-sm">➕ Создать категорию</button>
    </div>
  )
}
