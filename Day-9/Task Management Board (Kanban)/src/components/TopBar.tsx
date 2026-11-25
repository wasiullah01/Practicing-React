import { useState } from 'react'
import {
  Bell,
  Check,
  ChevronDown,
  Command,
  Plus,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { useBoardActions, useBoardState } from './BoardProvider'

export function TopBar({ onNewTask }: { onNewTask: () => void }) {
  const { search, priority } = useBoardState()
  const { setSearch, setPriority } = useBoardActions()
  const [showFilter, setShowFilter] = useState(false)

  return (
    <header className="flex min-h-[68px] items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-4 sm:px-7">
      <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
        <span className="hidden sm:inline">Workspace</span><span className="hidden sm:inline">/</span>
        <span className="truncate font-semibold text-slate-700">Product launch</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input aria-label="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." className="h-9 w-44 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-xs outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50" />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1 text-[9px] text-slate-400"><Command size={10} /></span>
        </label>
        <div className="relative">
          <button onClick={() => setShowFilter((open) => !open)} className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition ${priority !== 'All priorities' ? 'border-violet-200 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`} aria-label="Filter by priority">
            <SlidersHorizontal size={15} /><span className="hidden md:inline">Filter</span><ChevronDown size={13} />
          </button>
          {showFilter && (
            <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Priority</p>
              {['All priorities', 'High', 'Medium', 'Low'].map((option) => (
                <button key={option} onClick={() => { setPriority(option); setShowFilter(false) }} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs text-slate-600 hover:bg-slate-50">
                  {option}{priority === option && <Check size={14} className="text-violet-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 sm:flex" aria-label="Notifications"><Bell size={16} /></button>
        <button onClick={onNewTask} className="flex h-9 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200">
          <Plus size={15} /><span className="hidden sm:inline">New task</span><span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  )
}
