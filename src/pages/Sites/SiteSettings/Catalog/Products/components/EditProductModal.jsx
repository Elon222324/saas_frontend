import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import { fieldTypes } from '@/components/fields/fieldTypes'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2 } from 'lucide-react'

// Хуки для загрузки связанных данных
import { useCategories } from '../hooks/useCategories'
import { useExtraGroups } from '../../Extras/hooks/useExtraGroups'
import { useOptionGroups } from '../../Options/hooks/useOptionGroups'

// Хелпер для генерации комбинаций вариантов
const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

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

  // --- 1. Загрузка всех необходимых данных ---
  const { data: tree = [] } = useCategories(siteName)
  const { data: allExtraGroups = [] } = useExtraGroups(siteName)
  const { data: allOptionGroups = [] } = useOptionGroups(siteName)

  // --- 2. Основные стейты для полей формы ---
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [gallery, setGallery] = useState([])
  const [category, setCategory] = useState('')
  const [active, setActive] = useState(true)
  const [order, setOrder] = useState(0)
  const [selectedExtras, setSelectedExtras] = useState(new Set())
  const [msg, setMsg] = useState(null)
  
  // --- 3. НОВЫЕ СТЕЙТЫ для управления вариантами (аналогично AddProductModal) ---
  const [useVariants, setUseVariants] = useState(false) // Чекбокс "Использовать варианты"
  const [variants, setVariants] = useState([]) // Список вариантов для сложного товара
  const [basePrice, setBasePrice] = useState('') // Цена для простого товара
  const [baseWeight, setBaseWeight] = useState('') // Вес для простого товара
  const [selectedOptionGroups, setSelectedOptionGroups] = useState(new Set()) // Группы опций для генератора

  // --- 4. Мемоизация данных для удобной работы ---
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


  // --- 5. Предзаполнение формы при открытии модального окна ---
  useEffect(() => {
    if (open && product) {
      // Заполняем основные поля товара
      setTitle(product.title || '')
      setDescription(product.description || '')
      setImageUrl(product.image_url || '')
      setGallery(product.gallery || [])
      setCategory(product.category_id ?? '')
      setActive(Boolean(product.active))
      setOrder(product.order || 0)
      // ВАЖНО: product.extra_groups - это массив объектов, а нам нужны ID
      setSelectedExtras(new Set(product.extra_groups?.map(g => g.id) || [])) 
      setMsg(null)

      // ИЗМЕНЕНО: Логика для определения, простой товар или сложный
      const incomingVariants = product.variants || []
      const isComplex = incomingVariants.length > 1 || (incomingVariants[0] && (incomingVariants[0].option_value_ids || []).length > 0)
      
      setUseVariants(isComplex)
      setVariants(JSON.parse(JSON.stringify(incomingVariants))) // Всегда сохраняем варианты

      if (isComplex) {
        // Если товар сложный, очищаем поля базовой цены/веса
        setBasePrice('')
        setBaseWeight('')
      } else {
        // Если товар простой, заполняем поля базовой цены/веса из первого варианта
        setBasePrice(incomingVariants[0]?.price?.toString() || '')
        setBaseWeight(incomingVariants[0]?.weight || '')
      }
    }
  }, [open, product])


  // --- 6. Обработчики для изменения данных ---
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
  
  // Генерация вариантов (заменяет существующие)
  const generateVariants = () => {
    if (selectedOptionGroups.size === 0) return
    const arraysToCombine = Array.from(selectedOptionGroups).map(groupId => {
        const group = allOptionGroups.find(g => g.id === groupId)
        return group ? group.values.map(v => v.id) : []
    }).filter(arr => arr.length > 0)

    if (arraysToCombine.length === 0) return
    const combinations = cartesian(...arraysToCombine)
    const newVariants = combinations.map(combo => ({
        price: variants[0]?.price || basePrice || '',
        old_price: null, sku: '', weight: variants[0]?.weight || baseWeight || '',
        is_available: true, option_value_ids: Array.isArray(combo) ? combo : [combo], image_url: ''
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
      alert('Нельзя удалить последний вариант.')
      return
    }
    setVariants(variants.filter((_, i) => i !== index))
  }
  
  const handleAddVariant = () => {
    setVariants([...variants, {
      price: variants[0]?.price || 0, sku: '', weight: variants[0]?.weight || '',
      is_available: true, option_value_ids: [], image_url: ''
    }])
  }

  const handleSave = async () => {
    const t = title.trim()
    if (!t || !category) return

    // ИЗМЕНЕНО: Логика сборки списка вариантов перед отправкой
    const variantList = useVariants
      ? variants.map(v => ({ ...v, price: parseFloat(v.price) || 0 }))
      : [{
          price: parseFloat(basePrice) || 0,
          old_price: null, sku: '', weight: baseWeight.trim() || '',
          is_available: true, option_value_ids: [], image_url: ''
        }]
    
    // Проверяем, что у всех вариантов есть цена
    if (variantList.some(v => v.price === 0 || isNaN(v.price))) {
        setMsg({ text: 'У всех вариантов должна быть указана цена.', type: 'error' })
        return
    }

    const payload = {
      id: product.id,
      title: t,
      slug: product.slug, // Слаг не меняем
      description,
      full_description: product.full_description,
      image_url: imageUrl,
      gallery,
      category_id: parseInt(category),
      active,
      order,
      variants: variantList,
      labels: product.labels || [],
      extra_group_ids: Array.from(selectedExtras),
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

  // --- 7. JSX разметка компонента ---
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[800px] max-h-[90vh] flex flex-col rounded bg-white shadow-xl">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Редактировать товар: {product.title}</h3>
        </div>
        <div className="overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Название</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-2 py-1 mb-2" />
              <label className="block text-sm">Порядок</label>
              <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full rounded border px-2 py-1 mb-2" />
              <label className="block text-sm">Категория</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded border px-2 py-1 mb-2">
                <option value="" disabled>Выберите категорию</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.path}</option>)}
              </select>
              <ImageField label="Основное фото" value={imageUrl} onChange={setImageUrl} category="products"/>
              <GalleryField label="Галерея" value={gallery} onChange={setGallery} category="products"/>
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
          
          <label className="flex items-center gap-2 text-sm pt-4 border-t">
            <input type="checkbox" checked={useVariants} onChange={(e) => setUseVariants(e.target.checked)} />
            Использовать варианты (размеры, опции и т.д.)
          </label>

          {useVariants ? (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded border space-y-2">
                  <p className="text-xs text-gray-600">Выберите группы опций для создания комбинаций.</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {allOptionGroups.map(group => (
                          <label key={group.id} className="flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={selectedOptionGroups.has(group.id)} onChange={() => handleOptionGroupSelect(group.id)} />
                              {group.name}
                          </label>
                      ))}
                  </div>
                  <button onClick={generateVariants} className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600 disabled:opacity-50" disabled={selectedOptionGroups.size === 0}>Сгенерировать</button>
              </div>
              <div className="space-y-3 rounded border p-3">
                {variants.map((variant, index) => (
                  <div key={variant.id || `new-${index}`} className="grid grid-cols-12 gap-2 items-end border-b pb-3 last:border-b-0">
                    <div className="col-span-12 md:col-span-4"><label className="text-xs text-gray-500">Опции</label><div className="flex flex-wrap gap-1 text-sm font-medium">{variant.option_value_ids.map(id => <span key={id} className="bg-gray-200 px-2 py-0.5 rounded">{optionValueMap.get(id)?.value || '...'}</span>)}</div></div>
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
                <button onClick={handleAddVariant} className="mt-2 flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-sm text-gray-700 hover:bg-gray-200"><Plus size={16}/>Добавить вариант</button>
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

          <label className="mb-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Активен
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t p-4 mt-auto">
          {msg && <p className={`mr-auto text-sm ${msg.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{msg.text}</p>}
          <button onClick={onClose} className="rounded px-3 py-1 text-sm hover:bg-gray-100">Отмена</button>
          <button disabled={!title.trim() || !category} onClick={handleSave} className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50">Сохранить</button>
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
