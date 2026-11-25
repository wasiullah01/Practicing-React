import { useState, type FormEvent } from 'react'
import {
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  FolderPlus,
  Heart,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useNotesActions, useNotesState } from './NotesProvider'

function FolderDialog({ folderId, onClose }: { folderId: string | null; onClose: () => void }) {
  const { folders } = useNotesState()
  const { createFolder, renameFolder } = useNotesActions()
  const folder = folders.find((item) => item.id === folderId)
  const [name, setName] = useState(folder?.name ?? '')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    if (folder) renameFolder(folder.id, trimmed)
    else createFolder(trimmed)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/30 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <form onSubmit={submit} className="my-auto w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><FolderPlus size={19} /></span>
            <div>
              <h2 className="font-semibold text-slate-900">{folder ? 'Rename folder' : 'Create a folder'}</h2>
              <p className="mt-0.5 text-xs text-slate-500">Keep your thoughts organized.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Close dialog"><X size={17} /></button>
        </div>
        <label className="text-xs font-semibold text-slate-700">Folder name
          <input autoFocus required maxLength={32} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Projects" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-50" />
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700">{folder ? 'Save folder' : 'Create folder'}</button>
        </div>
      </form>
    </div>
  )
}

export function Sidebar() {
  const { folders, notes, activeFolderId, favoritesOnly } = useNotesState()
  const { selectFolder, selectFavorites, createNote, deleteFolder } = useNotesActions()
  const [folderDialogId, setFolderDialogId] = useState<string | null | undefined>(undefined)
  const [menuFolderId, setMenuFolderId] = useState<string | null>(null)
  const favoriteCount = notes.filter((note) => note.favorite).length

  return (
    <>
      <aside className="flex w-full shrink-0 items-center gap-5 overflow-x-auto border-b border-slate-200/80 bg-white px-4 py-3 lg:w-[250px] lg:flex-col lg:items-stretch lg:gap-0 lg:overflow-visible lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
        <a href="#" className="flex shrink-0 items-center gap-2.5 lg:mb-10 lg:px-1" aria-label="Papertrail home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8d5c1] text-[#704f35]"><BookOpen size={18} /></span>
          <span className="text-[16px] font-bold tracking-tight text-slate-900">papertrail</span>
        </a>
        <div className="flex shrink-0 items-center gap-2 lg:mb-3 lg:px-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Library</span>
          <ChevronDown size={12} className="hidden text-slate-400 lg:block" />
        </div>
        <nav className="flex shrink-0 items-center gap-1 lg:flex-col lg:items-stretch">
          <button onClick={() => selectFolder(null)} className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition lg:w-full lg:py-2.5 lg:text-sm ${!favoritesOnly && activeFolderId === null ? 'bg-[#f7f1ea] text-[#725339]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <FileText size={16} /> All notes <span className="ml-auto hidden text-[10px] text-slate-400 lg:inline">{notes.length}</span>
          </button>
          <button onClick={selectFavorites} className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition lg:w-full lg:py-2.5 lg:text-sm ${favoritesOnly ? 'bg-[#f7f1ea] text-[#725339]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <Heart size={16} /> Favorites <span className="ml-auto hidden text-[10px] text-slate-400 lg:inline">{favoriteCount}</span>
          </button>
        </nav>
        <div className="hidden items-center justify-between lg:mb-2 lg:mt-8 lg:flex lg:px-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Folders</span>
          <button onClick={() => setFolderDialogId(null)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Create folder"><Plus size={15} /></button>
        </div>
        <nav className="flex shrink-0 items-center gap-1 lg:flex-col lg:items-stretch">
          {folders.map((folder) => {
            const count = notes.filter((note) => note.folderId === folder.id).length
            return (
              <div key={folder.id} className="group relative flex items-center">
                <button onClick={() => selectFolder(folder.id)} className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition lg:w-full lg:py-2.5 lg:text-sm ${activeFolderId === folder.id && !favoritesOnly ? 'bg-[#f7f1ea] text-[#725339]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${folder.color}`} />{folder.name}
                  <span className="ml-auto hidden text-[10px] text-slate-400 lg:inline">{count}</span>
                </button>
                <div className="absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 group-hover:flex">
                  <button onClick={() => setMenuFolderId(menuFolderId === folder.id ? null : folder.id)} className="rounded-md p-1 text-slate-400 hover:bg-white hover:text-slate-700" aria-label={`Options for ${folder.name}`}><MoreHorizontal size={15} /></button>
                  {menuFolderId === folder.id && (
                    <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                      <button onClick={() => { setFolderDialogId(folder.id); setMenuFolderId(null) }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"><Pencil size={13} /> Rename</button>
                      <button onClick={() => { if (window.confirm(`Delete "${folder.name}"? Its notes will be moved to All notes.`)) deleteFolder(folder.id); setMenuFolderId(null) }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-rose-600 hover:bg-rose-50"><Trash2 size={13} /> Delete</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <button onClick={() => setFolderDialogId(null)} className="flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 lg:hidden"><FolderPlus size={15} /> New folder</button>
        </nav>
        <div className="ml-auto hidden border-t border-slate-100 pt-4 lg:mt-auto lg:block">
          <button onClick={createNote} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700"><Plus size={15} /> New note</button>
          <div className="mt-4 flex items-center gap-2 px-1 text-[11px] text-slate-400"><Check size={13} className="text-emerald-500" /> All changes saved</div>
        </div>
      </aside>
      {folderDialogId !== undefined && <FolderDialog key={folderDialogId ?? 'new-folder'} folderId={folderDialogId} onClose={() => setFolderDialogId(undefined)} />}
    </>
  )
}
