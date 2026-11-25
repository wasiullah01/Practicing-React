import { useState, type FormEvent } from 'react'
import { Check, X } from 'lucide-react'
import { columns, type Priority, type Status, type Task } from '../board'
import { useBoardActions } from './BoardProvider'

export function TaskDialog({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const { saveTask } = useBoardActions()
  const isEditing = Boolean(task?.id)
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<Status>(task?.status ?? 'todo')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'Medium')
  const [assignee, setAssignee] = useState(task?.assignee ?? '')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [tag, setTag] = useState(task?.tag ?? 'Product')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    saveTask({
      id: task?.id || crypto.randomUUID(),
      title: trimmedTitle,
      description: description.trim(),
      status,
      priority,
      assignee: assignee.trim() || 'Jamie Morgan',
      dueDate,
      tag: tag.trim() || 'General',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <form onSubmit={submit} className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Check size={17} /></span>
            <h2 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit task' : 'Create a task'}</h2>
            <p className="mt-1 text-xs text-slate-500">{isEditing ? 'Make changes to this task.' : 'Add a little more detail to keep everyone aligned.'}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close dialog"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-slate-700">Task name <span className="text-rose-500">*</span>
            <input autoFocus required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Prepare launch checklist" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-50" />
          </label>
          <label className="block text-xs font-semibold text-slate-700">Description
            <textarea maxLength={400} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What needs to be done?" className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-50" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-700">Status
              <select value={status} onChange={(event) => setStatus(event.target.value as Status)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-normal outline-none focus:border-violet-300">
                {columns.map((column) => <option key={column.id} value={column.id}>{column.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-700">Priority
              <select value={priority} onChange={(event) => setPriority(event.target.value as Priority)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-normal outline-none focus:border-violet-300">
                {(['Low', 'Medium', 'High'] as const).map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-700">Assignee
              <input value={assignee} onChange={(event) => setAssignee(event.target.value)} placeholder="Name" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-2.5 text-xs font-normal outline-none placeholder:text-slate-400 focus:border-violet-300" />
            </label>
            <label className="text-xs font-semibold text-slate-700">Due date
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-2.5 text-xs font-normal text-slate-600 outline-none focus:border-violet-300" />
            </label>
          </div>
          <label className="block text-xs font-semibold text-slate-700">Label
            <input value={tag} onChange={(event) => setTag(event.target.value)} placeholder="e.g. Design" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none placeholder:text-slate-400 focus:border-violet-300" />
          </label>
        </div>
        <div className="mt-7 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-700">{isEditing ? 'Save changes' : 'Create task'}</button>
        </div>
      </form>
    </div>
  )
}
