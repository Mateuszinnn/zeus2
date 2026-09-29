import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { grade as fmtGrade } from '@/lib/format'
import { gradeLevel, levelStyle } from '@/lib/grade'

/* Lançamento no lugar: a nota se edita na própria célula, com salvamento
 * otimista. Ler e lançar são dois modos do mesmo objeto — nunca um modal.
 *
 * Aceita vírgula ou ponto, porque o professor digita "7,5". */

interface GradeCellProps {
  value: number
  /** Descreve aluno e habilidade para o leitor de tela. */
  label: string
  onCommit: (next: number) => void
  compact?: boolean
}

function parseGrade(raw: string): number | null {
  const normalized = raw.replace(',', '.').trim()
  if (normalized === '') return null
  const parsed = Number(normalized)
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 10) return null
  return Math.round(parsed * 10) / 10
}

export function GradeCell({ value, label, onCommit, compact = false }: GradeCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [invalid, setInvalid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  function open() {
    setDraft(fmtGrade(value))
    setInvalid(false)
    setEditing(true)
  }

  function commit() {
    const parsed = parseGrade(draft)
    if (parsed === null) {
      setInvalid(true)
      inputRef.current?.focus()
      return
    }
    setEditing(false)
    if (parsed !== value) onCommit(parsed)
  }

  const style = levelStyle(gradeLevel(value))

  if (editing) {
    return (
      <span className="inline-flex flex-col items-start gap-1">
        <input
          ref={inputRef}
          value={draft}
          inputMode="decimal"
          aria-label={`${label}. Nota de 0 a 10.`}
          aria-invalid={invalid}
          onChange={(e) => {
            setDraft(e.target.value)
            setInvalid(false)
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') setEditing(false)
          }}
          className={cn(
            'h-9 w-16 rounded-md border bg-surface px-2 text-body font-medium text-primary',
            invalid ? 'border-error' : 'border-focus',
          )}
        />
        {invalid && <span className="text-caption text-error-ink">Use um número de 0 a 10</span>}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`${label}: ${fmtGrade(value)}, ${style.label.toLowerCase()}. Clique para editar.`}
      className={cn(
        'group flex items-center gap-3 rounded-md text-left',
        'transition-colors duration-150 ease-expo',
        compact ? 'w-16' : 'w-full max-w-64',
      )}
    >
      <span
        className={cn(
          'w-9 shrink-0 rounded-sm px-1 py-0.5 text-body font-medium text-primary',
          'group-hover:bg-accent-soft',
        )}
      >
        {fmtGrade(value)}
      </span>
      {!compact && (
        <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-30">
          <span
            className={cn('block h-full rounded-full transition-[width] duration-200 ease-expo', style.fill)}
            style={{ width: `${Math.max(2, (value / 10) * 100)}%` }}
          />
        </span>
      )}
    </button>
  )
}
