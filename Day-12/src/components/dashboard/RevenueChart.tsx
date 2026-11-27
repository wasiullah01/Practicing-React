import { memo, useMemo, useState } from 'react'
import { orderDataGeneratedAt, orders } from '../../data/orders'
import { Card } from '../ui/Card'

type Range = '7 days' | '30 days' | '12 months'
type RevenuePoint = { label: string; revenue: number }
const DAY_IN_MS = 24 * 60 * 60 * 1000
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function getRevenuePoints(range: Range): RevenuePoint[] {
  const today = orderDataGeneratedAt
  let start: Date
  let bucketCount: number

  if (range === '7 days') {
    start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
    bucketCount = 7
  } else if (range === '30 days') {
    start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29)
    bucketCount = 10
  } else {
    start = new Date(today.getFullYear(), today.getMonth() - 11, 1)
    bucketCount = 12
  }
  const dayAfterToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  const points = Array.from({ length: bucketCount }, (_, index): RevenuePoint => {
    const bucketDate = range === '12 months'
      ? new Date(start.getFullYear(), start.getMonth() + index, 1)
      : new Date(start.getTime() + (index * (range === '7 days' ? 1 : 3) * DAY_IN_MS))
    const label = range === '7 days'
      ? bucketDate.toLocaleDateString('en-US', { weekday: 'short' })
      : range === '30 days'
        ? bucketDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : bucketDate.toLocaleDateString('en-US', { month: 'short' })
    return { label, revenue: 0 }
  })

  for (const order of orders) {
    const date = new Date(`${order.date}T12:00:00`)
    if (date < start || date >= dayAfterToday) continue

    const bucketIndex = range === '12 months'
      ? (date.getFullYear() - start.getFullYear()) * 12 + date.getMonth() - start.getMonth()
      : Math.floor((date.getTime() - start.getTime()) / (range === '7 days' ? DAY_IN_MS : 3 * DAY_IN_MS))
    if (bucketIndex >= 0 && bucketIndex < points.length) points[bucketIndex].revenue += order.amount
  }

  return points
}

export const RevenueChart = memo(function RevenueChart() {
  const [range, setRange] = useState<Range>('12 months')
  const points = useMemo(() => getRevenuePoints(range), [range])
  const total = useMemo(() => points.reduce((sum, point) => sum + point.revenue, 0), [points])
  const maximum = Math.max(...points.map((point) => point.revenue), 1)
  const chartPoints = useMemo(
    () => points.map((point, index) => ({
      x: 48 + (index * 704) / Math.max(points.length - 1, 1),
      y: 178 - (point.revenue / maximum) * 142,
    })),
    [maximum, points],
  )
  const coordinates = useMemo(
    () => chartPoints.map(({ x, y }) => `${x},${y}`).join(' '),
    [chartPoints],
  )
  const areaPath = `M ${coordinates.replaceAll(' ', ' L ')} L 752,190 L 48,190 Z`

  return (
    <Card className="min-w-0">
      <Card.Header>
        <div>
          <Card.Title>Revenue over time</Card.Title>
          <Card.Description>A closer look at your store performance</Card.Description>
        </div>
        <label className="sr-only" htmlFor="revenue-range">Revenue chart time range</label>
        <select
          id="revenue-range"
          value={range}
          onChange={(event) => setRange(event.target.value as Range)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-medium text-slate-600 outline-none focus:border-violet-400"
        >
          <option>7 days</option><option>30 days</option><option>12 months</option>
        </select>
      </Card.Header>
      <Card.Content className="pt-5">
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-[25px] font-semibold tracking-tight text-slate-900">{currency.format(total)}</span>
          <span className="text-[11px] text-slate-400">{range === '12 months' ? 'last 12 months' : `last ${range}`}</span>
        </div>
        <div className="w-full overflow-hidden">
          <svg viewBox="0 0 800 220" className="h-[210px] w-full min-w-[560px]" role="img" aria-label={`Revenue chart for ${range}`}>
            <defs>
              <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#8b72ed" stopOpacity=".2" />
                <stop offset="100%" stopColor="#8b72ed" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[36, 82, 128, 174].map((y) => <line key={y} x1="48" x2="752" y1={y} y2={y} stroke="#edf0f5" strokeDasharray="3 5" />)}
            <path d={areaPath} fill="url(#revenue-fill)" />
            <polyline points={coordinates} fill="none" stroke="#8065e8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {chartPoints.map(({ x, y }, index) => <circle key={points[index].label} cx={x} cy={y} r="3.5" fill="#fff" stroke="#8065e8" strokeWidth="2" />)}
            {points.map((point, index) =>
              <text key={point.label} x={chartPoints[index].x} y="211" textAnchor="middle" fill="#9aa3b2" fontSize="10">{point.label}</text>,
            )}
          </svg>
        </div>
      </Card.Content>
    </Card>
  )
})
