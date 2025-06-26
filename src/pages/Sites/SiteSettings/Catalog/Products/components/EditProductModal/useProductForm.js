import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useCategories } from '../../hooks/useCategories'
import { useExtraGroups } from '../../../Extras/hooks/useExtraGroups'
import { useOptionGroups } from '../../../Options/hooks/useOptionGroups'

const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))

// Helper to check for duplicate variants based on options
const hasDuplicateVariants = (variants) => {
  const seen = new Set()
  for (const variant of variants) {
    if (!variant.option_value_ids || variant.option_value_ids.length === 0) continue
    const key = JSON.stringify(variant.option_value_ids.slice().sort())
    if (seen.has(key)) {
      return true
    }
    seen.add(key)
  }
  return false
}

export default function useProductForm({ open, product, onSave, onClose }) {
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
    
  const groupValueMap = useMemo(() => {
      const map = new Map();
      allOptionGroups.forEach(group => {
          map.set(group.id, group.values.map(v => v.id))
      })
      return map
  }, [allOptionGroups]);

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
      
      const existingDescIds = product.descriptive_option_value_ids
        ? product.descriptive_option_value_ids
        : (product.descriptive_options || []).flatMap(g => g.values.map(v => v.id))
      setSelectedDescriptiveValues(new Set(existingDescIds.map(Number)))

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

      const initialPricingGroups = new Set()
      if (isComplex) {
          const firstVariantOptions = incomingVariants[0]?.option_value_ids || [];
          firstVariantOptions.forEach(valId => {
              const option = optionValueMap.get(valId);
              if (option && option.group_id) {
                const group = pricingGroups.find(g => g.id === option.group_id);
                if (group) initialPricingGroups.add(group.id);
              }
          })
      }
      setSelectedOptionGroups(initialPricingGroups)
    }
  }, [open, product, optionValueMap, pricingGroups])

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

  const handleVariantOptionChange = (variantIndex, groupId, newValueId) => {
    setVariants(currentVariants => {
        const newVariants = [...currentVariants];
        const variant = { ...newVariants[variantIndex] };
        
        // IDs of all possible values in the changed group
        const groupValues = new Set(groupValueMap.get(groupId));

        // Filter out old value from the same group
        let newOptionIds = variant.option_value_ids.filter(id => !groupValues.has(id));

        // Add the new value if it's not empty
        if (newValueId) {
            newOptionIds.push(Number(newValueId));
        }

        variant.option_value_ids = newOptionIds;
        newVariants[variantIndex] = variant;
        return newVariants;
    });
  };

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
    setMsg(null);
    const t = title.trim()
    if (!t || !category) return

    if (useVariants && hasDuplicateVariants(variants)) {
        setMsg({ text: 'Найдены варианты с одинаковым набором опций. Исправьте дубликаты.', type: 'error' });
        return;
    }

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
    if (useVariants && variantList.some(v => v.option_value_ids.length === 0)) {
        setMsg({ text: 'У каждого варианта должен быть выбран хотя бы один параметр.', type: 'error' });
        return;
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

  return {
    allExtraGroups,
    pricingGroups,
    descriptiveGroups,
    optionValueMap,
    categories,
    title,
    setTitle,
    description,
    setDescription,
    imageUrl,
    setImageUrl,
    gallery,
    setGallery,
    category,
    setCategory,
    active,
    setActive,
    order,
    setOrder,
    selectedExtras,
    handleExtraChange,
    msg,
    useVariants,
    setUseVariants,
    variants,
    basePrice,
    setBasePrice,
    baseWeight,
    setBaseWeight,
    selectedOptionGroups,
    handleOptionGroupSelect,
    generateVariants,
    handleVariantChange,
    handleRemoveVariant,
    handleAddVariant,
    handleVariantOptionChange, // <-- Экспортируем новый обработчик
    selectedDescriptiveValues,
    handleDescriptiveValueChange,
    selectedDescriptiveOptions,
    handleSave
  }
}
