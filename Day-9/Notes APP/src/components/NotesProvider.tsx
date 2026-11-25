import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { isFolder, isNote, starterFolders, starterNotes, type Folder, type Note } from '../notes'

type Workspace = {
  folders: Folder[]
  notes: Note[]
}

type NotesState = Workspace & {
  activeFolderId: string | null
  favoritesOnly: boolean
  selectedNoteId: string | null
  search: string
  notice: string
}

type NotesActions = {
  setSearch: (value: string) => void
  selectFolder: (folderId: string | null) => void
  selectFavorites: () => void
  selectNote: (noteId: string) => void
  createNote: () => void
  updateNote: (noteId: string, patch: Partial<Pick<Note, 'title' | 'content'>>) => void
  toggleFavorite: (noteId: string) => void
  deleteNote: (noteId: string) => void
  createFolder: (name: string) => void
  renameFolder: (folderId: string, name: string) => void
  deleteFolder: (folderId: string) => void
  dismissNotice: () => void
}

const NotesStateContext = createContext<NotesState | null>(null)
const NotesActionsContext = createContext<NotesActions | null>(null)

function readWorkspace(): { workspace: Workspace; notice: string } {
  try {
    const saved = localStorage.getItem('papertrail.workspace')
    if (!saved) return { workspace: { folders: starterFolders, notes: starterNotes }, notice: '' }
    const parsed: unknown = JSON.parse(saved)
    if (
      parsed &&
      typeof parsed === 'object' &&
      'folders' in parsed &&
      'notes' in parsed &&
      Array.isArray(parsed.folders) &&
      Array.isArray(parsed.notes) &&
      parsed.folders.every(isFolder) &&
      parsed.notes.every(isNote)
    ) {
      return { workspace: { folders: parsed.folders, notes: parsed.notes }, notice: '' }
    }
  } catch {
    return {
      workspace: { folders: starterFolders, notes: starterNotes },
      notice: 'Saved notes could not be read. The sample workspace is shown instead.',
    }
  }
  return {
    workspace: { folders: starterFolders, notes: starterNotes },
    notice: 'Saved notes were invalid. The sample workspace is shown instead.',
  }
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(readWorkspace)
  const [workspace, setWorkspace] = useState(initial.workspace)
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(initial.workspace.notes[0]?.id ?? null)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState(initial.notice)
  const version = useRef(0)

  const commit = useCallback((next: Workspace) => {
    const previous = workspace
    const updateVersion = ++version.current
    setWorkspace(next)
    window.setTimeout(() => {
      try {
        localStorage.setItem('papertrail.workspace', JSON.stringify(next))
      } catch {
        if (version.current === updateVersion) setWorkspace(previous)
        setNotice('Could not save your changes. The previous workspace was restored.')
      }
    }, 120)
  }, [workspace])

  const selectFolder = useCallback((folderId: string | null) => {
    setActiveFolderId(folderId)
    setFavoritesOnly(false)
    setSelectedNoteId(workspace.notes.find((note) => note.folderId === folderId)?.id ?? null)
  }, [workspace.notes])

  const selectFavorites = useCallback(() => {
    setActiveFolderId(null)
    setFavoritesOnly(true)
    setSelectedNoteId(workspace.notes.find((note) => note.favorite)?.id ?? null)
  }, [workspace.notes])

  const createNote = useCallback(() => {
    const folderId = activeFolderId ?? workspace.folders[0]?.id ?? null
    const note: Note = {
      id: crypto.randomUUID(),
      folderId,
      title: 'Untitled note',
      content: '',
      updatedAt: new Date().toISOString(),
      favorite: false,
    }
    commit({ ...workspace, notes: [note, ...workspace.notes] })
    setActiveFolderId(folderId)
    setFavoritesOnly(false)
    setSelectedNoteId(note.id)
  }, [activeFolderId, commit, workspace])

  const updateNote = useCallback((noteId: string, patch: Partial<Pick<Note, 'title' | 'content'>>) => {
    commit({
      ...workspace,
      notes: workspace.notes.map((note) =>
        note.id === noteId ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note,
      ),
    })
  }, [commit, workspace])

  const toggleFavorite = useCallback((noteId: string) => {
    commit({
      ...workspace,
      notes: workspace.notes.map((note) =>
        note.id === noteId ? { ...note, favorite: !note.favorite, updatedAt: new Date().toISOString() } : note,
      ),
    })
  }, [commit, workspace])

  const deleteNote = useCallback((noteId: string) => {
    const notes = workspace.notes.filter((note) => note.id !== noteId)
    commit({ ...workspace, notes })
    setSelectedNoteId(notes.find((note) => favoritesOnly ? note.favorite : activeFolderId ? note.folderId === activeFolderId : true)?.id ?? null)
  }, [activeFolderId, commit, favoritesOnly, workspace])

  const createFolder = useCallback((name: string) => {
    const folder: Folder = { id: crypto.randomUUID(), name, color: 'bg-violet-500' }
    commit({ ...workspace, folders: [...workspace.folders, folder] })
    setActiveFolderId(folder.id)
    setFavoritesOnly(false)
    setSelectedNoteId(null)
  }, [commit, workspace])

  const renameFolder = useCallback((folderId: string, name: string) => {
    commit({ ...workspace, folders: workspace.folders.map((folder) => folder.id === folderId ? { ...folder, name } : folder) })
  }, [commit, workspace])

  const deleteFolder = useCallback((folderId: string) => {
    commit({
      folders: workspace.folders.filter((folder) => folder.id !== folderId),
      notes: workspace.notes.map((note) => note.folderId === folderId ? { ...note, folderId: null } : note),
    })
    if (activeFolderId === folderId) selectFolder(null)
  }, [activeFolderId, commit, selectFolder, workspace])

  const state = useMemo(
    () => ({ ...workspace, activeFolderId, favoritesOnly, selectedNoteId, search, notice }),
    [workspace, activeFolderId, favoritesOnly, selectedNoteId, search, notice],
  )
  const actions = useMemo(
    () => ({
      setSearch,
      selectFolder,
      selectFavorites,
      selectNote: setSelectedNoteId,
      createNote,
      updateNote,
      toggleFavorite,
      deleteNote,
      createFolder,
      renameFolder,
      deleteFolder,
      dismissNotice: () => setNotice(''),
    }),
    [selectFolder, selectFavorites, createNote, updateNote, toggleFavorite, deleteNote, createFolder, renameFolder, deleteFolder],
  )

  return (
    <NotesStateContext.Provider value={state}>
      <NotesActionsContext.Provider value={actions}>{children}</NotesActionsContext.Provider>
    </NotesStateContext.Provider>
  )
}

export function useNotesState() {
  const context = useContext(NotesStateContext)
  if (!context) throw new Error('useNotesState must be used within NotesProvider')
  return context
}

export function useNotesActions() {
  const context = useContext(NotesActionsContext)
  if (!context) throw new Error('useNotesActions must be used within NotesProvider')
  return context
}
