// Compound component exports are intentionally attached to Card for Card.Header composition.
/* oxlint-disable react/only-export-components */
import { memo, type HTMLAttributes, type ReactNode } from 'react'

type SectionProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode }

function CardRoot({ children, className = '', ...props }: SectionProps) {
  return <section className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_8px_rgba(27,31,59,0.025)] ${className}`} {...props}>{children}</section>
}

function CardHeader({ children, className = '', ...props }: SectionProps) {
  return <div className={`flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6 ${className}`} {...props}>{children}</div>
}

function CardTitle({ children, className = '', ...props }: SectionProps) {
  return <h2 className={`text-sm font-semibold tracking-[-0.01em] text-slate-800 ${className}`} {...props}>{children}</h2>
}

function CardDescription({ children, className = '', ...props }: SectionProps) {
  return <p className={`mt-1 text-xs text-slate-400 ${className}`} {...props}>{children}</p>
}

function CardContent({ children, className = '', ...props }: SectionProps) {
  return <div className={`px-5 pb-5 pt-4 sm:px-6 sm:pb-6 ${className}`} {...props}>{children}</div>
}

export const Card = Object.assign(memo(CardRoot), {
  Header: memo(CardHeader),
  Title: memo(CardTitle),
  Description: memo(CardDescription),
  Content: memo(CardContent),
})
