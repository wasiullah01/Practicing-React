import { getCoverUrl } from '../api/books.js'
import Icon from './Icon.jsx'
import styles from '../App.module.css'

function BookCard({ book, onSelect }) {
  const cover = getCoverUrl(book.cover_i)
  const author = book.author_name?.[0] || 'Unknown author'

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className={`${styles.bookCard} group min-w-0 text-left`}
      aria-label={`View ${book.title} by ${author}`}
    >
      <span className={`${styles.coverFrame} relative block aspect-[3/4] overflow-hidden rounded-xl bg-[#e8e4dc] shadow-sm ring-1 ring-black/[0.04]`}>
        {cover ? (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.035]"
            onError={(event) => { event.currentTarget.hidden = true }}
          />
        ) : (
          <span className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-[#8b8172]">
            <Icon name="book" size={30} />
            <span className="line-clamp-3 text-sm font-semibold">{book.title}</span>
          </span>
        )}
        {book.first_publish_year && (
          <span className="absolute bottom-2.5 left-2.5 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-600 shadow-sm backdrop-blur">
            {book.first_publish_year}
          </span>
        )}
      </span>
      <span className="mt-3 block truncate text-sm font-semibold text-slate-800 transition group-hover:text-emerald-800">{book.title}</span>
      <span className="mt-1 block truncate text-xs text-slate-500">{author}</span>
      {book.edition_count > 1 && <span className="mt-1.5 block text-[11px] text-slate-400">{book.edition_count} editions</span>}
    </button>
  )
}

export default BookCard
