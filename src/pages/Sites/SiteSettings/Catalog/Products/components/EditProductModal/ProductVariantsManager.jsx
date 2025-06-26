import { Plus, Trash2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { fieldTypes } from '@/components/fields/fieldTypes'
import ProductDescriptiveOptions from './ProductDescriptiveOptions'
import { useMemo } from 'react'

export default function ProductVariantsManager({
  useVariants,
  setUseVariants,
  pricingGroups,
  selectedOptionGroups,
  handleOptionGroupSelect,
  generateVariants,
  variants,
  handleVariantChange,
  handleRemoveVariant,
  handleAddVariant,
  handleVariantOptionChange, // <-- Получаем новый обработчик
  optionValueMap,
  descriptiveGroups,
  selectedDescriptiveValues,
  handleDescriptiveValueChange,
  selectedDescriptiveOptions,
  basePrice,
  setBasePrice,
  baseWeight,
  setBaseWeight
}) {
  const ImageField = fieldTypes.image || (() => null)

  // Memoize a map for quick lookup of a variant's selected option value for a given group
  const variantOptionByGroupMap = useMemo(() => {
    const map = new Map()
    variants.forEach((variant, index) => {
      const innerMap = new Map()
      variant.option_value_ids.forEach(valueId => {
        const option = optionValueMap.get(valueId)
        if (option) {
          innerMap.set(option.group_id, valueId)
        }
      })
      map.set(index, innerMap)
    })
    return map
  }, [variants, optionValueMap])

  return (
    <>
      <div className="border-t pt-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useVariants}
            onChange={e => setUseVariants(e.target.checked)}
          />
          Использовать варианты (размеры, опции и т.д.)
        </label>
      </div>

      {useVariants ? (
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded border space-y-4">
            <div>
              <p className="font-medium text-sm text-gray-800">1. Опции для генерации вариантов (влияют на цену)</p>
              <p className="text-xs text-gray-600 mt-1">Выберите группы для создания комбинаций. Например: \"Размер\".</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                {pricingGroups.map(group => (
                  <label key={group.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedOptionGroups.has(group.id)}
                      onChange={() => handleOptionGroupSelect(group.id)}
                    />
                    {group.name}
                  </label>
                ))}
                {pricingGroups.length === 0 && (
                  <p className="text-xs text-gray-500">Группы опций для создания вариантов не найдены.</p>
                )}
              </div>
              <div className="pt-2">
                <button
                  onClick={generateVariants}
                  disabled={selectedOptionGroups.size === 0}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  Сгенерировать варианты
                </button>
              </div>
            </div>
            {descriptiveGroups.length > 0 && (
              <ProductDescriptiveOptions
                groups={descriptiveGroups}
                selectedValues={selectedDescriptiveValues}
                onChange={handleDescriptiveValueChange}
                selectedOptions={selectedDescriptiveOptions}
              />
            )}
          </div>
          <div className="space-y-3 rounded border p-3">
            {variants.map((variant, index) => (
              <div key={variant.id || `new-${index}`} className="grid grid-cols-12 gap-2 items-end border-b pb-3 last:border-b-0">
                <div className="col-span-12 md:col-span-4">
                  <label className="text-xs text-gray-500">Опции</label>
                  {/* --- MODIFICATION START --- */}
                  {variant.option_value_ids.length > 0 ? (
                    <div className="flex flex-wrap gap-1 text-sm font-medium">
                      {variant.option_value_ids.map(id => (
                        <span key={id} className="bg-gray-200 px-2 py-0.5 rounded">
                          {optionValueMap.get(id)?.value || '...'}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1 mt-1">
                      {pricingGroups.filter(g => selectedOptionGroups.has(g.id)).map(group => (
                        <select
                          key={group.id}
                          value={variantOptionByGroupMap.get(index)?.get(group.id) || ''}
                          onChange={(e) => handleVariantOptionChange(index, group.id, e.target.value)}
                          className="w-full rounded border px-2 py-1 text-sm"
                        >
                          <option value="">Выберите {group.name.toLowerCase()}</option>
                          {group.values.map(val => (
                            <option key={val.id} value={val.id}>{val.value}</option>
                          ))}
                        </select>
                      ))}
                       {selectedOptionGroups.size === 0 && <p className="text-xs text-gray-500">Сначала выберите опции для генерации</p>}
                    </div>
                  )}
                  {/* --- MODIFICATION END --- */}
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label className="text-xs text-gray-500">Цена*</label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={e => handleVariantChange(index, 'price', e.target.value)}
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label className="text-xs text-gray-500">Артикул</label>
                  <input
                    type="text"
                    value={variant.sku || ''}
                    onChange={e => handleVariantChange(index, 'sku', e.target.value)}
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label className="text-xs text-gray-500">Вес</label>
                  <input
                    type="text"
                    value={variant.weight || ''}
                    onChange={e => handleVariantChange(index, 'weight', e.target.value)}
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                </div>
                <div className="col-span-12">
                  <ImageField
                    label="Фото варианта"
                    value={variant.image_url}
                    onChange={value => handleVariantChange(index, 'image_url', value)}
                    category="products"
                  />
                </div>
                <div className="col-span-12 flex justify-between items-center mt-1">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={variant.is_available}
                      onCheckedChange={checked => handleVariantChange(index, 'is_available', checked)}
                    />
                    В наличии
                  </label>
                  <button
                    onClick={() => handleRemoveVariant(index)}
                    className="p-1 text-red-500 hover:bg-red-100 rounded"
                    title="Удалить вариант"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddVariant}
              disabled={selectedOptionGroups.size === 0}
              className="mt-2 flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              <Plus size={16} />Добавить вариант вручную
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm">Цена*</label>
            <input
              type="number"
              value={basePrice}
              onChange={e => setBasePrice(e.target.value)}
              className="mb-2 w-full rounded border px-2 py-1"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Вес</label>
            <input
              type="text"
              value={baseWeight}
              onChange={e => setBaseWeight(e.target.value)}
              className="mb-2 w-full rounded border px-2 py-1"
            />
          </div>
        </div>
      )}

      {!useVariants && descriptiveGroups.length > 0 && (
        <ProductDescriptiveOptions
          groups={descriptiveGroups}
          selectedValues={selectedDescriptiveValues}
          onChange={handleDescriptiveValueChange}
          selectedOptions={selectedDescriptiveOptions}
        />
      )}
    </>
  )
}
