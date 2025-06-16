// FILE: src/services/products.js
import { get, post, patch, del } from '@/lib/http'

const API_URL = import.meta.env.VITE_API_URL
const url = (site, suffix = '') => `${API_URL}/products/${site}${suffix}`

// Categories
export const getCategories = (site) => get(url(site, '/categories/all'))
export const addCategory = (site, dto) => post(url(site, '/categories/add'), dto)
export const updateCategory = (site, id, dto) => patch(url(site, `/categories/update/${id}`), dto)
export const deleteCategory = (site, id) => del(url(site, `/categories/delete/${id}`))

// Products
export const getProducts = (site, params) => get(url(site, '/all'), params)
export const addProduct = (site, dto) => post(url(site, '/add'), dto)
export const updateProduct = (site, id, dto) => patch(url(site, `/update/${id}`), dto)
export const deleteProduct = (site, id) => del(url(site, `/delete/${id}`))
