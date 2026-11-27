import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="min-h-screen lg:pl-[248px]">
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1600px] px-5 pb-10 pt-7 sm:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
