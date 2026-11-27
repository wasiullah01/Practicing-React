import { memo, useCallback, useMemo } from 'react'
import { ArrowDownToLine, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { OrdersTable } from '../components/dashboard/OrdersTable'
import { orders, type OrderStatus } from '../data/orders'

const PAGE_SIZE = 10
type StatusFilter = 'All status' | OrderStatus

const OrdersTableSection = memo(function OrdersTableSection({ pageOrders }: { pageOrders: typeof orders }) {
  return <OrdersTable orders={pageOrders} showAll />
})

export default function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const statusValue = searchParams.get('status')
  const status: StatusFilter = statusValue === 'Completed' || statusValue === 'Processing' || statusValue === 'Refunded'
    ? statusValue
    : 'All status'
  const requestedPage = Number(searchParams.get('page') ?? 1)
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesSearch = !query || [order.id, order.customer, order.email, order.product].some((value) => value.toLowerCase().includes(query))
      return matchesSearch && (status === 'All status' || order.status === status)
    })
  }, [search, status])
  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visibleOrders = useMemo(() => filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [filteredOrders, currentPage])

  const setPage = useCallback((nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams)
    if (nextPage <= 1) nextParams.delete('page')
    else nextParams.set('page', String(nextPage))
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

  const handleSearch = useCallback((value: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (value) nextParams.set('search', value)
    else nextParams.delete('search')
    nextParams.delete('page')
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])
  const handleStatus = useCallback((value: StatusFilter) => {
    const nextParams = new URLSearchParams(searchParams)
    if (value === 'All status') nextParams.delete('status')
    else nextParams.set('status', value)
    nextParams.delete('page')
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])
  const exportOrders = useCallback(() => {
    const header = ['Order', 'Customer', 'Email', 'Product', 'Date', 'Status', 'Amount']
    const rows = filteredOrders.map((order) => [order.id, order.customer, order.email, order.product, order.date, order.status, order.amount.toFixed(2)])
    const csv = [header, ...rows].map((row) => row.map((field) => `"${field.replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'forma-orders.csv'
    link.click()
    URL.revokeObjectURL(url)
  }, [filteredOrders])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-400">Workspace / Orders</p>
          <h1 className="text-[27px] font-semibold tracking-[-0.035em] text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Track, manage, and fulfill your customer orders.</p>
        </div>
        <button onClick={exportOrders} className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg bg-violet-600 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 sm:self-auto">
          <ArrowDownToLine size={14} /> Export CSV
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'All orders', value: '5,000', foot: 'Across all channels' },
          { label: 'Completed', value: '3,000', foot: '60% of total orders' },
          { label: 'Processing', value: '1,000', foot: 'Ready to fulfill' },
        ].map((metric) => (
          <div key={metric.label} className="rounded-xl border border-slate-200/80 bg-white p-4">
            <p className="text-xs text-slate-500">{metric.label}</p><p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{metric.value}</p><p className="mt-1 text-[10px] text-slate-400">{metric.foot}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => handleSearch(event.target.value)} placeholder="Search orders, customers, products..." className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
        </label>
        <label className="relative flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-500">
          <SlidersHorizontal size={14} />
          <span className="sr-only">Filter by status</span>
          <select value={status} onChange={(event) => handleStatus(event.target.value as StatusFilter)} className="h-full min-w-28 bg-transparent pr-1 text-xs outline-none">
            <option>All status</option><option>Completed</option><option>Processing</option><option>Refunded</option>
          </select>
        </label>
      </div>

      <OrdersTableSection pageOrders={visibleOrders} />
      <div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium text-slate-700">{filteredOrders.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}</span> of <span className="font-medium text-slate-700">{filteredOrders.length.toLocaleString()}</span> orders
        </p>
        <div className="flex items-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setPage(Math.max(1, currentPage - 1))} className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={14} /> Previous</button>
          <span className="px-2 text-xs text-slate-500">Page {currentPage} of {pageCount}</span>
          <button disabled={currentPage >= pageCount} onClick={() => setPage(Math.min(pageCount, currentPage + 1))} className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  )
}
