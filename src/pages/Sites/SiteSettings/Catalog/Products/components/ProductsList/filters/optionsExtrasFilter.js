export function buildOptionValueToGroupMap(optionGroups = []) {
  const map = new Map()
  optionGroups.forEach(group => {
    if (group.values && Array.isArray(group.values)) {
      group.values.forEach(value => {
        map.set(Number(value.id), Number(group.id))
      })
    }
  })
  return map
}

export function applyOptionsFilter(list, { selectedOptions, optionValueToGroupMap }) {
  if (!Array.isArray(selectedOptions) || selectedOptions.length === 0) return list
  const optionGroupIds = selectedOptions.map(id => Number(id))
  return list.filter((p) => {
    if (!p.variants || p.variants.length === 0) return false
    return p.variants.some(variant => {
      if (!variant.option_value_ids || variant.option_value_ids.length === 0) return false
      return variant.option_value_ids.some(valueId => {
        const groupId = optionValueToGroupMap.get(Number(valueId))
        return groupId && optionGroupIds.includes(groupId)
      })
    })
  })
}

export function applyExtrasFilter(list, { selectedExtras }) {
  if (!Array.isArray(selectedExtras) || selectedExtras.length === 0) return list
  const extraGroupIds = selectedExtras.map(id => Number(id))
  return list.filter((p) => {
    if (!p.extra_groups || p.extra_groups.length === 0) return false
    return p.extra_groups.some(eg => extraGroupIds.includes(Number(eg.id)))
  })
}


