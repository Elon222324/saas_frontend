export function applySidebarLabelsFilter(list, { labels, noLabel }) {
  if (noLabel) {
    return list.filter((p) => !Array.isArray(p.labels) || p.labels.length === 0)
  }
  if (Array.isArray(labels) && labels.length) {
    const labelIds = labels.map((id) => Number(id))
    return list.filter((p) => Array.isArray(p.labels) && p.labels.some((lbl) => labelIds.includes(Number(lbl))))
  }
  return list
}

export function applyPanelLabelsFilter(list, { selectedLabels }) {
  if (Array.isArray(selectedLabels) && selectedLabels.length > 0) {
    const labelIds = selectedLabels.map((id) => Number(id))
    return list.filter((p) => Array.isArray(p.labels) && p.labels.some((lbl) => labelIds.includes(Number(lbl))))
  }
  return list
}


