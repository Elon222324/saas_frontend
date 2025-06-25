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
  gallery,
  setGallery
}) {
  const ImageField = fieldTypes.image || (() => null)
  const GalleryField = fieldTypes.gallery || (() => null)

  return (
    <>
      <label className="block text-sm mb-1">Название</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border px-2 py-1 mb-2"
      />
      <label className="block text-sm mb-1">Порядок</label>
      <input
        type="number"
        value={order}
        onChange={(e) => setOrder(Number(e.target.value))}
        className="w-full rounded border px-2 py-1 mb-2"
      />
      <label className="block text-sm mb-1">Категория</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded border px-2 py-1 mb-2"
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
      <ImageField label="Основное фото" value={imageUrl} onChange={setImageUrl} category="products" />
      <GalleryField label="Галерея" value={gallery} onChange={setGallery} category="products" />
    </>
  )
}
