const API_URL = 'https://openlibrary.org'
const PAGE_SIZE = 18

/**
 * @typedef {object} Book
 * @property {string} key
 * @property {string} title
 * @property {string[]} [author_name]
 * @property {number} [first_publish_year]
 * @property {number} [cover_i]
 * @property {number} [edition_count]
 * @property {string[]} [subject]
 */

async function request(path, signal) {
  const response = await fetch(`${API_URL}${path}`, { signal })
  let data

  try {
    data = await response.json()
  } catch {
    throw new Error('The book service returned an invalid response. Please try again.')
  }

  if (!response.ok) {
    throw new Error(data.message || `Book request failed (${response.status}). Please try again.`)
  }

  return data
}

/**
 * @param {string} query
 * @param {number} page
 * @param {AbortSignal} signal
 * @returns {Promise<{books: Book[], total: number}>}
 */
export async function searchBooks(query, page, signal) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(PAGE_SIZE),
    fields: 'key,title,author_name,first_publish_year,cover_i,edition_count',
  })
  const data = await request(`/search.json?${params}`, signal)

  return {
    books: data.docs.filter((book) => book.key && book.title),
    total: data.numFound ?? data.num_found ?? 0,
  }
}

/**
 * @param {string} workKey
 * @param {AbortSignal} signal
 */
export async function getBookDetails(workKey, signal) {
  const work = await request(`/works/${encodeURIComponent(workKey)}.json`, signal)
  const authorRecords = (work.authors || []).slice(0, 3)

  const authors = await Promise.all(authorRecords.map(async ({ author }) => {
    const authorKey = author?.key?.split('/').pop()
    if (!authorKey) return null
    const record = await request(`/authors/${encodeURIComponent(authorKey)}.json`, signal)
    return record.name || null
  }))

  const description = typeof work.description === 'string'
    ? work.description
    : work.description?.value || ''

  return {
    key: work.key || `/works/${workKey}`,
    title: work.title || 'Untitled',
    description,
    authors: authors.filter(Boolean),
    firstPublishDate: work.first_publish_date || '',
    subjects: (work.subjects || []).slice(0, 12),
    coverId: work.covers?.find((coverId) => coverId > 0),
  }
}

export function getCoverUrl(coverId, size = 'M') {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : ''
}
