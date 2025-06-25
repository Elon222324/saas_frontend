export default function ProductInfoForm({
  title,
  setTitle,
  order,
  setOrder,
  category,
  setCategory,
  categories,
  ImageField,
  imageUrl,
  setImageUrl,
  GalleryField,
  gallery,
  setGallery,
  description,
  setDescription,
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm mb-1">Название</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-2 py-1 mb-2" />
        <label className="block text-sm mb-1">Порядок</label>
        <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full rounded border px-2 py-1 mb-2" />
        <label className="block text-sm mb-1">Категория</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded border px-2 py-1 mb-2">
          <option value="" disabled>Выберите категорию</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.path}</option>)}
        </select>
        <ImageField label="Основное фото" value={imageUrl} onChange={setImageUrl} category="products" />
        <GalleryField label="Галерея" value={gallery} onChange={setGallery} category="products" />
      </div>
      <div>
        <label className="mb-1 block text-sm">Краткое описание</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mb-2 w-full rounded border px-2 py-1" />
      </div>
    </div>
  )
}
