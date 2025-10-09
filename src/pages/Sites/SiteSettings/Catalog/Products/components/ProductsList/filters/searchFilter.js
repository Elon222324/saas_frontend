export function applySearchFilter(list, { debounced }) {
  if (debounced) {
    return list.filter((p) => String(p.title || '').toLowerCase().includes(debounced))
  }
  return list
}


