import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Package, Search, ShoppingBag, UsersRound, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { orders } from '../../data/orders'

type SearchResult = {
  type: 'Order' | 'Customer' | 'Product'
  title: string
  description: string
  searchTerm: string
}

const customerIndex = Array.from(
  new Map(orders.map((order) => [order.email, { name: order.customer, email: order.email }])).values(),
)
const productIndex = Array.from(new Set(orders.map((order) => order.product)))

const resultIcons = {
  Order: ShoppingBag,
  Customer: UsersRound,
  Product: Package,
}

function SearchResults({
  query,
  results,
  onSelect,
}: {
  query: string
  results: SearchResult[]
  onSelect: (result: SearchResult) => void
}) {
  if (!query.trim()) {
    return <p className="px-3 py-4 text-xs text-slate-400">Search orders, customers, or products by name or keyword.</p>
  }

  if (results.length === 0) {
    return <p className="px-3 py-4 text-xs text-slate-500">No matches found. Try a customer, product, or order number.</p>
  }

  return (
    <div className="max-h-80 overflow-y-auto p-1.5" role="listbox" aria-label="Search results">
      {results.map((result) => {
        const Icon = resultIcons[result.type]
        return (
          <button
            key={`${result.type}-${result.title}`}
            type="button"
            role="option"
            aria-selected="false"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(result)}
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600"><Icon size={15} /></span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-slate-700">{result.title}</span>
              <span className="mt-0.5 block truncate text-[10px] text-slate-400">{result.description}</span>
            </span>
            <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">{result.type}</span>
          </button>
        )
      })}
    </div>
  )
}

export function GlobalSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const desktopRef = useRef<HTMLDivElement>(null)
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return []

    const matchingOrders: SearchResult[] = orders
      .filter((order) =>
        [order.id, order.customer, order.email, order.product].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
      )
      .slice(0, 4)
      .map((order) => ({
        type: 'Order',
        title: order.id,
        description: `${order.customer} · ${order.product} · $${order.amount.toFixed(2)}`,
        searchTerm: order.id,
      }))

    const matchingCustomers: SearchResult[] = customerIndex
      .filter(({ name, email }) => `${name} ${email}`.toLowerCase().includes(normalizedQuery))
      .slice(0, 2)
      .map(({ name, email }) => ({
        type: 'Customer',
        title: name,
        description: email,
        searchTerm: email,
      }))

    const matchingProducts: SearchResult[] = productIndex
      .filter((product) => product.toLowerCase().includes(normalizedQuery))
      .slice(0, 2)
      .map((product) => ({
        type: 'Product',
        title: product,
        description: 'View matching orders',
        searchTerm: product,
      }))

    return [...matchingOrders, ...matchingCustomers, ...matchingProducts]
  }, [query])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
    setIsMobileOpen(false)
  }, [])

  const selectResult = useCallback((result: SearchResult) => {
    closeSearch()
    setQuery('')
    navigate(`/orders?search=${encodeURIComponent(result.searchTerm)}`)
  }, [closeSearch, navigate])

  useEffect(() => {
    if (isMobileOpen) mobileInputRef.current?.focus()
  }, [isMobileOpen])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsOpen(true)
        setIsMobileOpen(true)
        desktopInputRef.current?.focus()
      } else if (event.key === 'Escape') {
        closeSearch()
      }
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [closeSearch])

  const searchField = (inputRef: RefObject<HTMLInputElement | null>, mobile = false) => (
    <div className="relative">
      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') closeSearch()
        }}
        placeholder="Search orders, customers, products..."
        aria-label="Search orders, customers, and products"
        aria-expanded={isOpen}
        aria-controls={mobile ? 'mobile-search-results' : 'desktop-search-results'}
        className={`h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 ${mobile ? 'md:hidden' : 'hidden md:block'}`}
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery('')
            setIsOpen(true)
            inputRef.current?.focus()
          }}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={14} />
        </button>
      )}
      {isOpen && !mobile && (
        <div id="desktop-search-results" className="absolute right-0 top-12 z-50 w-[340px] rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
          <SearchResults query={query} results={results} onSelect={selectResult} />
        </div>
      )}
      {isOpen && mobile && (
        <div id="mobile-search-results" className="mt-2 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
          <SearchResults query={query} results={results} onSelect={selectResult} />
        </div>
      )}
    </div>
  )

  return (
    <>
      <div
        ref={desktopRef}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
        }}
        className="relative hidden md:block"
      >
        {searchField(desktopInputRef)}
        {!query && <span className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 lg:block">⌘ K</span>}
      </div>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open search"
        className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
      >
        <Search size={18} />
      </button>
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 p-4 pt-16 md:hidden" onClick={closeSearch}>
          <div className="mx-auto max-w-lg rounded-2xl bg-white p-3 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-xs font-semibold text-slate-700">Search your store</p>
              <button type="button" onClick={closeSearch} aria-label="Close search" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={16} /></button>
            </div>
            {searchField(mobileInputRef, true)}
          </div>
        </div>
      )}
    </>
  )
}
