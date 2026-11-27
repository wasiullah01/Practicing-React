import { ArrowUpRight, Package, ShoppingBag, TrendingUp } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { topProducts } from '../data/orders'

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-400">Workspace / Products</p>
        <h1 className="text-[27px] font-semibold tracking-[-0.035em] text-slate-900">Product performance</h1>
        <p className="mt-1 text-sm text-slate-500">See what&apos;s selling and where to focus next.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: 'Total products', value: '128', icon: Package, accent: 'bg-violet-50 text-violet-600', trend: '12 new this month' },
          { title: 'Units sold', value: '8,492', icon: ShoppingBag, accent: 'bg-sky-50 text-sky-600', trend: '+8.4% this month' },
          { title: 'Product revenue', value: '$284,592', icon: TrendingUp, accent: 'bg-emerald-50 text-emerald-600', trend: '+12.8% this month' },
        ].map(({ title, value, icon: Icon, accent, trend }) => <div key={title} className="rounded-xl border border-slate-200/80 bg-white p-5"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">{title}</p><span className={`grid size-9 place-items-center rounded-xl ${accent}`}><Icon size={17} /></span></div><p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{value}</p><p className="mt-1 text-[10px] font-medium text-emerald-600">{trend}</p></div>)}
      </div>
      <Card>
        <Card.Header><div><Card.Title>Top selling products</Card.Title><Card.Description>Ranked by revenue this month</Card.Description></div><button className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-medium text-slate-600">This month</button></Card.Header>
        <Card.Content className="space-y-5">
          {topProducts.map((product, index) => (
            <div key={product.name} className="grid grid-cols-[32px_1fr_auto] items-center gap-3 sm:grid-cols-[40px_1fr_100px_100px]">
              <span className="grid size-9 place-items-center rounded-xl bg-slate-50 text-xs font-semibold text-slate-500">0{index + 1}</span>
              <div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-700">{product.name}</p><p className="mt-1 text-[10px] text-slate-400">{product.category} · {product.sold} sold</p><div className="mt-2 h-1.5 rounded-full bg-slate-100 sm:hidden"><div className={`h-full rounded-full ${product.color}`} style={{ width: `${product.share}%` }} /></div></div>
              <div className="hidden sm:block"><div className="h-1.5 rounded-full bg-slate-100"><div className={`h-full rounded-full ${product.color}`} style={{ width: `${product.share}%` }} /></div></div>
              <div className="text-right"><p className="text-xs font-semibold text-slate-800">${product.revenue.toLocaleString()}</p><p className="mt-1 text-[10px] text-emerald-600">+{product.share / 10}% <ArrowUpRight className="inline" size={10} /></p></div>
            </div>
          ))}
        </Card.Content>
      </Card>
    </div>
  )
}
