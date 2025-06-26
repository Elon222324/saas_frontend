import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import slugify from 'slugify'
import { useCategories } from '../hooks/useCategories'
import { useExtraGroups } from '../../Extras/hooks/useExtraGroups'
import { useOptionGroups } from '../../Options/hooks/useOptionGroups'

const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))

export default function useProductForm({ open, onSave, onClose, categoryId }) {
  const { domain } = useParams()
  const siteName = `${domain}_app`

  const { data: tree = [] } = useCategories(siteName)
  const { data: allExtraGroups = [] } = useExtraGroups(siteName)
  const { data: allOptionGroups = [] } = useOptionGroups(siteName)

  const categories = useMemo(() => {
    const list = []
    const walk = (nodes, prefix = '') =>
      nodes.forEach(n => {
        const path = prefix ? `${prefix} / ${n.name}` : n.name
        list.push({ id: n.id, path })
        if (n.children?.length) walk(n.children, path)
      })
    walk(tree)
    return list
  }, [tree])

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

  const [selectedOptionGroups, setSelectedOptionGroups] = useState(new Set())
  const [variants, setVariants] = useState([])
  const [selectedDescriptiveValues, setSelectedDescriptiveValues] = useState(new Set())

  const optionValueMap = useMemo(() => {
    const map = new Map()
    allOptionGroups.forEach(group => {
      group.values.forEach(value => {
        map.set(value.id, { ...value, groupName: group.name })
      })
    })
    return map
  }, [allOptionGroups])

  const [pricingGroups, descriptiveGroups] = useMemo(() => {
    const pricing = []
    const descriptive = []

    allOptionGroups.forEach(group => {
      if (group.is_pricing) {
        pricing.push(group)
      } else {
        descriptive.push(group)
      }
    })

    return [pricing, descriptive]
  }, [allOptionGroups])

  const selectedDescriptiveOptions = useMemo(() => {
    return Array.from(selectedDescriptiveValues)
      .map(id => {
        const val = optionValueMap.get(id)
        return val ? `${val.groupName}: ${val.value}` : null
      })
      .filter(Boolean)
  }, [selectedDescriptiveValues, optionValueMap])

  useEffect(() => {
    if (!open) {
      setTitle('')
      setImageUrl('')
      setDescription('')
      setCategory('')
      setActive(true)
      setMsg(null)
      setOrder(0)
      setSelectedExtras(new Set())
      setUseVariants(false)
      setPrice('')
      setWeight('')
      setVariants([])
      setSelectedOptionGroups(new Set())
      setSelectedDescriptiveValues(new Set())
    } else {
      setCategory(categoryId ?? '')
      setVariants([])
    }
  }, [open, categoryId])

  const handleExtraChange = extraId => {
    setSelectedExtras(prev => {
      const next = new Set(prev)
      next.has(extraId) ? next.delete(extraId) : next.add(extraId)
      return next
    })
  }

  const handleOptionGroupSelect = groupId => {
    setSelectedOptionGroups(prev => {
      const next = new Set(prev)
      next.has(groupId) ? next.delete(groupId) : next.add(groupId)
      return next
    })
  }

  const handleDescriptiveValueChange = valueId => {
    const id = Number(valueId)
    setSelectedDescriptiveValues(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const generateVariants = () => {
    const arraysToCombine = Array.from(selectedOptionGroups)
      .map(groupId => {
        const group = allOptionGroups.find(g => g.id === groupId)
        return group ? group.values.map(v => v.id) : []
      })
      .filter(arr => arr.length > 0)

    if (arraysToCombine.length === 0) {
      setVariants([
        {
          price: price || '',
          old_price: null,
          sku: '',
          weight: weight || '',
          is_available: true,
          option_value_ids: [],
          image_url: ''
        }
      ])
      return
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

  const handleRemoveVariant = index => {
    if (variants.length <= 1) {
      console.warn('Cannot delete the last variant.')
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
      : [
          {
            price: parseFloat(price) || 0,
            old_price: null,
            sku: '',
            weight: weight.trim() || '',
            is_available: true,
            option_value_ids: [],
            image_url: ''
          }
        ]

    if (useVariants && variantList.length === 0) {
      setMsg({ text: 'Сгенерируйте или добавьте хотя бы один вариант.', type: 'error' })
      return
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
      descriptive_option_value_ids: Array.from(selectedDescriptiveValues).map(Number)
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
          attempt += 1
          continue
        }
        setMsg({ text: 'Не удалось сохранить товар. ' + (err?.response?.data?.detail || err.message), type: 'error' })
        return
      }
    }
    setMsg({ text: 'Не удалось уникализировать slug', type: 'error' })
  }

  return {
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
    useVariants,
    setUseVariants,
    pricingGroups,
    descriptiveGroups,
    selectedOptionGroups,
    handleOptionGroupSelect,
    generateVariants,
    variants,
    handleVariantChange,
    handleRemoveVariant,
    optionValueMap,
    selectedDescriptiveValues,
    handleDescriptiveValueChange,
    selectedDescriptiveOptions,
    price,
    setPrice,
    weight,
    setWeight,
    handleSave
  }
}
