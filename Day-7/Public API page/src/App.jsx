import { useEffect, useState } from 'react'
import { searchBooks } from './api/books.js'
import BookCard from './components/BookCard.jsx'
import BookDetail from './components/BookDetail.jsx'
import Icon from './components/Icon.jsx'
import styles from './App.module.css'

const PAGE_SIZE = 18

function readLocation() {
  const params = new URLSearchParams(window.location.search)
  const match = window.location.pathname.match(/^\/book\/([^/]+)\/?$/)
  return {
    type: match ? 'detail' : 'list',
    key: match ? decodeURIComponent(match[1]) : '',
    query: params.get('q') || 'the lord of the rings',
    page: Math.max(1, Number(params.get('page')) || 1),
  }
}

function App() {
  const initialLocation = readLocation()
  const [route, setRoute] = useState(initialLocation)
  const [input, setInput] = useState(initialLocation.query)
  const [query, setQuery] = useState(initialLocation.query)
  const [page, setPage] = useState(initialLocation.page)
  const [books, setBooks] = useState([])
  const [resultCount, setResultCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    function syncLocation() {
      const location = readLocation()
      setRoute(location)
      setInput(location.query)
      setQuery(location.query)
      setPage(location.page)
      setIsLoading(location.type === 'list')
      setListError('')
    }

    window.addEventListener('popstate', syncLocation)
    return () => window.removeEventListener('popstate', syncLocation)
  }, [])

  useEffect(() => {
    if (route.type !== 'list') return undefined

    const controller = new AbortController()

    searchBooks(query, page, controller.signal)
      .then(({ books: results, total }) => {
        setBooks(results)
        setResultCount(total)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setListError(error.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [route.type, query, page, retry])

  function navigateToBook(book) {
    const key = book.key.split('/').pop()
    window.history.pushState({ fromList: true }, '', `/book/${encodeURIComponent(key)}?q=${encodeURIComponent(query)}&page=${page}`)
    setRoute({ type: 'detail', key, query, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function navigateToList() {
    if (route.type === 'list') return
    if (window.history.state?.fromList) {
      window.history.back()
      return
    }
    window.history.pushState({}, '', `/?q=${encodeURIComponent(query)}&page=${page}`)
    setRoute({ type: 'list', query, page })
    setIsLoading(true)
    setListError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSearch(event) {
    event.preventDefault()
    const nextQuery = input.trim()
    if (!nextQuery) return
    setQuery(nextQuery)
    setPage(1)
    setIsLoading(true)
    setListError('')
    setRetry((value) => value + 1)
    if (route.type === 'detail') {
      window.history.pushState({}, '', `/?q=${encodeURIComponent(nextQuery)}&page=1`)
      setRoute({ type: 'list', query: nextQuery, page: 1 })
    } else {
      window.history.replaceState({}, '', `/?q=${encodeURIComponent(nextQuery)}&page=1`)
    }
  }

  function changePage(nextPage) {
    setPage(nextPage)
    setIsLoading(true)
    setListError('')
    window.history.replaceState({}, '', `/?q=${encodeURIComponent(query)}&page=${nextPage}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className={`${styles.app} min-h-screen text-slate-900`}>
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
          <button type="button" onClick={navigateToList} className="flex shrink-0 items-center gap-2.5" aria-label="Folio home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white"><Icon name="book" size={19} /></span>
            <span className="text-lg font-bold tracking-tight">folio<span className="text-emerald-700">.</span></span>
          </button>
          <form onSubmit={handleSearch} className="relative w-full max-w-[470px]">
            <Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Search books or authors..."
              aria-label="Search books or authors"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-20 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-3 focus:ring-emerald-700/10"
            />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800">Search</button>
          </form>
          <a href="https://openlibrary.org/" target="_blank" rel="noreferrer" className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-emerald-700 md:flex">
            Open Library <Icon name="external" size={14} />
          </a>
        </div>
      </header>

      {route.type === 'detail' ? (
        <BookDetail
          key={route.key}
          workKey={route.key}
          onBack={navigateToList}
        />
      ) : (
        <section className="mx-auto max-w-7xl px-5 pb-16 pt-9 sm:px-8 sm:pt-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">The reading room</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-[38px]">Find your next read</h1>
              <p className="mt-2 text-sm text-slate-500">Explore books, authors, and stories from around the world.</p>
            </div>
            {!isLoading && !listError && (
              <p className="text-sm text-slate-500"><span className="font-semibold text-slate-800">{resultCount.toLocaleString()}</span> books found</p>
            )}
          </div>

          {listError ? (
            <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border border-rose-200 bg-white px-6 text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Icon name="warning" size={22} /></span>
              <h2 className="font-semibold text-slate-900">We couldn’t load the books</h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">{listError}</p>
              <button type="button" onClick={() => { setIsLoading(true); setListError(''); setRetry((value) => value + 1) }} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Try again</button>
            </div>
          ) : isLoading ? (
            <BookGridSkeleton />
          ) : books.length === 0 ? (
            <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Icon name="search" size={21} /></span>
              <h2 className="font-semibold text-slate-900">No books found</h2>
              <p className="mt-1 text-sm text-slate-500">Try another title or author.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-6">
                {books.map((book) => (
                  <BookCard key={book.key} book={book} onSelect={navigateToBook} />
                ))}
              </div>
              <Pagination
                page={page}
                pageCount={Math.max(1, Math.ceil(resultCount / PAGE_SIZE))}
                onChange={changePage}
              />
            </>
          )}
          <p className="mt-10 text-center text-xs text-slate-400">Book information provided by Open Library.</p>
        </section>
      )}
    </main>
  )
}

function BookGridSkeleton() {
  return (
    <div aria-label="Loading books" aria-busy="true" className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: 12 }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[3/4] rounded-xl bg-slate-200" />
          <div className="mt-3 h-3 w-4/5 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

function Pagination({ page, pageCount, onChange }) {
  return (
    <nav aria-label="Book results pages" className="mt-10 flex items-center justify-center gap-3">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">
        <Icon name="left" size={15} /> Previous
      </button>
      <span className="min-w-[82px] text-center text-sm text-slate-500">Page {page} of {pageCount}</span>
      <button type="button" disabled={page >= pageCount} onClick={() => onChange(page + 1)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">
        Next <Icon name="right" size={15} />
      </button>
    </nav>
  )
}

export default App
