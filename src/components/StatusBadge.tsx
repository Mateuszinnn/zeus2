import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const TONES = {
  success: 'bg-success-soft text-success-ink',
  warning: 'bg-warning-soft text-warning-ink',
  error: 'bg-error-soft text-error-ink',
  info: 'bg-accent-soft text-accent-ink',
  neutral: 'bg-gray-20 text-secondary',
} as const

interface StatusBadgeProps {
  tone?: keyof typeof TONES
  children: ReactNode
  className?: string
}

export function StatusBadge({ tone = 'neutral', children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium whitespace-nowrap',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
