import { useRef } from 'react'
import { cn } from '@/lib/cn'

/* Navegável por setas do teclado, como manda o padrão de tablist. */

export interface TabItem {
  id: string
  label: string
  /** Contagem opcional ao lado do rótulo. */
  count?: number
}

interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (next: string) => void
  label: string
  className?: string
}

export function Tabs({ items, value, onChange, label, className }: TabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  function onKeyDown(event: React.KeyboardEvent) {
    const index = items.findIndex((item) => item.id === value)
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % items.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    onChange(items[next].id)
    refs.current[items[next].id]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('flex gap-6 border-b border-default', className)}
    >
      {items.map((item) => {
        const active = item.id === value
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[item.id] = el
            }}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={active}
            aria-controls={`painel-${item.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              '-mb-px flex items-center gap-2 border-b-2 pb-3 text-body',
              'transition-colors duration-150 ease-expo',
              active
                ? 'border-accent font-medium text-primary'
                : 'border-transparent text-muted hover:text-secondary',
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-caption',
                  active ? 'bg-accent-soft text-accent-ink' : 'bg-gray-20 text-muted',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function TabPanel({
  id,
  active,
  children,
}: {
  id: string
  active: boolean
  children: React.ReactNode
}) {
  if (!active) return null
  return (
    <div role="tabpanel" id={`painel-${id}`} aria-labelledby={`tab-${id}`} tabIndex={0}>
      {children}
    </div>
  )
}
