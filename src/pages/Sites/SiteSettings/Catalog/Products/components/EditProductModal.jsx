import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import { fieldTypes } from '@/components/fields/fieldTypes'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2 } from 'lucide-react'

import { useCategories } from '../hooks/useCategories'
import { useExtraGroups } from '../../Extras/hooks/useExtraGroups'
import { useOptionGroups } from '../../Options/hooks/useOptionGroups'

const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))

const modalRoot =
  document.getElementById('modal-root') ||
  (() => {
    const el = document.createElement('div')
    el.id = 'modal-root'
    document.body.appendChild(el)
    return el
  })()

export default function EditProductModal({ open, onClose, onSave, product }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: tree = [] } = useCategories(siteName)
  const { data: allExtraGroups = [] } = useExtraGroups(siteName)
  const { data: allOptionGroups = [] } = useOptionGroups(siteName)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [gallery, setGallery] = useState([])
  const [category, setCategory] = useState('')
  const [active, setActive] = useState(true)
  const [order, setOrder] = useState(0)
  const [selectedExtras, setSelectedExtras] = useState(new Set())
  const [msg, setMsg] = useState(null)

  const [useVariants, setUseVariants] = useState(false)
  const [variants, setVariants] = useState([])
  const [basePrice, setBasePrice] = useState('')
  const [baseWeight, setBaseWeight] = useState('')

  const [selectedOptionGroups, setSelectedOptionGroups] = useState(new Set())
  const [selectedDescriptiveValues, setSelectedDescriptiveValues] = useState(new Set())

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

  const optionValueMap = useMemo(() => {
    const map = new Map()
    allOptionGroups.forEach(group => {
      group.values.forEach(value => {
        map.set(value.id, { ...value, groupName: group.name, group_id: group.id })
      })
    })
    return map
  }, [allOptionGroups])

  const [pricingGroups, descriptiveGroups] = useMemo(() => {
    const pricing = []
    const descriptive = []
    allOptionGroups.forEach(group => {
      group.is_pricing ? pricing.push(group) : descriptive.push(group)
    })
    return [pricing, descriptive]
  }, [allOptionGroups])

  const selectedDescriptiveOptions = useMemo(() => {
    return Array.from(selectedDescriptiveValues).map(id => {
      const val = optionValueMap.get(id)
      return val ? `${val.groupName}: ${val.value}` : null
    }).filter(Boolean)
  }, [selectedDescriptiveValues, optionValueMap])

  useEffect(() => {
    if (open && product) {
      setTitle(product.title || '')
      setDescription(product.description || '')
      setImageUrl(product.image_url || '')
      setGallery(product.gallery || [])
      setCategory(product.category_id ?? '')
      setActive(Boolean(product.active))
      setOrder(product.order || 0)
      setSelectedExtras(new Set(product.extra_groups?.map(g => g.id) || []))
      setMsg(null)

      setSelectedDescriptiveValues(new Set((product.descriptive_option_value_ids || []).map(Number)))

      const incomingVariants = product.variants && product.variants.length > 0
        ? JSON.parse(JSON.stringify(product.variants))
        : [{ price: '', weight: '', is_available: true, option_value_ids: [], image_url: '' }]
      const isComplex = incomingVariants.length > 1 || (incomingVariants[0] && (incomingVariants[0].option_value_ids || []).length > 0)
      setUseVariants(isComplex)
      setVariants(incomingVariants)

      if (isComplex) {
        setBasePrice('')
        setBaseWeight('')
      } else {
        setBasePrice(incomingVariants[0]?.price?.toString() || '')
        setBaseWeight(incomingVariants[0]?.weight || '')
      }

      setSelectedOptionGroups(new Set())
    }
  }, [open, product])

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
    })
  }

  const handleDescriptiveValueChange = (valueId) => {
    const id = Number(valueId)
    setSelectedDescriptiveValues(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const generateVariants = () => {
    if (selectedOptionGroups.size === 0) return
    const arraysToCombine = Array.from(selectedOptionGroups).map(groupId => {
      const group = pricingGroups.find(g => g.id === groupId)
      return group ? group.values.map(v => v.id) : []
    }).filter(arr => arr.length > 0)
    if (arraysToCombine.length === 0) return
    const combinations = cartesian(...arraysToCombine)
    const newVariants = combinations.map(combo => ({
      price: variants[0]?.price || basePrice || '',
      old_price: null,
      sku: '',
      weight: variants[0]?.weight || baseWeight || '',
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
    if (useVariants && variants.length <= 1) {
      setMsg({ text: 'Нельзя удалить последний вариант у сложного товара.', type: 'error' })
      setTimeout(() => setMsg(null), 2000)
      return
    }
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleAddVariant = () => {
    setVariants([...variants, {
      price: variants[0]?.price || 0,
      sku: '',
      weight: variants[0]?.weight || '',
      is_available: true,
      option_value_ids: [],
      image_url: ''
    }])
  }

  const handleSave = async () => {
    const t = title.trim()
    if (!t || !category) return
    const variantList = useVariants
      ? variants.map(v => ({ ...v, price: parseFloat(v.price) || 0 }))
      : [{
          price: parseFloat(basePrice) || 0,
          old_price: null,
          sku: '',
          weight: baseWeight.trim() || '',
          is_available: true,
          option_value_ids: [],
          image_url: imageUrl || ''
        }]
    if (variantList.some(v => v.price === '' || isNaN(v.price))) {
      setMsg({ text: 'У всех вариантов должна быть указана цена.', type: 'error' })
      return
    }
    const payload = {
      id: product.id,
      title: t,
      slug: product.slug,
      description: description.trim() || undefined,
      full_description: product.full_description,
      image_url: imageUrl || undefined,
      gallery,
      category_id: parseInt(category),
      active,
      order,
      variants: variantList,
      labels: product.labels || [],
      extra_group_ids: Array.from(selectedExtras),
      descriptive_option_value_ids: Array.from(selectedDescriptiveValues)
    }
    try {
      await onSave(payload)
      setMsg({ text: 'Сохранено', type: 'success' })
      setTimeout(() => onClose(), 1000)
    } catch (err) {
      setMsg({ text: 'Ошибка сохранения: ' + (err?.response?.data?.detail || err.message), type: 'error' })
    }
  }

  const ImageField = fieldTypes.image || (() => null)
  const GalleryField = fieldTypes.gallery || (() => null)
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
              <h4 className="mb-2 font-medium text-sm">Доступные Дополнения</h4>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded border p-2">
                {allExtraGroups.length > 0 ? allExtraGroups.map(group => (
                  <label key={group.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={selectedExtras.has(group.id)} onChange={() => handleExtraChange(group.id)} />
                    {group.name}
                  </label>
                )) : <p className="text-xs text-gray-500">Группы добавок не найдены.</p>}
              </div>
              <label className="mb-1 block text-sm mt-2">Краткое описание</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mb-2 w-full rounded border px-2 py-1" />
            </div>
          </div>

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
                  <div className="pt-2">
                    <button onClick={generateVariants} disabled={selectedOptionGroups.size === 0} className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50">Сгенерировать варианты</button>
                  </div>
                </div>
                {descriptiveGroups.length > 0 && (
                  <div>
                    <p className="font-medium text-sm text-gray-800">2. Описательные опции (не влияют на цену)</p>
                    <p className="text-xs text-gray-600 mt-1">Выберите характеристики товара. Например: "Тесто: Тонкое". Они применятся ко всем вариантам.</p>
                    {selectedDescriptiveOptions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedDescriptiveOptions.map(opt => (
                          <span key={opt} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                            {opt}
                          </span>
                        ))}
                      </div>
                    )}
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
                    <div className="col-span-12 md:col-span-4"><label className="text-xs text-gray-500">Опции</label><div className="flex flex-wrap gap-1 text-sm font-medium">{variant.option_value_ids.length > 0 ? variant.option_value_ids.map(id => <span key={id} className="bg-gray-200 px-2 py-0.5 rounded">{optionValueMap.get(id)?.value || '...'}</span>) : <span className="text-gray-400">Базовый вариант</span>}</div></div>
                    <div className="col-span-6 md:col-span-2"><label className="text-xs text-gray-500">Цена*</label><input type="number" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} className="w-full rounded border px-2 py-1 text-sm"/></div>
                    <div className="col-span-6 md:col-span-2"><label className="text-xs text-gray-500">Артикул</label><input type="text" value={variant.sku || ''} onChange={e => handleVariantChange(index, 'sku', e.target.value)} className="w-full rounded border px-2 py-1 text-sm"/></div>
                    <div className="col-span-6 md:col-span-2"><label className="text-xs text-gray-500">Вес</label><input type="text" value={variant.weight || ''} onChange={e => handleVariantChange(index, 'weight', e.target.value)} className="w-full rounded border px-2 py-1 text-sm"/></div>
                    <div className="col-span-12"><ImageField label="Фото варианта" value={variant.image_url} onChange={value => handleVariantChange(index, 'image_url', value)} category="products" /></div>
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

          {!useVariants && descriptiveGroups.length > 0 && (
            <div className="p-3 bg-gray-50 rounded border space-y-4">
              <p className="font-medium text-sm text-gray-800">Описательные опции (не влияют на цену)</p>
              <p className="text-xs text-gray-600 mt-1">Выберите характеристики товара. Они применятся ко всем вариантам.</p>
              {selectedDescriptiveOptions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedDescriptiveOptions.map(opt => (
                    <span key={opt} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                      {opt}
                    </span>
                  ))}
                </div>
              )}
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

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
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
