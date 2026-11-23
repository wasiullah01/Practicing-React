import { useEffect, useState } from 'react'
import { getBookDetails, getCoverUrl } from '../api/books.js'
import Icon from './Icon.jsx'
import styles from '../App.module.css'

function BookDetail({ workKey, onBack }) {
  const [book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    getBookDetails(workKey, controller.signal)
      .then(setBook)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [workKey, retry])

  if (isLoading) {
    return (
      <section aria-label="Loading book details" aria-busy="true" className="mx-auto grid max-w-5xl animate-pulse grid-cols-1 gap-10 px-5 py-10 sm:px-8 md:grid-cols-[280px_1fr] md:py-14">
        <div className="mx-auto aspect-[3/4] w-full max-w-[280px] rounded-2xl bg-slate-200" />
        <div className="space-y-4 pt-3">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-9 w-3/4 rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-100" />
          <div className="mt-10 h-24 rounded bg-slate-100" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto flex min-h-[65vh] max-w-5xl flex-col items-center justify-center px-5 text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Icon name="warning" size={22} /></span>
        <h1 className="font-semibold text-slate-900">Couldn’t load this book</h1>
        <p className="mt-1 max-w-sm text-sm text-slate-500">{error}</p>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onBack} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Back to books</button>
          <button type="button" onClick={() => { setIsLoading(true); setError(''); setRetry((value) => value + 1) }} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Try again</button>
        </div>
      </section>
    )
  }

  if (!book) return null

  const cover = getCoverUrl(book.coverId, 'L')
  const authorText = book.authors.length ? book.authors.join(', ') : 'Author not listed'
  const openLibraryUrl = `https://openlibrary.org${book.key}`

  return (
    <article className="mx-auto max-w-5xl px-5 pb-16 pt-7 sm:px-8 sm:pt-9">
      <button type="button" onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-800">
        <Icon name="left" size={17} /> Back to results
      </button>
      <div className="grid grid-cols-1 items-start gap-8 sm:gap-12 md:grid-cols-[minmax(230px,310px)_1fr]">
        <div className={`${styles.detailCover} mx-auto flex aspect-[3/4] w-full max-w-[310px] items-center justify-center overflow-hidden rounded-2xl bg-[#e8e4dc] shadow-[0_18px_40px_rgba(15,23,42,0.12)]`}>
          {cover ? (
            <img src={cover} alt={`Cover of ${book.title}`} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.hidden = true }} />
          ) : (
            <span className="flex flex-col items-center gap-4 px-8 text-center text-[#8b8172]"><Icon name="book" size={44} /><span className="text-xl font-semibold">{book.title}</span></span>
          )}
        </div>
        <div className="pt-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Book details</p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-[40px]">{book.title}</h1>
          <p className="mt-3 text-lg text-slate-600">{authorText}</p>
          {book.firstPublishDate && <p className="mt-2 text-sm text-slate-500">First published {book.firstPublishDate}</p>}

          <div className="my-7 flex flex-wrap gap-3">
            {book.subjects.length > 0 && <Metadata label="Subjects" value={book.subjects.length} />}
          </div>

          <section className="border-t border-slate-200 pt-6">
            <h2 className="text-sm font-semibold text-slate-900">About this book</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-slate-600">
              {book.description || 'No description is available for this book yet.'}
            </p>
          </section>

          {book.subjects.length > 0 && (
            <section className="mt-7">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {book.subjects.map((subject) => <span key={subject} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium capitalize text-emerald-800">{subject}</span>)}
              </div>
            </section>
          )}

          <a href={openLibraryUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800">
            View on Open Library <Icon name="external" size={15} />
          </a>
        </div>
      </div>
    </article>
  )
}

function Metadata({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  )
}

export default BookDetail
