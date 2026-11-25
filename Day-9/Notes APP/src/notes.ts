export type Folder = {
  id: string
  name: string
  color: string
}

export type Note = {
  id: string
  folderId: string | null
  title: string
  content: string
  updatedAt: string
  favorite: boolean
}

export const starterFolders: Folder[] = [
  { id: 'folder-work', name: 'Work', color: 'bg-violet-500' },
  { id: 'folder-personal', name: 'Personal', color: 'bg-amber-400' },
  { id: 'folder-ideas', name: 'Ideas', color: 'bg-emerald-500' },
  { id: 'folder-reading', name: 'Reading list', color: 'bg-sky-500' },
]

const updated = (hoursAgo: number) => new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()

export const starterNotes: Note[] = [
  {
    id: 'note-1',
    folderId: 'folder-work',
    title: 'Q4 launch plan',
    content: '## A thoughtful launch, from start to finish\n\nThe best launches feel effortless because the details were considered early. Let’s keep the plan focused and leave room for the unexpected.\n\n### This week\n- Align on the launch story and audience\n- Confirm owners for each milestone\n- Share the first draft with the wider team\n\n### Open questions\nWhat is the one thing we want people to remember? How will we know the launch is working beyond the first day?\n\nSmall, clear steps beat a long list of maybes.',
    updatedAt: updated(1),
    favorite: true,
  },
  {
    id: 'note-2',
    folderId: 'folder-work',
    title: 'Meeting notes · Design sync',
    content: '## Design sync\n\n**Attendees:** Olivia, Ethan, Ava\n\n### Decisions\n- Keep the new navigation compact\n- Try warm neutrals with one bright accent\n- Review the empty states before handing off\n\n### Next steps\nAva to share the updated board by Thursday. Ethan will check the responsive layouts.',
    updatedAt: updated(5),
    favorite: false,
  },
  {
    id: 'note-3',
    folderId: 'folder-personal',
    title: 'Weekend ideas',
    content: '## A slower Saturday\n\n- Find a new coffee spot\n- Walk by the water if the weather is kind\n- Pick up ingredients for dinner\n\nRemember to bring a book and leave the afternoon open.',
    updatedAt: updated(26),
    favorite: true,
  },
  {
    id: 'note-4',
    folderId: 'folder-ideas',
    title: 'A tiny daily journal',
    content: '## The idea\n\nA calm place to write one good thing from the day. No streaks, no pressure, no scores.\n\nMaybe start with a single prompt: **What felt easier today than it did last week?**',
    updatedAt: updated(42),
    favorite: false,
  },
  {
    id: 'note-5',
    folderId: 'folder-reading',
    title: 'Books to come back to',
    content: '## On the list\n\n- *The Creative Act* — Rick Rubin\n- *Four Thousand Weeks* — Oliver Burkeman\n- *A Swim in a Pond in the Rain* — George Saunders\n\nAdd a sentence about why each one caught your eye.',
    updatedAt: updated(74),
    favorite: false,
  },
  {
    id: 'note-6',
    folderId: 'folder-work',
    title: 'Product voice & tone',
    content: '## Sound like a helpful teammate\n\nClear, warm, and confident. Use plain language and make the next step easy to find.\n\n### We are\n- Friendly, never overly familiar\n- Direct, never abrupt\n- Encouraging, never pushy',
    updatedAt: updated(120),
    favorite: false,
  },
]

export function isFolder(value: unknown): value is Folder {
  if (!value || typeof value !== 'object') return false
  const folder = value as Record<string, unknown>
  return typeof folder.id === 'string' && typeof folder.name === 'string' && typeof folder.color === 'string'
}

export function isNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false
  const note = value as Record<string, unknown>
  return (
    typeof note.id === 'string' &&
    (note.folderId === null || typeof note.folderId === 'string') &&
    typeof note.title === 'string' &&
    typeof note.content === 'string' &&
    typeof note.updatedAt === 'string' &&
    typeof note.favorite === 'boolean'
  )
}
