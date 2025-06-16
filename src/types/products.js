// FILE: src/types/products.js

/**
 * @typedef {Object} CategoryDTO
 * @property {string} code
 * @property {string} name
 * @property {string=} description
 * @property {string=} image_url
 * @property {number=} display_order
 * @property {boolean=} is_active
 */

/**
 * @typedef {CategoryDTO & {
 *   id: number,
 *   created_at: string,
 *   updated_at: string
 * }} Category
 */

/**
 * @typedef {Object} ProductDTO
 * @property {string} title
 * @property {string} slug
 * @property {number} price
 * @property {number=} old_price
 * @property {string=} description
 * @property {number=} category_id
 * @property {string=} image_url
 * @property {boolean=} is_active
 */

/**
 * @typedef {ProductDTO & {
 *   id: number,
 *   created_at: string,
 *   updated_at: string
 * }} Product
 */

/**
 * @template T
 * @typedef {Object} Paginated
 * @property {T[]} results
 * @property {number} total
 * @property {number} page
 * @property {number} limit
 */

