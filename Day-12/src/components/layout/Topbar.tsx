import { Bell, ChevronDown, Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { GlobalSearch } from '../search/GlobalSearch'

const titles: Record<string, string> = {
  '/': 'Overview',
  '/orders': 'Orders',
  '/products': 'Products',
  '/customers': 'Customers',
  '/analytics': 'Analytics',
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { pathname } = useLocation()
  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Open menu"><Menu size={19} /></button>
        <span className="text-sm font-semibold text-slate-800">{titles[pathname] ?? 'Overview'}</span>
        <span className="hidden text-slate-300 sm:inline">/</span>
        <span className="hidden text-xs text-slate-400 sm:inline">Studio North</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <GlobalSearch />
        <button className="relative grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Notifications">
          <Bell size={18} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <div className="hidden h-7 border-l border-slate-200 sm:block" />
        <button className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span className="grid size-8 place-items-center rounded-full bg-[#d7d2f2] text-[10px] font-bold text-[#514a80]">JD</span>
          <span className="hidden sm:inline">Jordan Davis</span>
          <ChevronDown size={14} className="hidden sm:block" />
        </button>
      </div>
    </header>
  )
}
