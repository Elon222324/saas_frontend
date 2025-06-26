import { fieldTypes } from '@/components/fields/fieldTypes'

export default function ProductInfoForm({
  title,
  setTitle,
  order,
  setOrder,
  categories,
  category,
  setCategory,
  imageUrl,
  setImageUrl,
  active,
  setActive,
  msg
}) {
  const ImageField = fieldTypes.image || (() => null)

  return (
    <div>
      <label className="mb-1 block text-sm">Название</label>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="mb-1 w-full rounded border px-2 py-1"
      />
      {msg && (
        <p className={`mb-2 text-sm ${msg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{msg.text}</p>
      )}
      <ImageField
        label="Основное фото"
        value={imageUrl}
        onChange={setImageUrl}
        category="products"
        className="mb-2"
      />
      <label className="mb-1 block text-sm">Порядок</label>
      <input
        type="number"
        value={order}
        onChange={e => setOrder(Number(e.target.value))}
        className="mb-2 w-full rounded border px-2 py-1"
      />
      <label className="mb-1 block text-sm">Категория</label>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="mb-2 w-full rounded border px-2 py-1"
      >
        <option value="" disabled>
          Выберите категорию
        </option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.path}
          </option>
        ))}
      </select>
      <label className="mb-1 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={e => setActive(e.target.checked)}
        />
        Активен
      </label>
    </div>
  )
}
