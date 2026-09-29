import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-default bg-surface shadow-sm',
        className,
      )}
    >
      {children}
    </section>
  )
}

interface CardHeaderProps {
  title: string
  /** Contexto factual ao lado do título — nunca um rótulo decorativo. */
  meta?: ReactNode
  actions?: ReactNode
  className?: string
}

export function CardHeader({ title, meta, actions, className }: CardHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-b border-default px-6 py-5',
        className,
      )}
    >
      <div className="flex items-baseline gap-3">
        <h2 className="text-h3 text-primary">{title}</h2>
        {meta}
      </div>
      {actions}
    </header>
  )
}

export function CardBody({ children, className }: CardProps) {
  return <div className={cn('p-6', className)}>{children}</div>
}
