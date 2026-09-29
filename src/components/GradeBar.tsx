import { cn } from '@/lib/cn'
import { gradeLevel, attendanceLevel, levelStyle, gradeLabel } from '@/lib/grade'
import { grade as fmtGrade, percent as fmtPercent } from '@/lib/format'

/* A assinatura do sistema: trilho fino totalmente arredondado, preenchido na
 * cor da faixa, SEMPRE com o número ao lado. A cor nunca viaja sozinha —
 * quem não a distingue lê o número e o rótulo acessível.
 *
 * Largura do número é fixa para que a coluna não dance entre linhas. */

interface GradeBarProps {
  /** Nota de 0 a 10, ou percentual de 0 a 100 quando kind="attendance". */
  value: number
  kind?: 'grade' | 'attendance'
  label: string
  className?: string
  showValue?: boolean
}

export function GradeBar({
  value,
  kind = 'grade',
  label,
  className,
  showValue = true,
}: GradeBarProps) {
  const isGrade = kind === 'grade'
  const level = isGrade ? gradeLevel(value) : attendanceLevel(value)
  const style = levelStyle(level)
  const pct = isGrade ? (value / 10) * 100 : value
  const text = isGrade ? fmtGrade(value) : fmtPercent(value)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {showValue && (
        <span className="w-9 shrink-0 text-body font-medium text-primary">{text}</span>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${text}, ${gradeLabel(level).toLowerCase()}`}
        className="h-2 min-w-16 flex-1 overflow-hidden rounded-full bg-gray-30"
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-200 ease-expo', style.fill)}
          style={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  )
}
