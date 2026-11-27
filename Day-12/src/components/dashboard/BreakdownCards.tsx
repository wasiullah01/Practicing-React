import { ArrowUpRight } from 'lucide-react'
import { Card } from '../ui/Card'

const sources = [
  { name: 'Online store', detail: 'Direct & organic', amount: '$168,492', share: 59, color: 'bg-violet-500' },
  { name: 'Social media', detail: 'Instagram, TikTok', amount: '$74,821', share: 26, color: 'bg-sky-400' },
  { name: 'Marketplaces', detail: 'Etsy, Amazon', amount: '$41,279', share: 15, color: 'bg-amber-400' },
]

export function BreakdownCards() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card>
        <Card.Header>
          <div><Card.Title>Sales by channel</Card.Title><Card.Description>Where your customers find you</Card.Description></div>
          <button className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-medium text-slate-500">This year</button>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
            {sources.map((source) => <div key={source.name} className={source.color} style={{ width: `${source.share}%` }} />)}
          </div>
          {sources.map((source) => (
            <div key={source.name} className="flex items-center gap-3">
              <span className={`size-2.5 rounded-full ${source.color}`} />
              <span className="min-w-0 flex-1"><span className="block text-xs font-medium text-slate-700">{source.name}</span><span className="text-[10px] text-slate-400">{source.detail}</span></span>
              <span className="text-xs font-semibold text-slate-700">{source.amount}</span>
              <span className="w-8 text-right text-[10px] text-slate-400">{source.share}%</span>
            </div>
          ))}
        </Card.Content>
      </Card>
      <Card>
        <Card.Header>
          <div><Card.Title>Top products</Card.Title><Card.Description>Your best performers this month</Card.Description></div>
          <a href="/products" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600">See all <ArrowUpRight size={13} /></a>
        </Card.Header>
        <Card.Content className="space-y-[18px]">
          {[
            { name: 'Canvas Weekender', category: 'Accessories', amount: '$12,416', sold: '128 sold', width: '78%', tone: 'bg-violet-500' },
            { name: 'Ceramic Pour-over Set', category: 'Home & Living', amount: '$8,832', sold: '96 sold', width: '59%', tone: 'bg-rose-400' },
            { name: 'Minimalist Desk Lamp', category: 'Home & Living', amount: '$6,510', sold: '62 sold', width: '43%', tone: 'bg-amber-400' },
          ].map((product) => (
            <div key={product.name}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="truncate text-xs font-medium text-slate-700">{product.name}<span className="ml-2 text-[10px] font-normal text-slate-400">{product.category}</span></span>
                <span className="shrink-0 text-xs font-semibold text-slate-700">{product.amount}</span>
              </div>
              <div className="flex items-center gap-2"><div className="h-1.5 flex-1 rounded-full bg-slate-100"><div className={`h-1.5 rounded-full ${product.tone}`} style={{ width: product.width }} /></div><span className="w-12 text-right text-[10px] text-slate-400">{product.sold}</span></div>
            </div>
          ))}
        </Card.Content>
      </Card>
    </div>
  )
}
