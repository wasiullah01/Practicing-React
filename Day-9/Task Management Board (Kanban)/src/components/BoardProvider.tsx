import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { isTask, starterTasks, type Status, type Task } from '../board'

type BoardState = {
  tasks: Task[]
  search: string
  priority: string
  notice: string
}

type BoardActions = {
  setSearch: (value: string) => void
  setPriority: (value: string) => void
  dismissNotice: () => void
  saveTask: (task: Task) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, status: Status) => void
}

const BoardStateContext = createContext<BoardState | null>(null)
const BoardActionsContext = createContext<BoardActions | null>(null)

function readTasks(): { tasks: Task[]; notice: string } {
  try {
    const saved = localStorage.getItem('flowboard.tasks')
    if (!saved) return { tasks: starterTasks, notice: '' }
    const parsed: unknown = JSON.parse(saved)
    if (Array.isArray(parsed) && parsed.every(isTask)) return { tasks: parsed, notice: '' }
  } catch {
    return { tasks: starterTasks, notice: 'Saved board data could not be read. The starter board is shown instead.' }
  }
  return { tasks: starterTasks, notice: 'Saved board data was invalid. The starter board is shown instead.' }
}

export function BoardProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(readTasks)
  const [tasks, setTasks] = useState<Task[]>(initial.tasks)
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('All priorities')
  const [notice, setNotice] = useState(initial.notice)
  const version = useRef(0)

  const persistOptimistically = useCallback((next: Task[]) => {
    const previous = tasks
    const updateVersion = ++version.current
    setTasks(next)
    window.setTimeout(() => {
      try {
        localStorage.setItem('flowboard.tasks', JSON.stringify(next))
      } catch {
        if (version.current === updateVersion) setTasks(previous)
        setNotice('Could not save your changes. The previous board state was restored.')
      }
    }, 120)
  }, [tasks])

  const saveTask = useCallback((task: Task) => {
    const existingIndex = tasks.findIndex((item) => item.id === task.id)
    const next = existingIndex < 0
      ? [task, ...tasks]
      : tasks.map((item) => item.id === task.id ? task : item)
    persistOptimistically(next)
  }, [persistOptimistically, tasks])

  const deleteTask = useCallback((id: string) => {
    persistOptimistically(tasks.filter((task) => task.id !== id))
  }, [persistOptimistically, tasks])

  const moveTask = useCallback((id: string, status: Status) => {
    persistOptimistically(tasks.map((task) => task.id === id ? { ...task, status } : task))
  }, [persistOptimistically, tasks])

  const state = useMemo(() => ({ tasks, search, priority, notice }), [tasks, search, priority, notice])
  const actions = useMemo(
    () => ({ setSearch, setPriority, dismissNotice: () => setNotice(''), saveTask, deleteTask, moveTask }),
    [saveTask, deleteTask, moveTask],
  )

  return (
    <BoardStateContext.Provider value={state}>
      <BoardActionsContext.Provider value={actions}>{children}</BoardActionsContext.Provider>
    </BoardStateContext.Provider>
  )
}

export function useBoardState() {
  const context = useContext(BoardStateContext)
  if (!context) throw new Error('useBoardState must be used within BoardProvider')
  return context
}

export function useBoardActions() {
  const context = useContext(BoardActionsContext)
  if (!context) throw new Error('useBoardActions must be used within BoardProvider')
  return context
}
