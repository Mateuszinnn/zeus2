import { cn } from '@/lib/cn'

interface ToggleProps {
  checked: boolean
  onChange: (next: boolean) => void
  /** Rótulo acessível. O controle é só o trilho, então ele nunca é visível. */
  label: string
  /** Estado não marcado ainda — nem presente, nem ausente. */
  indeterminate?: boolean
  className?: string
}

export function Toggle({ checked, onChange, label, indeterminate, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ease-expo',
        indeterminate ? 'bg-gray-30' : checked ? 'bg-success' : 'bg-error',
        className,
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 size-5 rounded-full bg-gray-0 shadow-xs transition-[left] duration-150 ease-expo',
          indeterminate ? 'left-3' : checked ? 'left-[22px]' : 'left-0.5',
        )}
      />
    </button>
  )
}
