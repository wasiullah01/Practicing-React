import { useMemo } from 'react'
import { Check, X } from 'lucide-react'
import { NoteEditor } from './NoteEditor'
import { NoteList } from './NoteList'
import { Sidebar } from './Sidebar'
import { useNotesActions, useNotesState } from './NotesProvider'

export function NotesPage() {
  const { notes, activeFolderId, favoritesOnly, selectedNoteId, notice } = useNotesState()
  const { createNote, dismissNotice } = useNotesActions()
  const visibleNotes = useMemo(
    () => notes
      .filter((note) => !favoritesOnly || note.favorite)
      .filter((note) => !activeFolderId || note.folderId === activeFolderId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [notes, activeFolderId, favoritesOnly],
  )
  const selectedNote = visibleNotes.find((note) => note.id === selectedNoteId) ?? visibleNotes[0] ?? null

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800 lg:flex-row">
      <Sidebar />
      <main className="grid min-h-0 flex-1 grid-cols-1 lg:min-h-screen lg:grid-cols-[300px_minmax(0,1fr)]">
        <NoteList onCreate={createNote} />
        <NoteEditor note={selectedNote} />
      </main>
      {notice && <div role="status" className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-3 rounded-xl border border-rose-200 bg-white p-4 text-xs text-slate-700 shadow-xl"><span className="flex-1">{notice}</span><button onClick={dismissNotice} aria-label="Dismiss notification"><X size={15} /></button></div>}
      <div className="sr-only" aria-live="polite"><Check /> Changes are saved automatically</div>
    </div>
  )
}
