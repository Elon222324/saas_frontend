
import { useState, useEffect } from 'react'
import { fieldTypes } from '@/components/fields/fieldTypes'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { useProducts } from '@/pages/Sites/SiteSettings/Catalog/Products/hooks/useProducts'
import ProductsSelector from './ProductsSelector'

export default function ProductsItemsEditor({
  schema,
  data,
  settings = {},
  onTextChange,
  onSaveData,
  uiDefaults = {},
}) {
  const { site_name } = useSiteSettings()
  const { data: products = [], isLoading, error } = useProducts(site_name)
  const [selectedIds, setSelectedIds] = useState(
    (data?.items?.map(item => Number(item.product_id)) || [])
  )

  useEffect(() => {
    setSelectedIds(data?.items?.map(item => Number(item.product_id)) || [])
  }, [data?.items])

  useEffect(() => {
    if (!isLoading && !error) {
      console.log('🧩 [PopularItems/ItemsEditor] products count:', products?.length || 0)
      console.log('🧩 [PopularItems/ItemsEditor] selectedIds:', selectedIds)
      if (products?.length) {
        const sample = products.slice(0, 3).map(p => ({ id: p.id, title: p.title || p.name }))
        console.log('🧩 [PopularItems/ItemsEditor] sample products:', sample)
      }
    }
  }, [products, isLoading, error, selectedIds])

  const maxItems = settings?.cards_count || 6

  const handleSelectProducts = (ids) => {
    const normalized = ids.map(Number)
    setSelectedIds(normalized)
    const items = normalized.map(product_id => ({ product_id }))
    onTextChange('items', items)
  }

  const renderField = (field) => {
    if (!field.editable || field.key === 'items') return null

    const fieldKey = field.key
    const textVal = data?.[fieldKey] ?? uiDefaults?.[fieldKey] ?? field.default ?? ''
    const FieldComponent = fieldTypes[field.type] || fieldTypes.text

    return (
      <FieldComponent
        {...field}
        key={fieldKey}
        value={textVal}
        onChange={(val) => onTextChange(fieldKey, val)}
        label={field.label}
      />
    )
  }

  return (
    <div className="pt-4 border-t mt-6 space-y-6 relative z-0">
      {schema.filter(s => s.key === 'title').map(renderField)}

      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          ⏳ Загружаю товары...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ❌ Ошибка загрузки: {error.message}
        </div>
      )}

      {!isLoading && !error && (
        <ProductsSelector
          products={products}
          selectedIds={selectedIds}
          maxItems={maxItems}
          onSelect={handleSelectProducts}
        />
      )}
    </div>
  )
}
