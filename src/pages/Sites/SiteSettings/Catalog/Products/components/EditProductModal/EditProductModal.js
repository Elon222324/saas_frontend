import { createPortal } from 'react-dom'
import useProductForm from './useProductForm'
import ProductInfoForm from './ProductInfoForm'
import ProductExtrasSelector from './ProductExtrasSelector'
import ProductVariantsManager from './ProductVariantsManager'
import ProductDescriptiveOptions from './ProductDescriptiveOptions'

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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[800px] max-h-[90vh] flex flex-col rounded bg-white shadow-xl">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Редактировать товар: {product.title}</h3>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <ProductInfoForm
                title={form.title}
                setTitle={form.setTitle}
                order={form.order}
                setOrder={form.setOrder}
                categories={form.categories}
                category={form.category}
                setCategory={form.setCategory}
                imageUrl={form.imageUrl}
                setImageUrl={form.setImageUrl}
                gallery={form.gallery}
                setGallery={form.setGallery}
              />
            </div>
            <div>
              <ProductExtrasSelector
                allExtraGroups={form.allExtraGroups}
                selectedExtras={form.selectedExtras}
                handleExtraChange={form.handleExtraChange}
                description={form.description}
                setDescription={form.setDescription}
              />
            </div>
          </div>

          <ProductVariantsManager
            useVariants={form.useVariants}
            setUseVariants={form.setUseVariants}
            pricingGroups={form.pricingGroups}
            descriptiveGroups={form.descriptiveGroups}
            selectedOptionGroups={form.selectedOptionGroups}
            handleOptionGroupSelect={form.handleOptionGroupSelect}
            generateVariants={form.generateVariants}
            selectedDescriptiveOptions={form.selectedDescriptiveOptions}
            selectedDescriptiveValues={form.selectedDescriptiveValues}
            handleDescriptiveValueChange={form.handleDescriptiveValueChange}
            variants={form.variants}
            optionValueMap={form.optionValueMap}
            handleVariantChange={form.handleVariantChange}
            handleRemoveVariant={form.handleRemoveVariant}
            handleAddVariant={form.handleAddVariant}
            basePrice={form.basePrice}
            setBasePrice={form.setBasePrice}
            baseWeight={form.baseWeight}
            setBaseWeight={form.setBaseWeight}
          />

          {!form.useVariants && (
            <ProductDescriptiveOptions
              descriptiveGroups={form.descriptiveGroups}
              selectedDescriptiveValues={form.selectedDescriptiveValues}
              handleDescriptiveValueChange={form.handleDescriptiveValueChange}
              selectedDescriptiveOptions={form.selectedDescriptiveOptions}
            />
          )}

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => form.setActive(e.target.checked)} />
            Активен
          </label>
        </div>
        <div className="flex justify-end items-center gap-2 border-t p-4 mt-auto">
          {form.msg && (
            <p className={`mr-auto text-sm ${form.msg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{form.msg.text}</p>
          )}
          <button onClick={onClose} className="rounded px-3 py-1 text-sm hover:bg-gray-100">Отмена</button>
          <button
            disabled={!form.title.trim() || !form.category}
            onClick={form.handleSave}
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
