import { useId } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/* Rótulo sempre visível acima do campo, nunca só placeholder.
 * Somente-leitura é VALOR SEM MOLDURA, não input desabilitado: campo
 * desabilitado parece defeito. */

const CONTROL = cn(
  'w-full rounded-md border border-default bg-surface px-3 text-body text-primary',
  'placeholder:text-disabled transition-colors duration-150 ease-expo hover:border-strong',
)

interface FieldProps {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

export function Field({ label, required, hint, error, children }: FieldProps) {
  const id = useId()
  const helpId = `${id}-ajuda`
  const message = error ?? hint

  return (
    <div>
      <label htmlFor={id} className="block text-label text-primary">
        {label}
        {required && (
          <span className="text-error" aria-label="obrigatório">
            {' '}
            *
          </span>
        )}
      </label>
      <div className="mt-1.5">
        {children({ id, describedBy: message ? helpId : undefined, invalid: Boolean(error) })}
      </div>
      {message && (
        <p
          id={helpId}
          className={cn('mt-1.5 text-caption', error ? 'text-error-ink' : 'text-muted')}
        >
          {message}
        </p>
      )}
    </div>
  )
}

interface ControlProps {
  id: string
  describedBy?: string
  invalid?: boolean
}

export function TextInput({
  id,
  describedBy,
  invalid,
  className,
  ...rest
}: ControlProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      id={id}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, 'h-10', invalid && 'border-error', className)}
      {...rest}
    />
  )
}

export function TextArea({
  id,
  describedBy,
  invalid,
  className,
  ...rest
}: ControlProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      id={id}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, 'min-h-24 py-2.5', invalid && 'border-error', className)}
      {...rest}
    />
  )
}

export function NativeSelect({
  id,
  describedBy,
  invalid,
  className,
  children,
  ...rest
}: ControlProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      id={id}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, 'h-10', invalid && 'border-error', className)}
      {...rest}
    >
      {children}
    </select>
  )
}

/** Dado em modo leitura: rótulo acima, valor em destaque, sem moldura. */
export function ReadOnlyField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-label text-muted">{label}</p>
      <p className="mt-1 text-body font-medium text-primary">{value || '—'}</p>
    </div>
  )
}
