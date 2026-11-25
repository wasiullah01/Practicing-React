import { useMemo } from 'react'
import { ArrowUpRight, Clock3, Heart, MoreHorizontal, Trash2 } from 'lucide-react'
import { useNotesActions, useNotesState } from './NotesProvider'
import type { Note } from '../notes'

export function NoteEditor({ note }: { note: Note | null }) {
  const { folders } = useNotesState()
  const { updateNote, toggleFavorite, deleteNote } = useNotesActions()
  const folder = folders.find((item) => item.id === note?.folderId)
  const wordCount = useMemo(() => note?.content.trim().split(/\s+/).filter(Boolean).length ?? 0, [note?.content])
  const date = note ? new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''

  if (!note) {
    return (
      <section className="flex min-h-[420px] flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="max-w-xs text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f1ea] text-[#8b6749]"><ArrowUpRight size={20} /></span>
          <h2 className="text-sm font-semibold text-slate-700">A little space for your thoughts</h2>
          <p className="mt-1.5 text-xs leading-5 text-slate-400">Choose a note from your library or create a fresh one to get started.</p>
        </div>
      </section>
    )
  }

  return (
    <article className="flex min-h-[560px] flex-1 flex-col bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 sm:px-8">
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className={`h-2 w-2 rounded-full ${folder?.color ?? 'bg-slate-300'}`} />
          <span>{folder?.name ?? 'Unfiled'}</span><span>/</span><span>Note</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => toggleFavorite(note.id)} className={`rounded-lg p-2 transition hover:bg-slate-50 ${note.favorite ? 'text-rose-500' : 'text-slate-400'}`} aria-label={note.favorite ? 'Remove from favorites' : 'Add to favorites'}><Heart size={16} className={note.favorite ? 'fill-rose-100' : ''} /></button>
          <button onClick={() => { if (window.confirm('Delete this note?')) deleteNote(note.id) }} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Delete note"><Trash2 size={16} /></button>
          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50" aria-label="More note options"><MoreHorizontal size={17} /></button>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col px-6 pb-10 pt-8 sm:px-12 sm:pt-12 lg:px-16">
        <div className="mb-6 flex items-center gap-2 text-[10px] text-slate-400"><Clock3 size={13} /> Edited {date}</div>
        <input
          value={note.title}
          onChange={(event) => updateNote(note.id, { title: event.target.value })}
          aria-label="Note title"
          placeholder="Untitled note"
          className="mb-5 w-full border-0 bg-transparent p-0 text-[27px] font-bold leading-tight tracking-tight text-slate-900 outline-none placeholder:text-slate-300 sm:text-[32px]"
        />
        <textarea
          value={note.content}
          onChange={(event) => updateNote(note.id, { content: event.target.value })}
          aria-label="Note content"
          placeholder="Start writing something..."
          className="min-h-[340px] w-full flex-1 resize-none border-0 bg-transparent p-0 text-[14px] leading-7 text-slate-600 outline-none placeholder:text-slate-300"
        />
        <footer className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-400">
          <span>{wordCount} words</span><span>Saved automatically</span>
        </footer>
      </div>
    </article>
  )
}
