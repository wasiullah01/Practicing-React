import { useCallback, useEffect, useMemo, useState } from 'react'
import { deleteProduct, getProducts, patchProduct, postProduct, putProduct } from './api/products.js'
import ProductForm from './components/ProductForm.jsx'
import Icon from './components/Icon.jsx'
import styles from './App.module.css'

const PAGE_SIZE = 8

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function getStockStatus(stock) {
  if (stock <= 10) return { label: 'Low stock', className: 'bg-amber-50 text-amber-700' }
  if (stock <= 25) return { label: 'Running low', className: 'bg-orange-50 text-orange-700' }
  return { label: 'In stock', className: 'bg-emerald-50 text-emerald-700' }
}

function App() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [mutationError, setMutationError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [page, setPage] = useState(1)
  const [activeProduct, setActiveProduct] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    getProducts(controller.signal)
      .then(setProducts)
      .catch((error) => {
        if (error.name !== 'AbortError') setLoadError(error.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products],
  )

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category
      const matchesQuery =
        !normalizedQuery ||
        [product.title, product.brand, product.category, String(product.id)]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery))
      return matchesCategory && matchesQuery
    })

    return filtered.sort((first, second) => {
      if (first.isDemoProduct !== second.isDemoProduct) return first.isDemoProduct ? -1 : 1
      if (sortBy === 'price-low') return first.price - second.price
      if (sortBy === 'price-high') return second.price - first.price
      if (sortBy === 'stock-low') return first.stock - second.stock
      return first.title.localeCompare(second.title)
    })
  }, [products, query, category, sortBy])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const pageProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0)
  const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
  const lowStockCount = products.filter((product) => product.stock <= 10).length

  function updateQuery(value) {
    setQuery(value)
    setPage(1)
  }

  function updateCategory(value) {
    setCategory(value)
    setPage(1)
  }

  function reloadProducts() {
    setIsLoading(true)
    setLoadError('')
    setReloadKey((key) => key + 1)
  }

  const saveProduct = useCallback(async (draft) => {
    setIsSaving(true)
    setMutationError('')
    try {
      if (activeProduct) {
        const updated = activeProduct.isDemoProduct
          ? { ...activeProduct, ...draft }
          : await putProduct(activeProduct.id, draft)
        setProducts((current) =>
          current.map((product) => (product.id === activeProduct.id ? { ...product, ...updated } : product)),
        )
      } else {
        const created = await postProduct(draft)
        setProducts((current) => {
          const localId = Math.max(0, ...current.map((product) => Number(product.id) || 0)) + 1
          return [{ ...draft, ...created, id: localId, isDemoProduct: true }, ...current]
        })
        setPage(1)
      }
      setActiveProduct(null)
      setIsCreating(false)
    } catch (error) {
      setMutationError(error.message)
    } finally {
      setIsSaving(false)
    }
  }, [activeProduct])

  async function saveStock(stock) {
    if (!activeProduct) return
    setIsSaving(true)
    setMutationError('')
    try {
      const updated = activeProduct.isDemoProduct
        ? { ...activeProduct, stock }
        : await patchProduct(activeProduct.id, { stock })
      setProducts((current) =>
        current.map((product) => (product.id === activeProduct.id ? { ...product, ...updated } : product)),
      )
      setActiveProduct((current) => ({ ...current, ...updated }))
    } catch (error) {
      setMutationError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function removeProduct(product) {
    if (!window.confirm(`Delete “${product.title}” from your inventory?`)) return
    setMutationError('')
    try {
      if (!product.isDemoProduct) await deleteProduct(product.id)
      setProducts((current) => current.filter((item) => item.id !== product.id))
      if (page > 1 && pageProducts.length === 1) setPage(page - 1)
    } catch (error) {
      setMutationError(error.message)
    }
  }

  const openCreate = () => {
    setMutationError('')
    setIsCreating(true)
  }
  const openEdit = (product) => {
    setMutationError('')
    setActiveProduct(product)
  }
  const closeForm = () => {
    setIsCreating(false)
    setActiveProduct(null)
    setMutationError('')
  }

  return (
    <main className={`${styles.page} min-h-screen text-slate-900`}>
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <a className="flex items-center gap-3" href="/" aria-label="Shelf home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Icon name="box" size={21} />
            </span>
            <span className="text-[17px] font-bold tracking-tight text-slate-900">shelf<span className="text-emerald-600">.</span></span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Inventory workspace
            </span>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <Icon name="plus" size={17} />
              <span className="hidden sm:inline">Add product</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Workspace</span><Icon name="chevron" size={14} /><span className="text-slate-700">Products</span>
            </div>
            <h1 className="text-[28px] font-bold tracking-tight text-slate-900 sm:text-[32px]">Product inventory</h1>
            <p className="mt-1.5 text-sm text-slate-500">Keep track of your products, stock, and value.</p>
          </div>
          <button
            type="button"
            onClick={reloadProducts}
            disabled={isLoading}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="refresh" size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </section>

        {mutationError && !isCreating && !activeProduct && (
          <div role="alert" className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <span>{mutationError}</span>
            <button type="button" onClick={() => setMutationError('')} aria-label="Dismiss error"><Icon name="close" size={16} /></button>
          </div>
        )}

        <section aria-label="Inventory summary" className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total products" value={isLoading ? '—' : products.length.toLocaleString()} icon="box" tint="green" foot="Across all categories" />
          <StatCard label="Inventory value" value={isLoading ? '—' : formatCurrency(inventoryValue)} icon="dollar" tint="blue" foot="Based on current stock" />
          <StatCard label="Units in stock" value={isLoading ? '—' : totalUnits.toLocaleString()} icon="layers" tint="violet" foot="Units available" />
          <StatCard label="Low stock items" value={isLoading ? '—' : lowStockCount.toLocaleString()} icon="warning" tint="amber" foot="10 units or fewer" />
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">All products</h2>
              <p className="mt-1 text-sm text-slate-500">{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} in your inventory</p>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <label className="relative block sm:w-[250px]">
                <span className="sr-only">Search products</span>
                <Icon name="search" size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  placeholder="Search products..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10"
                />
              </label>
              <label className="relative">
                <span className="sr-only">Filter by category</span>
                <select
                  value={category}
                  onChange={(event) => updateCategory(event.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 sm:w-[160px]"
                >
                  <option value="all">All categories</option>
                  {categories.map((item) => <option key={item} value={item}>{item.replaceAll('-', ' ')}</option>)}
                </select>
                <Icon name="chevron-down" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </label>
              <label className="relative">
                <span className="sr-only">Sort products</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 sm:w-[160px]"
                >
                  <option value="name">Name: A to Z</option>
                  <option value="price-low">Price: Low to high</option>
                  <option value="price-high">Price: High to low</option>
                  <option value="stock-low">Stock: Low to high</option>
                </select>
                <Icon name="chevron-down" size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </label>
            </div>
          </div>

          {loadError ? (
            <div className="flex min-h-[310px] flex-col items-center justify-center px-6 text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Icon name="warning" size={22} /></span>
              <h3 className="font-semibold text-slate-900">Couldn’t load your products</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">{loadError}</p>
              <button type="button" onClick={reloadProducts} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Try again</button>
            </div>
          ) : isLoading ? (
            <LoadingRows />
          ) : pageProducts.length === 0 ? (
            <div className="flex min-h-[310px] flex-col items-center justify-center px-6 text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Icon name="search" size={21} /></span>
              <h3 className="font-semibold text-slate-900">{products.length ? 'No matching products' : 'Your inventory is empty'}</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">{products.length ? 'Try another search or category filter.' : 'Add your first product to start building your inventory.'}</p>
              {products.length === 0 && <button type="button" onClick={openCreate} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"><Icon name="plus" size={16} />Add a product</button>}
              {products.length > 0 && <button type="button" onClick={() => { updateQuery(''); updateCategory('all') }} className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800">Clear filters</button>}
            </div>
          ) : (
            <>
              <div className={styles.tableScroll}>
                <table className={`${styles.table} w-full border-collapse text-left`}>
                  <thead>
                    <tr className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-[0.07em] text-slate-500">
                      <th className="px-5 py-3.5 sm:px-6">Product</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Price</th>
                      <th className="px-4 py-3.5">Stock</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right sm:px-6"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pageProducts.map((product) => (
                      <ProductRow key={product.id} product={product} onEdit={openEdit} onDelete={removeProduct} />
                    ))}
                  </tbody>
                </table>
              </div>
              <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-medium text-slate-700">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredProducts.length)}</span> of <span className="font-medium text-slate-700">{filteredProducts.length}</span> products
                </p>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><Icon name="chevron-left" size={14} />Previous</button>
                  <span className="px-1 text-xs text-slate-500">Page {page} of {pageCount}</span>
                  <button type="button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)} className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next<Icon name="chevron-right" size={14} /></button>
                </div>
              </footer>
            </>
          )}
        </section>
        <p className="mt-5 text-center text-xs text-slate-400">Changes are reflected in this view. The demo API does not persist data between sessions.</p>
      </div>

      {(isCreating || activeProduct) && (
        <ProductForm
          key={activeProduct ? `edit-${activeProduct.id}` : 'create'}
          product={activeProduct}
          isSaving={isSaving}
          error={mutationError}
          onClose={closeForm}
          onSave={saveProduct}
          onSaveStock={saveStock}
        />
      )}
    </main>
  )
}

function StatCard({ label, value, icon, tint, foot }) {
  const tintClasses = {
    green: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    violet: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-[26px] font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${tintClasses[tint]}`}><Icon name={icon} size={19} /></span>
      </div>
      <p className="mt-3 text-xs text-slate-400">{foot}</p>
    </article>
  )
}

function ProductRow({ product, onEdit, onDelete }) {
  const status = getStockStatus(product.stock)

  return (
    <tr className={`${styles.row} transition-colors hover:bg-slate-50/70`}>
      <td className="px-5 py-4 sm:px-6">
        <div className="flex min-w-[225px] items-center gap-3">
          <div className={`${styles.thumb} flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100`}>
            <img src={product.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="min-w-0">
            <p className="max-w-[230px] truncate text-sm font-semibold text-slate-800">{product.title}</p>
            <p className="mt-1 text-xs text-slate-400">{product.brand || `Product #${product.id}`}</p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm capitalize text-slate-500">{(product.category || 'Uncategorized').replaceAll('-', ' ')}</td>
      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-700">{formatCurrency(product.price)}</td>
      <td className="whitespace-nowrap px-4 py-4">
        <span className="text-sm font-medium text-slate-700">{product.stock}</span><span className="ml-1 text-xs text-slate-400">units</span>
      </td>
      <td className="whitespace-nowrap px-4 py-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />{status.label}
        </span>
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-right sm:px-6">
        <div className="inline-flex items-center gap-1">
          <button type="button" onClick={() => onEdit(product)} aria-label={`Edit ${product.title}`} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700"><Icon name="edit" size={16} /></button>
          <button type="button" onClick={() => onDelete(product)} aria-label={`Delete ${product.title}`} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Icon name="trash" size={16} /></button>
        </div>
      </td>
    </tr>
  )
}

function LoadingRows() {
  return (
    <div aria-label="Loading products" aria-busy="true" className="space-y-4 p-6">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex animate-pulse items-center gap-4 py-2">
          <span className="h-11 w-11 rounded-lg bg-slate-100" />
          <span className="h-3 w-1/4 rounded bg-slate-100" />
          <span className="ml-auto h-3 w-20 rounded bg-slate-100" />
          <span className="h-3 w-16 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

export default App
