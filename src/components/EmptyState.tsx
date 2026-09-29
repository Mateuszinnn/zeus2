import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  /** Screen-specific copy. A generic "No results" is not allowed. */
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-16 text-center', className)}>
      <span className="text-disabled" aria-hidden="true">
        {icon}
      </span>
      <h3 className="mt-4 text-h3 text-primary">{title}</h3>
      <p className="mt-2 max-w-sm text-body text-secondary">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
