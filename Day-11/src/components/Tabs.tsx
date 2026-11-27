import { createContext, useContext, useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

interface TabsContextValue {
  value: string
  setValue: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tabs components must be used inside Tabs.Root')
  return context
}

function Root({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [value, setValue] = useState(defaultValue)
  return <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>
}

function List({ children, className = '' }: HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" className={className}>{children}</div>
}

function Trigger({
  value,
  children,
}: {
  value: string
  children: ReactNode
}) {
  const tabs = useTabs()
  const selected = tabs.value === value
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={() => tabs.setValue(value)}
      className={`border-b-2 pb-3 text-[11px] font-semibold transition ${selected ? 'border-forest text-forest' : 'border-transparent text-muted hover:text-ink'}`}
    >
      {children}
    </button>
  )
}

function Content({ value, children }: { value: string; children: ReactNode }) {
  const tabs = useTabs()
  return tabs.value === value ? <div role="tabpanel">{children}</div> : null
}

export const Tabs = { Root, List, Trigger, Content }
