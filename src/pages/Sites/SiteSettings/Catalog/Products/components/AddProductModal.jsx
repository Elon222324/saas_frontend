import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import slugify from 'slugify'
import { fieldTypes } from '@/components/fields/fieldTypes'
import { useCategories } from '../hooks/useCategories'
import { useExtraGroups } from '../../Extras/hooks/useExtraGroups'
import { useOptionGroups } from '../../Options/hooks/useOptionGroups'
import { Switch } from '@/components/ui/switch'
import { Trash2 } from 'lucide-react'

// Helper function to create Cartesian product of arrays
const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))

// Modal root element
const modalRoot =
  document.getElementById('modal-root') ||
  (() => {
    const el = document.createElement('div')
    el.id = 'modal-root'
    document.body.appendChild(el)
    return el
  })()

export default function AddProductModal({ open, onClose, onSave, categoryId }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`
  const { data: tree = [] } = useCategories(siteName)
  const { data: allExtraGroups = [] } = useExtraGroups(siteName)
  const { data: allOptionGroups = [] } = useOptionGroups(siteName)

  // Memoized categories list
  const categories = useMemo(() => {
    const list = []
    const walk = (nodes, prefix = '') =>
      nodes.forEach((n) => {
        const path = prefix ? `${prefix} / ${n.name}` : n.name
        list.push({ id: n.id, path })
        if (n.children?.length) walk(n.children, path)
      })
    walk(tree)
    return list
  }, [tree])

  // Component State
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [active, setActive] = useState(true)
  const [msg, setMsg] = useState(null)
  const [order, setOrder] = useState(0)
  const [selectedExtras, setSelectedExtras] = useState(new Set())
  const [useVariants, setUseVariants] = useState(false)
  const [price, setPrice] = useState('')
  const [weight, setWeight] = useState('')

  // State for variant generation
  const [selectedOptionGroups, setSelectedOptionGroups] = useState(new Set())
  const [variants, setVariants] = useState([])

  // State for descriptive options (that don't affect price)
  const [selectedDescriptiveValues, setSelectedDescriptiveValues] = useState(new Set())

  // Memoized map for quick option value lookup
  const optionValueMap = useMemo(() => {
    const map = new Map()
    allOptionGroups.forEach(group => {
      group.values.forEach(value => {
        map.set(value.id, { ...value, groupName: group.name })
      })
    })
    return map
  }, [allOptionGroups])

  // Split option groups based on the `is_pricing` flag.
  const [pricingGroups, descriptiveGroups] = useMemo(() => {
    const pricing = [];
    const descriptive = [];
    
    allOptionGroups.forEach(group => {
      if (group.is_pricing) {
        pricing.push(group);
      } else {
        descriptive.push(group);
      }
    });

    return [pricing, descriptive];
  }, [allOptionGroups]);


  // Effect to reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setTitle(''); setImageUrl(''); setDescription('')
      setCategory(''); setActive(true); setMsg(null); setOrder(0)
      setSelectedExtras(new Set()); setUseVariants(false)
      setPrice(''); setWeight('');
      setVariants([])
      setSelectedOptionGroups(new Set())
      setSelectedDescriptiveValues(new Set())
    } else {
      setCategory(categoryId ?? '')
      setVariants([])
    }
  }, [open, categoryId])


  const handleExtraChange = (extraId) => {
    setSelectedExtras(prev => {
      const next = new Set(prev)
      next.has(extraId) ? next.delete(extraId) : next.add(extraId)
      return next
    })
  }
  
  const handleOptionGroupSelect = (groupId) => {
    setSelectedOptionGroups(prev => {
      const next = new Set(prev)
      next.has(groupId) ? next.delete(groupId) : next.add(groupId)
      return next
    });
  }

  // Handler for selecting descriptive option values
  const handleDescriptiveValueChange = (valueId) => {
    setSelectedDescriptiveValues(prev => {
      const next = new Set(prev);
      next.has(valueId) ? next.delete(valueId) : next.add(valueId);
      return next;
    });
  };


  const generateVariants = () => {
    const arraysToCombine = Array.from(selectedOptionGroups).map(groupId => {
      // Find the group in the main list, as it's the source of truth
      const group = allOptionGroups.find(g => g.id === groupId)
      return group ? group.values.map(v => v.id) : []
    }).filter(arr => arr.length > 0)

    if (arraysToCombine.length === 0) {
        setVariants([{
            price: price || '',
            old_price: null,
            sku: '',
            weight: weight || '',
            is_available: true,
            option_value_ids: [],
            image_url: ''
        }]);
        return;
    }

    const combinations = cartesian(...arraysToCombine)

    const newVariants = combinations.map(combo => ({
      price: price || '',
      old_price: null,
      sku: '',
      weight: weight || '',
      is_available: true,
      option_value_ids: Array.isArray(combo) ? combo : [combo],
      image_url: ''
    }))
    setVariants(newVariants)
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index][field] = value
    setVariants(newVariants)
  }

  const handleRemoveVariant = (index) => {
    if (variants.length <= 1) {
      // In a real app, use a non-blocking notification instead of alert
      console.warn('Cannot delete the last variant.');
      return
    }
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    const t = title.trim()
    if (!t || !category) return

    const baseSlug = slugify(t, { lower: true, strict: true })

    const variantList = useVariants
      ? variants
      : [{
        price: parseFloat(price) || 0,
        old_price: null,
        sku: '',
        weight: weight.trim() || '',
        is_available: true,
        option_value_ids: [],
        image_url: ''
      }]

    if (useVariants && variantList.length === 0) {
        setMsg({ text: 'Сгенерируйте или добавьте хотя бы один вариант.', type: 'error' });
        return;
    }

    if (variantList.some(v => v.price === '' || isNaN(parseFloat(v.price)))) {
      setMsg({ text: 'У всех вариантов должна быть указана цена.', type: 'error' })
      return
    }

    const productBase = {
      title: t,
      slug: baseSlug,
      description: description.trim() || undefined,
      image_url: imageUrl || undefined,
      category_id: parseInt(category),
      active,
      order,
      variants: variantList.map(v => ({ ...v, price: parseFloat(v.price) || 0 })),
      labels: [],
      extra_group_ids: Array.from(selectedExtras),
      descriptive_option_value_ids: Array.from(selectedDescriptiveValues),
    }

    let attempt = 0
    const maxAttempts = 10
    while (attempt < maxAttempts) {
      const currentSlug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`
      try {
        await onSave({ ...productBase, slug: currentSlug })
        setMsg({ text: `Товар добавлен (slug: ${currentSlug})`, type: 'success' })
        setTimeout(() => onClose(), 1000)
        return
      } catch (err) {
        if (err?.response?.status === 409) {
          attempt += 1; continue
        }
        setMsg({ text: 'Не удалось сохранить товар. ' + (err?.response?.data?.detail || err.message), type: 'error' })
        return
      }
    }
    setMsg({ text: 'Не удалось уникализировать slug', type: 'error' })
  }

  const ImageField = fieldTypes.image || (() => null)

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[800px] max-h-[90vh] flex flex-col rounded bg-white shadow-xl">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Новый товар</h3>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm">Название</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-1 w-full rounded border px-2 py-1"/>
              {msg && <p className={`mb-2 text-sm ${msg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{msg.text}</p>}
              <ImageField label="Основное фото" value={imageUrl} onChange={setImageUrl} category="products" className="mb-2"/>
              <label className="mb-1 block text-sm">Порядок</label>
              <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="mb-2 w-full rounded border px-2 py-1"/>
              <label className="mb-1 block text-sm">Категория</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="mb-2 w-full rounded border px-2 py-1">
                <option value="" disabled>Выберите категорию</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.path}</option>)}
              </select>
              <label className="mb-1 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                Активен
              </label>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-sm">Доступные Дополнения</h4>
              <div className="max-h-64 space-y-1 overflow-y-auto rounded border p-2">
                {allExtraGroups.length > 0 ? allExtraGroups.map(group => (
                  <label key={group.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={selectedExtras.has(group.id)} onChange={() => handleExtraChange(group.id)} />
                    {group.name}
                  </label>
                )) : <p className="text-xs text-gray-500">Группы добавок не найдены.</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm">Краткое описание</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mb-2 w-full rounded border px-2 py-1"/>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useVariants} onChange={(e) => setUseVariants(e.target.checked)} />
            Использовать варианты (размеры, опции и т.д.)
          </label>

          {useVariants ? (
            <>
              <div className="p-3 bg-gray-50 rounded border space-y-4">
                {/* Section 1: For options that generate variants */}
                <div>
                  <p className="font-medium text-sm text-gray-800">1. Опции для генерации вариантов (влияют на цену)</p>
                  <p className="text-xs text-gray-600 mt-1">Выберите группы для создания комбинаций. Например: "Размер".</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                    {pricingGroups.map(group => (
                      <label key={group.id} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={selectedOptionGroups.has(group.id)} onChange={() => handleOptionGroupSelect(group.id)} />
                        {group.name}
                      </label>
                    ))}
                    {pricingGroups.length === 0 && <p className="text-xs text-gray-500">Группы опций для создания вариантов не найдены.</p>}
                  </div>
                </div>
                
                {/* Section 2: For descriptive options that DO NOT generate variants */}
                {descriptiveGroups.length > 0 && (
                  <div>
                    <p className="font-medium text-sm text-gray-800">2. Описательные опции (не влияют на цену)</p>
                    <p className="text-xs text-gray-600 mt-1">Выберите характеристики товара. Например: "Тесто: Тонкое". Эти опции будут применены ко всем вариантам.</p>
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
                <div className="pt-2">
                    <button onClick={generateVariants} className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50">Сгенерировать варианты</button>
                </div>
              </div>

              <div className="space-y-3 rounded border p-3">
                {variants.map((variant, index) => (
                  <div key={`variant-${index}`} className="grid grid-cols-12 gap-2 items-end border-b pb-3 last:border-b-0">
                    <div className="col-span-12 md:col-span-4">
                      <label className="text-xs text-gray-500">Опции</label>
                      <div className="flex flex-wrap gap-1 text-sm font-medium">
                        {variant.option_value_ids.length > 0
                          ? variant.option_value_ids.map(id => <span key={id} className="bg-gray-200 px-2 py-0.5 rounded">{optionValueMap.get(id)?.value || '...'}</span>)
                          : <span className="text-gray-400">Базовый вариант</span>}
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-2"><label className="text-xs text-gray-500">Цена*</label><input type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} className="w-full rounded border px-2 py-1 text-sm"/></div>
                    <div className="col-span-6 md:col-span-2"><label className="text-xs text-gray-500">Артикул</label><input type="text" value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} className="w-full rounded border px-2 py-1 text-sm"/></div>
                    <div className="col-span-6 md:col-span-2"><label className="text-xs text-gray-500">Вес</label><input type="text" value={variant.weight} onChange={e => handleVariantChange(index, 'weight', e.target.value)} className="w-full rounded border px-2 py-1 text-sm"/></div>
                    <div className="col-span-12"><ImageField label="Фото варианта" value={variant.image_url} onChange={value => handleVariantChange(index, 'image_url', value)} category="products" /></div>
                    <div className="col-span-12 flex justify-between items-center mt-1">
                      <label className="flex items-center gap-2 text-sm"><Switch checked={variant.is_available} onCheckedChange={checked => handleVariantChange(index, 'is_available', checked)}/>В наличии</label>
                      <button onClick={() => handleRemoveVariant(index)} className="p-1 text-red-500 hover:bg-red-100 rounded" title="Удалить вариант"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                 {variants.length === 0 && <p className="text-center text-sm text-gray-500 py-4">Нажмите "Сгенерировать варианты", чтобы создать список для редактирования.</p>}
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm">Цена</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-2 w-full rounded border px-2 py-1"/>
                </div>
                <div>
                  <label className="mb-1 block text-sm">Вес</label>
                  <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} className="mb-2 w-full rounded border px-2 py-1"/>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t p-4 mt-auto">
          <button onClick={onClose} className="rounded px-3 py-1 text-sm hover:bg-gray-100">Отмена</button>
          <button disabled={!title.trim() || !category} onClick={handleSave} className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50">Сохранить</button>
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
