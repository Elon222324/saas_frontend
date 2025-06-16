// FILE: src/services/products.ts
import api from '@/lib/axios'
import { CategoryDTO, Category, ProductDTO, Product, Paginated } from '@/types/products'

const API_URL = import.meta.env.VITE_API_URL

function url(site: string, suffix = '') {
  return `${API_URL}/products/${site}${suffix}`
}

// Categories
export const getCategories = async (site: string): Promise<Category[]> => {
  const res = await api.get(url(site, '/categories/all'))
  return res.data
}

export const addCategory = async (site: string, data: CategoryDTO): Promise<Category> => {
  const res = await api.post(url(site, '/categories/add'), data)
  return res.data
}

export const updateCategory = async (site: string, id: number, data: Partial<CategoryDTO>): Promise<Category> => {
  const res = await api.patch(url(site, `/categories/update/${id}`), data)
  return res.data
}

export const deleteCategory = async (site: string, id: number): Promise<{ ok: boolean }> => {
  const res = await api.delete(url(site, `/categories/delete/${id}`))
  return res.data
}

// Products
export interface ProductFilters {
  category?: string
  search?: string
  page?: number
  limit?: number
  activeOnly?: boolean
}

export const getProducts = async (site: string, filters: ProductFilters): Promise<Paginated<Product>> => {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.search) params.set('search', filters.search)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.activeOnly) params.set('activeOnly', 'true')

  const res = await api.get(url(site, `/all?${params.toString()}`))
  return res.data
}

export const addProduct = async (site: string, data: ProductDTO): Promise<Product> => {
  const res = await api.post(url(site, '/add'), data)
  return res.data
}

export const updateProduct = async (site: string, id: number, data: Partial<ProductDTO>): Promise<Product> => {
  const res = await api.patch(url(site, `/update/${id}`), data)
  return res.data
}

export const deleteProduct = async (site: string, id: number): Promise<{ ok: boolean }> => {
  const res = await api.delete(url(site, `/delete/${id}`))
  return res.data
}
