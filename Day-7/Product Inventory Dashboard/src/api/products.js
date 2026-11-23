const API_URL = 'https://dummyjson.com/products'

/**
 * @typedef {object} Product
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {number} price
 * @property {number} stock
 * @property {string} thumbnail
 * @property {string} [brand]
 */

/**
 * @typedef {Pick<Product, 'title' | 'category' | 'price' | 'stock'> & Partial<Pick<Product, 'description' | 'brand'>>} ProductDraft
 */

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
    ...options,
  })

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('The server returned an invalid response. Please try again.')
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status}). Please try again.`)
  }

  return data
}

/**
 * @param {AbortSignal} signal
 * @returns {Promise<Product[]>}
 */
export async function getProducts(signal) {
  const data = await request('?limit=0', { signal })
  return data.products
}

/**
 * @param {ProductDraft} product
 * @returns {Promise<Product>}
 */
export function postProduct(product) {
  return request('/add', { method: 'POST', body: JSON.stringify(product) })
}

/**
 * @param {number} id
 * @param {ProductDraft} product
 * @returns {Promise<Product>}
 */
export function putProduct(id, product) {
  return request(`/${id}`, { method: 'PUT', body: JSON.stringify(product) })
}

/**
 * @param {number} id
 * @param {Partial<Product>} changes
 * @returns {Promise<Product>}
 */
export function patchProduct(id, changes) {
  return request(`/${id}`, { method: 'PATCH', body: JSON.stringify(changes) })
}

/**
 * @param {number} id
 */
export function deleteProduct(id) {
  return request(`/${id}`, { method: 'DELETE' })
}
