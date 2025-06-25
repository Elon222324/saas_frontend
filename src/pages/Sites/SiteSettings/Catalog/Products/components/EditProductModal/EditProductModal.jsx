import { createPortal } from 'react-dom'
import useProductForm from './useProductForm'
import ProductInfoForm from './ProductInfoForm'
import ProductExtrasSelector from './ProductExtrasSelector'
import ProductVariantsManager from './ProductVariantsManager'

const modalRoot =
  document.getElementById('modal-root') ||
  (() => {
    const el = document.createElement('div')
    el.id = 'modal-root'
    document.body.appendChild(el)
    return el
  })()

export default function EditProductModal({ open, onClose, onSave, product }) {
  const form = useProductForm({ open, product, onSave, onClose })

  if (!open || !product) return null

  const {
    categories,
    allExtraGroups,
    title,
    setTitle,
    order,
    setOrder,
    category,
    setCategory,
    imageUrl,
    setImageUrl,
    gallery,
    setGallery,
    description,
    setDescription,
    selectedExtras,
    handleExtraChange,
    active,
    setActive,
    msg,
    handleSave,
    ...variantProps
  } = form

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[800px] max-h-[90vh] flex flex-col rounded bg-white shadow-xl">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Редактировать товар: {product.title}</h3>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ProductInfoForm
              title={title}
              setTitle={setTitle}
              order={order}
              setOrder={setOrder}
              categories={categories}
              category={category}
              setCategory={setCategory}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              gallery={gallery}
              setGallery={setGallery}
            />
            <ProductExtrasSelector
              allExtraGroups={allExtraGroups}
              selectedExtras={selectedExtras}
              onChange={handleExtraChange}
              description={description}
              setDescription={setDescription}
            />
          </div>

          <ProductVariantsManager {...variantProps} />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
            Активен
          </label>
        </div>
        <div className="flex justify-end items-center gap-2 border-t p-4 mt-auto">
          {msg && <p className={`mr-auto text-sm ${msg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{msg.text}</p>}
          <button onClick={onClose} className="rounded px-3 py-1 text-sm hover:bg-gray-100">Отмена</button>
          <button disabled={!title.trim() || !category} onClick={handleSave} className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50">Сохранить</button>
        </div>
      </div>
    </div>,
    modalRoot
  )
}
