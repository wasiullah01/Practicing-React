import { createContext, useContext, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface ModalContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  titleId: string
}

const ModalContext = createContext<ModalContextValue | null>(null)

function useModal() {
  const context = useContext(ModalContext)
  if (!context) throw new Error('Modal components must be used inside Modal.Root')
  return context
}

function Root({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  const titleId = useId()
  return (
    <ModalContext.Provider value={{ open, onOpenChange, titleId }}>
      {children}
    </ModalContext.Provider>
  )
}

function Trigger({
  children,
  className = '',
  onOpen,
}: {
  children: ReactNode
  className?: string
  onOpen?: () => void
}) {
  const { onOpenChange } = useModal()
  return (
    <button
      type="button"
      onClick={() => {
        onOpen?.()
        onOpenChange(true)
      }}
      className={className}
    >
      {children}
    </button>
  )
}

function Close({ children }: { children: ReactNode }) {
  const { onOpenChange } = useModal()
  return <span onClick={() => onOpenChange(false)}>{children}</span>
}

function Content({ children }: { children: ReactNode }) {
  const { open, onOpenChange, titleId } = useModal()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, onOpenChange])

  if (!open) return null
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#16241dc2] p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false)
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fade-in w-full max-w-[480px] rounded-[24px] bg-[#fbfaf7] p-7 shadow-2xl outline-none sm:p-9"
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

function Title({ children }: { children: ReactNode }) {
  const { titleId } = useModal()
  return <h2 id={titleId} className="font-display text-[28px] leading-tight text-ink">{children}</h2>
}

function Dismiss({ className = '' }: { className?: string }) {
  const { onOpenChange } = useModal()
  return (
    <button
      type="button"
      aria-label="Close dialog"
      onClick={() => onOpenChange(false)}
      className={`rounded-full p-2 text-muted transition hover:bg-sand hover:text-ink ${className}`}
    >
      <X size={18} />
    </button>
  )
}

export const Modal = { Root, Trigger, Close, Content, Title, Dismiss }
