export const columns = [
  { id: 'todo', label: 'To do', color: 'bg-slate-400', tint: 'bg-slate-100 text-slate-600' },
  { id: 'in-progress', label: 'In progress', color: 'bg-violet-500', tint: 'bg-violet-50 text-violet-700' },
  { id: 'review', label: 'Review', color: 'bg-amber-400', tint: 'bg-amber-50 text-amber-700' },
  { id: 'done', label: 'Done', color: 'bg-emerald-500', tint: 'bg-emerald-50 text-emerald-700' },
] as const

export type Status = (typeof columns)[number]['id']
export type Priority = 'Low' | 'Medium' | 'High'

export type Task = {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  assignee: string
  dueDate: string
  tag: string
}

const dateInDays = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export const starterTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Refresh onboarding flow',
    description: 'Simplify the first-run experience and make the next step obvious.',
    status: 'todo',
    priority: 'High',
    assignee: 'Olivia Chen',
    dueDate: dateInDays(2),
    tag: 'Product',
  },
  {
    id: 'task-2',
    title: 'Map customer journey',
    description: 'Document key touchpoints and identify where people get stuck.',
    status: 'todo',
    priority: 'Medium',
    assignee: 'Noah Williams',
    dueDate: dateInDays(5),
    tag: 'Research',
  },
  {
    id: 'task-3',
    title: 'Write empty-state copy',
    description: 'Give every empty screen a helpful, human next action.',
    status: 'todo',
    priority: 'Low',
    assignee: 'Ava Patel',
    dueDate: dateInDays(7),
    tag: 'Content',
  },
  {
    id: 'task-4',
    title: 'Build activity timeline',
    description: 'Bring the latest project updates together in one clear view.',
    status: 'in-progress',
    priority: 'High',
    assignee: 'Ethan Brooks',
    dueDate: dateInDays(1),
    tag: 'Engineering',
  },
  {
    id: 'task-5',
    title: 'Design project overview',
    description: 'Explore a compact dashboard for project health and ownership.',
    status: 'in-progress',
    priority: 'Medium',
    assignee: 'Olivia Chen',
    dueDate: dateInDays(4),
    tag: 'Design',
  },
  {
    id: 'task-6',
    title: 'Add keyboard shortcuts',
    description: 'Make the most-used board actions faster to reach.',
    status: 'review',
    priority: 'Low',
    assignee: 'Mia Thompson',
    dueDate: dateInDays(3),
    tag: 'Engineering',
  },
  {
    id: 'task-7',
    title: 'Update component library',
    description: 'Align buttons, inputs, and cards with the updated visual system.',
    status: 'review',
    priority: 'Medium',
    assignee: 'Ava Patel',
    dueDate: dateInDays(6),
    tag: 'Design',
  },
  {
    id: 'task-8',
    title: 'Ship account settings',
    description: 'Profile, preferences, and notification settings are ready to go.',
    status: 'done',
    priority: 'High',
    assignee: 'Noah Williams',
    dueDate: dateInDays(-1),
    tag: 'Product',
  },
]

export function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    columns.some((column) => column.id === task.status) &&
    ['Low', 'Medium', 'High'].includes(String(task.priority)) &&
    typeof task.assignee === 'string' &&
    typeof task.dueDate === 'string' &&
    typeof task.tag === 'string'
  )
}
