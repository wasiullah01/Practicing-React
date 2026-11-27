import { ArrowUpRight, UserPlus, UsersRound } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { orders } from '../data/orders'

const customerRows = orders.slice(0, 8)

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-1.5 text-xs font-medium text-slate-400">Workspace / Customers</p><h1 className="text-[27px] font-semibold tracking-[-0.035em] text-slate-900">Customers</h1><p className="mt-1 text-sm text-slate-500">Get to know the people behind your orders.</p></div>
        <button className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg bg-violet-600 px-3.5 text-xs font-semibold text-white hover:bg-violet-700 sm:self-auto"><UserPlus size={14} /> Add customer</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[{ label: 'Total customers', value: '3,842', icon: UsersRound }, { label: 'New this month', value: '284', icon: UserPlus }, { label: 'Repeat purchase rate', value: '38.6%', icon: ArrowUpRight }].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-xl border border-slate-200/80 bg-white p-5"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">{label}</p><Icon size={17} className="text-violet-500" /></div><p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{value}</p><p className="mt-1 text-[10px] text-emerald-600">↑ 6.4% compared to last month</p></div>)}
      </div>
      <Card>
        <Card.Header><div><Card.Title>Recently active</Card.Title><Card.Description>Your latest customer activity</Card.Description></div></Card.Header>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead><tr className="border-y border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400"><th className="px-6 py-3">Customer</th><th className="px-4 py-3">Last order</th><th className="px-4 py-3">Orders</th><th className="px-6 py-3 text-right">Lifetime value</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{customerRows.map((customer, index) => <tr key={customer.id} className="text-xs"><td className="px-6 py-3.5"><div className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-full text-[9px] font-bold text-slate-600" style={{ backgroundColor: customer.color }}>{customer.initials}</span><span><span className="block font-medium text-slate-700">{customer.customer}</span><span className="mt-0.5 block text-[10px] text-slate-400">{customer.email}</span></span></div></td><td className="px-4 py-3.5 text-slate-500">{new Date(`${customer.date}T12:00:00`).toLocaleDateString()}</td><td className="px-4 py-3.5 text-slate-600">{index + 2}</td><td className="px-6 py-3.5 text-right font-semibold text-slate-700">${(customer.amount * (index + 2)).toLocaleString()} <ArrowUpRight size={13} className="ml-1 inline text-emerald-500" /></td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
