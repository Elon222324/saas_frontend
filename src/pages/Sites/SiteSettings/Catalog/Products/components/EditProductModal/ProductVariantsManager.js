import { Switch } from '@/components/ui/switch'
import { Plus, Trash2 } from 'lucide-react'

export default function ProductVariantsManager({
  useVariants,
  setUseVariants,
  pricingGroups,
  descriptiveGroups,
  selectedOptionGroups,
  handleOptionGroupSelect,
  generateVariants,
  selectedDescriptiveValues,
  handleDescriptiveValueChange,
  variants,
  optionValueMap,
  handleVariantChange,
  handleRemoveVariant,
  handleAddVariant,
  basePrice,
  setBasePrice,
  baseWeight,
  setBaseWeight,
  ImageField,
}) {
  return (
    <>
      <div className="border-t pt-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useVariants} onChange={(e) => setUseVariants(e.target.checked)} />
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
                    <input type="checkbox" checked={selectedOptionGroups.has(group.id)} onChange={() => handleOptionGroupSelect(group.id)} />
                    {group.name}
                  </label>
                ))}
                {pricingGroups.length === 0 && <p className="text-xs text-gray-500">Группы опций для создания вариантов не найдены.</p>}
              </div>
              <div className="pt-2">
                <button onClick={generateVariants} disabled={selectedOptionGroups.size === 0} className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50">Сгенерировать варианты</button>
              </div>
            </div>
            {descriptiveGroups.length > 0 && (
              <div>
                <p className="font-medium text-sm text-gray-800">2. Описательные опции (не влияют на цену)</p>
                <p className="text-xs text-gray-600 mt-1">Выберите характеристики товара. Например: \"Тесто: Тонкое\". Они применятся ко всем вариантам.</p>
                <div className="space-y-2 mt-2">
                  {descriptiveGroups.map(group => (
                    <div key={group.id}>
                      <p className="text-sm font-semibold">{group.name}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 pl-2">
                        {group.values.map(value => (
                          <label key={value.id} className="flex items-center gap-2 text-sm font-normal">
                            <input type="checkbox" checked={selectedDescriptiveValues.has(value.id)} onChange={() => handleDescriptiveValueChange(value.id)} />
                            {value.value}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-3 rounded border p-3">
            {variants.map((variant, index) => (
              <div key={variant.id || `new-${index}`} className="grid grid-cols-12 gap-2 items-end border-b pb-3 last:border-b-0">
                <div className="col-span-12 md:col-span-4">
                  <label className="text-xs text-gray-500">Опции</label>
                  <div className="flex flex-wrap gap-1 text-sm font-medium">
                    {variant.option_value_ids.length > 0 ? variant.option_value_ids.map(id => <span key={id} className="bg-gray-200 px-2 py-0.5 rounded">{optionValueMap.get(id)?.value || '...'}</span>) : <span className="text-gray-400">Базовый вариант</span>}
                  </div>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label className="text-xs text-gray-500">Цена*</label>
                  <input type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} className="w-full rounded border px-2 py-1 text-sm"/>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label className="text-xs text-gray-500">Артикул</label>
                  <input type="text" value={variant.sku || ''} onChange={e => handleVariantChange(index, 'sku', e.target.value)} className="w-full rounded border px-2 py-1 text-sm"/>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <label className="text-xs text-gray-500">Вес</label>
                  <input type="text" value={variant.weight || ''} onChange={e => handleVariantChange(index, 'weight', e.target.value)} className="w-full rounded border px-2 py-1 text-sm"/>
                </div>
                <div className="col-span-12">
                  <ImageField label="Фото варианта" value={variant.image_url} onChange={value => handleVariantChange(index, 'image_url', value)} category="products" />
                </div>
                <div className="col-span-12 flex justify-between items-center mt-1">
                  <label className="flex items-center gap-2 text-sm"><Switch checked={variant.is_available} onCheckedChange={checked => handleVariantChange(index, 'is_available', checked)}/>В наличии</label>
                  <button onClick={() => handleRemoveVariant(index)} className="p-1 text-red-500 hover:bg-red-100 rounded" title="Удалить вариант"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            <button onClick={handleAddVariant} className="mt-2 flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-sm text-gray-700 hover:bg-gray-200"><Plus size={16}/>Добавить вариант вручную</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm">Цена*</label>
            <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="mb-2 w-full rounded border px-2 py-1" />
          </div>
          <div>
            <label className="mb-1 block text-sm">Вес</label>
            <input type="text" value={baseWeight} onChange={(e) => setBaseWeight(e.target.value)} className="mb-2 w-full rounded border px-2 py-1" />
          </div>
        </div>
      )}
    </>
  )
}
