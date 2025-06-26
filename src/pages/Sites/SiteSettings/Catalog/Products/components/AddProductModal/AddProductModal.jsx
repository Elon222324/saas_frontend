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

export default function AddProductModal({ open, onClose, onSave, categoryId }) {
  const form = useProductForm({ open, onSave, onClose, categoryId })

  if (!open) return null

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
    description,
    setDescription,
    active,
    setActive,
    msg,
    selectedExtras,
    handleExtraChange,
    handleSave,
    ...variantProps
  } = form

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[800px] max-h-[90vh] flex flex-col rounded bg-white shadow-xl">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Новый товар</h3>
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
              active={active}
              setActive={setActive}
              msg={msg}
            />
            <ProductExtrasSelector
              allExtraGroups={allExtraGroups}
              selectedExtras={selectedExtras}
              onChange={handleExtraChange}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Краткое описание</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="mb-2 w-full rounded border px-2 py-1"
            />
          </div>

          <ProductVariantsManager {...variantProps} />
        </div>

        <div className="flex justify-end gap-2 border-t p-4 mt-auto">
          <button onClick={onClose} className="rounded px-3 py-1 text-sm hover:bg-gray-100">Отмена</button>
          <button
            disabled={!title.trim() || !category}
            onClick={handleSave}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  )
}
