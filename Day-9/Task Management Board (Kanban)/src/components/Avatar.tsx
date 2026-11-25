const avatarColors = [
  'bg-orange-100 text-orange-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
]

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

export function Avatar({ name, index = 0, size = 'sm' }: { name: string; index?: number; size?: 'sm' | 'md' }) {
  return (
    <span
      aria-label={name}
      title={name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-white ${avatarColors[index % avatarColors.length]} ${size === 'md' ? 'h-9 w-9 text-xs' : 'h-7 w-7 text-[10px]'}`}
    >
      {initials(name)}
    </span>
  )
}
