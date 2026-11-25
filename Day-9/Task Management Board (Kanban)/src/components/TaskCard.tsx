import { useState } from 'react'
import { CalendarDays, MoreHorizontal, Tag, Trash2 } from 'lucide-react'
import { columns, type Task } from '../board'
import { Avatar } from './Avatar'
import { useBoardActions } from './BoardProvider'

export function TaskCard({ task, onEdit }: { task: Task; onEdit: (task: Task) => void }) {
  const { deleteTask, moveTask } = useBoardActions()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const assigneeIndex = ['Olivia Chen', 'Noah Williams', 'Ava Patel', 'Ethan Brooks', 'Mia Thompson'].indexOf(task.assignee)
  const due = new Date(`${task.dueDate}T12:00:00`)
  const overdue = task.status !== 'done' && due < new Date(new Date().toDateString())
  const dueLabel = task.dueDate
    ? due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'No due date'

  return (
    <article
      draggable
      onDragStart={(event) => { event.dataTransfer.setData('text/plain', task.id); event.dataTransfer.effectAllowed = 'move'; setDragging(true) }}
      onDragEnd={() => setDragging(false)}
      className={`group rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${dragging ? 'opacity-40' : ''}`}
    >
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${task.priority === 'High' ? 'bg-rose-50 text-rose-700' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
          {task.priority} priority
        </span>
        <div className="relative">
          <button onClick={() => setMenuOpen((open) => !open)} className="rounded-md p-1 text-slate-400 opacity-0 transition hover:bg-slate-100 group-hover:opacity-100 focus:opacity-100" aria-label="Task actions"><MoreHorizontal size={17} /></button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
              <button onClick={() => { onEdit(task); setMenuOpen(false) }} className="w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50">Edit task</button>
              {columns.filter((column) => column.id !== task.status).map((column) => (
                <button key={column.id} onClick={() => { moveTask(task.id, column.id); setMenuOpen(false) }} className="w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50">Move to {column.label}</button>
              ))}
              <button onClick={() => deleteTask(task.id)} className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50"><Trash2 size={12} /> Delete task</button>
            </div>
          )}
        </div>
      </div>
      <button onClick={() => onEdit(task)} className="block w-full text-left">
        <h3 className="text-[13px] font-semibold leading-5 text-slate-800">{task.title}</h3>
        <p className="mt-1.5 line-clamp-2 min-h-9 text-[11px] leading-[18px] text-slate-500">{task.description}</p>
      </button>
      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
        <Tag size={12} className="text-slate-400" /><span>{task.tag}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className={`flex items-center gap-1.5 text-[10px] ${overdue ? 'font-semibold text-rose-600' : 'text-slate-400'}`}>
          <CalendarDays size={12} />{dueLabel}{overdue && <span className="text-[9px]">overdue</span>}
        </div>
        <Avatar name={task.assignee} index={Math.max(assigneeIndex, 0)} />
      </div>
    </article>
  )
}
