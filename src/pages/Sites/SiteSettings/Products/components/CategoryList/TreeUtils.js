// src/pages/Sites/SiteSettings/Products/components/CategoryList/TreeUtils.js
export function escapeRegExp(str = '') {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function highlight(text = '', q = '') {
  if (!q) return text
  return text.replace(
    new RegExp(`(${escapeRegExp(q)})`, 'gi'),
    '<mark class="bg-yellow-200 text-black">$1</mark>',
  )
}

export function filterTree(tree, query = '') {
  if (!query) return tree
  const walk = (nodes) =>
    nodes
      .map((n) => {
        if (n.id === 'all') return null
        const match = n.name.toLowerCase().includes(query)
        const kids = n.children ? walk(n.children) : []
        if (match || kids.length)
          return { ...n, children: kids.length ? kids : n.children }
        return null
      })
      .filter(Boolean)
  return [tree[0], ...walk(tree.slice(1))]
}
