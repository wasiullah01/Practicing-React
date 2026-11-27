import { memo, type ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

type MetricCardProps = {
  label: string
  value: string
  change: string
  positive?: boolean
  icon: ReactNode
  iconClass: string
  comparison?: string
}

export const MetricCard = memo(function MetricCard({
  label, value, change, positive = true, icon, iconClass, comparison = 'vs. last month',
}: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(27,31,59,0.025)] sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <span className={`grid size-9 place-items-center rounded-xl ${iconClass}`}>{icon}</span>
      </div>
      <p className="mt-4 text-[26px] font-semibold tracking-[-0.04em] text-slate-900">{value}</p>
      <div className="mt-2 flex items-center gap-1.5 text-[11px]">
        <span className={`inline-flex items-center gap-0.5 font-semibold ${positive ? 'text-emerald-600' : 'text-rose-500'}`}>
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{change}
        </span>
        <span className="text-slate-400">{comparison}</span>
      </div>
    </article>
  )
})
