import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Edit2, Trash2, GripVertical } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import slugify from 'slugify'
import EditableLabelTags from './EditableLabelTags'
import { useOptionGroups } from '../../../Options/hooks/useOptionGroups'


const toPublicUrl = (raw = '', siteName) => {
  if (!raw) return null
  if (/^https?:\/\//i.test(raw) && !raw.includes(`${siteName}:8001`)) return raw
  const base = import.meta.env.VITE_CLOUD_CDN || import.meta.env.VITE_ASSETS_URL || ''
  if (!base) return raw.startsWith('/') ? raw : `/${raw}`
  return `${base.replace(/\/$/, '')}/${raw.replace(/^\//, '')}`
}

export default function ProductRow({
  product,
  checked,
  onCheck,
  onEdit,
  onDelete,
  categoryName,
  categoryOptions,
  labelsMap,
  labelsList,
  dragHandleProps,
  draggableProps,
  innerRef,
  onToggleStatus,
  onInlineUpdate,
}) {
  const { domain } = useParams()
  const siteName = `${domain}_app`
  const { data: optionGroups = [] } = useOptionGroups(siteName)

  const firstVariant = product.variants && product.variants[0] ? product.variants[0] : {}

  const optionValueMap = useMemo(() => {
    const map = new Map()
    optionGroups.forEach(group => {
      group.values.forEach(value => {
        map.set(value.id, { ...value, groupName: group.name, groupId: group.id })
      })
    })
    return map
  }, [optionGroups])

  const optionGroupNames = useMemo(() => {
    const ids = new Set()
    product.variants?.forEach(v => {
      v.option_value_ids?.forEach(id => {
        const groupId = optionValueMap.get(id)?.groupId
        if (groupId) ids.add(groupId)
      })
    })
    return Array.from(ids)
      .map(id => optionGroups.find(g => g.id === id)?.name)
      .filter(Boolean)
  }, [product, optionGroups, optionValueMap])

  const extraGroupNames = product.extra_groups?.map(g => g.name) || []

  const [editTitle, setEditTitle] = useState(false)
  const [titleVal, setTitleVal] = useState('')
  const [editPrice, setEditPrice] = useState(false)
  const [priceVal, setPriceVal] = useState('')
  const [editWeight, setEditWeight] = useState(false)
  const [weightVal, setWeightVal] = useState('')
  const [editCategory, setEditCategory] = useState(false)
  const [categoryVal, setCategoryVal] = useState('')
  const [editOrder, setEditOrder] = useState(false)
  const [orderVal, setOrderVal] = useState(0)

  const getFullPayload = (productChanges = {}, variantChanges = {}) => {
    const updatedProduct = { ...product, ...productChanges }
    const updatedFirstVariant = { ...firstVariant, ...variantChanges }
    const updatedVariants = product.variants.map((v, index) =>
      index === 0 ? updatedFirstVariant : v
    )

    delete updatedProduct.created_at
    delete updatedProduct.updated_at
    delete updatedProduct.rating
    delete updatedProduct.rating_count
    delete updatedProduct.variants
    delete updatedProduct.extra_groups

    return { ...updatedProduct, variants: updatedVariants }
  }

  const saveTitle = async () => {
    const val = titleVal.trim()
    setEditTitle(false)
    if (val && val !== product.title) {
      const payload = getFullPayload({
        title: val,
        slug: slugify(val, { lower: true, strict: true }),
      })
      await onInlineUpdate(product.id, payload)
    }
  }

  const savePrice = async () => {
    const num = parseFloat(priceVal)
    setEditPrice(false)
    if (!Number.isNaN(num) && num !== firstVariant.price) {
      const payload = getFullPayload({}, { price: num })
      await onInlineUpdate(product.id, payload)
    }
  }

  const saveWeight = async () => {
    const val = weightVal.trim()
    setEditWeight(false)
    if (val !== firstVariant.weight) {
      const payload = getFullPayload({}, { weight: val })
      await onInlineUpdate(product.id, payload)
    }
  }

  const saveOrder = async () => {
    const num = parseInt(orderVal, 10)
    setEditOrder(false)
    if (!Number.isNaN(num) && num !== product.order) {
      const payload = getFullPayload({ order: num })
      await onInlineUpdate(product.id, payload)
    }
  }

  const saveCategory = async () => {
    setEditCategory(false)
    if (categoryVal && categoryVal !== String(product.category_id)) {
      const payload = getFullPayload({ category_id: parseInt(categoryVal, 10) })
      await onInlineUpdate(product.id, payload)
    }
  }

  const imgSrc = product.image_url
    ? `${import.meta.env.VITE_LIBRARY_ASSETS_URL || ''}${product.image_url}_small.webp`
    : ''

  return (
    <tr ref={innerRef} {...draggableProps} className="hover:bg-gray-50 focus-within:bg-gray-50">
      <td className="px-2 py-1">
        <input type="checkbox" checked={checked} onChange={() => onCheck(product.id)} className="focus:ring-blue-500" />
      </td>
      <td className="px-2 py-1 cursor-grab" {...dragHandleProps}>
        <GripVertical size={16} className="text-gray-400" />
      </td>
      <td className="px-2 py-1">
        {imgSrc ? (
          <img src={imgSrc} alt="" className="h-10 w-10 rounded object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">—</div>
        )}
      </td>
      <td className="max-w-[240px] truncate px-2 py-1 text-sm" onDoubleClick={() => { setTitleVal(product.title); setEditTitle(true); }}>
        {editTitle ? (
          <input autoFocus value={titleVal} onChange={(e) => setTitleVal(e.target.value)} onBlur={saveTitle} onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditTitle(false); }} className="w-full rounded border px-1 text-sm focus:ring-2 focus:ring-blue-500" />
        ) : (
          <>{product.title}{product.slug && <div className="text-xs text-gray-500">{product.slug}</div>}</>
        )}
      </td>
      <td className="px-2 py-1 text-sm" onDoubleClick={() => { setOrderVal(product.order); setEditOrder(true); }}>
        {editOrder ? (
          <input type="number" autoFocus value={orderVal} onChange={(e) => setOrderVal(e.target.value)} onBlur={saveOrder} onKeyDown={(e) => { if (e.key === 'Enter') saveOrder(); if (e.key === 'Escape') setEditOrder(false); }} className="w-16 rounded border px-1 text-sm focus:ring-2 focus:ring-blue-500" />
        ) : (
          product.order
        )}
      </td>
      <td className="px-2 py-1 whitespace-nowrap">
        <Switch className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200" checked={Boolean(product.active)} onCheckedChange={(val) => onToggleStatus(product.id, getFullPayload({ active: val }))} />
      </td>
      <td className="px-2 py-1 whitespace-nowrap">
        <Switch className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200" checked={Boolean(firstVariant.is_available)} onCheckedChange={(val) => onToggleStatus(product.id, getFullPayload({}, { is_available: val }))} />
      </td>
      <td className="px-2 py-1 whitespace-nowrap text-sm" onDoubleClick={() => { setPriceVal(String(firstVariant.price)); setEditPrice(true); }}>
        {editPrice ? (
          <input type="number" autoFocus value={priceVal} onChange={(e) => setPriceVal(e.target.value)} onBlur={savePrice} onKeyDown={(e) => { if (e.key === 'Enter') savePrice(); if (e.key === 'Escape') setEditPrice(false); }} className="w-20 rounded border px-1 text-sm focus:ring-2 focus:ring-blue-500" />
        ) : (
          <>{firstVariant.price}₽{' '}{firstVariant.old_price && <s className="text-gray-400">{firstVariant.old_price}₽</s>}</>
        )}
      </td>
      <td className="px-2 py-1 text-sm">
        <EditableLabelTags value={Array.isArray(product.labels) ? product.labels.map(String) : []} labelsList={labelsList} labelsMap={labelsMap} onSave={(newLabels) => onInlineUpdate(product.id, getFullPayload({ labels: newLabels.map(Number) }))} />
      </td>
      <td className="px-2 py-1 text-sm" onDoubleClick={() => { setCategoryVal(String(product.category_id || '')); setEditCategory(true); }}>
        {editCategory ? (
          <select autoFocus value={categoryVal} onChange={(e) => setCategoryVal(e.target.value)} onBlur={saveCategory} onKeyDown={(e) => { if (e.key === 'Enter') saveCategory(); if (e.key === 'Escape') setEditCategory(false); }} className="w-40 rounded border px-1 text-sm focus:ring-2 focus:ring-blue-500" >
            {categoryOptions.map((c) => <option key={c.id} value={c.id}>{c.path}</option>)}
          </select>
        ) : (
          categoryName || '—'
        )}
      </td>
      <td className="px-2 py-1 text-xs text-gray-700">{optionGroupNames.join(', ') || '—'}</td>
      <td className="px-2 py-1 text-xs text-gray-700">{extraGroupNames.join(', ') || '—'}</td>
      <td className="px-2 py-1 text-sm whitespace-nowrap" onDoubleClick={() => { setWeightVal(firstVariant.weight || ''); setEditWeight(true); }}>
        {editWeight ? (
          <input autoFocus value={weightVal} onChange={(e) => setWeightVal(e.target.value)} onBlur={saveWeight} onKeyDown={(e) => { if (e.key === 'Enter') saveWeight(); if (e.key === 'Escape') setEditWeight(false); }} className="w-20 rounded border px-1 text-sm focus:ring-2 focus:ring-blue-500" />
        ) : (
          firstVariant.weight || '—'
        )}
      </td>
      <td className="px-2 py-1 text-right space-x-2">
        <button onClick={() => onEdit(product)} className="rounded p-1 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500" title="Редактировать"><Edit2 size={16} /></button>
        <button onClick={() => onDelete(product.id)} className="rounded p-1 hover:bg-gray-100 focus:ring-2 focus:ring-red-500" title="Удалить"><Trash2 size={16} /></button>
      </td>
    </tr>
  )
}
