import { getAllNestedCategoryIds } from '../modules/utils'

export function applyCategoryFilter(list, { selectedCategory, fallbackCategory, flatCategories }) {
  const activeCategoryFilter = selectedCategory || fallbackCategory
  if (activeCategoryFilter && flatCategories.length) {
    const allowedIds = getAllNestedCategoryIds(activeCategoryFilter, flatCategories)
    return list.filter((p) => allowedIds.has(Number(p.category_id)))
  }
  return list
}


