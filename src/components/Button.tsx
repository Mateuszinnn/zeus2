import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

const VARIANTS = {
  primary: 'bg-accent text-gray-0 hover:bg-accent-hover',
  secondary: 'bg-surface text-primary border border-default hover:border-strong',
  ghost: 'text-secondary hover:bg-gray-20 hover:text-primary',
  danger: 'bg-error text-gray-0 hover:bg-error-ink',
} as const

const SIZES = {
  sm: 'h-8 px-3 gap-1.5',
  md: 'h-10 px-4 gap-2',
  lg: 'h-11 px-5 gap-2',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  loading?: boolean
  icon?: ReactNode
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-body font-medium',
        'transition-colors duration-150 ease-expo',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {/* Carregando: o spinner substitui o ícone e o rótulo permanece, para
          que o botão não mude de largura e a linha não salte. */}
      {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  )
}
