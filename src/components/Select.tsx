import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (next: string) => void
  options: SelectOption[]
  /** Rótulo acessível. Some visualmente quando o filtro já se explica. */
  label: string
  /** Prefixo dentro do controle, como "Ordenar:" no mockup de referência. */
  prefix?: string
  className?: string
}

export function Select({ value, onChange, options, label, prefix, className }: SelectProps) {
  return (
    <span className={cn('relative inline-flex items-center', className)}>
      {prefix && (
        <span className="pointer-events-none absolute left-3 text-body text-muted">{prefix}</span>
      )}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-10 w-full appearance-none rounded-md border border-default bg-surface',
          'pr-9 text-body text-primary',
          'transition-colors duration-150 ease-expo hover:border-strong',
          prefix ? 'pl-[4.75rem]' : 'pl-3',
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 text-muted"
        aria-hidden="true"
      />
    </span>
  )
}
