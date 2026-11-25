import { FileText, Heart, Plus, Search } from 'lucide-react'
import { useNotesActions, useNotesState } from './NotesProvider'
import type { Note } from '../notes'

function excerpt(content: string) {
  return content.replace(/^#+\s*/gm, '').replace(/[*#>-]/g, '').trim().replace(/\s+/g, ' ')
}

function formatEdited(value: string) {
  const date = new Date(value)
  const delta = Date.now() - date.getTime()
  if (delta < 60 * 60 * 1000) return 'Just now'
  if (delta < 24 * 60 * 60 * 1000) return `${Math.floor(delta / (60 * 60 * 1000))}h ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function NotePreview({ note, selected }: { note: Note; selected: boolean }) {
  const { selectNote } = useNotesActions()
  return (
    <button onClick={() => selectNote(note.id)} className={`w-full rounded-xl border p-3.5 text-left transition ${selected ? 'border-[#dfcbb5] bg-white shadow-[0_3px_14px_rgba(87,62,38,0.07)]' : 'border-transparent bg-transparent hover:border-slate-200 hover:bg-white/70'}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className={`truncate text-[13px] font-semibold ${selected ? 'text-slate-900' : 'text-slate-700'}`}>{note.title || 'Untitled note'}</h3>
        {note.favorite && <Heart size={13} className="shrink-0 fill-rose-400 text-rose-400" />}
      </div>
      <p className="line-clamp-2 min-h-9 text-[11px] leading-[18px] text-slate-500">{excerpt(note.content) || 'No additional text'}</p>
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
        <span>{formatEdited(note.updatedAt)}</span>
        <span>{note.content.trim().split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </button>
  )
}

export function NoteList({ onCreate }: { onCreate: () => void }) {
  const { notes, folders, activeFolderId, favoritesOnly, selectedNoteId, search } = useNotesState()
  const { setSearch } = useNotesActions()
  const folder = folders.find((item) => item.id === activeFolderId)
  const title = favoritesOnly ? 'Favorites' : folder?.name ?? 'All notes'
  const visibleNotes = notes
    .filter((note) => !favoritesOnly || note.favorite)
    .filter((note) => !activeFolderId || note.folderId === activeFolderId)
    .filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return (
    <section className="flex min-h-[420px] flex-col border-b border-slate-200/80 bg-[#faf9f7] lg:min-h-0 lg:border-b-0 lg:border-r">
      <header className="px-5 pb-3 pt-6 sm:px-6 lg:pt-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Your library</p>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-[11px] text-slate-400">{visibleNotes.length} {visibleNotes.length === 1 ? 'note' : 'notes'}</p>
          </div>
          <button onClick={onCreate} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8d5c1] text-[#704f35] transition hover:bg-[#dfc5a9]" aria-label="Create note"><Plus size={17} /></button>
        </div>
        <label className="relative mt-5 block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input aria-label="Search notes" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your notes..." className="h-9 w-full rounded-lg border border-slate-200/80 bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-[#d7bea2] focus:ring-4 focus:ring-[#f1e8df]" />
        </label>
      </header>
      <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-5">
        {visibleNotes.map((note) => <NotePreview key={note.id} note={note} selected={note.id === selectedNoteId} />)}
        {visibleNotes.length === 0 && (
          <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm"><FileText size={18} /></span>
            <p className="text-xs font-semibold text-slate-600">{search ? 'No notes found' : 'Nothing here yet'}</p>
            <p className="mt-1 text-[11px] text-slate-400">{search ? 'Try another search.' : 'Create a note to start collecting ideas.'}</p>
            {!search && <button onClick={onCreate} className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#8b6749]"><Plus size={13} /> Create a note</button>}
          </div>
        )}
      </div>
    </section>
  )
}
