// FILE: src/types/products.ts
export interface CategoryDTO {
  code: string
  name: string
  description?: string
  image_url?: string
  display_order?: number
  is_active?: boolean
}

export interface Category extends CategoryDTO {
  id: number
  created_at: string
  updated_at: string
}

export interface ProductDTO {
  title: string
  slug: string
  price: number
  old_price?: number
  currency?: string
  description?: string
  full_description?: string
  image_url?: string
  gallery?: string[]
  is_available?: boolean
  category_id?: string
  labels?: string[]
  rating?: number
  rating_count?: number
  weight?: string
  props?: Record<string, string>
  extras?: unknown[]
  related_product_ids?: number[]
  custom_data?: Record<string, any>
  order?: number
  active?: boolean
}

export interface Product extends ProductDTO {
  id: number
  created_at: string
  updated_at: string
}

export interface Paginated<T> {
  results: T[]
  total: number
  page: number
  limit: number
}
