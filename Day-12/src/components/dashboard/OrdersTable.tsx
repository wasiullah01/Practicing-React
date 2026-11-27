import { memo } from 'react'
import { ArrowUpRight, MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Order } from '../../data/orders'
import { Card } from '../ui/Card'

type OrdersTableProps = { orders: Order[]; showAll?: boolean }

export const OrdersTable = memo(function OrdersTable({ orders, showAll = false }: OrdersTableProps) {
  return (
    <Card className="overflow-hidden">
      <Card.Header className="items-center">
        <div>
          <Card.Title>{showAll ? 'All orders' : 'Recent orders'}</Card.Title>
          <Card.Description>{showAll ? 'A quick overview of your latest sales' : 'You have 5,000 orders in the last 12 months'}</Card.Description>
        </div>
        <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700">
          View all <ArrowUpRight size={14} />
        </Link>
      </Card.Header>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              <th className="px-6 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 text-right font-semibold">Amount</th>
              <th className="w-10 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="text-xs hover:bg-slate-50/50">
                <td className="whitespace-nowrap px-6 py-3.5 font-medium text-slate-700">{order.id}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full text-[9px] font-bold text-slate-600" style={{ backgroundColor: order.color }}>{order.initials}</span>
                    <span className="min-w-0">
                      <span className="block whitespace-nowrap font-medium text-slate-700">{order.customer}</span>
                      <span className="mt-0.5 block whitespace-nowrap text-[10px] text-slate-400">{order.email}</span>
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">{order.product}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">{new Date(`${order.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>
                <td className="whitespace-nowrap px-6 py-3.5 text-right font-medium text-slate-700">${order.amount.toFixed(2)}</td>
                <td className="pr-4 text-right text-slate-400"><button aria-label={`More options for ${order.id}`} className="rounded p-1 hover:bg-slate-100"><MoreHorizontal size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
})

export const StatusBadge = memo(function StatusBadge({ status }: { status: Order['status'] }) {
  const style = status === 'Completed'
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
    : status === 'Processing'
      ? 'bg-amber-50 text-amber-700 ring-amber-600/10'
      : 'bg-rose-50 text-rose-600 ring-rose-600/10'
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium ring-1 ring-inset ${style}`}><span className="size-1 rounded-full bg-current" />{status}</span>
})
