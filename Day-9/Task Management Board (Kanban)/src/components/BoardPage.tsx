import { useState } from 'react'
import { CircleHelp, LayoutGrid, ListFilter, MoreHorizontal, Search, X } from 'lucide-react'
import { columns, type Task } from '../board'
import { BoardColumn } from './BoardColumn'
import { useBoardActions, useBoardState } from './BoardProvider'
import { Sidebar } from './Sidebar'
import { TaskDialog } from './TaskDialog'
import { TopBar } from './TopBar'
import { Avatar } from './Avatar'

export function BoardPage() {
  const { tasks, search, notice } = useBoardState()
  const { setSearch, dismissNotice } = useBoardActions()
  const [dialogTask, setDialogTask] = useState<Task | null>(null)
  const completed = tasks.filter((task) => task.status === 'done').length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  const openNewTask = () => setDialogTask({ id: '', title: '', description: '', status: 'todo', priority: 'Medium', assignee: '', dueDate: '', tag: 'Product' })

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] text-slate-800">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar onNewTask={openNewTask} />
        <div className="flex-1 px-4 py-7 sm:px-7 sm:py-8">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"><span>Boards</span><span>/</span><span className="text-violet-600">Product launch</span></div>
                <h1 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-3xl">Product launch</h1>
                <p className="mt-1.5 text-xs text-slate-500">Plan, track, and ship something great together.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden items-center -space-x-2 sm:flex">
                  {['Olivia Chen', 'Noah Williams', 'Ava Patel', 'Ethan Brooks'].map((name, index) => <Avatar key={name} name={name} index={index} />)}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[9px] font-bold text-slate-500 ring-2 ring-white">+2</span>
                </div>
                <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50"><CircleHelp size={15} /> <span className="hidden sm:inline">Share board</span></button>
              </div>
            </div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                <button className="flex items-center gap-1.5 rounded-md bg-violet-50 px-2.5 py-1.5 text-[11px] font-semibold text-violet-700"><LayoutGrid size={14} /> Board</button>
                <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50"><ListFilter size={14} /> List</button>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="hidden sm:inline">{tasks.length} tasks</span>
                <span className="hidden h-3 w-px bg-slate-200 sm:block" />
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {progress}% complete</span>
                <button className="ml-1 rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50" aria-label="Board options"><MoreHorizontal size={16} /></button>
              </div>
            </div>
            <div className="mb-4 flex items-center gap-2 sm:hidden">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input aria-label="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 text-xs outline-none focus:border-violet-300" />
              </div>
            </div>
            <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-7 sm:px-7">
              <div className="flex min-h-[450px] items-stretch gap-3 sm:gap-4">
                {columns.map((column) => <BoardColumn key={column.id} status={column.id} onEdit={setDialogTask} />)}
              </div>
            </div>
          </div>
        </div>
        {notice && <div role="status" className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-3 rounded-xl border border-rose-200 bg-white p-4 text-xs text-slate-700 shadow-xl"><span className="flex-1">{notice}</span><button onClick={dismissNotice} aria-label="Dismiss notification"><X size={15} /></button></div>}
        {dialogTask && <TaskDialog key={dialogTask.id || 'new-task'} task={dialogTask} onClose={() => setDialogTask(null)} />}
      </main>
    </div>
  )
}
