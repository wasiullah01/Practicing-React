import { ArrowRight, LayoutGrid, ListFilter, Plus, Settings2, Sparkles } from 'lucide-react'
import { Avatar } from './Avatar'

export function Sidebar() {
  return (
    <aside className="hidden w-[248px] shrink-0 flex-col border-r border-slate-200/80 bg-white px-5 py-6 lg:flex">
      <a href="#" className="mb-10 flex items-center gap-3 px-1" aria-label="Flowboard home">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
          <LayoutGrid size={18} strokeWidth={2.5} />
        </span>
        <span className="text-[17px] font-bold tracking-tight text-slate-900">flowboard</span>
      </a>
      <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
      <nav className="space-y-1">
        <a href="#" className="flex items-center gap-3 rounded-xl bg-violet-50 px-3 py-2.5 text-sm font-semibold text-violet-700">
          <LayoutGrid size={17} /> My board
        </a>
        <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">
          <ListFilter size={17} /> My tasks <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold">8</span>
        </a>
      </nav>
      <div className="mb-3 mt-9 flex items-center justify-between px-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Your boards</p>
        <button className="rounded-md p-1 text-slate-400 hover:bg-slate-100" aria-label="Add board"><Plus size={15} /></button>
      </div>
      <nav className="space-y-1">
        <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <span className="h-2 w-2 rounded-full bg-violet-500" /> Product launch
        </a>
        <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Website refresh
        </a>
        <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Q4 planning
        </a>
      </nav>
      <div className="mt-auto rounded-2xl bg-slate-50 p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm"><Sparkles size={17} /></div>
        <p className="text-sm font-semibold text-slate-800">Keep the momentum</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">A little progress each day adds up to big things.</p>
        <button className="mt-3 text-xs font-semibold text-violet-700 hover:text-violet-900">View workspace tips <ArrowRight className="ml-1 inline" size={13} /></button>
      </div>
      <div className="mt-5 flex items-center gap-3 border-t border-slate-100 px-1 pt-5">
        <Avatar name="Jamie Morgan" index={4} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-800">Jamie Morgan</p>
          <p className="text-[11px] text-slate-400">Free plan</p>
        </div>
        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Account settings"><Settings2 size={16} /></button>
      </div>
    </aside>
  )
}
