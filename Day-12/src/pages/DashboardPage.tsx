import { useMemo } from 'react'
import { ArrowDownToLine, ArrowUpRight, Clock3, CreditCard, ShoppingCart, UsersRound } from 'lucide-react'
import { BreakdownCards } from '../components/dashboard/BreakdownCards'
import { MetricCard } from '../components/dashboard/MetricCard'
import { OrdersTable } from '../components/dashboard/OrdersTable'
import { RevenueChart } from '../components/dashboard/RevenueChart'
import { averageOrderValue, orders, totalRevenue } from '../data/orders'

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})
const wholeCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const preciseCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

export default function DashboardPage() {
  const recentOrders = useMemo(() => orders.slice(0, 5), [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-400">{today}</p>
          <h1 className="text-[25px] font-semibold tracking-[-0.035em] text-slate-900 sm:text-[28px]">Good morning, Jordan <span aria-hidden="true">✦</span></h1>
          <p className="mt-1.5 text-sm text-slate-500">Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <button onClick={() => window.print()} className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 sm:self-auto">
          <ArrowDownToLine size={14} /> Export report
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total revenue" value={wholeCurrency.format(totalRevenue)} change="12.8%" icon={<CreditCard size={17} />} iconClass="bg-violet-50 text-violet-600" />
        <MetricCard label="Total orders" value="5,000" change="8.2%" icon={<ShoppingCart size={17} />} iconClass="bg-sky-50 text-sky-600" />
        <MetricCard label="New customers" value="1,284" change="4.6%" icon={<UsersRound size={17} />} iconClass="bg-amber-50 text-amber-600" />
        <MetricCard label="Avg. order value" value={preciseCurrency.format(averageOrderValue)} change="2.1%" positive={false} icon={<Clock3 size={17} />} iconClass="bg-rose-50 text-rose-500" />
      </div>

      <RevenueChart />
      <BreakdownCards />
      <OrdersTable orders={recentOrders} />
      <p className="pb-2 text-center text-[10px] text-slate-400">Showing a live sample from 5,000 orders <ArrowUpRight className="inline" size={11} /></p>
    </div>
  )
}
