import { ArrowDown, Plus } from 'lucide-react'
import { columns, type Status, type Task } from '../board'
import { TaskCard } from './TaskCard'
import { useBoardActions, useBoardState } from './BoardProvider'

export function BoardColumn({ status, onEdit }: { status: Status; onEdit: (task: Task) => void }) {
  const { tasks, search, priority } = useBoardState()
  const { moveTask } = useBoardActions()
  const column = columns.find((item) => item.id === status)!
  const visibleTasks = tasks.filter((task) => {
    const matchesText = `${task.title} ${task.description} ${task.assignee} ${task.tag}`.toLowerCase().includes(search.toLowerCase())
    return task.status === status && matchesText && (priority === 'All priorities' || task.priority === priority)
  })

  return (
    <section
      onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move' }}
      onDrop={(event) => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); if (id) moveTask(id, status) }}
      className="flex min-h-[420px] min-w-[265px] flex-1 flex-col rounded-2xl bg-slate-100/70 p-3 sm:min-w-[280px] sm:p-3.5"
    >
      <header className="mb-3 flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
          <h2 className="text-[13px] font-bold text-slate-700">{column.label}</h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-white px-1.5 text-[10px] font-semibold text-slate-500 shadow-sm">{visibleTasks.length}</span>
        </div>
        <button onClick={() => onEdit({ id: '', title: '', description: '', status, priority: 'Medium', assignee: '', dueDate: '', tag: '' })} className="rounded-md p-1 text-slate-400 transition hover:bg-white hover:text-slate-700" aria-label={`Add task to ${column.label}`}><Plus size={16} /></button>
      </header>
      <div className="flex flex-1 flex-col gap-2.5">
        {visibleTasks.map((task) => <TaskCard key={task.id} task={task} onEdit={onEdit} />)}
        {visibleTasks.length === 0 && (
          <div className="flex min-h-32 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300/80 px-4 text-center">
            <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400"><ArrowDown size={15} /></span>
            <p className="text-[11px] font-medium text-slate-500">{search || priority !== 'All priorities' ? 'No matching tasks' : 'Drop a task here'}</p>
            <p className="mt-1 text-[10px] text-slate-400">or add a new one</p>
          </div>
        )}
      </div>
    </section>
  )
}
