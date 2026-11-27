import {
  BarChart3,
  ChevronDown,
  CircleHelp,
  CreditCard,
  X,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  UsersRound,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const primaryLinks = [
  { label: 'Overview', to: '/', icon: LayoutDashboard },
  { label: 'Orders', to: '/orders', icon: ShoppingBag, badge: '5k' },
  { label: 'Products', to: '/products', icon: Package },
  { label: 'Customers', to: '/customers', icon: UsersRound },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
]

type SidebarProps = { isOpen: boolean; onClose: () => void }

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
    {isOpen && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" aria-label="Close navigation" onClick={onClose} />}
    <aside className={`fixed inset-y-0 left-0 z-40 w-[248px] flex-col bg-[#171725] px-4 py-6 text-slate-400 transition-transform lg:flex lg:translate-x-0 ${isOpen ? 'flex translate-x-0' : 'hidden -translate-x-full'}`}>
      <div className="mb-9 flex items-center justify-between">
      <a href="/" className="flex items-center gap-3 px-2 text-white" aria-label="Forma home" onClick={onClose}>
        <span className="grid size-9 place-items-center rounded-xl bg-violet-500 text-lg font-bold">f</span>
        <span className="text-lg font-semibold tracking-tight">forma<span className="text-violet-400">.</span></span>
      </a>
      <button className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden" aria-label="Close navigation" onClick={onClose}><X size={17} /></button>
      </div>

      <button className="mb-8 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 text-left hover:bg-white/10">
        <span className="grid size-9 place-items-center rounded-lg bg-[#f2b9a7] text-xs font-bold text-[#5a3730]">ST</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-white">Studio North</span>
          <span className="mt-0.5 block text-xs text-slate-500">Growth plan</span>
        </span>
        <ChevronDown size={16} />
      </button>

      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
      <nav className="space-y-1" aria-label="Main navigation">
        {primaryLinks.map(({ label, to, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                isActive ? 'bg-violet-500/15 text-violet-300' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
              }`
            }
          >
            <Icon size={17} strokeWidth={1.8} />
            <span className="flex-1">{label}</span>
            {badge && <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      <p className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Preferences</p>
      <nav className="space-y-1" aria-label="Preferences">
        <a href="#billing" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium hover:bg-white/[0.06] hover:text-white">
          <CreditCard size={17} strokeWidth={1.8} /> Billing
        </a>
        <a href="#settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium hover:bg-white/[0.06] hover:text-white">
          <Settings size={17} strokeWidth={1.8} /> Settings
        </a>
      </nav>

      <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-white">
          <span className="grid size-6 place-items-center rounded-md bg-amber-400/15 text-amber-300"><CircleHelp size={14} /></span>
          Need a hand?
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">Our support team is always happy to help you out.</p>
        <a href="mailto:support@forma.example" className="mt-3 inline-block text-[11px] font-semibold text-violet-300 hover:text-violet-200">Contact support <span aria-hidden="true">→</span></a>
      </div>
      <div className="mt-5 flex items-center gap-3 border-t border-white/10 px-2 pt-5">
        <div className="grid size-8 place-items-center rounded-full bg-[#d7d2f2] text-[10px] font-bold text-[#514a80]">JD</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-white">Jordan Davis</p>
          <p className="truncate text-[10px] text-slate-500">jordan@studionorth.co</p>
        </div>
        <ChevronDown size={14} />
      </div>
    </aside>
    </>
  )
}
